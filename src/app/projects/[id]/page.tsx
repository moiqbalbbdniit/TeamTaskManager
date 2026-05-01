'use client';

import { ProtectedLayout } from '@/components/ProtectedLayout';
import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

interface Project {
  _id: string;
  name: string;
  description: string;
  owner: { _id: string; name: string; email: string };
  members: Array<{ userId: { _id: string; name: string; email: string }; role: string }>;
  createdAt: string;
}

interface Task {
  _id: string;
  title: string;
  status: string;
  priority: string;
  assignee: { name: string } | null;
}

export default function ProjectDetailsPage({
  params,
}: {
  params: { id: string };
}) {
  const router = useRouter();
  const [projectId, setProjectId] = useState('');
  const [project, setProject] = useState<Project | null>(null);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [addMemberEmail, setAddMemberEmail] = useState('');
  const [memberError, setMemberError] = useState('');
  const [memberLoading, setMemberLoading] = useState(false);

  const { user } = useAuth();

  useEffect(() => {
    setProjectId(params.id);
    fetchProject(params.id);
    fetchTasks(params.id);
  }, [params.id]);

  const fetchProject = async (id: string) => {
    try {
      const response = await axios.get(`/api/projects/${id}`);
      setProject(response.data.project);
    } catch (error) {
      console.error('Failed to fetch project:', error);
    }
  };

  const fetchTasks = async (id: string) => {
    try {
      const response = await axios.get('/api/tasks', {
        params: { projectId: id },
      });
      setTasks(response.data.tasks);
    } catch (error) {
      console.error('Failed to fetch tasks:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddMember = async (e: React.FormEvent) => {
    e.preventDefault();
    setMemberError('');
    setMemberLoading(true);

    try {
      await axios.post(`/api/projects/${projectId}/members`, {
        email: addMemberEmail,
        role: 'member',
      });
      setAddMemberEmail('');
      fetchProject(projectId);
    } catch (err: any) {
      setMemberError(err.response?.data?.error || 'Failed to add member');
    } finally {
      setMemberLoading(false);
    }
  };

  const handleDeleteProject = async () => {
    if (confirm('Are you sure you want to delete this project?')) {
      try {
        await axios.delete(`/api/projects/${projectId}`);
        router.push('/projects');
      } catch (error) {
        console.error('Failed to delete project:', error);
      }
    }
  };

  if (loading || !project) {
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
            <h1 className="text-3xl font-bold text-gray-900">{project.name}</h1>
            <p className="text-gray-600 mt-1">{project.description}</p>
          </div>
          <div className="flex gap-2">
            {user?.role === 'admin' && (
              <>
                <Link
                  href={`/projects/${projectId}/edit`}
                  className="btn-secondary"
                >
                  Edit
                </Link>
                <button onClick={handleDeleteProject} className="btn-danger">
                  Delete
                </button>
              </>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Project Info */}
          <div className="card">
            <h2 className="text-lg font-bold text-gray-900 mb-4">Project Info</h2>
            <div className="space-y-3">
              <div>
                <p className="text-xs text-gray-600">Owner</p>
                <p className="font-medium text-gray-900">{project.owner.name}</p>
              </div>
              <div>
                <p className="text-xs text-gray-600">Created</p>
                <p className="font-medium text-gray-900">
                  {new Date(project.createdAt).toLocaleDateString()}
                </p>
              </div>
            </div>
          </div>

          {/* Members */}
          <div className="card">
            <h2 className="text-lg font-bold text-gray-900 mb-4">Members</h2>
            <div className="space-y-2 max-h-[300px] overflow-y-auto">
              {project.members.map((member) => (
                <div
                  key={member.userId._id}
                  className="flex items-center justify-between py-2 border-b border-gray-100 last:border-0"
                >
                  <div>
                    <p className="font-medium text-gray-900">
                      {member.userId.name}
                    </p>
                    <p className="text-xs text-gray-600">{member.userId.email}</p>
                  </div>
                  <span className="badge badge-info text-xs">
                    {member.role}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Add Member (admins only) */}
          {user?.role === 'admin' && (
            <div className="card">
              <h2 className="text-lg font-bold text-gray-900 mb-4">Add Member</h2>
              {memberError && (
                <div className="mb-4 p-2 bg-red-50 border border-red-200 rounded text-sm text-red-800">
                  {memberError}
                </div>
              )}
              <form onSubmit={handleAddMember} className="space-y-3">
                <input
                  type="email"
                  value={addMemberEmail}
                  onChange={(e) => setAddMemberEmail(e.target.value)}
                  className="input text-sm"
                  placeholder="email@example.com"
                  required
                />
                <button
                  type="submit"
                  disabled={memberLoading}
                  className="btn-primary w-full text-sm"
                >
                  {memberLoading ? 'Adding...' : 'Add Member'}
                </button>
              </form>
            </div>
          )}
        </div>

        {/* Tasks */}
        <div className="card">
            <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-gray-900">Tasks</h2>
            {user?.role === 'admin' ? (
              <Link
                href={`/projects/${projectId}/tasks/new`}
                className="btn-primary text-sm"
              >
                New Task
              </Link>
            ) : null}
          </div>

          {tasks.length === 0 ? (
            <p className="text-gray-600">No tasks in this project</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-3 px-4 font-semibold text-gray-900">
                      Title
                    </th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-900">
                      Status
                    </th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-900">
                      Priority
                    </th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-900">
                      Assignee
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {tasks.map((task) => (
                    <tr
                      key={task._id}
                      className="border-b border-gray-100 hover:bg-gray-50"
                    >
                      <td className="py-3 px-4">
                        <Link
                          href={`/tasks/${task._id}`}
                          className="text-blue-600 hover:text-blue-700 font-medium"
                        >
                          {task.title}
                        </Link>
                      </td>
                      <td className="py-3 px-4">
                        <span
                          className={`badge ${
                            task.status === 'completed'
                              ? 'badge-success'
                              : task.status === 'in_progress'
                              ? 'badge-info'
                              : 'badge-warning'
                          }`}
                        >
                          {task.status.replace('_', ' ')}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <span
                          className={`badge ${
                            task.priority === 'high'
                              ? 'badge-danger'
                              : task.priority === 'medium'
                              ? 'badge-warning'
                              : 'badge-info'
                          }`}
                        >
                          {task.priority}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-gray-600">
                        {task.assignee?.name || 'Unassigned'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </ProtectedLayout>
  );
}
