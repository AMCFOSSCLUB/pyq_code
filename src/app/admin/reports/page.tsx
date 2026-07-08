'use client';
import { useEffect, useState } from 'react';
import { Flag, CheckCircle, AlertCircle, Trash2 } from 'lucide-react';

interface Report {
  id: string;
  reportedBy: string;
  reportedByUsers?: string[];
  subjectCode: string;
  filename: string;
  reason: string;
  description: string;
  reportedAt: string;
  reportCount: number;
  resolved: boolean;
}

export default function AdminReportsPage() {
  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(true);
  const [resolving, setResolving] = useState<string | null>(null);
  const [removing, setRemoving] = useState<string | null>(null);
  const [canRemovePaper, setCanRemovePaper] = useState(false);

  async function load() {
    setLoading(true);
    try {
      const [reportsRes, adminRes] = await Promise.all([
        fetch('/api/admin/reports').catch(() => null),
        fetch('/api/admin/me').catch(() => null),
      ]);

      if (reportsRes?.ok) {
        const reportsPayload = await reportsRes.json().catch(() => ({ reports: [] }));
        setReports(Array.isArray(reportsPayload?.reports) ? reportsPayload.reports : []);
      } else {
        setReports([]);
      }

      if (adminRes?.ok) {
        const adminData = await adminRes.json().catch(() => ({ isAuthorizedAdmin: false }));
        setCanRemovePaper(Boolean(adminData?.isAuthorizedAdmin));
      } else {
        setCanRemovePaper(false);
      }
    } catch {
      setReports([]);
      setCanRemovePaper(false);
    } finally {
      setLoading(false);
    }
  }

  async function resolve(id: string) {
    setResolving(id);
    await fetch('/api/admin/reports', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ reportId: id }),
    });
    setReports((prev) => prev.filter((r) => r.id !== id));
    setResolving(null);
  }

  async function removePaper(id: string) {
    const confirmed = window.confirm('Permanently delete this paper, its PDF, and all related report records?');
    if (!confirmed) return;

    setRemoving(id);
    const res = await fetch('/api/admin/reports', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ reportId: id, action: 'remove' }),
    });

    if (res.ok) {
      setReports((prev) => prev.filter((r) => r.id !== id));
    }
    setRemoving(null);
  }

  useEffect(() => { void load(); }, []);

  return (
    <div>
      <div style={{ marginBottom: 28 }}>
        <h1 style={{ fontSize: '1.5rem', marginBottom: 6 }}>Reports Queue</h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>Unresolved user reports — review and resolve.</p>
      </div>

      {loading && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {[1,2,3].map((i) => <div key={i} className="skeleton" style={{ height: 100, borderRadius: 'var(--radius-md)' }} />)}
        </div>
      )}

      {!loading && reports.length === 0 && (
        <div className="empty-state">
          <CheckCircle size={48} style={{ color: 'var(--success)' }} />
          <h3>All reports resolved</h3>
          <p>No pending reports at this time.</p>
        </div>
      )}

      {!loading && reports.length > 0 && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          {reports.map((r) => (
            <div key={r.id} className="glass-card" style={{ padding: '20px 24px' }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: 16 }}>
                <div style={{ width: 36, height: 36, borderRadius: 9, background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <Flag size={15} style={{ color: '#fca5a5' }} />
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap', marginBottom: 6 }}>
                    <code style={{ fontFamily: 'JetBrains Mono, monospace', color: 'var(--violet-light)', fontSize: '0.85rem' }}>{r.subjectCode}/{r.filename}</code>
                    <span className="badge badge-red">{r.reason}</span>
                  </div>
                  {r.description && (
                    <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: 8 }}>{r.description}</p>
                  )}
                  <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginBottom: 8 }}>
                    Reported by @{(r.reportedByUsers && r.reportedByUsers.length > 0 ? r.reportedByUsers : [r.reportedBy]).join(', @')} · {r.reportedAt ? new Date(r.reportedAt).toLocaleDateString('en-IN') : ''}
                  </p>
                  {(r.reportCount || 0) >= 3 && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: '#f59e0b', fontSize: '0.8rem', fontWeight: 600 }}>
                      <AlertCircle size={14} /> Report threshold reached
                    </div>
                  )}
                </div>
                <div style={{ display: 'flex', gap: 8, flexShrink: 0, alignItems: 'center' }}>
                  <a
                    href={`/search?code=${r.subjectCode}`}
                    target="_blank"
                    rel="noreferrer"
                    className="btn btn-secondary btn-sm"
                  >
                    View Paper
                  </a>
                  <span aria-label={`${r.reportCount || 0} reports`} style={{ width: 24, height: 24, borderRadius: '50%', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(239,68,68,0.16)', color: '#fca5a5', fontSize: '0.8rem', fontWeight: 700 }}>
                    {r.reportCount || 0}
                  </span>
                  <button
                    id={`resolve-${r.id}`}
                    className="btn btn-primary btn-sm"
                    onClick={() => resolve(r.id)}
                    disabled={resolving === r.id}
                  >
                    {resolving === r.id ? <span className="spinner" /> : <CheckCircle size={13} />}
                    Resolve
                  </button>
                  {canRemovePaper && (
                    <button
                      id={`remove-${r.id}`}
                      className="btn btn-danger btn-sm"
                      onClick={() => removePaper(r.id)}
                      disabled={removing === r.id}
                    >
                      {removing === r.id ? <span className="spinner" /> : <Trash2 size={13} />}
                      Remove Paper
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
