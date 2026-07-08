import { NextRequest, NextResponse } from 'next/server';
import { getAdminSession } from '@/backend/services/auth';
import { getFirebaseAdmin } from '@/backend/config/firebase-admin';
import { deleteFile } from '@/backend/services/github';
import { FieldValue } from 'firebase-admin/firestore';

export const dynamic = 'force-dynamic';

/** GET — list unresolved reports */
export async function GET(req: NextRequest) {
  try {
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
      lastReportedAt: d.data().lastReportedAt?.toDate?.().toISOString() ?? d.data().lastReportedAt,
    }));

    return NextResponse.json({ reports });
  } catch (error) {
    console.error('[admin-reports-get]', error);
    return NextResponse.json({ reports: [] }, { status: 200 });
  }
}

/** POST — resolve or remove a report */
export async function POST(req: NextRequest) {
  try {
    const session = await getAdminSession();
    if (!session) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

    const adminGitHub = (session.user as any).login as string;
    let payload: { reportId?: string; action?: string } = {};
    try {
      payload = await req.json();
    } catch {
      payload = {};
    }

    const { reportId, action } = payload;
    if (!reportId) return NextResponse.json({ error: 'Missing reportId' }, { status: 400 });

    const db = getFirebaseAdmin();

    if (action === 'remove') {
      const reportDoc = await db.collection('reports').doc(reportId).get();
      if (!reportDoc.exists) return NextResponse.json({ error: 'Report not found' }, { status: 404 });

      const reportData = reportDoc.data()!;
      const uploadId = reportData.paperId as string | undefined;

      let uploadSnap = uploadId ? await db.collection('uploads').doc(uploadId).get() : null;
      if (!uploadSnap?.exists) {
        const uploadMatches = await db.collection('uploads')
          .where('subjectCode', '==', reportData.subjectCode)
          .where('filename', '==', reportData.filename)
          .where('status', '==', 'active')
          .limit(1)
          .get();
        uploadSnap = uploadMatches.empty ? null : uploadMatches.docs[0];
      }

      if (uploadSnap?.exists) {
        const uploadData = uploadSnap.data()!;
        await deleteFile(uploadData.subjectCode, uploadData.subjectTitle, uploadData.month, uploadData.filename);
        await uploadSnap.ref.delete();
      }

      const matchingReports = uploadId
        ? await db.collection('reports').where('paperId', '==', uploadId).get()
        : await db.collection('reports')
            .where('subjectCode', '==', reportData.subjectCode)
            .where('filename', '==', reportData.filename)
            .get();

      const batch = db.batch();
      matchingReports.docs.forEach((doc) => batch.delete(doc.ref));
      if (!matchingReports.empty) await batch.commit();

      await db.collection('auditLogs').add({
        action: 'REMOVE_PAPER',
        actorGitHub: adminGitHub,
        targetFile: `${reportData.subjectCode}/${reportData.filename}`,
        timestamp: FieldValue.serverTimestamp(),
      });

      return NextResponse.json({ ok: true });
    }

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
  } catch (error) {
    console.error('[admin-reports-post]', error);
    return NextResponse.json({ error: 'Failed to process report action' }, { status: 500 });
  }
}
