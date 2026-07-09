'use client';
import { useEffect, useState, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { SubjectSearchBar } from '@/frontend/components/SubjectSearchBar';
import { PaperCard, Paper } from '@/frontend/components/PaperCard';
import { CopyButton } from '@/frontend/components/ui/CopyButton';
import { Breadcrumb } from '@/frontend/components/ui/Breadcrumb';
import { BookOpen, AlertCircle, Bookmark, History } from 'lucide-react';
import Link from 'next/link';
import type { Metadata } from 'next';

const EXAM_TYPE_FILTERS = [
  { value: 'all', label: 'All' },
  { value: 'mid', label: 'Mid Sem' },
  { value: 'end', label: 'End Sem' },
  { value: 'sup', label: 'Supplementary' },
];

function getExamType(filename: string): string {
  const base = filename.replace('.pdf', '');
  const parts = base.split('_');
  return parts[1] || '';
}

function RecentlyViewedStrip() {
  const [recent, setRecent] = useState<Paper[]>([]);

  useEffect(() => {
    try {
      const raw = localStorage.getItem('recently_viewed_papers');
      setRecent(raw ? JSON.parse(raw) : []);
    } catch {
      setRecent([]);
    }
  }, []);

  if (recent.length === 0) return null;

  return (
    <div style={{ marginBottom: 32, background: 'rgba(255,255,255,0.01)', border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)', padding: '18px 22px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
        <History size={15} style={{ color: '#0E9300' }} />
        <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-secondary)' }}>Recently Viewed</span>
      </div>
      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
        {recent.map((p) => (
          <Link
            key={p.id}
            href={`/search?code=${p.subjectCode}`}
            style={{
              textDecoration: 'none', fontSize: '0.8rem', color: 'var(--text-secondary)',
              background: 'rgba(255,255,255,0.03)', border: '1px solid var(--border)',
              padding: '6px 12px', borderRadius: 'var(--radius-full)', fontFamily: 'JetBrains Mono, monospace',
            }}
          >
            {p.subjectCode}
          </Link>
        ))}
      </div>
    </div>
  );
}

function SearchResults() {
  const params = useSearchParams();
  const code = params.get('code') || '';
  const [papers, setPapers] = useState<Paper[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [examFilter, setExamFilter] = useState('all');

  useEffect(() => {
    setExamFilter('all'); // reset filter when the searched subject changes
    if (!code) return;
    setLoading(true);
    setError('');
    fetch(`/api/search?code=${encodeURIComponent(code)}`)
      .then((r) => r.json())
      .then(({ papers: p, error: e }) => {
        if (e) { setError(e); setPapers([]); }
        else setPapers(p || []);
      })
      .catch(() => setError('Failed to load results. Please try again.'))
      .finally(() => setLoading(false));
  }, [code]);

  const filteredPapers = examFilter === 'all' ? papers : papers.filter((p) => getExamType(p.filename) === examFilter);

  if (!code) return null;

  return (
    <div style={{ marginTop: 40 }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24, flexWrap: 'wrap', gap: 12 }}>
        <div>
          <h2 style={{ marginBottom: 4, display: 'flex', alignItems: 'center', gap: 8 }}>
            Papers for{' '}
            <code style={{ fontFamily: 'JetBrains Mono, monospace', color: 'var(--violet-light)', fontSize: '1.3rem' }}>{code}</code>
            <CopyButton value={code} size={16} label={`Copy subject code ${code}`} />
          </h2>
          {!loading && <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>{papers.length} paper{papers.length !== 1 ? 's' : ''} found</p>}
        </div>
      </div>

      {!loading && !error && papers.length > 0 && (
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 20 }}>
          {EXAM_TYPE_FILTERS.map(({ value, label }) => (
            <button
              key={value}
              onClick={() => setExamFilter(value)}
              style={{
                padding: '6px 14px', borderRadius: 'var(--radius-full)', fontSize: '0.8rem', fontWeight: 600,
                cursor: 'pointer', transition: 'all 0.2s',
                background: examFilter === value ? '#0E9300' : 'rgba(255,255,255,0.03)',
                color: examFilter === value ? '#fff' : 'var(--text-secondary)',
                border: `1px solid ${examFilter === value ? '#0E9300' : 'var(--border)'}`,
              }}
            >
              {label}
            </button>
          ))}
        </div>
      )}

      {loading && (
        <div className="grid-3">
          {[1,2,3].map((i) => <div key={i} className="skeleton" style={{ height: 180, borderRadius: 'var(--radius-lg)' }} />)}
        </div>
      )}

      {error && (
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '16px 20px', background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)', borderRadius: 'var(--radius-md)' }}>
          <AlertCircle size={16} style={{ color: '#fca5a5' }} />
          <p style={{ color: '#fca5a5', fontSize: '0.9rem' }}>{error}</p>
        </div>
      )}

      {!loading && !error && papers.length === 0 && (
        <div className="empty-state">
          <BookOpen size={48} />
          <h3>No papers found for {code}</h3>
          <p>Be the first to upload a paper for this subject!</p>
          <a href="/upload" className="btn btn-primary" style={{ marginTop: 20, display: 'inline-flex' }}>Upload Now</a>
        </div>
      )}

      {!loading && !error && papers.length > 0 && filteredPapers.length === 0 && (
        <div className="empty-state">
          <BookOpen size={48} />
          <h3>No papers match this filter</h3>
          <p>Try a different exam type, or view all papers for {code}.</p>
        </div>
      )}

      {!loading && filteredPapers.length > 0 && (
        <div className="grid-3">
          {filteredPapers.map((paper) => (
            <PaperCard key={paper.id} paper={paper} />
          ))}
        </div>
      )}
    </div>
  );
}

export default function SearchPage() {
  return (
    <div className="page-top section">
      <div className="container">
        <Breadcrumb items={[{ label: 'Home', href: '/' }, { label: 'Papers' }]} />
        <div style={{ marginBottom: 40, display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: 16 }}>
          <div>
            <h1 className="scramble-text" style={{ marginBottom: 8, fontFamily: 'JetBrains Mono, monospace' }}>Browse Question Papers</h1>
            <p style={{ color: 'var(--text-muted)' }}>Search by subject code to find all available previous year papers.</p>
          </div>
          <Link href="/saved" className="btn btn-ghost btn-sm" style={{ flexShrink: 0 }}>
            <Bookmark size={14} />Saved Papers
          </Link>
        </div>

        <SubjectSearchBar autoFocus large />

        <RecentlyViewedStrip />

        <Suspense>
          <SearchResults />
        </Suspense>
      </div>
    </div>
  );
}
