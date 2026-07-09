import { NextRequest, NextResponse } from 'next/server';
import { getAdminSession } from '@/backend/services/auth';
import { getFirebaseAdmin } from '@/backend/config/firebase-admin';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  const session = await getAdminSession();
  if (!session) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

  const db = getFirebaseAdmin();
  const page = Number(req.nextUrl.searchParams.get('page') || '0');
  const status = req.nextUrl.searchParams.get('status') || '';
  const limit = 30;

  let query = db.collection('uploads').orderBy('uploadedAt', 'desc');
  if (status) query = (query as any).where('status', '==', status);

  const snap = await query.limit(limit).offset(page * limit).get();

  const logs = snap.docs.map((d) => ({
    id: d.id,
    ...d.data(),
    uploadedAt: d.data().uploadedAt?.toDate?.().toISOString() ?? d.data().uploadedAt,
  }));

  return NextResponse.json({ logs, page, count: snap.size });
}
