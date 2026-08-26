import { NextResponse } from 'next/server';
import { getProducts, getPublicProducts, createProduct } from '@/lib/db';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const isAdmin = searchParams.get('admin') === 'true';
    const category = searchParams.get('category');
    const featured = searchParams.get('featured') === 'true';

    let products = isAdmin ? await getProducts() : await getPublicProducts();

    if (category && category !== 'all') {
      products = products.filter(p => p.category === category);
    }
    if (featured) {
      products = products.filter(p => p.featured);
    }

    return NextResponse.json({ products });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Error' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    if (!body.name || !body.price || !body.category) {
      return NextResponse.json({ error: 'Name, price and category are required' }, { status: 400 });
    }

    const slug = body.slug || body.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

    const newProduct = await createProduct({
      name: body.name,
      slug,
      tagline: body.tagline || '',
      description: body.description || '',
      category: body.category,
      price: Number(body.price),
      originalPrice: body.originalPrice ? Number(body.originalPrice) : undefined,
      stock: Number(body.stock || 10),
      commissionAmount: Number(body.commissionAmount || 200),
      images: body.images && body.images.length > 0 ? body.images : [
        'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?q=80&w=1000&auto=format&fit=crop'
      ],
      specs: body.specs || {
        caseDiameter: '42 mm',
        caseThickness: '11 mm',
        dialColor: 'Black',
        movement: 'Japanese Quartz',
        strapMaterial: 'Stainless Steel',
        waterResistance: '3 ATM',
        glassType: 'Mineral Crystal',
      },
      featured: Boolean(body.featured),
      bestSeller: Boolean(body.bestSeller),
      isNewArrival: Boolean(body.isNewArrival),
      rating: 5.0,
      reviewCount: 1,
    });

    return NextResponse.json({ product: newProduct }, { status: 201 });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Error' }, { status: 500 });
  }
}
