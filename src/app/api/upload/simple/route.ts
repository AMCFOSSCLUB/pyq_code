import { NextRequest, NextResponse } from 'next/server';
import { getAuthenticatedSession } from '@/backend/services/auth';
import { getFirebaseAdmin } from '@/backend/config/firebase-admin';
import { uploadFile } from '@/backend/services/github';
import { FieldValue } from 'firebase-admin/firestore';

export const dynamic = 'force-dynamic';

const SUBJECT_RE = /^[0-9]{2}[A-Z]{2,4}[0-9]{3}$/;
const MAX_SIZE_KB = 2 * 1024; // 2 MB

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

  const { subjectCode, filename, content } = await req.json();
  const code = (subjectCode as string)?.toUpperCase().trim();

  if (!SUBJECT_RE.test(code)) {
    return NextResponse.json({ error: 'Invalid subject code format. Expected: 22CSE301, 19MA201' }, { status: 400 });
  }
  if (!filename || !filename.endsWith('.pdf')) {
    return NextResponse.json({ error: 'Invalid filename' }, { status: 400 });
  }
  if (filename.length > 60) {
    return NextResponse.json({ error: 'Filename too long' }, { status: 400 });
  }
  if (typeof content !== 'string' || !content) {
    return NextResponse.json({ error: 'Missing file content' }, { status: 400 });
  }

  // File size check
  const fileSizeKB = Math.round((content.length * 3) / 4 / 1024);
  if (fileSizeKB > MAX_SIZE_KB) {
    return NextResponse.json({ error: 'File exceeds 2MB limit.' }, { status: 400 });
  }

  // Magic byte check
  const buf = Buffer.from(content.substring(0, 8), 'base64');
  if (!isPdf(buf)) {
    return NextResponse.json({ error: 'File is not a valid PDF.' }, { status: 400 });
  }

  const db = getFirebaseAdmin();
  const uploaderGitHub = (session.user as any).login as string;
  const uploaderProfileUrl = `https://github.com/${uploaderGitHub}`;

  // Duplicate check
  const dup = await db.collection('uploads')
    .where('subjectCode', '==', code)
    .where('filename', '==', filename)
    .where('status', '==', 'active')
    .limit(1).get();

  if (!dup.empty) {
    return NextResponse.json({ error: 'This paper already exists.' }, { status: 409 });
  }

  try {
    // Commit to GitHub
    const commitSha = await uploadFile(code, filename, content, uploaderGitHub);

    // Write Firestore upload doc
    const uploadRef = await db.collection('uploads').add({
      subjectCode: code,
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
      targetFile: `${code}/${filename}`,
      timestamp: FieldValue.serverTimestamp(),
    });

    return NextResponse.json({ uploadId: uploadRef.id, subjectCode: code, filename });
  } catch (err: any) {
    console.error('[simple-upload]', err);
    return NextResponse.json({ error: err.message || 'Upload failed' }, { status: 500 });
  }
}
