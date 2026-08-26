import { NextResponse } from 'next/server';
import { getUserByReferralCode } from '@/lib/db';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const code = searchParams.get('code');

    if (!code) {
      return NextResponse.json({ valid: false, error: 'Code is required' }, { status: 400 });
    }

    const user = await getUserByReferralCode(code);
    if (!user) {
      return NextResponse.json({ valid: false, error: 'Invalid or expired referral code' });
    }

    return NextResponse.json({
      valid: true,
      referralCode: user.referralCode,
      referrerName: user.name,
    });
  } catch (err: any) {
    return NextResponse.json({ valid: false, error: 'Error validating code' }, { status: 500 });
  }
}
