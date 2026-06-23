import { NextRequest, NextResponse } from 'next/server';
import { getAdminSession } from '@/backend/services/auth';
import { getFirebaseAdmin } from '@/backend/config/firebase-admin';
import { FieldValue } from 'firebase-admin/firestore';

export const dynamic = 'force-dynamic';

/** GET — list unresolved reports */
export async function GET(req: NextRequest) {
  const session = await getAdminSession();
  if (!session) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

  const db = getFirebaseAdmin();
  const snap = await db.collection('reports')
    .where('resolved', '==', false)
    .orderBy('reportedAt', 'desc')
    .limit(50)
    .get();

  const reports = snap.docs.map((d) => ({
    id: d.id,
    ...d.data(),
    reportedAt: d.data().reportedAt?.toDate?.().toISOString() ?? d.data().reportedAt,
  }));

  return NextResponse.json({ reports });
}

/** POST — resolve a report */
export async function POST(req: NextRequest) {
  const session = await getAdminSession();
  if (!session) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

  const adminGitHub = (session.user as any).login as string;
  const { reportId } = await req.json();
  if (!reportId) return NextResponse.json({ error: 'Missing reportId' }, { status: 400 });

  const db = getFirebaseAdmin();
  await db.collection('reports').doc(reportId).update({
    resolved: true,
    resolvedBy: adminGitHub,
    resolvedAt: FieldValue.serverTimestamp(),
  });

  await db.collection('auditLogs').add({
    action: 'RESOLVE_REPORT',
    actorGitHub: adminGitHub,
    targetFile: reportId,
    timestamp: FieldValue.serverTimestamp(),
  });

  return NextResponse.json({ ok: true });
}
