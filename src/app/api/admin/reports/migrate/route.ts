import { NextRequest, NextResponse } from 'next/server';
import { getAdminSession } from '@/backend/services/auth';
import { getFirebaseAdmin } from '@/backend/config/firebase-admin';

export const dynamic = 'force-dynamic';

/**
 * Admin-only endpoint to migrate existing reports to have paperId field.
 * This ensures existing reports can be found by the new query logic.
 */
export async function POST(req: NextRequest) {
  const session = await getAdminSession();
  if (!session) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

  try {
    const db = getFirebaseAdmin();

    const reportsSnap = await db.collection('reports').get();
    let migrated = 0;

    for (const reportDoc of reportsSnap.docs) {
      const reportData = reportDoc.data();
      
      // Skip if already has paperId
      if (reportData.paperId) {
        continue;
      }

      // Find the corresponding upload document
      const uploadSnap = await db.collection('uploads')
        .where('subjectCode', '==', reportData.subjectCode)
        .where('filename', '==', reportData.filename)
        .where('status', '==', 'active')
        .limit(1)
        .get();

      if (!uploadSnap.empty) {
        const uploadDoc = uploadSnap.docs[0];
        await reportDoc.ref.update({
          paperId: uploadDoc.id,
        });
        migrated++;
        console.log(`[migrate] Added paperId to report for ${reportData.subjectCode}/${reportData.filename}`);
      }
    }

    return NextResponse.json({ ok: true, migrated });
  } catch (error: any) {
    console.error('[migrate] Error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
