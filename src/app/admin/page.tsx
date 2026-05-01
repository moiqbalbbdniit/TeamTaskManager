'use client';

import { ProtectedLayout } from '@/components/ProtectedLayout';
import { useAuth } from '@/context/AuthContext';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

function AdminContent() {
  const router = useRouter();
  const { user, loading } = useAuth();

  useEffect(() => {
    if (!loading && user && user.role !== 'admin') {
      router.replace('/dashboard');
    }
  }, [loading, user, router]);

  if (loading || !user) {
    return null;
  }

  if (user.role !== 'admin') {
    return null;
  }

  const items = [
    {
      title: 'Manage projects',
      description: 'Create, update, and review the team projects that users work on.',
    },
    {
      title: 'Assign members',
      description: 'Add members to projects and control which tasks they can access.',
    },
    {
      title: 'Monitor workload',
      description: 'Use the dashboard and task views to track progress and overdue work.',
    },
  ];

  return (
    <div className="space-y-8">
      <div className="rounded-3xl bg-gradient-to-r from-slate-900 via-blue-900 to-cyan-700 px-8 py-10 text-white shadow-xl shadow-slate-200/50">
        <p className="text-sm uppercase tracking-[0.25em] text-white/75">Admin portal</p>
        <h1 className="mt-3 text-4xl font-bold">Welcome, {user.name}</h1>
        <p className="mt-3 max-w-2xl text-white/85">
          This page makes the admin role explicit for your interview demo. It is the place to explain how project ownership, membership, and task control fit together.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        {items.map((item) => (
          <div key={item.title} className="card">
            <h2 className="text-lg font-bold text-gray-900">{item.title}</h2>
            <p className="mt-2 text-gray-600">{item.description}</p>
          </div>
        ))}
      </div>

      <div className="card flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="text-lg font-bold text-gray-900">Helpful links</h2>
          <p className="text-gray-600">Jump straight to the places admins use most.</p>
        </div>
        <div className="flex flex-col gap-3 md:flex-row">
          <Link href="/projects" className="btn-primary text-center">
            Projects
          </Link>
          <Link href="/dashboard" className="btn-secondary text-center">
            Dashboard
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function AdminPage() {
  return (
    <ProtectedLayout>
      <AdminContent />
    </ProtectedLayout>
  );
}