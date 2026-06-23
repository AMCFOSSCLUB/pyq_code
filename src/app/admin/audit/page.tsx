import { getAdminSession } from '@/backend/services/auth';
import { getFirebaseAdmin } from '@/backend/config/firebase-admin';
import { redirect } from 'next/navigation';
import type { Metadata } from 'next';

export const metadata: Metadata = { title: 'Audit Log — Admin' };

const ACTION_COLORS: Record<string, string> = {
  UPLOAD: 'badge-green',
  DOWNLOAD: 'badge-cyan',
  DELETE: 'badge-red',
  REPORT: 'badge-yellow',
  RESOLVE_REPORT: 'badge-violet',
  LOGIN: 'badge-gray',
};

export default async function AdminAuditPage({ searchParams }: { searchParams: { page?: string } }) {
  const session = await getAdminSession();
  if (!session) redirect('/');

  const page = Number(searchParams.page || '0');
  const limit = 30;

  const db = getFirebaseAdmin();
  const snap = await db.collection('auditLogs')
    .orderBy('timestamp', 'desc')
    .limit(limit).offset(page * limit).get();

  const entries = snap.docs.map((d: any) => ({
    id: d.id,
    ...d.data(),
    timestamp: d.data().timestamp?.toDate?.().toISOString() ?? d.data().timestamp,
  }));

  return (
    <div>
      <div style={{ marginBottom: 28 }}>
        <h1 style={{ fontSize: '1.5rem', marginBottom: 6 }}>Audit Log</h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>Every action on the platform — immutable, server-written only.</p>
      </div>

      <div className="table-wrapper">
        <table>
          <thead>
            <tr>
              <th>Action</th>
              <th>Actor</th>
              <th>Target File</th>
              <th>Timestamp</th>
              <th>Note</th>
            </tr>
          </thead>
          <tbody>
            {entries.map((e: any) => (
              <tr key={e.id}>
                <td>
                  <span className={`badge ${ACTION_COLORS[e.action] || 'badge-gray'}`}>{e.action}</span>
                </td>
                <td style={{ fontSize: '0.875rem' }}>
                  <a href={`https://github.com/${e.actorGitHub}`} target="_blank" rel="noreferrer"
                    style={{ color: 'var(--text-secondary)' }}>
                    @{e.actorGitHub}
                  </a>
                </td>
                <td style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                  {e.targetFile}
                </td>
                <td style={{ fontSize: '0.8rem', whiteSpace: 'nowrap' }}>
                  {e.timestamp ? new Date(e.timestamp).toLocaleString('en-IN') : '—'}
                </td>
                <td style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{e.adminNote || '—'}</td>
              </tr>
            ))}
            {entries.length === 0 && (
              <tr><td colSpan={5} style={{ textAlign: 'center', color: 'var(--text-muted)', padding: 32 }}>No audit entries yet.</td></tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div style={{ display: 'flex', gap: 10, marginTop: 20, justifyContent: 'flex-end' }}>
        {page > 0 && <a href={`/admin/audit?page=${page - 1}`} className="btn btn-secondary btn-sm">← Previous</a>}
        {entries.length === limit && <a href={`/admin/audit?page=${page + 1}`} className="btn btn-secondary btn-sm">Next →</a>}
      </div>
    </div>
  );
}
