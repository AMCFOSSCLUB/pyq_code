import { NextRequest, NextResponse } from 'next/server';
import { getFirebaseAdmin } from '@/backend/config/firebase-admin';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  const code = req.nextUrl.searchParams.get('code');
  if (!code) return NextResponse.json({ error: 'code param required' }, { status: 400 });

  const subjectCode = code.toUpperCase().trim();

  try {
    const db = getFirebaseAdmin();
    const snap = await db
      .collection('uploads')
      .where('subjectCode', '==', subjectCode)
      .where('status', '==', 'active')
      .orderBy('uploadedAt', 'desc')
      .get();

    const papers = snap.docs.map((d) => ({
      id: d.id,
      ...d.data(),
      uploadedAt: d.data().uploadedAt?.toDate?.().toISOString() ?? d.data().uploadedAt,
    }));

    return NextResponse.json({ papers });
  } catch (err: any) {
    console.error('[search]', err);
    return NextResponse.json({ error: 'Failed to fetch papers' }, { status: 500 });
  }
}
