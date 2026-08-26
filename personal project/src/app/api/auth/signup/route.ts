import { NextResponse } from 'next/server';
import { createUser } from '@/lib/db';

export async function POST(request: Request) {
  try {
    const { name, email, password, phone } = await request.json();
    if (!name || !email || !password) {
      return NextResponse.json({ error: 'Name, email, and password are required' }, { status: 400 });
    }

    if (password.length < 6) {
      return NextResponse.json({ error: 'Password must be at least 6 characters long' }, { status: 400 });
    }

    const newUser = await createUser({
      name,
      email,
      passwordHash: password,
      phone: phone || '',
    });

    const { passwordHash, ...safeUser } = newUser;
    return NextResponse.json({ user: safeUser }, { status: 201 });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Internal server error' }, { status: 400 });
  }
}
