import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  // Check for auth cookie from main site
  const authToken = request.cookies.get('dreamitbiz_auth')?.value;

  if (!authToken) {
    return NextResponse.json({ authenticated: false }, { status: 401 });
  }

  // In production, verify token with main site API
  // For now, return mock user data
  return NextResponse.json({
    authenticated: true,
    user: {
      id: 'user-1',
      name: 'Test User',
      email: 'test@example.com',
    },
  });
}
