import { NextRequest, NextResponse } from 'next/server';
import { getAuthenticatedSession } from '@/backend/services/auth';
import { getFirebaseAdmin } from '@/backend/config/firebase-admin';
import { uploadFile } from '@/backend/services/github';
import { FieldValue } from 'firebase-admin/firestore';

export const dynamic = 'force-dynamic';

// Validate PDF magic bytes (%PDF)
function isPdf(buffer: Buffer): boolean {
  return buffer.length >= 4 &&
    buffer[0] === 0x25 && // %
    buffer[1] === 0x50 && // P
    buffer[2] === 0x44 && // D
    buffer[3] === 0x46;   // F
}

export async function POST(req: NextRequest) {
  const session = await getAuthenticatedSession();
  if (!session?.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const uploadId = req.nextUrl.searchParams.get('id');
  const { totalChunks } = await req.json();
  if (!uploadId || typeof totalChunks !== 'number') {
    return NextResponse.json({ error: 'Missing params' }, { status: 400 });
  }

  const db = getFirebaseAdmin();
  const pendingRef = db.collection('pendingUploads').doc(uploadId);
  const pending = await pendingRef.get();
  if (!pending.exists) return NextResponse.json({ error: 'Upload session not found' }, { status: 404 });

  const pendingData = pending.data()!;
  const { subjectCode, subjectTitle, month, filename, uploaderGitHub, uploaderProfileUrl } = pendingData;

  // Reassemble chunks in order
  const chunksSnap = await pendingRef.collection('chunks')
    .orderBy('index', 'asc').get();

  if (chunksSnap.size !== totalChunks) {
    return NextResponse.json({ error: `Expected ${totalChunks} chunks, got ${chunksSnap.size}` }, { status: 400 });
  }

  const parts: string[] = chunksSnap.docs.map((d) => d.data().data as string);
  const fullBase64 = parts.join('');

  // Magic byte check
  const buf = Buffer.from(fullBase64.substring(0, 8), 'base64');
  if (!isPdf(buf)) {
    await pendingRef.delete();
    return NextResponse.json({ error: 'File is not a valid PDF (magic byte check failed).' }, { status: 400 });
  }

  // File size check
  const fileSizeKB = Math.round((fullBase64.length * 3) / 4 / 1024);
  if (fileSizeKB > 15 * 1024) {
    await pendingRef.delete();
    return NextResponse.json({ error: 'Assembled file exceeds 15MB limit.' }, { status: 400 });
  }

  try {
    // Commit to GitHub
    const title = subjectTitle || 'Unknown';
    const m = month || 'Unknown';
    const commitSha = await uploadFile(subjectCode, title, m, filename, fullBase64, uploaderGitHub);

    // Write Firestore upload doc
    const uploadRef = await db.collection('uploads').add({
      subjectCode,
      subjectTitle: title,
      month: m,
      filename,
      uploaderGitHub,
      uploaderProfileUrl,
      uploadedAt: FieldValue.serverTimestamp(),
      fileSizeKB,
      githubCommitSha: commitSha,
      status: 'active',
      downloadCount: 0,
      reportCount: 0,
    });

    // Write audit log
    await db.collection('auditLogs').add({
      action: 'UPLOAD',
      actorGitHub: uploaderGitHub,
      targetFile: `${title}/${subjectCode}/${m}/${filename}`,
      timestamp: FieldValue.serverTimestamp(),
    });

    // Clean up pending
    const chunkDocs = chunksSnap.docs;
    const batch = db.batch();
    chunkDocs.forEach((d) => batch.delete(d.ref));
    batch.delete(pendingRef);
    await batch.commit();

    return NextResponse.json({ uploadId: uploadRef.id, subjectCode, filename });
  } catch (err: any) {
    console.error('[finalize]', err);
    return NextResponse.json({ error: err.message || 'GitHub commit failed' }, { status: 500 });
  }
}
