'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';

type SignupRole = 'admin' | 'member';

interface SignupFormProps {
  role: SignupRole;
  title: string;
  description: string;
  submitLabel: string;
  accentClassName?: string;
  showAdminKey?: boolean;
}

export function SignupForm({
  role,
  title,
  description,
  submitLabel,
  accentClassName = 'from-blue-600 to-cyan-500',
  showAdminKey = false,
}: SignupFormProps) {
  const router = useRouter();
  const { signup } = useAuth();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [adminKey, setAdminKey] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await signup(name, email, password, confirmPassword, role, adminKey);
      router.push('/dashboard');
    } catch (err: any) {
      setError(err.response?.data?.error || 'Signup failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f3f4f6] px-4 py-12 flex items-center justify-center">
      <div className="w-full max-w-2xl">
        <div className="card overflow-hidden p-0">
          <div className={`bg-gradient-to-r ${accentClassName} px-8 py-10 text-white`}>
            <p className="text-sm uppercase tracking-[0.25em] text-white/80">
              {role === 'admin' ? 'Admin access' : 'Member access'}
            </p>
            <h1 className="mt-3 text-3xl font-bold">{title}</h1>
            <p className="mt-3 max-w-xl text-white/90">{description}</p>
          </div>

          <div className="p-8">
            {error && (
              <div className="mb-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">
                  Full Name
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="input"
                  placeholder="John Doe"
                  required
                />
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">
                  Email
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="input"
                  placeholder="you@example.com"
                  required
                />
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-700">
                    Password
                  </label>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="input"
                    placeholder="••••••••"
                    required
                  />
                </div>

                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-700">
                    Confirm Password
                  </label>
                  <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="input"
                    placeholder="••••••••"
                    required
                  />
                </div>
              </div>

              {showAdminKey && (
                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-700">
                    Admin Invite Key
                  </label>
                  <input
                    type="password"
                    value={adminKey}
                    onChange={(e) => setAdminKey(e.target.value)}
                    className="input"
                    placeholder="Enter the admin key"
                    required
                  />
                  <p className="mt-2 text-xs text-gray-500">
                    This key is required to create an admin account.
                  </p>
                </div>
              )}

              <button type="submit" disabled={loading} className="btn-primary w-full">
                {loading ? 'Creating account...' : submitLabel}
              </button>
            </form>

            <div className="mt-6 flex flex-col items-center gap-2 text-center text-sm text-gray-600 md:flex-row md:justify-between md:text-left">
              <Link href="/login" className="font-medium text-blue-600 hover:text-blue-700">
                Already have an account? Sign in
              </Link>
              <Link href="/signup" className="font-medium text-gray-500 hover:text-gray-700">
                Back to signup options
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}