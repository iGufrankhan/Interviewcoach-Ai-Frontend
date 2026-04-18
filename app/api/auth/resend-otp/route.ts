import { NextRequest, NextResponse } from 'next/server';

const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email } = body;

    if (!email) {
      return NextResponse.json(
        { success: false, message: 'Email is required', error_code: 'MISSING_EMAIL' },
        { status: 400 }
      );
    }

    const response = await fetch(`${BACKEND_URL}/api/auth/resend-otp`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email }),
    });

    const data = await response.json();
    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    console.error('[resend-otp] Error:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to resend OTP', error_code: 'ERROR' },
      { status: 500 }
    );
  }
}
