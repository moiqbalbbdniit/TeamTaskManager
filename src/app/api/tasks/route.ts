import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import { verifyToken } from '@/lib/auth';
import Task from '@/models/Task';
import Project from '@/models/Project';
import { ProjectRole } from '@/models/Project';

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

    const { searchParams } = new URL(request.url);
    const projectId = searchParams.get('projectId');

    let query: any = {};
    if (projectId) {
      // If member, restrict tasks in project to those assigned to them or created by them
      if (decoded.role === 'member') {
        query = {
          project: projectId,
          $or: [{ assignee: decoded.userId }, { createdBy: decoded.userId }],
        };
      } else {
        query.project = projectId;
      }
    } else {
      // No projectId: admins see all tasks, members see only tasks assigned to or created by them
      if (decoded.role === 'member') {
        query = { $or: [{ assignee: decoded.userId }, { createdBy: decoded.userId }] };
      } else {
        query = {};
      }
    }

    const tasks = await Task.find(query)
      .populate('project', 'name')
      .populate('assignee', 'name email')
      .populate('createdBy', 'name email');

    return NextResponse.json(
      { tasks },
      { status: 200 }
    );
  } catch (error: any) {
    console.error('Get tasks error:', error);
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
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

    const { title, description, projectId, assigneeId, priority, dueDate } =
      await request.json();

    if (!title || !projectId) {
      return NextResponse.json(
        { error: 'Please provide title and projectId' },
        { status: 400 }
      );
    }

    // Check if user is member of project
    const project = await Project.findById(projectId);
    if (!project) {
      return NextResponse.json(
        { error: 'Project not found' },
        { status: 404 }
      );
    }

    const isMember =
      project.owner.toString() === decoded.userId ||
      project.members.some((m: any) => m.userId.toString() === decoded.userId);

    if (!isMember) {
      return NextResponse.json(
        { error: 'Forbidden' },
        { status: 403 }
      );
    }

    const task = await Task.create({
      title,
      description,
      project: projectId,
      assignee: assigneeId || null,
      priority,
      dueDate,
      createdBy: decoded.userId,
    });

    await task.populate('project', 'name');
    await task.populate('assignee', 'name email');
    await task.populate('createdBy', 'name email');

    return NextResponse.json(
      {
        message: 'Task created successfully',
        task,
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error('Create task error:', error);
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}
