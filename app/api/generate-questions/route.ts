import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { description, resume_id } = await request.json();

    if (!description || !resume_id) {
      return NextResponse.json(
        { message: 'Missing required fields: description and resume_id' },
        { status: 400 }
      );
    }

    const token = request.headers.get('Authorization')?.replace('Bearer ', '');
    if (!token) {
      return NextResponse.json(
        { message: 'Unauthorized - No token provided' },
        { status: 401 }
      );
    }

    const apiUrl = `${process.env.BACKEND_URL || 'http://localhost:8000'}/interviewservice/question_gen/generate?description=${encodeURIComponent(description)}&resume_id=${resume_id}`;

    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json(data, { status: response.status });
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error('API error:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}
