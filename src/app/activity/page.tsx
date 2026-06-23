import { ActivityFeed } from '@/frontend/components/ActivityFeed';
import { Activity, Trophy } from 'lucide-react';
import type { Metadata } from 'next';

export const metadata: Metadata = { title: 'Activity Feed' };

async function getData() {
  try {
    const base = process.env.NEXTAUTH_URL || 'http://localhost:3000';
    const [actRes, statsRes] = await Promise.all([
      fetch(`${base}/api/activity`, { next: { revalidate: 60 } }),
      fetch(`${base}/api/stats`, { next: { revalidate: 300 } }),
    ]);
    const { items } = await actRes.json();
    const stats = await statsRes.json();
    return { items: items || [], stats };
  } catch {
    return { items: [], stats: { totalPapers: 0, totalDownloads: 0, totalSubjects: 0 } };
  }
}

export default async function ActivityPage() {
  const { items, stats } = await getData();

  // Derive top contributors from recent activity
  const counts: Record<string, { github: string; profileUrl: string; count: number }> = {};
  items.forEach((item: any) => {
    if (!counts[item.uploaderGitHub]) {
      counts[item.uploaderGitHub] = { github: item.uploaderGitHub, profileUrl: item.uploaderProfileUrl, count: 0 };
    }
    counts[item.uploaderGitHub].count++;
  });
  const topContributors = Object.values(counts).sort((a, b) => b.count - a.count).slice(0, 5);

  return (
    <div className="page-top section">
      <div className="container">
        <div style={{ marginBottom: 40 }}>
          <h1 style={{ marginBottom: 8 }}>
            <span className="gradient-text">Community</span> Activity
          </h1>
          <p style={{ color: 'var(--text-muted)' }}>See what the community has been uploading recently.</p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 280px', gap: 40, alignItems: 'start' }}>
          {/* Feed */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 20 }}>
              <Activity size={18} style={{ color: 'var(--violet-light)' }} />
              <h2 style={{ fontSize: '1.1rem', fontWeight: 600 }}>Recent Uploads</h2>
            </div>
            <ActivityFeed items={items} />
          </div>

          {/* Sidebar */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            {/* Stats */}
            <div className="glass-card" style={{ padding: 24 }}>
              <h3 style={{ fontSize: '0.9rem', marginBottom: 16, color: 'var(--text-secondary)' }}>Platform Stats</h3>
              {[
                { label: 'Total Papers', value: stats.totalPapers },
                { label: 'Total Downloads', value: stats.totalDownloads },
                { label: 'Subjects Covered', value: stats.totalSubjects },
              ].map(({ label, value }) => (
                <div key={label} style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0', borderBottom: '1px solid var(--border)' }}>
                  <span style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>{label}</span>
                  <span style={{ color: 'var(--text-primary)', fontWeight: 700 }}>{(value as number).toLocaleString()}</span>
                </div>
              ))}
            </div>

            {/* Top Contributors */}
            {topContributors.length > 0 && (
              <div className="glass-card" style={{ padding: 24 }}>
                <h3 style={{ fontSize: '0.9rem', marginBottom: 16, display: 'flex', alignItems: 'center', gap: 8, color: 'var(--text-secondary)' }}>
                  <Trophy size={14} style={{ color: '#fcd34d' }} /> Top Contributors
                </h3>
                {topContributors.map(({ github, profileUrl, count }, i) => (
                  <div key={github} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '8px 0', borderBottom: i < topContributors.length - 1 ? '1px solid var(--border)' : 'none' }}>
                    <span style={{ width: 22, height: 22, borderRadius: '50%', background: 'var(--gradient-brand)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.7rem', fontWeight: 700, color: 'white', flexShrink: 0 }}>
                      {i + 1}
                    </span>
                    <a href={profileUrl} target="_blank" rel="noreferrer" style={{ flex: 1, fontSize: '0.875rem', color: 'var(--text-secondary)', textDecoration: 'none' }}>
                      @{github}
                    </a>
                    <span className="badge badge-violet">{count}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
