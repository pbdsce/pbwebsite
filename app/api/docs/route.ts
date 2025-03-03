import { db } from "@/Firebase";
import { doc, getDoc } from "firebase/firestore";
import { getApiDocs } from '@/lib/swagger';
import { NextResponse } from 'next/server';
import { logInfo, logError } from '@/lib/logger';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET(request: Request) {
  logInfo('API request received', {
    endpoint: '/api/docs',
    method: 'GET'
  });

  try {
    // Get the UID from the query parameters
    const { searchParams } = new URL(request.url);
    const uid = searchParams.get('uid');

    if (!uid) {
      logError('No user ID provided', new Error('Missing UID'), {
        endpoint: '/api/docs',
        method: 'GET'
      });
      return NextResponse.json(
        { error: 'No user ID provided' },
        { status: 401 }
      );
    }

    // Check admin status
    const adminDocRef = doc(db, "admin", uid);
    const adminDocSnap = await getDoc(adminDocRef);

    if (!adminDocSnap.exists()) {
      logError('Access denied. Admin privileges required.', new Error('Unauthorized access'), {
        endpoint: '/api/docs',
        method: 'GET'
      });
      return NextResponse.json(
        { error: 'Access denied. Admin privileges required.' },
        { status: 403 }
      );
    }

    // If admin, proceed to generate API docs
    const spec = await getApiDocs();
    logInfo('API request completed successfully', {
      endpoint: '/api/docs',
      method: 'GET'
    });
    return NextResponse.json(spec, {
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Cache-Control': 'no-store, max-age=0',
      },
    });
  } catch (error) {
    logError('Error generating API docs', error as Error, {
      endpoint: '/api/docs',
      method: 'GET'
    });
    return NextResponse.json(
      { error: 'Failed to generate API documentation' },
      { status: 500 }
    );
  }
}
