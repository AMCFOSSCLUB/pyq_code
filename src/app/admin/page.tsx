import { getAdminSession } from '@/backend/services/auth';
import { redirect } from 'next/navigation';
import { FileText, Download, Flag, BarChart2, Upload, AlertCircle } from 'lucide-react';
import Link from 'next/link';
import type { Metadata } from 'next';

export const metadata: Metadata = { title: 'Admin Dashboard' };

async function getStats() {
  try {
    const base = process.env.NEXTAUTH_URL || 'http://localhost:3000';
    const res = await fetch(`${base}/api/admin/stats`, {
      cache: 'no-store',
      headers: { Cookie: '' }, // server-to-server, auth handled by session
    });
    if (!res.ok) return null;
    return res.json();
  } catch { return null; }
}

export default async function AdminDashboard() {
  const session = await getAdminSession();
  if (!session) redirect('/');

  // Fetch stats directly from Firestore (no HTTP hop needed on server)
  const { getFirebaseAdmin } = await import('@/backend/config/firebase-admin');
  const db = getFirebaseAdmin();

  const [uploadsSnap, reportsSnap] = await Promise.all([
    db.collection('uploads').get(),
    db.collection('reports').where('resolved', '==', false).get(),
  ]);

  let totalDownloads = 0, activeCount = 0, flaggedCount = 0, removedCount = 0;
  uploadsSnap.docs.forEach((d) => {
    const data = d.data();
    totalDownloads += data.downloadCount || 0;
    if (data.status === 'active') activeCount++;
    if (data.status === 'flagged') flaggedCount++;
    if (data.status === 'removed') removedCount++;
  });

  const cards = [
    { icon: FileText, label: 'Total Papers', value: uploadsSnap.size, color: 'var(--violet-light)', href: '/admin/logs' },
    { icon: Upload, label: 'Active Papers', value: activeCount, color: '#6ee7b7', href: '/admin/logs?status=active' },
    { icon: Download, label: 'Total Downloads', value: totalDownloads, color: 'var(--cyan-light)', href: '/admin/analytics' },
    { icon: Flag, label: 'Pending Reports', value: reportsSnap.size, color: '#fca5a5', href: '/admin/reports' },
    { icon: AlertCircle, label: 'Flagged Papers', value: flaggedCount, color: '#fcd34d', href: '/admin/logs?status=flagged' },
    { icon: BarChart2, label: 'Removed Papers', value: removedCount, color: 'var(--text-muted)', href: '/admin/logs?status=removed' },
  ];

  return (
    <div>
      <div style={{ marginBottom: 32 }}>
        <h1 style={{ fontSize: '1.5rem', marginBottom: 6 }}>Admin Dashboard</h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>Platform overview — only visible to AMCFOSS admins.</p>
      </div>

      <div className="grid-3" style={{ marginBottom: 40 }}>
        {cards.map(({ icon: Icon, label, value, color, href }) => (
          <Link key={label} href={href} style={{ textDecoration: 'none' }}>
            <div className="stat-card glass-card" style={{ cursor: 'pointer', transition: 'border-color 0.2s, box-shadow 0.2s' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
                <Icon size={20} style={{ color }} />
                <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontWeight: 500 }}>View →</span>
              </div>
              <p style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--text-primary)', lineHeight: 1 }}>{value.toLocaleString()}</p>
              <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginTop: 6 }}>{label}</p>
            </div>
          </Link>
        ))}
      </div>

      {reportsSnap.size > 0 && (
        <div style={{ padding: '18px 22px', background: 'rgba(239,68,68,0.06)', border: '1px solid rgba(239,68,68,0.2)', borderRadius: 'var(--radius-md)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <Flag size={16} style={{ color: '#fca5a5' }} />
            <p style={{ color: '#fca5a5', fontWeight: 600 }}>{reportsSnap.size} unresolved report{reportsSnap.size > 1 ? 's' : ''} pending review</p>
          </div>
          <Link href="/admin/reports" className="btn btn-danger btn-sm">Review Now</Link>
        </div>
      )}
    </div>
  );
}
