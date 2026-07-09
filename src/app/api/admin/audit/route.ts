import { NextRequest, NextResponse } from 'next/server';
import { getAdminSession } from '@/backend/services/auth';
import { getFirebaseAdmin } from '@/backend/config/firebase-admin';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  const session = await getAdminSession();
  if (!session) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

  const db = getFirebaseAdmin();
  const page = Number(req.nextUrl.searchParams.get('page') || '0');
  const limit = 30;

  const snap = await db.collection('auditLogs')
    .orderBy('timestamp', 'desc')
    .limit(limit)
    .offset(page * limit)
    .get();

  const entries = snap.docs.map((d) => ({
    id: d.id,
    ...d.data(),
    timestamp: d.data().timestamp?.toDate?.().toISOString() ?? d.data().timestamp,
  }));

  return NextResponse.json({ entries, page, count: snap.size });
}
