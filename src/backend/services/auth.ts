import { NextAuthOptions, getServerSession } from 'next-auth';
import GitHubProvider from 'next-auth/providers/github';

export const authOptions: NextAuthOptions = {
  providers: [
    GitHubProvider({
      clientId: process.env.GITHUB_CLIENT_ID!,
      clientSecret: process.env.GITHUB_CLIENT_SECRET!,
    }),
  ],
  callbacks: {
    async session({ session, token }) {
      if (session.user && token.login) {
        (session.user as any).login = token.login as string;
      }
      return session;
    },
    async jwt({ token, profile }) {
      if (profile) {
        token.login = (profile as any).login;
      }
      return token;
    },
  },
  pages: {
    signIn: '/',
  },
};

/** Returns the session only if the user is an admin, else null. */
export async function getAdminSession() {
  const session = await getServerSession(authOptions);
  if (!session?.user) return null;
  const adminUsers = (process.env.ADMIN_GITHUB_USERS || '')
    .split(',')
    .map((u) => u.trim())
    .filter(Boolean);
  const userLogin = (session.user as any).login as string;
  if (!adminUsers.includes(userLogin)) return null;
  return session;
}

export async function getAuthenticatedSession() {
  return getServerSession(authOptions);
}
