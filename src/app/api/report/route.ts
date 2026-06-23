import { NextRequest, NextResponse } from 'next/server';
import { getAuthenticatedSession } from '@/backend/services/auth';
import { getFirebaseAdmin } from '@/backend/config/firebase-admin';
import { FieldValue } from 'firebase-admin/firestore';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  const session = await getAuthenticatedSession();
  if (!session?.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const uploaderGitHub = (session.user as any).login as string;
  const { subjectCode, filename, reason, description } = await req.json();

  if (!subjectCode || !filename || !reason) {
    return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
  }

  const db = getFirebaseAdmin();

  // Find the upload doc
  const snap = await db.collection('uploads')
    .where('subjectCode', '==', subjectCode)
    .where('filename', '==', filename)
    .where('status', '==', 'active')
    .limit(1).get();

  if (snap.empty) return NextResponse.json({ error: 'Paper not found' }, { status: 404 });

  const uploadDoc = snap.docs[0];
  const newCount = (uploadDoc.data().reportCount || 0) + 1;

  // Write report
  await db.collection('reports').add({
    reportedBy: uploaderGitHub,
    subjectCode,
    filename,
    reason,
    description: description || '',
    reportedAt: FieldValue.serverTimestamp(),
    resolved: false,
  });

  // Increment report count; auto-flag if >= 3
  const updateData: Record<string, any> = { reportCount: FieldValue.increment(1) };
  if (newCount >= 3) updateData.status = 'flagged';
  await uploadDoc.ref.update(updateData);

  return NextResponse.json({ ok: true });
}
