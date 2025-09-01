import { db } from "@/Firebase";
import { doc, getDoc } from "firebase/firestore";
import { getApiDocs } from '@/lib/swagger';
import { NextResponse } from 'next/server';
import { requireAuth } from "@/lib/requireAuth";

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET(request: Request) {
  try {
    const { user, error } = await requireAuth(request);
    if (error) return error;

    // Check admin status
    const adminDocRef = doc(db, "admin", user.uid);
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