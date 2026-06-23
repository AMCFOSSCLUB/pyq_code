'use client';
import { useEffect, useState, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { SubjectSearchBar } from '@/frontend/components/SubjectSearchBar';
import { PaperCard, Paper } from '@/frontend/components/PaperCard';
import { BookOpen, AlertCircle } from 'lucide-react';
import type { Metadata } from 'next';

function SearchResults() {
  const params = useSearchParams();
  const code = params.get('code') || '';
  const [papers, setPapers] = useState<Paper[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
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

  if (!code) return null;

  return (
    <div style={{ marginTop: 40 }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24, flexWrap: 'wrap', gap: 12 }}>
        <div>
          <h2 style={{ marginBottom: 4 }}>
            Papers for{' '}
            <code style={{ fontFamily: 'JetBrains Mono, monospace', color: 'var(--violet-light)', fontSize: '1.3rem' }}>{code}</code>
          </h2>
          {!loading && <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>{papers.length} paper{papers.length !== 1 ? 's' : ''} found</p>}
        </div>
      </div>

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

      {!loading && papers.length > 0 && (
        <div className="grid-3">
          {papers.map((paper) => (
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
        <div style={{ marginBottom: 40 }}>
          <h1 style={{ marginBottom: 8 }}>Browse <span className="gradient-text">Question Papers</span></h1>
          <p style={{ color: 'var(--text-muted)' }}>Search by subject code to find all available previous year papers.</p>
        </div>

        <SubjectSearchBar autoFocus large />

        <Suspense>
          <SearchResults />
        </Suspense>
      </div>
    </div>
  );
}
