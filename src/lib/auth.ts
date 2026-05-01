import jwt from 'jsonwebtoken';
import { cookies } from 'next/headers';

export async function setAuthToken(userId: string, role: string) {
  const token = jwt.sign(
    { userId, role },
    process.env.JWT_SECRET || 'secret',
    { expiresIn: '7d' }
  );

  const cookieStore = await cookies();
  cookieStore.set('authToken', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 60 * 60 * 24 * 7, // 7 days
  });

  return token;
}

export async function getAuthToken() {
  const cookieStore = await cookies();
  return cookieStore.get('authToken')?.value;
}

export async function clearAuthToken() {
  const cookieStore = await cookies();
  cookieStore.delete('authToken');
}

export async function verifyToken(token: string) {
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret');
    return decoded as { userId: string; role: string };
  } catch {
    return null;
  }
}
