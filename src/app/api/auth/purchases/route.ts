import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const authToken = request.cookies.get('dreamitbiz_auth')?.value;

  if (!authToken) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  // In production, fetch user's purchases from main site API
  // For now, return mock data
  return NextResponse.json({
    purchases: [],
    bookmarks: [],
    readingProgress: {},
  });
}
