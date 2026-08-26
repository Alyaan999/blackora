import { NextResponse } from 'next/server';
import { getSettings, updateSettings } from '@/lib/db';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const isAdmin = searchParams.get('admin') === 'true';

    const settings = await getSettings();
    if (!isAdmin) {
      const { adminUsername, adminPassword, ...safeSettings } = settings;
      return NextResponse.json({ settings: safeSettings });
    }
    return NextResponse.json({ settings });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Error' }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const updated = await updateSettings(body);
    return NextResponse.json({ settings: updated });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Error updating settings' }, { status: 500 });
  }
}
