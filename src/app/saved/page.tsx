'use client';
import { useEffect, useState } from 'react';
import { PaperCard, Paper } from '@/frontend/components/PaperCard';
import { Breadcrumb } from '@/frontend/components/ui/Breadcrumb';
import { Bookmark } from 'lucide-react';

const SAVED_KEY = 'saved_papers';

export default function SavedPage() {
  const [papers, setPapers] = useState<Paper[]>([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(SAVED_KEY);
      setPapers(raw ? JSON.parse(raw) : []);
    } catch {
      setPapers([]);
    } finally {
      setLoaded(true);
    }
  }, []);

  return (
    <div className="page-top section">
      <div className="container">
        <Breadcrumb items={[{ label: 'Home', href: '/' }, { label: 'Saved Papers' }]} />

        <div style={{ marginBottom: 40 }}>
          <h1 style={{ marginBottom: 8, fontFamily: 'JetBrains Mono, monospace' }}>Saved Papers</h1>
          <p style={{ color: 'var(--text-muted)' }}>
            Papers you&apos;ve bookmarked for later, stored right here in this browser.
          </p>
        </div>

        {loaded && papers.length === 0 && (
          <div className="empty-state">
            <Bookmark size={48} />
            <h3>No saved papers yet</h3>
            <p>Tap the bookmark icon on any paper to save it here for quick access before exams.</p>
            <a href="/search" className="btn btn-primary" style={{ marginTop: 20, display: 'inline-flex' }}>Browse Papers</a>
          </div>
        )}

        {papers.length > 0 && (
          <div className="grid-3">
            {papers.map((paper) => (
              <PaperCard key={paper.id} paper={paper} showSubject />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
