import { NextRequest, NextResponse } from 'next/server';
import { getAuthenticatedSession } from '@/backend/services/auth';
import { getFirebaseAdmin } from '@/backend/config/firebase-admin';
import { FieldValue } from 'firebase-admin/firestore';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  const session = await getAuthenticatedSession();
  if (!session?.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const uploadId = req.nextUrl.searchParams.get('id');
  const chunkIndex = req.nextUrl.searchParams.get('chunk');
  if (!uploadId || chunkIndex === null) {
    return NextResponse.json({ error: 'Missing id or chunk param' }, { status: 400 });
  }

  const { data } = await req.json();
  if (typeof data !== 'string') {
    return NextResponse.json({ error: 'Invalid chunk data' }, { status: 400 });
  }

  const db = getFirebaseAdmin();
  const pendingRef = db.collection('pendingUploads').doc(uploadId);
  const pending = await pendingRef.get();
  if (!pending.exists) return NextResponse.json({ error: 'Upload session not found' }, { status: 404 });

  // Store chunk
  await pendingRef.collection('chunks').doc(`chunk_${chunkIndex}`).set({
    index: Number(chunkIndex),
    data,
    savedAt: FieldValue.serverTimestamp(),
  });

  return NextResponse.json({ ok: true });
}
