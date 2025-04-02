import { db } from "@/Firebase";
import { doc, getDoc } from "firebase/firestore";
import { getApiDocs } from '@/lib/swagger';
import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET(request: Request) {
  try {
    // Get the UID from the query parameters
    const { searchParams } = new URL(request.url);
    const uid = searchParams.get('uid');

    if (!uid) {
      return NextResponse.json(
        { error: 'No user ID provided' },
        { status: 401 }
      );
    }

    // Check admin status
    const adminDocRef = doc(db, "admin", uid);
    const adminDocSnap = await getDoc(adminDocRef);

    if (!adminDocSnap) {
      return NextResponse.json(
        { error: 'Access denied. Admin privileges required.' },
        { status: 403 }
      );
    }

    // If admin, proceed to generate API docs
    const spec = await getApiDocs();
    return NextResponse.json(spec, {
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Cache-Control': 'no-store, max-age=0',
      },
    });
  } catch (error) {
    console.error('Error generating API docs:', error);
    return NextResponse.json(
      { error: 'Failed to generate API documentation' },
      { status: 500 }
    );
  }
}