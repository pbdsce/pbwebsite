import { NextResponse } from 'next/server';

export async function POST() {
  const response = NextResponse.json({ message: 'Logged out' });
  response.cookies.set('session', '', {
    maxAge: 0,
    httpOnly: true,
    secure: true,
    path: '/',
    sameSite: 'strict',
  });
  return response;
}