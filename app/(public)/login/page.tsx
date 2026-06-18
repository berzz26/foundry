'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { login } from '@/lib/services/api';
import { useAuth } from '@/lib/contexts/AuthContext';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api/v1';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const router = useRouter();
  const { setUser } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const data = await login(email, password);
      setUser(data.user);
      router.push('/dashboard');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to login. Please check your credentials.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-[calc(100vh-100px)] flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="mt-6 text-center font-serif text-3xl font-bold tracking-tight text-[var(--ink)]">
          Sign in to your account
        </h2>
        <p className="mt-2 text-center text-sm text-[var(--ink-3)]">
          Or{' '}
          <Link href="/signup" className="font-medium text-[var(--teal)] hover:text-[var(--teal-dark)] transition-colors">
            create a new account
          </Link>
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-[var(--bg)] py-8 px-4 shadow-[var(--shadow-float)] sm:rounded-xl sm:px-10 border border-[var(--border)]">
          <form className="space-y-6" onSubmit={handleSubmit}>
            {error && (
              <div className="p-3 text-sm text-red-600 bg-red-50 border border-red-200 rounded-md">
                {error}
              </div>
            )}
            
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-[var(--ink-2)]">
                Email address
              </label>
              <div className="mt-1">
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="block w-full appearance-none rounded-md border border-[var(--border)] px-3 py-2 text-[var(--ink)] placeholder-[var(--ink-4)] shadow-sm focus:border-[var(--teal)] focus:outline-none focus:ring-[var(--teal)] sm:text-sm bg-transparent"
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-[var(--ink-2)]">
                Password
              </label>
              <div className="mt-1">
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="block w-full appearance-none rounded-md border border-[var(--border)] px-3 py-2 text-[var(--ink)] placeholder-[var(--ink-4)] shadow-sm focus:border-[var(--teal)] focus:outline-none focus:ring-[var(--teal)] sm:text-sm bg-transparent"
                />
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={isLoading}
                className="flex w-full justify-center rounded-md border border-transparent bg-[var(--ink)] py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-[var(--ink-2)] focus:outline-none focus:ring-2 focus:ring-[var(--teal)] focus:ring-offset-2 disabled:opacity-50 transition-colors"
              >
                {isLoading ? 'Signing in...' : 'Sign in'}
              </button>
            </div>
          </form>

          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-[var(--border)]" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="bg-[var(--bg)] px-2 text-[var(--ink-4)]">Or continue with</span>
              </div>
            </div>

            <div className="mt-6 grid grid-cols-2 gap-3">
              <a
                href={`${API_BASE_URL}/auth/google/login`}
                className="inline-flex w-full justify-center rounded-md border border-[var(--border)] bg-transparent py-2 px-4 text-sm font-medium text-[var(--ink-2)] shadow-sm hover:bg-[var(--bg-alt)] hover:text-[var(--ink)] transition-colors"
              >
                <span className="sr-only">Sign in with Google</span>
                Google
              </a>
              <a
                href={`${API_BASE_URL}/auth/github/login`}
                className="inline-flex w-full justify-center rounded-md border border-[var(--border)] bg-transparent py-2 px-4 text-sm font-medium text-[var(--ink-2)] shadow-sm hover:bg-[var(--bg-alt)] hover:text-[var(--ink)] transition-colors"
              >
                <span className="sr-only">Sign in with GitHub</span>
                GitHub
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
