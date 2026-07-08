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

  try {
    const snap = await db.collection('uploads')
      .where('subjectCode', '==', subjectCode)
      .where('filename', '==', filename)
      .where('status', '==', 'active')
      .limit(1)
      .get();

    if (snap.empty) return NextResponse.json({ error: 'Paper not found' }, { status: 404 });

    const uploadDoc = snap.docs[0];
    const uploadId = uploadDoc.id;

    console.log(`[report] Found paper: ${subjectCode}/${filename} (id: ${uploadId})`);

    const reportsSnap = await db.collection('reports')
      .where('subjectCode', '==', subjectCode)
      .where('filename', '==', filename)
      .get();

    console.log(`[report] Found ${reportsSnap.size} existing reports for this paper`);

    if (reportsSnap.size > 0) {
      const existingReport = reportsSnap.docs[0];
      const reportData = existingReport.data();
      
      console.log(`[report] Existing report: ${existingReport.id}, count=${reportData.reportCount}, users=${JSON.stringify(reportData.reportedByUsers || [])}`);

      const userList = reportData.reportedByUsers || [];
      if (userList.includes(uploaderGitHub)) {
        console.log(`[report] User already reported this paper`);
        return NextResponse.json({ 
          ok: true, 
          alreadyReported: true, 
          reportCount: Number(reportData.reportCount || 1)
        });
      }

      const currentCount = Number(reportData.reportCount || 1);
      const newCount = currentCount + 1;

      console.log(`[report] Incrementing count: ${currentCount} -> ${newCount}`);

      await existingReport.ref.update({
        paperId: uploadId,
        reportCount: newCount,
        reportedByUsers: FieldValue.arrayUnion(uploaderGitHub),
        reportedBy: uploaderGitHub,
        reason,
        description: description || '',
        lastReportedAt: FieldValue.serverTimestamp(),
        resolved: false,
      });

      await uploadDoc.ref.update({
        reportCount: newCount,
        reportUsers: FieldValue.arrayUnion(uploaderGitHub),
        reportUpdatedAt: FieldValue.serverTimestamp(),
      });

      await db.collection('auditLogs').add({
        action: 'REPORT_PAPER',
        actorGitHub: uploaderGitHub,
        targetFile: `${subjectCode}/${filename}`,
        timestamp: FieldValue.serverTimestamp(),
      });

      console.log(`[report] Successfully updated report. New count: ${newCount}`);

      return NextResponse.json({ ok: true, alreadyReported: false, reportCount: newCount });
    }

    console.log(`[report] Creating first report for this paper`);

    const reportRef = await db.collection('reports').add({
      paperId: uploadId,
      reportedBy: uploaderGitHub,
      reportedByUsers: [uploaderGitHub],
      subjectCode,
      filename,
      reason,
      description: description || '',
      reportedAt: FieldValue.serverTimestamp(),
      lastReportedAt: FieldValue.serverTimestamp(),
      reportCount: 1,
      resolved: false,
    });

    await uploadDoc.ref.update({
      reportCount: 1,
      reportUsers: [uploaderGitHub],
      reportUpdatedAt: FieldValue.serverTimestamp(),
    });

    await db.collection('auditLogs').add({
      action: 'REPORT_PAPER',
      actorGitHub: uploaderGitHub,
      targetFile: `${subjectCode}/${filename}`,
      timestamp: FieldValue.serverTimestamp(),
    });

    console.log(`[report] Created new report: ${reportRef.id}`);

    return NextResponse.json({ ok: true, alreadyReported: false, reportCount: 1, reportId: reportRef.id });
  } catch (error: any) {
    console.error(`[report] Error:`, error);
    return NextResponse.json({ error: error.message || 'Failed to submit report' }, { status: 500 });
  }
}

