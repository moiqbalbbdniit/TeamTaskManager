import { NextRequest, NextResponse } from 'next/server';
import { verifyToken } from '@/lib/auth';

export async function withAuth(
  request: NextRequest,
  handler: (req: NextRequest, context: any) => Promise<any>
) {
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

  // Add user info to request
  const requestWithUser = new NextRequest(request, {
    headers: {
      ...request.headers,
      'x-user-id': decoded.userId,
      'x-user-role': decoded.role,
    },
  });

  return handler(requestWithUser, {});
}

export function requireRole(allowedRoles: string[]) {
  return (handler: (req: NextRequest) => Promise<any>) => {
    return async (request: NextRequest) => {
      const userRole = request.headers.get('x-user-role');

      if (!userRole || !allowedRoles.includes(userRole)) {
        return NextResponse.json(
          { error: 'Forbidden' },
          { status: 403 }
        );
      }

      return handler(request);
    };
  };
}
