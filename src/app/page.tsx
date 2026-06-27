import { Suspense } from 'react';
import { BookOpen, ArrowRight, Shield, GitBranch, Zap } from 'lucide-react';
import Link from 'next/link';
import { SubjectSearchBar } from '@/frontend/components/SubjectSearchBar';
import { StatsStrip } from '@/frontend/components/StatsStrip';
import { ActivityFeed } from '@/frontend/components/ActivityFeed';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'AMCFOSS PYQ — Amrita Chennai Previous Year Papers',
};

async function getRecentActivity() {
  try {
    const baseUrl = process.env.NEXTAUTH_URL || 'http://localhost:3000';
    const res = await fetch(`${baseUrl}/api/activity`, { next: { revalidate: 60 } });
    if (!res.ok) return [];
    const { items } = await res.json();
    return items || [];
  } catch { return []; }
}

const FEATURES = [
  { icon: GitBranch, title: 'Git-backed Storage', desc: 'Every paper is committed to a GitHub repo — permanently versioned and recoverable.', color: 'var(--violet-light)' },
  { icon: Shield, title: 'Audit Trail', desc: 'Every upload, download and report is logged with timestamp and GitHub identity.', color: 'var(--cyan-light)' },
  { icon: Zap, title: 'Instant Access', desc: 'Search by subject code and download directly from GitHub\'s CDN — no paywalls.', color: 'var(--pink)' },
];

export default async function HomePage() {
  const activity = await getRecentActivity();

  return (
    <div>
      {/* ── Hero ────────────────────────────────────── */}
      <section style={{ paddingTop: 140, paddingBottom: 80, position: 'relative', zIndex: 1 }}>
        {/* Glowing orb */}
        <div style={{
          position: 'absolute', top: '20%', left: '50%', transform: 'translateX(-50%)',
          width: 600, height: 600, borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(0,200,83,0.06) 0%, transparent 70%)',
          pointerEvents: 'none', zIndex: 0,
        }} />

        <div className="container" style={{ textAlign: 'center', position: 'relative', zIndex: 1 }}>
          <div className="animate-fade-up" style={{ marginBottom: 16 }}>
            <span className="badge badge-violet" style={{ fontSize: '0.8rem', padding: '6px 16px' }}>
              <BookOpen size={11} /> Open Source · Free Forever
            </span>
          </div>

          <h1 className="animate-fade-up delay-1" style={{ maxWidth: 780, margin: '0 auto 20px', lineHeight: 1.1 }}>
            Find Every <span className="gradient-text">Amrita Chennai</span>{' '}
            Previous Year Paper
          </h1>

          <p className="animate-fade-up delay-2" style={{
            fontSize: 'clamp(1rem, 2vw, 1.2rem)',
            color: 'var(--text-muted)', maxWidth: 560, margin: '0 auto 48px',
          }}>
            Community-driven. GitHub-backed. No logins needed to browse — just search by subject code and download.
          </p>

          {/* Search */}
          <div className="animate-fade-up delay-3" style={{ maxWidth: 580, margin: '0 auto 32px' }}>
            <SubjectSearchBar large autoFocus={false} />
          </div>

          {/* Popular codes */}
          <div className="animate-fade-up delay-3" style={{ display: 'flex', alignItems: 'center', gap: 10, justifyContent: 'center', flexWrap: 'wrap' }}>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Popular:</span>
            {['23CSE301', '22MAT201', '22PHY101', '22EEE201', '22ECE301'].map((code) => (
              <Link key={code} href={`/search?code=${code}`}>
                <span className="badge badge-gray" style={{ cursor: 'pointer', fontFamily: 'JetBrains Mono, monospace', fontSize: '0.78rem' }}>{code}</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── Stats Strip ─────────────────────────────── */}
      <section className="section-sm" style={{ zIndex: 1, position: 'relative' }}>
        <div className="container">
          <Suspense fallback={
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 1, background: 'var(--border)', borderRadius: 'var(--radius-xl)', overflow: 'hidden' }}>
              {[1,2,3].map((i) => <div key={i} className="skeleton" style={{ height: 120 }} />)}
            </div>
          }>
            <StatsStrip />
          </Suspense>
        </div>
      </section>

      {/* ── Features ────────────────────────────────── */}
      <section className="section">
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: 52 }}>
            <h2>Built for <span className="gradient-text">Students, by Students</span></h2>
            <p style={{ maxWidth: 480, margin: '12px auto 0', color: 'var(--text-muted)' }}>
              AMCFOSS maintains this as a free, open-source public good for Amrita Chennai.
            </p>
          </div>
          <div className="grid-3">
            {FEATURES.map(({ icon: Icon, title, desc, color }) => (
              <div key={title} className="glass-card" style={{ padding: 28 }}>
                <div style={{ width: 48, height: 48, borderRadius: 12, background: 'var(--bg-secondary)', border: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 18 }}>
                  <Icon size={22} style={{ color }} />
                </div>
                <h3 style={{ fontSize: '1.05rem', marginBottom: 10 }}>{title}</h3>
                <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', lineHeight: 1.7 }}>{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Recent Activity ──────────────────────────── */}
      <section className="section" style={{ background: 'rgba(255,255,255,0.01)', borderTop: '1px solid var(--border)', borderBottom: '1px solid var(--border)' }}>
        <div className="container">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 32 }}>
            <div>
              <h2 style={{ marginBottom: 6 }}>Recent Uploads</h2>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Latest papers added by the community</p>
            </div>
            <Link href="/activity" className="btn btn-secondary btn-sm">
              View All <ArrowRight size={13} />
            </Link>
          </div>
          <ActivityFeed items={activity.slice(0, 6)} />
        </div>
      </section>

      {/* ── CTA ─────────────────────────────────────── */}
      <section className="section">
        <div className="container" style={{ textAlign: 'center' }}>
          <div style={{
            maxWidth: 600, margin: '0 auto',
            padding: '52px 40px',
            background: 'linear-gradient(145deg, rgba(0,200,83,0.08), rgba(0,230,118,0.03))',
            border: '1px solid rgba(0,200,83,0.15)',
            borderRadius: 'var(--radius-xl)',
          }}>
            <h2 style={{ marginBottom: 14 }}>Have a Paper to Share?</h2>
            <p style={{ color: 'var(--text-muted)', marginBottom: 28 }}>
              Upload with your GitHub account. It takes under a minute and helps hundreds of students.
            </p>
            <Link href="/upload" className="btn btn-primary btn-lg">
              Upload a Paper <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
