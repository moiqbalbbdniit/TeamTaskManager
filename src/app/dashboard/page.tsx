'use client';

import { ProtectedLayout } from '@/components/ProtectedLayout';
import { useState, useEffect } from 'react';
import axios from 'axios';
import Link from 'next/link';
import { formatDistanceToNow } from 'date-fns';
import { useAuth } from '@/context/AuthContext';

interface DashboardStats {
  role: 'admin' | 'member';
  projectCount: number;
  ownedProjects: number;
  memberProjects: number;
  totalTasks: number;
  completedTasks: number;
  inProgressTasks: number;
  todoTasks: number;
  overdueTasks: number;
  assignedTasks: number;
  completionPercentage: number;
}

interface Task {
  _id: string;
  title: string;
  description: string;
  status: string;
  priority: string;
  dueDate: string;
  createdAt: string;
  project: { name: string };
  assignee: { name: string; email: string } | null;
}

export default function Dashboard() {
  const { user } = useAuth();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboard();
  }, []);

  const fetchDashboard = async () => {
    try {
      const response = await axios.get('/api/dashboard');
      setStats(response.data.stats);
      setTasks(response.data.recentTasks);
    } catch (error) {
      console.error('Failed to fetch dashboard:', error);
    } finally {
      setLoading(false);
    }
  };

  const isAdmin = user?.role === 'admin';
  const dashboardTitle = isAdmin ? 'Admin Dashboard' : 'Member Dashboard';
  const dashboardDescription = isAdmin
    ? 'Oversee projects, assignments, and team progress.'
    : 'Track your assigned work and progress across projects.';

  const topCards = isAdmin
    ? [
        { label: 'Projects', value: stats?.projectCount || 0, tone: 'text-gray-900' },
        { label: 'Owned Projects', value: stats?.ownedProjects || 0, tone: 'text-blue-600' },
        { label: 'Completed', value: stats?.completedTasks || 0, tone: 'text-green-600' },
        { label: 'Overdue', value: stats?.overdueTasks || 0, tone: 'text-red-600' },
      ]
    : [
        { label: 'Assigned Tasks', value: stats?.assignedTasks || 0, tone: 'text-gray-900' },
        { label: 'To Do', value: stats?.todoTasks || 0, tone: 'text-amber-600' },
        { label: 'In Progress', value: stats?.inProgressTasks || 0, tone: 'text-blue-600' },
        { label: 'Overdue', value: stats?.overdueTasks || 0, tone: 'text-red-600' },
      ];

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
        <div className="rounded-3xl bg-gradient-to-r from-slate-900 via-blue-900 to-cyan-700 px-8 py-10 text-white shadow-xl shadow-slate-200/50">
          <p className="text-sm uppercase tracking-[0.25em] text-white/75">
            {isAdmin ? 'Admin workspace' : 'Member workspace'}
          </p>
          <h1 className="mt-3 text-4xl font-bold">{dashboardTitle}</h1>
          <p className="mt-3 max-w-2xl text-white/85">{dashboardDescription}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {topCards.map((card) => (
            <div key={card.label} className="card">
              <p className="text-gray-600 text-sm">{card.label}</p>
              <p className={`text-3xl font-bold mt-1 ${card.tone}`}>{card.value}</p>
              {card.label === 'Completed' && isAdmin && (
                <p className="text-xs text-gray-500 mt-2">
                  {stats?.completionPercentage || 0}% complete
                </p>
              )}
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="card">
            <h2 className="text-lg font-bold text-gray-900 mb-4">
              {isAdmin ? 'Team Overview' : 'My Workload'}
            </h2>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-gray-700">To Do</span>
                <span className="font-semibold text-gray-900">
                  {stats?.todoTasks || 0}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-700">In Progress</span>
                <span className="font-semibold text-gray-900">
                  {stats?.inProgressTasks || 0}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-700">Completed</span>
                <span className="font-semibold text-gray-900">
                  {stats?.completedTasks || 0}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-700">Projects</span>
                <span className="font-semibold text-gray-900">
                  {stats?.projectCount || 0}
                </span>
              </div>
            </div>
          </div>

          <div className="card">
            <h2 className="text-lg font-bold text-gray-900 mb-4">Quick Actions</h2>
            <div className="space-y-2">
              <Link href="/projects" className="btn-primary block text-center">
                View Projects
              </Link>
              {isAdmin ? (
                <>
                  <Link href="/projects/new" className="btn-secondary block text-center">
                    Create Project
                  </Link>
                  <Link href="/admin" className="btn-secondary block text-center">
                    Admin Panel
                  </Link>
                </>
              ) : (
                <Link href="/projects" className="btn-secondary block text-center">
                  Browse Projects
                </Link>
              )}
            </div>
          </div>
        </div>

        <div className="card">
          <h2 className="text-lg font-bold text-gray-900 mb-4">
            {isAdmin ? 'Recent Team Tasks' : 'My Recent Tasks'}
          </h2>
          {tasks.length === 0 ? (
            <p className="text-gray-600">
              {isAdmin ? 'No team tasks yet' : 'No assigned tasks yet'}
            </p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-3 px-4 font-semibold text-gray-900">
                      Title
                    </th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-900">
                      {isAdmin ? 'Project' : 'Project'}
                    </th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-900">
                      Status
                    </th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-900">
                      Priority
                    </th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-900">
                      Created
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
                      <td className="py-3 px-4 text-gray-600">
                        {task.project.name}
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
                        {formatDistanceToNow(new Date(task.createdAt), {
                          addSuffix: true,
                        })}
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
