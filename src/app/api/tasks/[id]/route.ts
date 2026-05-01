import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import { verifyToken } from '@/lib/auth';
import Task from '@/models/Task';
import Project from '@/models/Project';
import { ProjectRole } from '@/models/Project';

const extractId = (v: any) => {
  if (!v) return null;
  if (typeof v === 'string') return v;
  if (v._id) return v._id.toString();
  try {
    return v.toString();
  } catch (e) {
    return null;
  }
};

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
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

    const { id } = await params;
    const task = await Task.findById(id)
      .populate('project', 'name')
      .populate('assignee', 'name email')
      .populate('createdBy', 'name email');

    if (!task) {
      return NextResponse.json(
        { error: 'Task not found' },
        { status: 404 }
      );
    }

    // If member, allow only if they are assignee or creator
    if (decoded.role === 'member') {
      const assigneeId = extractId(task.assignee);
      const creatorId = extractId(task.createdBy);
      const isAssignee = assigneeId === decoded.userId;
      const isCreator = creatorId === decoded.userId;
      if (!isAssignee && !isCreator) {
        return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
      }
    }

    // Populate reports' user info
    await task.populate('reports.userId', 'name email');

    return NextResponse.json({ task }, { status: 200 });
  } catch (error: any) {
    console.error('Get task error:', error);
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
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

    const { id } = await params;
    const body = await request.json();
    const { title, description, status, priority, assigneeId, dueDate, reportMessage } = body;

    const task = await Task.findById(id);
    if (!task) {
      return NextResponse.json(
        { error: 'Task not found' },
        { status: 404 }
      );
    }

    // Check if user is member of project
    const project = await Project.findById(task.project);
    const isMember =
      project?.owner.toString() === decoded.userId ||
      project?.members.some((m: any) => m.userId.toString() === decoded.userId);

    if (!isMember) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    // If member, restrict what they can change: status and/or add a report
    if (decoded.role === 'member') {
      const currentAssigneeId = extractId(task.assignee);
      if (currentAssigneeId !== decoded.userId) {
        return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
      }

      // Handle report message (optional)
      const newStatus: string | undefined = status;

      if (!reportMessage && newStatus === undefined) {
        return NextResponse.json({ error: 'Members must provide a report or a new status' }, { status: 400 });
      }

      if (reportMessage) {
        task.reports = task.reports || [];
        task.reports.push({ userId: decoded.userId, message: reportMessage, status: newStatus });
      }

      if (newStatus !== undefined) {
        task.status = newStatus as any;
      }
    } else {
      // Admins can update full fields
      if (title !== undefined) task.title = title;
      if (description !== undefined) task.description = description;
      if (status !== undefined) task.status = status;
      if (priority !== undefined) task.priority = priority;
      if (assigneeId !== undefined) task.assignee = assigneeId;
      if (dueDate !== undefined) task.dueDate = dueDate;
    }

    await task.save();
    await task.populate('project', 'name');
    await task.populate('assignee', 'name email');
    await task.populate('createdBy', 'name email');

    return NextResponse.json(
      {
        message: 'Task updated successfully',
        task,
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error('Update task error:', error);
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
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

    const { id } = await params;
    const task = await Task.findById(id);

    if (!task) {
      return NextResponse.json(
        { error: 'Task not found' },
        { status: 404 }
      );
    }

    // Check if user is project admin or task creator
    const project = await Project.findById(task.project);
    const isAdmin =
      project?.owner.toString() === decoded.userId ||
      project?.members.some(
        (m: any) =>
          m.userId.toString() === decoded.userId &&
          m.role === ProjectRole.ADMIN
      );
    const creatorId = extractId(task.createdBy);
    const isCreator = creatorId === decoded.userId;

    if (!isAdmin && !isCreator) {
      return NextResponse.json(
        { error: 'Forbidden' },
        { status: 403 }
      );
    }

    await Task.findByIdAndDelete(id);

    return NextResponse.json(
      { message: 'Task deleted successfully' },
      { status: 200 }
    );
  } catch (error: any) {
    console.error('Delete task error:', error);
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}
