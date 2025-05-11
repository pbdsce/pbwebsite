import { NextResponse } from 'next/server';
import admin from '@/Firebase-admin';


export async function POST(req: Request) {
  try {
    const body = await req.json();
    const idToken = body.idToken;

    if (!idToken) {
      return NextResponse.json({ message: 'Missing ID token' }, { status: 400 });
    }
    
    const expiresIn = 60 * 60 * 24 * 5 * 1000;// Set the expiration time to 5 days
    const sessionCookie = await admin.auth().createSessionCookie(idToken, { expiresIn });
    const response = NextResponse.json({ status: 'success' });
    response.cookies.set('session', sessionCookie, {
      maxAge: expiresIn / 1000,
      httpOnly: true,
      secure: true,
      path: '/',
      sameSite: 'strict',
    });

    return response;

  } catch (err) {
    console.error('[SESSION_LOGIN_ERROR]', err);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}
