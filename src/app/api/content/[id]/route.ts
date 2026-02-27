import { NextRequest, NextResponse } from 'next/server';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const authToken = request.cookies.get('dreamitbiz_auth')?.value;

  // Check if content is free or user is authenticated
  // In production, verify purchase status
  if (!authToken) {
    return NextResponse.json(
      { error: 'Authentication required' },
      { status: 401 }
    );
  }

  // In production, stream content from storage
  return NextResponse.json({
    contentId: id,
    url: `/content/${id}`,
    type: 'pdf',
    message: 'Content streaming endpoint - implement with actual storage',
  });
}
