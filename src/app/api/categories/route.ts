import { NextRequest, NextResponse } from 'next/server';
import { getCategories, createCategory } from '@/lib/dataService';
import { categorySchema } from '@/lib/validations';
import { getAdminSession } from '@/lib/auth';

export async function GET() {
  const categories = await getCategories();
  return NextResponse.json({ success: true, data: categories });
}

export async function POST(req: NextRequest) {
  try {
    const session = await getAdminSession();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const validated = categorySchema.parse(body);

    const category = await createCategory(validated);
    return NextResponse.json({ success: true, data: category }, { status: 201 });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 400 });
  }
}
