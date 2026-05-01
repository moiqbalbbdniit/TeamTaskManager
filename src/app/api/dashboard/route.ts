import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import { verifyToken } from '@/lib/auth';
import Task from '@/models/Task';
import Project from '@/models/Project';
import { TaskStatus } from '@/models/Task';

export async function GET(request: NextRequest) {
  try {
    await connectDB();

    const token = request.cookies.get('authToken')?.value;
    if (!token) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const decoded = await verifyToken(token);
    if (!decoded) {
      return NextResponse.json(
        { error: 'Invalid token' },
        { status: 401 }
      );
    }

    const isAdmin = decoded.role === 'admin';

    // Get user's projects
    const projects = await Project.find({
      $or: [
        { owner: decoded.userId },
        { 'members.userId': decoded.userId },
      ],
    });

    const projectIds = projects.map((p) => p._id);
    const memberProjects = projects.filter(
      (project) => project.owner.toString() !== decoded.userId
    ).length;
    const ownedProjects = projects.length - memberProjects;

    const taskScopeFilter = isAdmin
      ? { project: { $in: projectIds } }
      : {
          project: { $in: projectIds },
          $or: [{ assignee: decoded.userId }, { createdBy: decoded.userId }],
        };

    // Get task statistics
    const totalTasks = await Task.countDocuments(taskScopeFilter);

    const completedTasks = await Task.countDocuments({
      ...taskScopeFilter,
      status: TaskStatus.COMPLETED,
    });

    const inProgressTasks = await Task.countDocuments({
      ...taskScopeFilter,
      status: TaskStatus.IN_PROGRESS,
    });

    const todoTasks = await Task.countDocuments({
      ...taskScopeFilter,
      status: TaskStatus.TODO,
    });

    // Get overdue tasks
    const now = new Date();
    const overdueTasks = await Task.countDocuments({
      ...taskScopeFilter,
      dueDate: { $lt: now },
      status: { $ne: TaskStatus.COMPLETED },
    });

    // Get assigned tasks for user
    const assignedTasks = await Task.countDocuments({
      assignee: decoded.userId,
      status: { $ne: TaskStatus.COMPLETED },
    });

    // Get recent tasks
    const recentTasks = await Task.find(taskScopeFilter)
      .populate('project', 'name')
      .populate('assignee', 'name email')
      .sort({ createdAt: -1 })
      .limit(5);

    return NextResponse.json(
      {
        stats: {
          role: decoded.role,
          projectCount: projects.length,
          ownedProjects,
          memberProjects,
          totalTasks,
          completedTasks,
          inProgressTasks,
          todoTasks,
          overdueTasks,
          assignedTasks,
          completionPercentage:
            totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0,
        },
        recentTasks,
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error('Dashboard error:', error);
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}
