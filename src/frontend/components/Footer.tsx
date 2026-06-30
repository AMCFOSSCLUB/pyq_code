import Link from 'next/link';
import { BookOpen, Github, Heart, ExternalLink, Mail, MessageSquare, Globe } from 'lucide-react';

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
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 40, marginBottom: 40 }}>
          {/* Left Column: Identity */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
              <div style={{ width: 32, height: 32, background: 'var(--gradient-brand)', borderRadius: 7, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white' }}>
                <BookOpen size={16} />
              </div>
              <span style={{ fontWeight: 800, fontSize: '1rem', color: 'var(--text-primary)' }}>
                AMC<span className="gradient-text">FOSS</span> PYQ
              </span>
            </div>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', maxWidth: 260, lineHeight: 1.7, marginBottom: 16 }}>
              Built with <Heart size={12} style={{ color: 'var(--green-neon)', fill: 'var(--green-neon)', display: 'inline', verticalAlign: 'middle' }} /> by AMCFOSS. Open Source under MIT License.
            </p>
            {/* Pulsing System Status */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: '0.8rem', color: 'var(--text-secondary)', fontWeight: 500 }}>
              <span style={{
                position: 'relative', display: 'inline-flex', width: 8, height: 8, borderRadius: '50%',
                background: 'var(--green-neon)', boxShadow: '0 0 8px var(--green-neon)',
              }}>
                <span style={{
                  position: 'absolute', inset: 0, borderRadius: '50%', background: 'var(--green-neon)',
                  animation: 'pulse-glow 1.8s infinite ease-in-out',
                }} />
              </span>
              <span>System Status: <span style={{ color: 'var(--green-neon)', fontWeight: 700 }}>OPERATIONAL</span></span>
            </div>
          </div>

          {/* Middle Column: SYSTEM_NAV */}
          <div>
            <p style={{ fontSize: '0.75rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--text-muted)', marginBottom: 14, fontFamily: 'JetBrains Mono, monospace' }}>
              SYSTEM_NAV
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 9 }}>
              {[
                { href: '/', label: 'Home' },
                { href: '/search', label: 'Repository' },
                { href: '/search', label: 'Docs' },
                { href: '/upload', label: 'GitHub Contribution' },
              ].map(({ href, label }) => (
                <Link key={label} href={href} style={{ color: 'var(--text-muted)', fontSize: '0.875rem', textDecoration: 'none', transition: 'color 0.2s' }}
                  className="footer-link">
                  {label}
                </Link>
              ))}
            </div>
          </div>

          {/* Right Column: SECURE_UPLINK Terminal */}
          <div>
            <p style={{ fontSize: '0.75rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--text-muted)', marginBottom: 14, fontFamily: 'JetBrains Mono, monospace' }}>
              // SECURE_UPLINK
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 9 }}>
              <a href="mailto:foss@ch.amrita.edu"
                style={{ display: 'flex', alignItems: 'center', gap: 8, color: 'var(--text-muted)', fontSize: '0.875rem', transition: 'color 0.2s', textDecoration: 'none' }}
                className="footer-link">
                <Mail size={13} /> foss@ch.amrita.edu
              </a>
              <a href="https://github.com/amcfoss/pyq/issues" target="_blank" rel="noreferrer"
                style={{ display: 'flex', alignItems: 'center', gap: 8, color: 'var(--text-muted)', fontSize: '0.875rem', transition: 'color 0.2s', textDecoration: 'none' }}
                className="footer-link">
                <Github size={13} /> Report Issue / Bug Bounty <ExternalLink size={11} />
              </a>
              {/* Social Anchors */}
              <div style={{ display: 'flex', gap: 14, marginTop: 6, alignItems: 'center' }}>
                <a href="https://github.com/amcfoss" target="_blank" rel="noreferrer" title="GitHub"
                  style={{ color: 'var(--text-muted)', transition: 'color 0.2s' }} className="footer-link">
                  <Github size={16} />
                </a>
                <a href="https://linkedin.com/company/amcfoss" target="_blank" rel="noreferrer" title="LinkedIn"
                  style={{ color: 'var(--text-muted)', transition: 'color 0.2s' }} className="footer-link">
                  <Globe size={16} />
                </a>
                <a href="https://discord.gg/amcfoss" target="_blank" rel="noreferrer" title="Discord"
                  style={{ color: 'var(--text-muted)', transition: 'color 0.2s' }} className="footer-link">
                  <MessageSquare size={16} />
                </a>
              </div>
            </div>
          </div>
        </div>

        <div className="divider" style={{ marginBottom: 24, height: 1, background: 'var(--border)' }} />

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
          <p style={{ fontSize: '0.8125rem', color: 'var(--text-muted)' }}>
            © {year} AMCFOSS. Open Source under MIT License.
          </p>
          <p style={{ fontSize: '0.8125rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: 5 }}>
            Built with <Heart size={12} style={{ color: 'var(--green-neon)', fill: 'var(--green-neon)' }} /> by <a href="https://github.com/amcfoss" target="_blank" rel="noreferrer" style={{ color: 'var(--text-secondary)', fontWeight: 600, textDecoration: 'none' }}>AMCFOSS</a>
          </p>
        </div>
      </div>
    </footer>
  );
}
