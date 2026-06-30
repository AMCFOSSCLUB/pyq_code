import { NextRequest, NextResponse } from 'next/server';
import { getAuthenticatedSession } from '@/backend/services/auth';
import { getFirebaseAdmin } from '@/backend/config/firebase-admin';
import { FieldValue } from 'firebase-admin/firestore';

export const dynamic = 'force-dynamic';

const SUBJECT_RE = /^[0-9]{2}[A-Z]{2,4}[0-9]{3}$/;

export async function POST(req: NextRequest) {
  const session = await getAuthenticatedSession();
  if (!session?.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { subjectCode, courseTitle, month, filename } = await req.json();
  const code = (subjectCode as string)?.toUpperCase().trim();
  const title = (courseTitle as string)?.trim() || 'Unknown';
  const m = (month as string)?.trim() || 'Unknown';

  if (!SUBJECT_RE.test(code)) {
    return NextResponse.json({ error: 'Invalid subject code format' }, { status: 400 });
  }
  if (!filename || !filename.endsWith('.pdf')) {
    return NextResponse.json({ error: 'Invalid filename' }, { status: 400 });
  }
  if (filename.length > 60) {
    return NextResponse.json({ error: 'Filename too long' }, { status: 400 });
  }

  const db = getFirebaseAdmin();
  const uploaderGitHub = (session.user as any).login as string;

  // Duplicate check
  const dup = await db.collection('uploads')
    .where('subjectCode', '==', code)
    .where('filename', '==', filename)
    .where('status', '==', 'active')
    .limit(1).get();

  if (!dup.empty) {
    return NextResponse.json({ error: 'This paper already exists. View it in the repository.' }, { status: 409 });
  }

  // Create pending upload + chunks subcollection placeholder
  const ref = await db.collection('pendingUploads').add({
    subjectCode: code,
    subjectTitle: title,
    month: m,
    filename,
    uploaderGitHub,
    uploaderProfileUrl: `https://github.com/${uploaderGitHub}`,
    createdAt: FieldValue.serverTimestamp(),
    expiresAt: new Date(Date.now() + 60 * 60 * 1000), // 1 hour TTL
  });

  return NextResponse.json({ uploadId: ref.id });
}
