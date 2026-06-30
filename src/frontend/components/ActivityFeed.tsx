import Link from 'next/link';
import Image from 'next/image';
import { Upload, Clock } from 'lucide-react';

interface ActivityItem {
  id: string;
  subjectCode: string;
  filename: string;
  uploaderGitHub: string;
  uploaderProfileUrl: string;
  uploadedAt: string;
}

interface Props {
  items: ActivityItem[];
  loading?: boolean;
}

function timeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  return `${Math.floor(hrs / 24)}d ago`;
}

export function ActivityFeed({ items, loading }: Props) {
  if (loading) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        {[...Array(5)].map((_, i) => (
          <div key={i} className="skeleton" style={{ height: 72, borderRadius: 'var(--radius-md)' }} />
        ))}
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="empty-state">
        <Upload size={40} />
        <h3>NO_TRANSMISSIONS_DETECTED</h3>
        <p>Initialize first uplink to stream new parameters.</p>
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
      {items.map((item) => (
        <div key={item.id} className="glass-card" style={{ padding: '14px 18px', display: 'flex', alignItems: 'center', gap: 14 }}>
          <div style={{
            width: 38, height: 38, flexShrink: 0,
            background: 'rgba(14, 147, 0, 0.12)',
            border: '1px solid rgba(14, 147, 0, 0.2)',
            borderRadius: 9,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <Upload size={15} style={{ color: 'var(--green-neon)' }} />
          </div>

          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
              <Link href={`/search?code=${item.subjectCode}`}>
                <span className="badge badge-green" style={{ fontFamily: 'JetBrains Mono, monospace', cursor: 'pointer' }}>
                  {item.subjectCode}
                </span>
              </Link>
              <span style={{ fontSize: '0.875rem', color: 'var(--text-primary)', fontWeight: 500 }}>
                {item.filename}
              </span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 4 }}>
              <a href={item.uploaderProfileUrl} target="_blank" rel="noreferrer"
                style={{ fontSize: '0.78rem', color: 'var(--text-muted)', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 4 }}>
                @{item.uploaderGitHub}
              </a>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 5, color: 'var(--text-muted)', fontSize: '0.78rem', flexShrink: 0 }}>
            <Clock size={11} />{timeAgo(item.uploadedAt)}
          </div>
        </div>
      ))}
    </div>
  );
}
