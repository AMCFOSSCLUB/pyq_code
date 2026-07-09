import { FileText, Download, Users } from 'lucide-react';
import { getFirebaseAdmin } from '@/backend/config/firebase-admin';

interface Stats { totalPapers: number; totalDownloads: number; totalSubjects: number; }

export async function StatsStrip() {
  let stats: Stats = { totalPapers: 0, totalDownloads: 0, totalSubjects: 0 };
  try {
    const db = getFirebaseAdmin();
    const snap = await db.collection('uploads').where('status', '==', 'active').get();

    let totalDownloads = 0;
    const subjectSet = new Set<string>();
    snap.docs.forEach((d) => {
      totalDownloads += d.data().downloadCount || 0;
      if (d.data().subjectCode) subjectSet.add(d.data().subjectCode);
    });

    stats = {
      totalPapers: snap.size,
      totalDownloads,
      totalSubjects: subjectSet.size,
    };
  } catch {}

  const items = [
    { icon: FileText, value: stats.totalPapers.toLocaleString(), label: 'Papers Uploaded', color: 'var(--green-primary)' },
    { icon: Download, value: stats.totalDownloads.toLocaleString(), label: 'Total Downloads', color: 'var(--green-primary)' },
    { icon: Users,    value: stats.totalSubjects.toLocaleString(), label: 'Subjects Covered', color: 'var(--green-primary)' },
  ];

  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
      gap: 1,
      background: 'var(--border)',
      border: '1px solid var(--border)',
      borderRadius: 'var(--radius-xl)',
      overflow: 'hidden',
    }}>
      {items.map(({ icon: Icon, value, label, color }) => (
        <div key={label} style={{
          background: 'var(--bg-secondary)',
          padding: '28px 24px',
          display: 'flex', flexDirection: 'column', alignItems: 'center',
          gap: 8, textAlign: 'center',
        }}>
          <Icon size={22} style={{ color }} />
          <span style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--text-primary)', lineHeight: 1 }}>{value}</span>
          <span style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>{label}</span>
        </div>
      ))}
    </div>
  );
}
