import { NextRequest, NextResponse } from 'next/server';
import { clearAuthToken } from '@/lib/auth';

export async function POST(request: NextRequest) {
  try {
    await clearAuthToken();

    return NextResponse.json(
      { message: 'Logout successful' },
      { status: 200 }
    );
  } catch (error: any) {
    console.error('Logout error:', error);
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}
