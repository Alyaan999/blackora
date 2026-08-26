import { NextResponse } from 'next/server';
import { getWithdrawals, getWithdrawalsByUserId, requestWithdrawal } from '@/lib/db';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    if (userId) {
      const withdrawals = await getWithdrawalsByUserId(userId);
      return NextResponse.json({ withdrawals });
    }

    const withdrawals = await getWithdrawals();
    return NextResponse.json({ withdrawals });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Error' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { userId, amount, paymentMethod, accountTitle, accountNumber, bankName } = body;

    if (!userId || !amount || !paymentMethod || !accountTitle || !accountNumber) {
      return NextResponse.json(
        { error: 'All withdrawal details are required' },
        { status: 400 }
      );
    }

    const req = await requestWithdrawal({
      userId,
      amount: Number(amount),
      paymentMethod,
      accountTitle,
      accountNumber,
      bankName,
    });

    return NextResponse.json({ withdrawal: req }, { status: 201 });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Error requesting withdrawal' }, { status: 400 });
  }
}
