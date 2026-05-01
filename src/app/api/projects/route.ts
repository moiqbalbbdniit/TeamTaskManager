import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import { verifyToken } from '@/lib/auth';
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

    // Get projects where user is owner or member
    const projects = await Project.find({
      $or: [
        { owner: decoded.userId },
        { 'members.userId': decoded.userId },
      ],
    })
      .populate('owner', 'name email')
      .populate('members.userId', 'name email');

    return NextResponse.json(
      { projects },
      { status: 200 }
    );
  } catch (error: any) {
    console.error('Get projects error:', error);
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

    if (decoded.role !== 'admin') {
      return NextResponse.json(
        { error: 'Only admins can create projects' },
        { status: 403 }
      );
    }

    const { name, description } = await request.json();

    if (!name) {
      return NextResponse.json(
        { error: 'Please provide a project name' },
        { status: 400 }
      );
    }

    const project = await Project.create({
      name,
      description,
      owner: decoded.userId,
      members: [
        {
          userId: decoded.userId,
          role: ProjectRole.ADMIN,
        },
      ],
    });

    await project.populate('owner', 'name email');

    return NextResponse.json(
      {
        message: 'Project created successfully',
        project,
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error('Create project error:', error);
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}
