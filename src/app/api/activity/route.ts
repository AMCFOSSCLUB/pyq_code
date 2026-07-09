import { NextRequest, NextResponse } from 'next/server';
import { getFirebaseAdmin } from '@/backend/config/firebase-admin';

export const dynamic = 'force-dynamic';

export async function GET(_req: NextRequest) {
  try {
    const db = getFirebaseAdmin();
    const snap = await db.collection('uploads')
      .where('status', '==', 'active')
      .orderBy('uploadedAt', 'desc')
      .limit(20)
      .get();

    const items = snap.docs.map((d) => ({
      id: d.id,
      subjectCode: d.data().subjectCode,
      subjectTitle: d.data().subjectTitle,
      filename: d.data().filename,
      uploaderGitHub: d.data().uploaderGitHub,
      uploaderProfileUrl: d.data().uploaderProfileUrl,
      uploadedAt: d.data().uploadedAt?.toDate?.().toISOString() ?? d.data().uploadedAt,
    }));

    return NextResponse.json({ items });
  } catch (err) {
    console.error('[activity]', err);
    return NextResponse.json({ error: 'Failed to load activity' }, { status: 500 });
  }
}
