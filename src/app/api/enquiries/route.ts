import { NextRequest, NextResponse } from 'next/server';
import { recordEnquiry, getEnquiries } from '@/lib/dataService';
import { enquirySchema } from '@/lib/validations';
import { getAdminSession } from '@/lib/auth';
import { z } from 'zod';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const validated = enquirySchema.parse(body);
    const enquiry = await recordEnquiry(validated);
    return NextResponse.json({ success: true, data: enquiry }, { status: 201 });
  } catch (err: any) {
    if (err instanceof z.ZodError) {
      return NextResponse.json({ error: 'Validation Error', details: err.issues }, { status: 400 });
    }
    return NextResponse.json({ error: err.message || 'Server Error' }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  try {
    const session = await getAdminSession();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);

    const status = searchParams.get('status') || undefined;
    const search = searchParams.get('search') || undefined;
    const page = parseInt(searchParams.get('page') || '1', 10);
    const limit = parseInt(searchParams.get('limit') || '20', 10);

    const { enquiries, total } = await getEnquiries({
      status,
      search,
      page,
      limit,
    });

    return NextResponse.json({
      success: true,
      data: enquiries,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
