import { NextResponse } from 'next/server';
import { updateWithdrawalStatus } from '@/lib/db';

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const { status, adminNote } = await request.json();

    const updated = await updateWithdrawalStatus(id, status, adminNote);
    if (!updated) {
      return NextResponse.json({ error: 'Withdrawal not found' }, { status: 404 });
    }
    return NextResponse.json({ withdrawal: updated });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Error updating withdrawal' }, { status: 500 });
  }
}
