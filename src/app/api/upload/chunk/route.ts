import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

/**
 * Chunked upload has been removed. All PDFs are ≤ 2 MB and use the
 * /api/upload/simple endpoint directly.
 */
export async function POST() {
  return NextResponse.json(
    { error: 'Chunked upload is no longer supported. Use /api/upload/simple.' },
    { status: 410 }
  );
}
