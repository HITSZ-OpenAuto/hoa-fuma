import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { path, rating, comments } = body || {};

    if (!path || typeof path !== 'string') {
      return NextResponse.json(
        { success: false, error: 'Page path is required.' },
        { status: 400 }
      );
    }

    if (rating !== 'helpful' && rating !== 'unhelpful') {
      return NextResponse.json(
        { success: false, error: 'Rating must be helpful or unhelpful.' },
        { status: 400 }
      );
    }

    // Console log for server audit / storage mock
    console.log('[Page Feedback Received]', {
      timestamp: new Date().toISOString(),
      path,
      rating,
      comments: comments ? String(comments).trim() : '',
    });

    return NextResponse.json({
      success: true,
      message: 'Thank you for your feedback!',
    });
  } catch (error) {
    console.error('Error processing feedback API request:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to process feedback.' },
      { status: 500 }
    );
  }
}
