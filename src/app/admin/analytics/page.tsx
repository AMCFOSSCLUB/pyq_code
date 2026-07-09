import { getAdminSession } from '@/backend/services/auth';
import { getFirebaseAdmin } from '@/backend/config/firebase-admin';
import { redirect } from 'next/navigation';
import { BarChart2, TrendingUp, Users, BookOpen } from 'lucide-react';
import type { Metadata } from 'next';

export const metadata: Metadata = { title: 'Analytics — Admin' };

export default async function AdminAnalyticsPage() {
  const session = await getAdminSession();
  if (!session) redirect('/');

  const db = getFirebaseAdmin();

  const uploadsSnap = await db.collection('uploads').get();

  const subjectCounts: Record<string, number> = {};
  const uploaderCounts: Record<string, number> = {};
  const downloadsPerSubject: Record<string, number> = {};

  uploadsSnap.docs.forEach((d) => {
    const data = d.data();
    const sc = data.subjectCode;
    const ug = data.uploaderGitHub;
    subjectCounts[sc] = (subjectCounts[sc] || 0) + 1;
    uploaderCounts[ug] = (uploaderCounts[ug] || 0) + 1;
    downloadsPerSubject[sc] = (downloadsPerSubject[sc] || 0) + (data.downloadCount || 0);
  });

  const topSubjects = Object.entries(subjectCounts).sort((a, b) => b[1] - a[1]).slice(0, 10);
  const topUploaders = Object.entries(uploaderCounts).sort((a, b) => b[1] - a[1]).slice(0, 10);
  const topDownloaded = Object.entries(downloadsPerSubject).sort((a, b) => b[1] - a[1]).slice(0, 10);

  const maxSubjectCount = topSubjects[0]?.[1] || 1;
  const maxDownloads = topDownloaded[0]?.[1] || 1;

  return (
    <div>
      <div style={{ marginBottom: 32 }}>
        <h1 style={{ fontSize: '1.5rem', marginBottom: 6 }}>Analytics</h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>Insights across all papers, subjects, and contributors.</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 28 }}>
        {/* Top subjects by upload count */}
        <div className="glass-card" style={{ padding: 24 }}>
          <h3 style={{ fontSize: '1rem', marginBottom: 20, display: 'flex', alignItems: 'center', gap: 8 }}>
            <BookOpen size={16} style={{ color: 'var(--green-primary)' }} /> Top Subjects by Papers
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {topSubjects.map(([code, count]) => (
              <div key={code}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 5 }}>
                  <code style={{ fontSize: '0.82rem', color: 'var(--green-primary)', fontFamily: 'JetBrains Mono, monospace' }}>{code}</code>
                  <span style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>{count} paper{count > 1 ? 's' : ''}</span>
                </div>
                <div className="progress-bar">
                  <div className="progress-fill" style={{ width: `${(count / maxSubjectCount) * 100}%` }} />
                </div>
              </div>
            ))}
            {topSubjects.length === 0 && <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>No data yet.</p>}
          </div>
        </div>

        {/* Top subjects by downloads */}
        <div className="glass-card" style={{ padding: 24 }}>
          <h3 style={{ fontSize: '1rem', marginBottom: 20, display: 'flex', alignItems: 'center', gap: 8 }}>
            <TrendingUp size={16} style={{ color: 'var(--green-primary)' }} /> Top Subjects by Downloads
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {topDownloaded.map(([code, count]) => (
              <div key={code}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 5 }}>
                  <code style={{ fontSize: '0.82rem', color: 'var(--green-primary)', fontFamily: 'JetBrains Mono, monospace' }}>{code}</code>
                  <span style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>{count.toLocaleString()}</span>
                </div>
                <div className="progress-bar">
                  <div className="progress-fill" style={{ width: `${(count / maxDownloads) * 100}%`, background: 'var(--green-primary)' }} />
                </div>
              </div>
            ))}
            {topDownloaded.length === 0 && <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>No data yet.</p>}
          </div>
        </div>

        {/* Top uploaders */}
        <div className="glass-card" style={{ padding: 24, gridColumn: '1 / -1' }}>
          <h3 style={{ fontSize: '1rem', marginBottom: 20, display: 'flex', alignItems: 'center', gap: 8 }}>
            <Users size={16} style={{ color: 'var(--green-primary)' }} /> Top Contributors
          </h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 12 }}>
            {topUploaders.map(([username, count], i) => (
              <div key={username} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 16px', background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 'var(--radius-md)' }}>
                <div style={{ width: 32, height: 32, borderRadius: '50%', background: 'var(--gradient-brand)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.78rem', fontWeight: 800, color: 'white', flexShrink: 0 }}>
                  #{i + 1}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <a href={`https://github.com/${username}`} target="_blank" rel="noreferrer"
                    style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', fontWeight: 500, display: 'block', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    @{username}
                  </a>
                  <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>{count} paper{count > 1 ? 's' : ''}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
