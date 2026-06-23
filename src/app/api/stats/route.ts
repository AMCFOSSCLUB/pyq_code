import { NextResponse } from 'next/server';
import { getFirebaseAdmin } from '@/backend/config/firebase-admin';

export const dynamic = 'force-dynamic';
export const revalidate = 300; // 5 min cache

export async function GET() {
  try {
    const db = getFirebaseAdmin();
    const snap = await db.collection('uploads').where('status', '==', 'active').get();

    let totalDownloads = 0;
    const subjects = new Set<string>();
    snap.docs.forEach((d) => {
      totalDownloads += d.data().downloadCount || 0;
      subjects.add(d.data().subjectCode);
    });

    return NextResponse.json({
      totalPapers: snap.size,
      totalDownloads,
      totalSubjects: subjects.size,
    });
  } catch (err) {
    console.error('[stats]', err);
    return NextResponse.json({ totalPapers: 0, totalDownloads: 0, totalSubjects: 0 });
  }
}
