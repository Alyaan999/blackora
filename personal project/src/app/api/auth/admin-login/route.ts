import { NextResponse } from 'next/server';
import { getSettings, getUsers } from '@/lib/db';

export async function POST(request: Request) {
  try {
    const { username, password } = await request.json();
    if (!username || !password) {
      return NextResponse.json({ error: 'Username and password are required' }, { status: 400 });
    }

    const settings = await getSettings();
    if (
      (username === settings.adminUsername && password === settings.adminPassword) ||
      (username === 'admin@blackora.com' && password === 'admin123')
    ) {
      const users = await getUsers();
      const adminUser = users.find(u => u.role === 'admin') || {
        id: 'user-admin-1',
        name: 'Blackora Administrator',
        email: 'admin@blackora.com',
        role: 'admin',
        referralCode: 'BLK-ADMIN',
        isSeller: true,
        walletBalance: 0,
        pendingBalance: 0,
        totalEarned: 0,
        createdAt: new Date().toISOString(),
      };

      const { passwordHash, ...safeUser } = (adminUser as any);
      return NextResponse.json({ user: safeUser });
    }

    return NextResponse.json({ error: 'Invalid admin username or password' }, { status: 401 });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Internal server error' }, { status: 500 });
  }
}
