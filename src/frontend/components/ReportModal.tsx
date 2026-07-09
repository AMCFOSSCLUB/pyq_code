'use client';
import { useState, FormEvent } from 'react';
import { useSession } from 'next-auth/react';

import { Modal } from './ui/Modal';
import { Flag, AlertTriangle } from 'lucide-react';

const REASONS = ['Wrong file / Incorrect paper', 'Duplicate paper', 'Spam or irrelevant', 'Other'];

interface Props {
  open: boolean;
  onClose: () => void;
  subjectCode: string;
  filename: string;
}

export function ReportModal({ open, onClose, subjectCode, filename }: Props) {
  const { data: session } = useSession();
  const [reason, setReason] = useState('');
  const [description, setDescription] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!session) return;
    setSubmitting(true);
    try {
      const res = await fetch('/api/report', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          subjectCode,
          filename,
          reason,
          description,
        }),
      });
      if (!res.ok) throw new Error('Failed to submit report');
      setDone(true);
    } catch (err) {
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  }

  function handleClose() {
    setDone(false);
    setReason('');
    setDescription('');
    onClose();
  }

  if (!session) return null;

  return (
    <Modal open={open} onClose={handleClose} title="Report Paper">
      {done ? (
        <div style={{ textAlign: 'center', padding: '16px 0' }}>
          <div style={{ width: 52, height: 52, background: 'rgba(16,185,129,0.12)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
            <Flag size={22} style={{ color: '#6ee7b7' }} />
          </div>
          <h3 style={{ marginBottom: 8, color: 'var(--text-primary)' }}>Report submitted</h3>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: 20 }}>
            Our admins will review this paper shortly. Thank you!
          </p>
          <button className="btn btn-secondary" onClick={handleClose}>Close</button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
          <div style={{ padding: '12px 14px', background: 'rgba(245,158,11,0.08)', border: '1px solid rgba(245,158,11,0.2)', borderRadius: 'var(--radius-sm)', display: 'flex', gap: 10 }}>
            <AlertTriangle size={15} style={{ color: '#fcd34d', flexShrink: 0, marginTop: 1 }} />
            <p style={{ fontSize: '0.82rem', color: '#fcd34d' }}>
              Reporting <strong style={{ fontFamily: 'JetBrains Mono, monospace' }}>{filename}</strong> from <strong>{subjectCode}</strong>
            </p>
          </div>

          <div className="input-group">
            <label className="input-label">Reason *</label>
            <select
              id="report-reason"
              className="input"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              required
            >
              <option value="">Select a reason…</option>
              {REASONS.map((r) => <option key={r} value={r}>{r}</option>)}
            </select>
          </div>

          <div className="input-group">
            <label className="input-label">Additional details (optional)</label>
            <textarea
              id="report-description"
              className="input"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe the issue…"
              rows={3}
              style={{ resize: 'vertical' }}
            />
          </div>

          <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end' }}>
            <button type="button" className="btn btn-ghost" onClick={handleClose}>Cancel</button>
            <button id="report-submit-btn" type="submit" className="btn btn-danger" disabled={submitting || !reason}>
              {submitting ? <span className="spinner" /> : <Flag size={14} />}
              Submit Report
            </button>
          </div>
        </form>
      )}
    </Modal>
  );
}
