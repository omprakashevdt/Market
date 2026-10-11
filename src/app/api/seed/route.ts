import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({
    success: true,
    message: 'Store initial mock catalog is already pre-loaded and ready for live use!',
  });
}
