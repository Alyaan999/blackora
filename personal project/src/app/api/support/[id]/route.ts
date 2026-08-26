import { NextResponse } from 'next/server';
import { replySupportMessage, deleteSupportMessage, getSupportMessageById } from '@/lib/db';
import { SupportMessageStatus } from '@/lib/types';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const msg = await getSupportMessageById(id);
    if (!msg) {
      return NextResponse.json({ error: 'Inquiry not found' }, { status: 404 });
    }
    return NextResponse.json({ message: msg });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Error fetching inquiry' }, { status: 500 });
  }
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { adminReply, status } = body;

    if (adminReply === undefined && !status) {
      return NextResponse.json(
        { error: 'Provide adminReply or status to update.' },
        { status: 400 }
      );
    }

    const updated = await replySupportMessage(
      id,
      adminReply || '',
      (status as SupportMessageStatus) || 'replied'
    );

    if (!updated) {
      return NextResponse.json({ error: 'Inquiry not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, message: updated });
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message || 'Failed to update support message' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const deleted = await deleteSupportMessage(id);
    if (!deleted) {
      return NextResponse.json({ error: 'Inquiry not found' }, { status: 404 });
    }
    return NextResponse.json({ success: true, message: 'Inquiry deleted successfully' });
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message || 'Failed to delete support message' },
      { status: 500 }
    );
  }
}
