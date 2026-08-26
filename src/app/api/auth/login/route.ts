import { NextResponse } from 'next/server';
import { getUserByEmail, getUsers } from '@/lib/db';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const email = (body.email || '').trim().toLowerCase();
    const password = (body.password || '').trim();

    if (!email || !password) {
      return NextResponse.json({ error: 'Email and password are required' }, { status: 400 });
    }

    // Direct Admin Login Support
    if ((email === 'admin' || email === 'admin@blackora.com') && password === 'admin123') {
      let adminUser = null;
      try {
        const users = await getUsers();
        adminUser = users.find(u => u.role === 'admin' || u.email.toLowerCase() === 'admin@blackora.com');
      } catch (_e) {}

      if (!adminUser) {
        adminUser = {
          id: 'user-admin-1',
          name: 'Blackora Administrator',
          email: 'admin@blackora.com',
          role: 'admin',
          referralCode: 'BLK-ADMIN01',
          isSeller: true,
          walletBalance: 0,
          pendingBalance: 0,
          totalEarned: 0,
          createdAt: new Date().toISOString(),
        };
      }

      const { passwordHash: _h, ...safeUser } = (adminUser as any);
      return NextResponse.json({ user: { ...safeUser, role: 'admin' } });
    }

    const user = await getUserByEmail(email);
    if (!user) {
      return NextResponse.json({ error: 'Invalid email or password' }, { status: 401 });
    }

    if (user.passwordHash !== password) {
      return NextResponse.json({ error: 'Invalid email or password' }, { status: 401 });
    }

    const { passwordHash, ...safeUser } = user;
    return NextResponse.json({ user: safeUser });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Internal server error' }, { status: 500 });
  }
}
