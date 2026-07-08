import { getAdminSession } from '@/backend/services/auth';
import { getFirebaseAdmin } from '@/backend/config/firebase-admin';
import { redirect } from 'next/navigation';
import { StatusBadge } from '@/frontend/components/ui/Badge';
import type { Metadata } from 'next';

export const metadata: Metadata = { title: 'Upload Logs — Admin' };

export default async function AdminLogsPage({ searchParams }: { searchParams: { page?: string; status?: string } }) {
  const session = await getAdminSession();
  if (!session) redirect('/');

  const page = Number(searchParams.page || '0');
  const status = searchParams.status || '';
  const limit = 30;

  const db = getFirebaseAdmin();
  let query: any = db.collection('uploads').orderBy('uploadedAt', 'desc');
  if (status) query = query.where('status', '==', status);

  const snap = await query.limit(limit).offset(page * limit).get();
  const logs = snap.docs.map((d: any) => ({
    id: d.id,
    ...d.data(),
    uploadedAt: d.data().uploadedAt?.toDate?.().toISOString() ?? d.data().uploadedAt,
  }));

  return (
    <div>
      <div style={{ marginBottom: 28 }}>
        <h1 style={{ fontSize: '1.5rem', marginBottom: 6 }}>Upload Logs</h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>All papers ever uploaded — paginated, 30 per page.</p>
      </div>

      {/* Filters */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 20, flexWrap: 'wrap' }}>
        {['', 'active', 'flagged', 'removed'].map((s) => (
          <a
            key={s}
            href={`/admin/logs${s ? `?status=${s}` : ''}`}
            className={`btn btn-sm ${status === s ? 'btn-primary' : 'btn-secondary'}`}
          >
            {s || 'All'}
          </a>
        ))}
      </div>

      <div className="table-wrapper">
        <table>
          <thead>
            <tr>
              <th>Subject</th>
              <th>Filename</th>
              <th>Reports</th>
              <th>Uploader</th>
              <th>Uploaded</th>
              <th>Size</th>
              <th>Downloads</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {logs.map((log: any) => (
              <tr key={log.id}>
                <td>
                  <code style={{ fontFamily: 'JetBrains Mono, monospace', color: 'var(--violet-light)', fontSize: '0.82rem' }}>
                    {log.subjectCode}
                  </code>
                </td>
                <td style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '0.82rem' }}>{log.filename}</td>
                <td style={{ width: 80 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <div style={{ minWidth: 28, height: 28, borderRadius: 999, background: 'rgba(252, 165, 165, 0.12)', border: '1px solid rgba(252,165,165,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <span style={{ color: '#ef4444', fontWeight: 700, fontSize: '0.85rem' }}>{(log.reportCount || 0)}</span>
                    </div>
                  </div>
                </td>
                <td>
                  <a href={log.uploaderProfileUrl} target="_blank" rel="noreferrer" style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>
                    @{log.uploaderGitHub}
                  </a>
                </td>
                <td style={{ fontSize: '0.8rem', whiteSpace: 'nowrap' }}>
                  {new Date(log.uploadedAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                </td>
                <td>{log.fileSizeKB} KB</td>
                <td>{(log.downloadCount || 0).toLocaleString()}</td>
                <td><StatusBadge status={log.status} /></td>
              </tr>
            ))}
            {logs.length === 0 && (
              <tr><td colSpan={7} style={{ textAlign: 'center', color: 'var(--text-muted)', padding: 32 }}>No records found.</td></tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div style={{ display: 'flex', gap: 10, marginTop: 20, justifyContent: 'flex-end' }}>
        {page > 0 && (
          <a href={`/admin/logs?page=${page - 1}${status ? `&status=${status}` : ''}`} className="btn btn-secondary btn-sm">← Previous</a>
        )}
        {logs.length === limit && (
          <a href={`/admin/logs?page=${page + 1}${status ? `&status=${status}` : ''}`} className="btn btn-secondary btn-sm">Next →</a>
        )}
      </div>
    </div>
  );
}
