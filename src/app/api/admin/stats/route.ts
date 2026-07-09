import { NextResponse } from 'next/server';
import { getAdminSession } from '@/backend/services/auth';
import { getFirebaseAdmin } from '@/backend/config/firebase-admin';

export const dynamic = 'force-dynamic';

export async function GET() {
  const session = await getAdminSession();
  if (!session) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

  const db = getFirebaseAdmin();

  const [uploadsSnap, reportsSnap, auditSnap] = await Promise.all([
    db.collection('uploads').get(),
    db.collection('reports').where('resolved', '==', false).get(),
    db.collection('auditLogs')
      .where('action', '==', 'UPLOAD')
      .orderBy('timestamp', 'desc')
      .limit(100).get(),
  ]);

  let totalDownloads = 0;
  let activeCount = 0;
  let flaggedCount = 0;
  const subjectCounts: Record<string, number> = {};
  const uploaderCounts: Record<string, number> = {};

  uploadsSnap.docs.forEach((d) => {
    const data = d.data();
    totalDownloads += data.downloadCount || 0;
    if (data.status === 'active') activeCount++;
    if (data.status === 'flagged') flaggedCount++;
    subjectCounts[data.subjectCode] = (subjectCounts[data.subjectCode] || 0) + 1;
    uploaderCounts[data.uploaderGitHub] = (uploaderCounts[data.uploaderGitHub] || 0) + 1;
  });

  const topSubjects = Object.entries(subjectCounts)
    .sort((a, b) => b[1] - a[1]).slice(0, 10)
    .map(([code, count]) => ({ code, count }));

  const topUploaders = Object.entries(uploaderCounts)
    .sort((a, b) => b[1] - a[1]).slice(0, 10)
    .map(([username, count]) => ({ username, count }));

  // Uploads per day (last 14 days)
  const now = Date.now();
  const uploadsPerDay: Record<string, number> = {};
  auditSnap.docs.forEach((d) => {
    const ts = d.data().timestamp?.toDate?.();
    if (ts) {
      const daysAgo = Math.floor((now - ts.getTime()) / 86400000);
      if (daysAgo < 14) {
        const label = ts.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' });
        uploadsPerDay[label] = (uploadsPerDay[label] || 0) + 1;
      }
    }
  });

  return NextResponse.json({
    totalPapers: uploadsSnap.size,
    activePapers: activeCount,
    flaggedPapers: flaggedCount,
    totalDownloads,
    pendingReports: reportsSnap.size,
    topSubjects,
    topUploaders,
    uploadsPerDay,
  });
}
