import Link from 'next/link';
import { BookOpen, Github, Heart, ExternalLink } from 'lucide-react';

export function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer style={{
      background: 'var(--bg-secondary)',
      borderTop: '1px solid var(--border)',
      padding: '48px 0 28px',
      position: 'relative', zIndex: 1,
    }}>
      <div className="container">
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 40, marginBottom: 40 }}>
          {/* Brand */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
              <div style={{ width: 32, height: 32, background: 'var(--gradient-brand)', borderRadius: 7, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white' }}>
                <BookOpen size={16} />
              </div>
              <span style={{ fontWeight: 800, fontSize: '1rem', color: 'var(--text-primary)' }}>
                AMC<span className="gradient-text">FOSS</span> PYQ
              </span>
            </div>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', maxWidth: 240, lineHeight: 1.7 }}>
              Open-source repository of previous year question papers for Amrita Chennai students.
            </p>
          </div>

          {/* Links */}
          <div>
            <p style={{ fontSize: '0.75rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--text-muted)', marginBottom: 14 }}>
              Platform
            </p>
            {[
              { href: '/search', label: 'Browse Papers' },
              { href: '/upload', label: 'Upload Paper' },
              { href: '/activity', label: 'Activity Feed' },
              { href: '/dashboard', label: 'My Dashboard' },
            ].map(({ href, label }) => (
              <Link key={href} href={href} style={{ display: 'block', color: 'var(--text-muted)', fontSize: '0.875rem', marginBottom: 9, transition: 'color 0.2s' }}
                className="footer-link">
                {label}
              </Link>
            ))}
          </div>

          {/* Community */}
          <div>
            <p style={{ fontSize: '0.75rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--text-muted)', marginBottom: 14 }}>
              Community
            </p>
            <a href="https://github.com/amcfoss" target="_blank" rel="noreferrer"
              style={{ display: 'flex', alignItems: 'center', gap: 8, color: 'var(--text-muted)', fontSize: '0.875rem', marginBottom: 9, transition: 'color 0.2s' }}
              className="footer-link">
              <Github size={13} /> AMCFOSS on GitHub <ExternalLink size={11} />
            </a>
          </div>
        </div>

        <div className="divider" style={{ marginBottom: 24 }} />

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
          <p style={{ fontSize: '0.8125rem', color: 'var(--text-muted)' }}>
            © {year} AMCFOSS PYQ. Open source under MIT License.
          </p>
          <p style={{ fontSize: '0.8125rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: 5 }}>
            Made with <Heart size={12} style={{ color: 'var(--violet-light)' }} /> by AMCFOSS, Amrita Chennai
          </p>
        </div>
      </div>

    </footer>
  );
}
