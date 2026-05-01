import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import User, { UserRole } from '@/models/User';
import { setAuthToken } from '@/lib/auth';

export async function POST(request: NextRequest) {
  try {
    await connectDB();

    const { name, email, password, confirmPassword, role, adminKey } = await request.json();

    const normalizedRole = role === UserRole.ADMIN ? UserRole.ADMIN : UserRole.MEMBER;

    // Validation
    if (!name || !email || !password) {
      return NextResponse.json(
        { error: 'Please provide all required fields' },
        { status: 400 }
      );
    }

    if (password !== confirmPassword) {
      return NextResponse.json(
        { error: 'Passwords do not match' },
        { status: 400 }
      );
    }

    if (normalizedRole === UserRole.ADMIN) {
      const adminSignupKey = process.env.ADMIN_SIGNUP_KEY;

      if (!adminSignupKey) {
        return NextResponse.json(
          { error: 'Admin signup is not configured' },
          { status: 500 }
        );
      }

      if (!adminKey || adminKey !== adminSignupKey) {
        return NextResponse.json(
          { error: 'Invalid admin signup key' },
          { status: 403 }
        );
      }
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return NextResponse.json(
        { error: 'User already exists' },
        { status: 409 }
      );
    }

    // Create user
    const user = await User.create({
      name,
      email,
      password,
      role: normalizedRole,
    });

    // Generate token
    await setAuthToken(user._id.toString(), user.role);

    return NextResponse.json(
      {
        message: 'User registered successfully',
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
        },
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error('Signup error:', error);
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}
