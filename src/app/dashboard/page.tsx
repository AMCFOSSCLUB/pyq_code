import { getServerSession } from 'next-auth';
import { authOptions } from '@/backend/services/auth';
import { getFirebaseAdmin } from '@/backend/config/firebase-admin';
import { redirect } from 'next/navigation';
import { PaperCard, Paper } from '@/frontend/components/PaperCard';
import { StatusBadge } from '@/frontend/components/ui/Badge';
import { LayoutDashboard, Upload, Download, FileText, AlertCircle } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import type { Metadata } from 'next';

export const metadata: Metadata = { title: 'My Dashboard' };

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);
  if (!session?.user) redirect('/');

  const github = (session.user as any).login as string;
  const db = getFirebaseAdmin();

  const snap = await db.collection('uploads')
    .where('uploaderGitHub', '==', github)
    .orderBy('uploadedAt', 'desc')
    .get();

  const papers = snap.docs.map((d) => ({
    id: d.id,
    ...d.data(),
    uploadedAt: d.data().uploadedAt?.toDate?.().toISOString() ?? d.data().uploadedAt,
  })) as Paper[];

  const totalDownloads = papers.reduce((s, p) => s + (p.downloadCount || 0), 0);
  const activeCount = papers.filter((p) => p.status === 'active').length;
  const flaggedCount = papers.filter((p) => p.status === 'flagged').length;

  return (
    <div className="page-top section">
      <div className="container">
        {/* Profile header */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 20, marginBottom: 40 }}>
          <Image
            src={session.user?.image || ''}
            alt={session.user?.name || ''}
            width={64} height={64}
            style={{ borderRadius: '50%', border: '2px solid var(--violet)' }}
          />
          <div>
            <h1 style={{ fontSize: '1.8rem', marginBottom: 4 }}>{session.user?.name}</h1>
            <a href={`https://github.com/${github}`} target="_blank" rel="noreferrer"
              style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>@{github}</a>
          </div>
          <Link href="/upload" className="btn btn-primary" style={{ marginLeft: 'auto' }}>
            <Upload size={14} /> Upload Paper
          </Link>
        </div>

        {/* Stats */}
        <div className="grid-4" style={{ marginBottom: 40 }}>
          {[
            { icon: FileText, label: 'Papers Uploaded', value: papers.length, color: 'var(--violet-light)' },
            { icon: Download, label: 'Total Downloads', value: totalDownloads, color: 'var(--cyan-light)' },
            { icon: Upload, label: 'Active Papers', value: activeCount, color: '#6ee7b7' },
            { icon: AlertCircle, label: 'Flagged', value: flaggedCount, color: '#fca5a5' },
          ].map(({ icon: Icon, label, value, color }) => (
            <div key={label} className="stat-card" style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              <Icon size={20} style={{ color }} />
              <div>
                <p style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--text-primary)', lineHeight: 1 }}>{value.toLocaleString()}</p>
                <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginTop: 4 }}>{label}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Papers list */}
        <h2 style={{ fontSize: '1.2rem', marginBottom: 24 }}>Your Papers</h2>

        {papers.length === 0 ? (
          <div className="empty-state">
            <FileText size={44} />
            <h3>No papers uploaded yet</h3>
            <p>Start contributing to the community!</p>
            <Link href="/upload" className="btn btn-primary" style={{ marginTop: 20, display: 'inline-flex' }}>
              Upload Your First Paper
            </Link>
          </div>
        ) : (
          <div className="grid-3">
            {papers.map((paper) => (
              <PaperCard key={paper.id} paper={paper} showSubject />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
