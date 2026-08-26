import { NextResponse } from 'next/server';
import {
  getSupportMessages,
  getSupportMessageById,
  getSupportMessagesByUserId,
  getSupportMessagesByEmail,
  createSupportMessage,
} from '@/lib/db';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    const userId = searchParams.get('userId');
    const email = searchParams.get('email');

    if (id) {
      const msg = await getSupportMessageById(id);
      if (!msg) {
        return NextResponse.json({ error: 'Inquiry ticket not found' }, { status: 404 });
      }
      return NextResponse.json({ message: msg });
    }

    if (userId) {
      const messages = await getSupportMessagesByUserId(userId);
      return NextResponse.json({ messages });
    }

    if (email) {
      const messages = await getSupportMessagesByEmail(email);
      return NextResponse.json({ messages });
    }

    // Default: fetch all for admin
    const messages = await getSupportMessages();
    return NextResponse.json({ messages });
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message || 'Failed to fetch support messages' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, email, phone, subject, message, userId } = body;

    if (!name || !email || !subject || !message) {
      return NextResponse.json(
        { error: 'Name, email, subject, and message are required.' },
        { status: 400 }
      );
    }

    // Simple email format check
    if (!email.includes('@') || !email.includes('.')) {
      return NextResponse.json(
        { error: 'Please enter a valid email address.' },
        { status: 400 }
      );
    }

    const ticket = await createSupportMessage({
      name,
      email,
      phone,
      subject,
      message,
      userId,
    });

    return NextResponse.json(
      {
        success: true,
        message: 'Your inquiry has been received. Our concierge team will get back to you shortly.',
        ticket,
      },
      { status: 201 }
    );
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message || 'Failed to submit support inquiry' },
      { status: 500 }
    );
  }
}
