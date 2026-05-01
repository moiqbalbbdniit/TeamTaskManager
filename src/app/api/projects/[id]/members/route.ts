import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import { verifyToken } from '@/lib/auth';
import Project from '@/models/Project';
import User from '@/models/User';
import { ProjectRole } from '@/models/Project';

export async function POST(
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
    const { email, role } = await request.json();

    const project = await Project.findById(id);
    if (!project) {
      return NextResponse.json(
        { error: 'Project not found' },
        { status: 404 }
      );
    }

    // Check if user is admin
    const isAdmin =
      project.owner.toString() === decoded.userId ||
      project.members.some(
        (m: any) =>
          m.userId.toString() === decoded.userId &&
          m.role === ProjectRole.ADMIN
      );

    if (!isAdmin) {
      return NextResponse.json(
        { error: 'Forbidden' },
        { status: 403 }
      );
    }

    // Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    // Check if already member
    const isMember = project.members.some(
      (m: any) => m.userId.toString() === user._id.toString()
    );

    if (isMember) {
      return NextResponse.json(
        { error: 'User is already a member' },
        { status: 400 }
      );
    }

    // Add member
    project.members.push({
      userId: user._id,
      role: role || ProjectRole.MEMBER,
    });

    await project.save();
    await project.populate('members.userId', 'name email');

    return NextResponse.json(
      {
        message: 'Member added successfully',
        project,
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error('Add member error:', error);
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
    const { userId } = await request.json();

    const project = await Project.findById(id);
    if (!project) {
      return NextResponse.json(
        { error: 'Project not found' },
        { status: 404 }
      );
    }

    // Check if user is admin
    const isAdmin =
      project.owner.toString() === decoded.userId ||
      project.members.some(
        (m: any) =>
          m.userId.toString() === decoded.userId &&
          m.role === ProjectRole.ADMIN
      );

    if (!isAdmin) {
      return NextResponse.json(
        { error: 'Forbidden' },
        { status: 403 }
      );
    }

    // Remove member
    project.members = project.members.filter(
      (m: any) => m.userId.toString() !== userId
    );

    await project.save();

    return NextResponse.json(
      { message: 'Member removed successfully' },
      { status: 200 }
    );
  } catch (error: any) {
    console.error('Remove member error:', error);
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}
