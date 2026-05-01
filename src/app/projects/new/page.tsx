'use client';

import { ProtectedLayout } from '@/components/ProtectedLayout';
import { useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';

export default function NewProjectPage() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const [formData, setFormData] = useState({
    name: '',
    description: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await axios.post('/api/projects', formData);
      router.push(`/projects/${response.data.project._id}`);
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to create project');
    } finally {
      setLoading(false);
    }
  };

  if (authLoading) {
    return (
      <ProtectedLayout>
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
        </div>
      </ProtectedLayout>
    );
  }

  if (user?.role !== 'admin') {
    return (
      <ProtectedLayout>
        <div className="max-w-2xl mx-auto">
          <div className="card">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-red-600">
              Access restricted
            </p>
            <h1 className="mt-3 text-3xl font-bold text-gray-900">
              Project creation is for admins only
            </h1>
            <p className="mt-3 text-gray-600">
              Members can view projects and work on tasks, but only admins can create new projects.
            </p>
            <div className="mt-6 flex gap-3">
              <button onClick={() => router.push('/projects')} className="btn-primary">
                Go to Projects
              </button>
              <button onClick={() => router.push('/dashboard')} className="btn-secondary">
                Back to Dashboard
              </button>
            </div>
          </div>
        </div>
      </ProtectedLayout>
    );
  }

  return (
    <ProtectedLayout>
      <div className="max-w-2xl mx-auto">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Create New Project</h1>
          <p className="text-gray-600 mt-1">Start managing a new project</p>
        </div>

        <div className="card mt-8">
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-800 text-sm">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Project Name *
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="input"
                placeholder="e.g., Website Redesign"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                className="input min-h-[120px] resize-none"
                placeholder="Describe your project..."
              />
            </div>

            <div className="flex gap-4">
              <button
                type="submit"
                disabled={loading}
                className="btn-primary flex-1"
              >
                {loading ? 'Creating...' : 'Create Project'}
              </button>
              <button
                type="button"
                onClick={() => router.back()}
                className="btn-secondary flex-1"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </ProtectedLayout>
  );
}
