import { NextRequest, NextResponse } from 'next/server';
import { getProductCatalog, createProduct } from '@/lib/dataService';
import { productSchema } from '@/lib/validations';
import { getAdminSession } from '@/lib/auth';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);

  const category = searchParams.get('category') || undefined;
  const search = searchParams.get('q') || undefined;
  const sort = searchParams.get('sort') || 'newest';
  const minPrice = searchParams.get('minPrice') || undefined;
  const maxPrice = searchParams.get('maxPrice') || undefined;
  const featured = searchParams.get('featured') || undefined;
  const popular = searchParams.get('popular') || undefined;
  const page = parseInt(searchParams.get('page') || '1', 10);
  const limit = parseInt(searchParams.get('limit') || '12', 10);

  const { products, total } = await getProductCatalog({
    category,
    search,
    sort,
    minPrice,
    maxPrice,
    featured,
    popular,
    page,
    limit,
  });

  return NextResponse.json({
    success: true,
    data: products,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  });
}

export async function POST(req: NextRequest) {
  try {
    const session = await getAdminSession();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const validated = productSchema.parse(body);

    let slug = validated.slug;
    if (!slug) {
      slug = validated.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
    }

    const newProduct = await createProduct({
      ...validated,
      slug,
    });

    return NextResponse.json({ success: true, data: newProduct }, { status: 201 });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Failed to create product' }, { status: 400 });
  }
}
