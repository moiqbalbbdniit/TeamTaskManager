'use client';

import { ProtectedLayout } from '@/components/ProtectedLayout';
import { useState, useEffect } from 'react';
import axios from 'axios';
import Link from 'next/link';

interface Project {
  _id: string;
  name: string;
  description: string;
  owner: { name: string; email: string };
  members: Array<{ userId: { name: string; email: string }; role: string }>;
  createdAt: string;
}

export default function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      const response = await axios.get('/api/projects');
      setProjects(response.data.projects);
    } catch (error) {
      console.error('Failed to fetch projects:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <ProtectedLayout>
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
        </div>
      </ProtectedLayout>
    );
  }

  return (
    <ProtectedLayout>
      <div className="space-y-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Projects</h1>
            <p className="text-gray-600 mt-1">
              Manage your projects and teams
            </p>
          </div>
          <Link href="/projects/new" className="btn-primary">
            New Project
          </Link>
        </div>

        {projects.length === 0 ? (
          <div className="card text-center py-12">
            <p className="text-gray-600 mb-4">No projects yet</p>
            <Link href="/projects/new" className="btn-primary inline-block">
              Create Your First Project
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects.map((project) => (
              <div key={project._id} className="card hover:shadow-md transition-shadow">
                <Link href={`/projects/${project._id}`}>
                  <h3 className="text-lg font-bold text-gray-900 hover:text-blue-600">
                    {project.name}
                  </h3>
                </Link>
                <p className="text-gray-600 text-sm mt-2 line-clamp-2">
                  {project.description || 'No description'}
                </p>
                <div className="mt-4 pt-4 border-t border-gray-200">
                  <p className="text-xs text-gray-600 mb-3">
                    Owner: {project.owner.name}
                  </p>
                  <p className="text-xs text-gray-600 mb-3">
                    Members: {project.members.length}
                  </p>
                  <Link
                    href={`/projects/${project._id}`}
                    className="btn-secondary text-sm w-full text-center inline-block"
                  >
                    View Details
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </ProtectedLayout>
  );
}
