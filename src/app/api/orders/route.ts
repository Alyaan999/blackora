import { NextResponse } from 'next/server';
import { getOrders, getOrdersByUserId, createOrder, trackOrders } from '@/lib/db';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    const query = searchParams.get('query') || searchParams.get('track');

    if (query) {
      const orders = await trackOrders(query);
      return NextResponse.json({ orders });
    }

    if (userId) {
      const orders = await getOrdersByUserId(userId);
      return NextResponse.json({ orders });
    }

    const orders = await getOrders();
    return NextResponse.json({ orders });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Error' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      userId,
      customerName,
      customerEmail,
      customerPhone,
      city,
      address,
      postalCode,
      notes,
      items,
      paymentMethod,
      transactionId,
      referralCode,
    } = body;

    if (!customerName || !customerPhone || !city || !address) {
      return NextResponse.json(
        { error: 'Name, phone, city, and address are required' },
        { status: 400 }
      );
    }

    if (!items || items.length === 0) {
      return NextResponse.json(
        { error: 'Cart is empty' },
        { status: 400 }
      );
    }

    if ((paymentMethod === 'easypaisa' || paymentMethod === 'jazzcash') && !transactionId) {
      return NextResponse.json(
        { error: 'Transaction ID is required for online payment' },
        { status: 400 }
      );
    }

    const order = await createOrder({
      userId,
      customerName,
      customerEmail: customerEmail || 'guest@blackora.com',
      customerPhone,
      city,
      address,
      postalCode,
      notes,
      items,
      paymentMethod: paymentMethod || 'cod',
      transactionId,
      referralCode,
    });

    return NextResponse.json({ order }, { status: 201 });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Error creating order' }, { status: 500 });
  }
}
