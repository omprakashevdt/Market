import { NextResponse } from 'next/server';
import { getAdminMetrics } from '@/lib/dataService';
import { getAdminSession } from '@/lib/auth';

export async function GET() {
  try {
    const session = await getAdminSession();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const {
      totalProducts,
      totalCategories,
      totalEnquiries,
      newEnquiries,
      featuredProducts,
    } = await getAdminMetrics();

    return NextResponse.json({
      success: true,
      stats: {
        totalProducts,
        totalCategories,
        totalEnquiries,
        newEnquiries,
        featuredProducts,
      },
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

