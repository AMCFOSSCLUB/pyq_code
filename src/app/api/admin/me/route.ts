import { NextRequest, NextResponse } from 'next/server';
import { getAdminSession, isAuthorizedAdminUsername } from '@/backend/services/auth';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  const session = await getAdminSession();
  const userLogin = (session?.user as any)?.login as string | undefined;

  return NextResponse.json({
    isAuthorizedAdmin: isAuthorizedAdminUsername(userLogin),
    login: userLogin || null,
  });
}
