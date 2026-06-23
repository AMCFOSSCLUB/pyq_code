import { NextRequest, NextResponse } from 'next/server';
import { getFirebaseAdmin } from '@/backend/config/firebase-admin';
import { getFileDownloadUrl } from '@/backend/services/github';
import { FieldValue } from 'firebase-admin/firestore';

export const dynamic = 'force-dynamic';

export async function GET(
  _req: NextRequest,
  { params }: { params: { id: string } }
) {
  const { id } = params;
  try {
    const db = getFirebaseAdmin();
    const docRef = db.collection('uploads').doc(id);
    const snap = await docRef.get();
    if (!snap.exists) return NextResponse.json({ error: 'Paper not found' }, { status: 404 });

    const data = snap.data()!;
    if (data.status !== 'active') {
      return NextResponse.json({ error: 'Paper is not available' }, { status: 410 });
    }

    // Increment download count (fire and forget)
    docRef.update({ downloadCount: FieldValue.increment(1) }).catch(() => {});

    // Write audit log
    db.collection('auditLogs').add({
      action: 'DOWNLOAD',
      actorGitHub: 'anonymous',
      targetFile: `${data.subjectCode}/${data.filename}`,
      timestamp: FieldValue.serverTimestamp(),
    }).catch(() => {});

    const url = getFileDownloadUrl(data.subjectCode, data.filename);
    return NextResponse.json({ url });
  } catch (err: any) {
    console.error('[download]', err);
    return NextResponse.json({ error: 'Failed to process download' }, { status: 500 });
  }
}
