import { NextRequest, NextResponse } from 'next/server';
import { pushMetrics } from '../../../telemetry/setup';

export async function POST(request: NextRequest) {
  try {
    const contentType = request.headers.get('content-type');
    if (!contentType || !contentType.includes('application/json')) {
      await pushMetrics();
      return NextResponse.json({ 
        success: true, 
        message: 'Server metrics pushed successfully' 
      });
    }

    const body = await request.json();
    
    // Handle client-side metrics
    if (body.type === 'page_view') {
      await pushMetrics();
      
      return NextResponse.json({ 
        success: true, 
        message: 'Client metrics recorded' 
      });
    }
    
    // Default: push server metrics
    await pushMetrics();
    return NextResponse.json({ 
      success: true, 
      message: 'Metrics pushed successfully' 
    });
  } catch (error) {
    console.error('Error handling metrics:', error);
    
    try {
      await pushMetrics();
      return NextResponse.json({ 
        success: true, 
        message: 'Server metrics pushed (fallback)' 
      });
    } catch (pushError) {
      return NextResponse.json(
        { success: false, error: 'Failed to handle metrics' },
        { status: 500 }
      );
    }
  }
}

export async function GET() {
  return NextResponse.json({ 
    message: 'Metrics endpoint - use POST to push metrics',
    status: 'ready'
  });
}
