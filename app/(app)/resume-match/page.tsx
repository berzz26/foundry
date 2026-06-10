'use client';

import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Upload, FileText, CheckCircle2, Loader2, X, Zap, Code2, Briefcase, GraduationCap, FolderOpen } from 'lucide-react';
import MatchCard from '@/components/cards/MatchCard';
import { DUMMY_JOBS } from '@/lib/dummy-data/jobs';
import { Progress } from '@/components/ui/progress';

type UploadState = 'idle' | 'uploading' | 'parsing' | 'done';

const DUMMY_RESUME = {
  skills: ['TypeScript', 'Go', 'Rust', 'React', 'Node.js', 'PostgreSQL', 'Kubernetes', 'gRPC', 'Distributed Systems'],
  experience: [
    { role: 'Senior Backend Engineer', company: 'FinTech Startup', duration: '2021 — 2023' },
    { role: 'Software Engineer', company: 'TechCorp', duration: '2019 — 2021' },
  ],
  education: [{ degree: 'B.S. Computer Science', school: 'UC Berkeley', year: '2019' }],
  projects: ['Open source distributed cache', 'Real-time collaboration engine', 'Kubernetes operator framework'],
};

const MATCH_EXPLANATIONS: Record<string, string[]> = {
  j1: ['Go & Rust expertise', 'Kubernetes experience', 'Backend infrastructure background'],
  j2: ['TypeScript proficiency', 'React & Next.js skills', 'Full stack capability'],
  j6: ['Rust / Go systems experience', 'Distributed systems depth', 'Kafka & data streaming'],
  j9: ['Go language expertise', 'Distributed systems knowledge', 'Infrastructure & observability'],
  j4: ['TypeScript proficiency', 'React expertise', 'Frontend engineering depth'],
  j7: ['ML engineering context', 'Python skills', 'Data pipeline experience'],
  j3: ['Node.js platform skills', 'PostgreSQL experience', 'Cloud infra knowledge'],
  j10: ['TypeScript fluency', 'AI/LLM integration interest', 'Full stack capability'],
};

export default function ResumeMatchPage() {
  const [uploadState, setUploadState] = useState<UploadState>('idle');
  const [progress, setProgress] = useState(0);
  const [dragover, setDragover] = useState(false);
  const [fileName, setFileName] = useState('');

  const handleFile = useCallback((file: File) => {
    // Client-side validation: type and size (security)
    const allowed = ['application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
    if (!allowed.includes(file.type)) {
      // TODO(security): Server-side also validates magic bytes before processing
      return;
    }
    if (file.size > 10 * 1024 * 1024) return; // 10MB max

    setFileName(file.name);
    setUploadState('uploading');
    setProgress(0);

    // Simulate upload progress
    let p = 0;
    const uploadInterval = setInterval(() => {
      p += Math.random() * 18;
      if (p >= 100) {
        clearInterval(uploadInterval);
        setProgress(100);
        setTimeout(() => {
          setUploadState('parsing');
          setProgress(0);
          let pp = 0;
          const parseInterval = setInterval(() => {
            pp += Math.random() * 12;
            if (pp >= 100) {
              clearInterval(parseInterval);
              setProgress(100);
              setTimeout(() => setUploadState('done'), 400);
            } else {
              setProgress(Math.min(pp, 99));
            }
          }, 120);
        }, 300);
      } else {
        setProgress(Math.min(p, 99));
      }
    }, 80);
  }, []);

  const onDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragover(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  }, [handleFile]);

  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
  };

  const matchedJobs = DUMMY_JOBS
    .filter(j => j.matchPercentage !== undefined)
    .sort((a, b) => (b.matchPercentage ?? 0) - (a.matchPercentage ?? 0));

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <AnimatePresence mode="wait">
        {uploadState === 'idle' && (
          <motion.div key="idle" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
            {/* Upload Zone */}
            <label
              id="resume-upload-zone"
              className={`upload-zone flex flex-col items-center justify-center gap-4 py-16 px-8 text-center cursor-pointer w-full block ${dragover ? 'dragover' : ''}`}
              onDragOver={e => { e.preventDefault(); setDragover(true); }}
              onDragLeave={() => setDragover(false)}
              onDrop={onDrop}
            >
              <div className="w-14 h-14 rounded-full bg-[var(--teal-light)] border border-[rgba(13,115,119,0.2)] flex items-center justify-center">
                <Upload className="w-6 h-6 text-[var(--teal)]" />
              </div>
              <div>
                <h2 className="font-serif text-2xl text-[var(--ink)] mb-2">Upload Your Resume</h2>
                <p className="text-sm text-[var(--ink-3)]">
                  Drag & drop your resume or{' '}
                  <span className="text-[var(--teal)] font-medium">click to browse</span>
                </p>
                <p className="text-xs text-[var(--ink-4)] mt-1">PDF or DOCX · Max 10MB</p>
              </div>
              <input
                type="file"
                accept=".pdf,.docx,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                onChange={onFileChange}
                className="sr-only"
                aria-label="Upload resume file"
              />
            </label>

            <div className="mt-6 flex flex-col gap-3 text-sm text-[var(--ink-3)]">
              {['We extract your skills, experience, and projects automatically', 'Get personalized job matches ranked by relevance', 'Your resume data stays private and secure'].map((t, i) => (
                <div key={i} className="flex items-center gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-[var(--teal)] shrink-0" />
                  <span>{t}</span>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {(uploadState === 'uploading' || uploadState === 'parsing') && (
          <motion.div key="loading" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
            className="card-double-border p-12 flex flex-col items-center gap-6 text-center">
            <div className="relative">
              <div className="w-16 h-16 rounded-full bg-[var(--teal-light)] flex items-center justify-center">
                <Loader2 className="w-7 h-7 text-[var(--teal)] animate-spin" />
              </div>
            </div>
            <div>
              <h3 className="font-serif text-xl text-[var(--ink)] mb-1">
                {uploadState === 'uploading' ? `Uploading ${fileName}...` : 'Analysing your resume...'}
              </h3>
              <p className="text-sm text-[var(--ink-3)]">
                {uploadState === 'uploading' ? 'Securely transferring your file' : 'Extracting skills and experience'}
              </p>
            </div>
            <div className="w-full max-w-sm">
              <Progress value={progress} className="h-1.5" />
            </div>
          </motion.div>
        )}

        {uploadState === 'done' && (
          <motion.div key="done" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
            {/* Resume Summary */}
            <div className="card-double-border p-6">
              <div className="flex items-center justify-between mb-5">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded bg-emerald-50 border border-emerald-200 flex items-center justify-center">
                    <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                  </div>
                  <div>
                    <h2 className="font-serif text-xl text-[var(--ink)]">Resume Parsed</h2>
                    <p className="text-xs text-[var(--ink-3)]">{fileName}</p>
                  </div>
                </div>
                <button
                  id="reset-resume"
                  onClick={() => { setUploadState('idle'); setFileName(''); setProgress(0); }}
                  className="flex items-center gap-1.5 text-xs text-[var(--ink-3)] hover:text-[var(--teal)] transition-colors border border-[var(--border)] px-3 py-1.5 rounded hover:border-[var(--teal)]"
                >
                  <X className="w-3 h-3" />
                  Upload new
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                {/* Skills */}
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <Code2 className="w-3.5 h-3.5 text-[var(--teal)]" />
                    <p className="text-xs font-bold uppercase tracking-widest text-[var(--ink-4)]">Skills</p>
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {DUMMY_RESUME.skills.map(s => <span key={s} className="tech-badge">{s}</span>)}
                  </div>
                </div>

                {/* Experience */}
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <Briefcase className="w-3.5 h-3.5 text-[var(--teal)]" />
                    <p className="text-xs font-bold uppercase tracking-widest text-[var(--ink-4)]">Experience</p>
                  </div>
                  <div className="flex flex-col gap-2">
                    {DUMMY_RESUME.experience.map(e => (
                      <div key={e.role} className="flex items-start justify-between text-sm">
                        <div>
                          <p className="font-medium text-[var(--ink)]">{e.role}</p>
                          <p className="text-[var(--ink-3)] text-xs">{e.company}</p>
                        </div>
                        <span className="text-xs text-[var(--ink-4)] font-mono shrink-0 ml-2">{e.duration}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Education */}
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <GraduationCap className="w-3.5 h-3.5 text-[var(--teal)]" />
                    <p className="text-xs font-bold uppercase tracking-widest text-[var(--ink-4)]">Education</p>
                  </div>
                  {DUMMY_RESUME.education.map(e => (
                    <div key={e.degree} className="text-sm">
                      <p className="font-medium text-[var(--ink)]">{e.degree}</p>
                      <p className="text-[var(--ink-3)] text-xs">{e.school} · {e.year}</p>
                    </div>
                  ))}
                </div>

                {/* Projects */}
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <FolderOpen className="w-3.5 h-3.5 text-[var(--teal)]" />
                    <p className="text-xs font-bold uppercase tracking-widest text-[var(--ink-4)]">Projects</p>
                  </div>
                  <ul className="flex flex-col gap-1.5">
                    {DUMMY_RESUME.projects.map(p => (
                      <li key={p} className="flex items-center gap-2 text-sm text-[var(--ink-2)]">
                        <div className="w-1 h-1 rounded-full bg-[var(--teal)] shrink-0" />
                        {p}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>

            {/* Match Summary */}
            <div className="flex items-center gap-4 p-4 bg-[var(--teal-light)] border border-[rgba(13,115,119,0.15)] rounded">
              <div className="w-12 h-12 rounded-full bg-[var(--teal)] flex items-center justify-center text-white font-bold font-serif text-xl shrink-0">87</div>
              <div>
                <p className="font-semibold text-[var(--ink)]">Resume Score: 87/100</p>
                <p className="text-sm text-[var(--ink-2)]">Found {matchedJobs.length} job matches · Top skills: TypeScript, Go, Distributed Systems</p>
              </div>
              <Zap className="w-5 h-5 text-[var(--teal)] ml-auto shrink-0" />
            </div>

            {/* Match Results */}
            <div>
              <h2 className="font-serif text-xl text-[var(--ink)] mb-4">Your Job Matches</h2>
              <div className="flex flex-col gap-4">
                {matchedJobs.map(job => (
                  <MatchCard
                    key={job.id}
                    job={job}
                    explanation={MATCH_EXPLANATIONS[job.id]}
                  />
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
