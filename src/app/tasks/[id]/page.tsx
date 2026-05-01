'use client';

import { ProtectedLayout } from '@/components/ProtectedLayout';
import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import axios from 'axios';
import { useRouter } from 'next/navigation';

interface Task {
  _id: string;
  title: string;
  description: string;
  status: string;
  priority: string;
  dueDate: string;
  assignee: { _id: string; name: string; email: string } | null;
  project: { _id: string; name: string };
  createdBy: { name: string; email: string };
  createdAt: string;
}

export default function TaskDetailsPage({
  params,
}: {
  params: { id: string };
}) {
  const router = useRouter();
  const [taskId, setTaskId] = useState('');
  const [task, setTask] = useState<Task | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    status: '',
    priority: '',
    dueDate: '',
  });
  const [error, setError] = useState('');
  const { user } = useAuth();
  const [reportMessage, setReportMessage] = useState('');

  useEffect(() => {
    setTaskId(params.id);
    fetchTask(params.id);
  }, [params.id]);

  const fetchTask = async (id: string) => {
    try {
      const response = await axios.get(`/api/tasks/${id}`);
      setTask(response.data.task);
      setFormData({
        title: response.data.task.title,
        description: response.data.task.description,
        status: response.data.task.status,
        priority: response.data.task.priority,
        dueDate: response.data.task.dueDate?.split('T')[0] || '',
      });
    } catch (error) {
      console.error('Failed to fetch task:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    try {
      const response = await axios.put(`/api/tasks/${taskId}`, formData);
      setTask(response.data.task);
      setIsEditing(false);
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to update task');
    }
  };

  const handleDelete = async () => {
    if (confirm('Are you sure you want to delete this task?')) {
      try {
        await axios.delete(`/api/tasks/${taskId}`);
        if (task?.project._id) {
          router.push(`/projects/${task.project._id}`);
        }
      } catch (error) {
        console.error('Failed to delete task:', error);
      }
    }
  };

  if (loading || !task) {
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
      <div className="max-w-3xl mx-auto space-y-8">
        <div className="flex items-center justify-between">
          <button
            onClick={() => router.back()}
            className="text-blue-600 hover:text-blue-700"
          >
            ← Back
          </button>
          <div className="flex gap-2">
            {!isEditing && (
              <>
                {user?.role === 'admin' && (
                  <button
                    onClick={() => setIsEditing(true)}
                    className="btn-secondary"
                  >
                    Edit
                  </button>
                )}

                {/* Delete allowed for admin or creator (match by email) */}
                {(user?.role === 'admin' || user?.email === task.createdBy.email) && (
                  <button onClick={handleDelete} className="btn-danger">
                    Delete
                  </button>
                )}

                {/* Assignee can mark complete */}
                {task.assignee && user && user.id === String(task.assignee._id) && task.status !== 'completed' && (
                  <button
                    onClick={async () => {
                      try {
                        await axios.put(`/api/tasks/${taskId}`, { status: 'completed' });
                        fetchTask(taskId);
                      } catch (err) {
                        console.error('Failed to mark complete', err);
                      }
                    }}
                    className="btn-primary"
                  >
                    Mark Complete
                  </button>
                )}
              </>
            )}
          </div>
        </div>

        <div className="card">
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-800 text-sm">{error}</p>
            </div>
          )}

          {!isEditing ? (
            <div className="space-y-6">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">
                  {task.title}
                </h1>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-xs text-gray-600 mb-1">Status</p>
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
                </div>
                <div>
                  <p className="text-xs text-gray-600 mb-1">Priority</p>
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
                </div>
              </div>

              <div>
                <p className="text-xs text-gray-600 mb-1">Description</p>
                <p className="text-gray-900">
                  {task.description || 'No description'}
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-gray-200">
                <div>
                  <p className="text-xs text-gray-600 mb-1">Assigned To</p>
                  <p className="font-medium text-gray-900">
                    {task.assignee ? task.assignee.name : 'Unassigned'}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-600 mb-1">Due Date</p>
                  <p className="font-medium text-gray-900">
                    {task.dueDate
                      ? new Date(task.dueDate).toLocaleDateString()
                      : 'No due date'}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-600 mb-1">Project</p>
                  <p className="font-medium text-gray-900">
                    {task.project.name}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-600 mb-1">Created By</p>
                  <p className="font-medium text-gray-900">
                    {task.createdBy.name}
                  </p>
                </div>
              </div>
              {/* Reports */}
              <div className="pt-4">
                <h3 className="text-sm font-semibold text-gray-900 mb-3">Reports</h3>
                {task.reports && task.reports.length > 0 ? (
                  <div className="space-y-3">
                    {task.reports.map((r: any, idx: number) => (
                      <div key={idx} className="p-3 border rounded">
                        <p className="text-xs text-gray-600">{r.userId?.name || 'User'}</p>
                        <p className="text-sm text-gray-800">{r.message}</p>
                        {r.status && (
                          <p className="text-xs text-gray-500 mt-1">Status: {r.status.replace('_', ' ')}</p>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-600">No reports yet</p>
                )}

                {/* Report form for assignee */}
                {task.assignee && user && user.id === String(task.assignee._id) && (
                  <form
                    onSubmit={async (e) => {
                      e.preventDefault();
                      try {
                        await axios.put(`/api/tasks/${taskId}`, { reportMessage, status: task.status });
                        setReportMessage('');
                        fetchTask(taskId);
                      } catch (err: any) {
                        console.error('Failed to send report', err);
                        setError(err.response?.data?.error || 'Failed to send report');
                      }
                    }}
                    className="mt-4 space-y-3"
                  >
                    <textarea
                      value={reportMessage}
                      onChange={(e) => setReportMessage(e.target.value)}
                      className="input min-h-[80px]"
                      placeholder="Write a short report (what you're working on / blockers)"
                      required
                    />
                    <div className="flex gap-2">
                      <button type="submit" className="btn-primary">Send Report</button>
                      <button
                        type="button"
                        onClick={async () => {
                          // quick mark complete
                          try {
                            await axios.put(`/api/tasks/${taskId}`, { status: 'completed' });
                            fetchTask(taskId);
                          } catch (err) {
                            console.error('Failed to mark complete', err);
                          }
                        }}
                        className="btn-secondary"
                      >
                        Mark Complete
                      </button>
                    </div>
                  </form>
                )}
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Title
                </label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  className="input"
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
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Status
                  </label>
                  <select
                    name="status"
                    value={formData.status}
                    onChange={handleChange}
                    className="input"
                  >
                    <option value="todo">To Do</option>
                    <option value="in_progress">In Progress</option>
                    <option value="completed">Completed</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Priority
                  </label>
                  <select
                    name="priority"
                    value={formData.priority}
                    onChange={handleChange}
                    className="input"
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Due Date
                </label>
                <input
                  type="date"
                  name="dueDate"
                  value={formData.dueDate}
                  onChange={handleChange}
                  className="input"
                />
              </div>

              <div className="flex gap-4">
                <button type="submit" className="btn-primary flex-1">
                  Save Changes
                </button>
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="btn-secondary flex-1"
                >
                  Cancel
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </ProtectedLayout>
  );
}
