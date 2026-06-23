'use client';
import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Download, Flag, FileText, Calendar, User, Eye } from 'lucide-react';
import { StatusBadge } from './ui/Badge';
import { ReportModal } from './ReportModal';

export interface Paper {
  id: string;
  subjectCode: string;
  filename: string;
  uploaderGitHub: string;
  uploaderProfileUrl: string;
  uploadedAt: string;
  fileSizeKB: number;
  downloadCount: number;
  reportCount: number;
  status: string;
}

interface PaperCardProps {
  paper: Paper;
  showSubject?: boolean;
}

export function PaperCard({ paper, showSubject = false }: PaperCardProps) {
  const [reportOpen, setReportOpen] = useState(false);
  const [downloading, setDownloading] = useState(false);

  // Parse filename: Nov2023_end.pdf → "Nov 2023 · End Sem"
  function parseFilename(filename: string) {
    const base = filename.replace('.pdf', '');
    const parts = base.split('_');
    const dateStr = parts[0]; // e.g. Nov2023
    const typeMap: Record<string, string> = { mid: 'Mid Sem', end: 'End Sem', sup: 'Supplementary' };
    const type = parts[1] ? typeMap[parts[1]] || parts[1] : '';
    return { date: dateStr, type };
  }

  const { date, type } = parseFilename(paper.filename);

  async function handleDownload() {
    setDownloading(true);
    try {
      const res = await fetch(`/api/download/${paper.id}`);
      const { url } = await res.json();
      window.open(url, '_blank');
    } finally {
      setDownloading(false);
    }
  }

  return (
    <>
      <div className="glass-card" style={{ padding: 20, display: 'flex', flexDirection: 'column', gap: 16 }}>
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12 }}>
          <div style={{
            width: 42, height: 42, flexShrink: 0,
            background: 'var(--gradient-card)',
            border: '1px solid var(--border)',
            borderRadius: 10,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <FileText size={18} style={{ color: 'var(--violet-light)' }} />
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
              {showSubject && (
                <Link href={`/search?code=${paper.subjectCode}`}>
                  <span className="badge badge-violet" style={{ fontFamily: 'JetBrains Mono, monospace' }}>
                    {paper.subjectCode}
                  </span>
                </Link>
              )}
              <span style={{ fontWeight: 700, fontSize: '0.95rem', color: 'var(--text-primary)' }}>{date}</span>
              {type && <span className="badge badge-cyan">{type}</span>}
              <StatusBadge status={paper.status} />
            </div>
            <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: 4, fontFamily: 'JetBrains Mono, monospace' }}>
              {paper.filename}
            </p>
          </div>
        </div>

        {/* Meta row */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 16, flexWrap: 'wrap' }}>
          <a href={paper.uploaderProfileUrl} target="_blank" rel="noreferrer"
            style={{ display: 'flex', alignItems: 'center', gap: 6, color: 'var(--text-muted)', fontSize: '0.8125rem', textDecoration: 'none', transition: 'color 0.2s' }}
            className="meta-link">
            <User size={12} />@{paper.uploaderGitHub}
          </a>
          <span style={{ display: 'flex', alignItems: 'center', gap: 5, color: 'var(--text-muted)', fontSize: '0.8125rem' }}>
            <Calendar size={12} />{new Date(paper.uploadedAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
          </span>
          <span style={{ display: 'flex', alignItems: 'center', gap: 5, color: 'var(--text-muted)', fontSize: '0.8125rem' }}>
            <Eye size={12} />{paper.downloadCount.toLocaleString()} downloads
          </span>
          <span style={{ color: 'var(--text-muted)', fontSize: '0.8125rem', marginLeft: 'auto' }}>
            {paper.fileSizeKB} KB
          </span>
        </div>

        {/* Actions */}
        <div style={{ display: 'flex', gap: 10 }}>
          <button
            id={`download-${paper.id}`}
            className="btn btn-primary btn-sm"
            style={{ flex: 1, justifyContent: 'center' }}
            onClick={handleDownload}
            disabled={downloading || paper.status !== 'active'}
          >
            {downloading ? <span className="spinner" /> : <Download size={14} />}
            {downloading ? 'Opening…' : 'Download PDF'}
          </button>
          <button
            id={`report-${paper.id}`}
            className="btn btn-ghost btn-sm"
            onClick={() => setReportOpen(true)}
            title="Report this paper"
          >
            <Flag size={14} />
          </button>
        </div>
      </div>

      <ReportModal
        open={reportOpen}
        onClose={() => setReportOpen(false)}
        subjectCode={paper.subjectCode}
        filename={paper.filename}
      />

    </>
  );
}
