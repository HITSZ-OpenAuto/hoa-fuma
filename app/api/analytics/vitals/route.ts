import { NextResponse } from 'next/server';

export interface WebVitalsPayload {
  id: string;
  name: string;
  value: number;
  rating?: string;
  delta: number;
}

export async function POST(request: Request) {
  try {
    let body: Partial<WebVitalsPayload> = {};
    const contentType = request.headers.get('content-type') || '';

    if (contentType.includes('application/json')) {
      body = await request.json();
    } else {
      const text = await request.text();
      body = text ? JSON.parse(text) : {};
    }

    const { id, name, value, rating, delta } = body;

    if (process.env.NODE_ENV === 'development') {
      console.log('[Web Vitals Metric Received]:', { id, name, value, rating, delta });
    }

    return NextResponse.json({
      success: true,
      timestamp: Date.now(),
    });
  } catch {
    return NextResponse.json(
      { success: false, error: 'Invalid request body' },
      { status: 400 }
    );
  }
}
