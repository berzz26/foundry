import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

interface MarkdownProps {
  content: string;
  className?: string;
}

export function Markdown({ content, className = '' }: MarkdownProps) {
  if (!content) return null;

  return (
    <div className={`prose prose-sm md:prose-base prose-[var(--ink)] max-w-none ${className}`}>
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          p: ({ node, ...props }) => <p className="text-sm text-[var(--ink-2)] leading-relaxed mb-4 last:mb-0" {...props} />,
          ul: ({ node, ...props }) => <ul className="list-disc pl-5 space-y-1.5 text-sm text-[var(--ink-2)] leading-relaxed mb-4 last:mb-0" {...props} />,
          ol: ({ node, ...props }) => <ol className="list-decimal pl-5 space-y-1.5 text-sm text-[var(--ink-2)] leading-relaxed mb-4 last:mb-0" {...props} />,
          li: ({ node, ...props }) => <li {...props} />,
          h1: ({ node, ...props }) => <h1 className="font-serif text-[var(--ink)] text-2xl font-bold mt-6 mb-3" {...props} />,
          h2: ({ node, ...props }) => <h2 className="font-serif text-[var(--ink)] text-xl font-bold mt-6 mb-3" {...props} />,
          h3: ({ node, ...props }) => <h3 className="font-serif text-[var(--ink)] text-lg font-bold mt-5 mb-2" {...props} />,
          h4: ({ node, ...props }) => <h4 className="font-serif text-[var(--ink)] text-base font-bold mt-4 mb-2" {...props} />,
          strong: ({ node, ...props }) => <strong className="font-semibold text-[var(--ink)]" {...props} />,
          a: ({ node, ...props }) => <a className="text-[var(--teal)] hover:underline font-medium" target="_blank" rel="noopener noreferrer" {...props} />,
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}
