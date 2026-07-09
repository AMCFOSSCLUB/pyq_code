import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

/**
 * Chunked upload has been removed. All PDFs are ≤ 2 MB and use the
 * /api/upload/simple endpoint directly.  This route is kept as a no-op
 * stub so that any stale client code receives a clear error instead of
 * a 404 that might be confused with a network failure.
 */
export async function POST() {
  return NextResponse.json(
    { error: 'Chunked upload is no longer supported. Use /api/upload/simple.' },
    { status: 410 }
  );
}
