'use client';
import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useSession, signIn, signOut } from 'next-auth/react';
import Image from 'next/image';
import {
  BookOpen, Upload, Activity, LayoutDashboard,
  LogIn, LogOut, Menu, X, Info, ChevronDown, ShieldCheck, GraduationCap, Bookmark,
} from 'lucide-react';

export function Navbar() {
  const { data: session } = useSession();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [logoHovered, setLogoHovered] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setUserMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', onClick);
    return () => document.removeEventListener('mousedown', onClick);
  }, []);

  const navLinks = [
    { href: '/search', label: 'Papers', icon: BookOpen, offset: 0 },
    { href: '/departments', label: 'Departments', icon: GraduationCap, offset: 6 },
    { href: '/upload', label: 'Upload', icon: Upload, offset: -4 },
    { href: '/activity', label: 'Activity', icon: Activity, offset: -6 },
    { href: '/about', label: 'About FOSS', icon: Info, offset: -3 },
  ];
  // offset values are small optical corrections (px) measured from the rendered
  // navbar, compensating for how much visual whitespace each icon shape has
  // baked into its own bounding box, so the gaps between pills look truly even.

  return (
    <>
      <nav
        style={{
          position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100,
          transition: 'background 0.3s, border-color 0.3s, backdrop-filter 0.3s',
          background: scrolled ? 'rgba(7,11,24,0.92)' : 'transparent',
          backdropFilter: scrolled ? 'blur(20px)' : 'none',
          borderBottom: `1px solid ${scrolled ? 'var(--border)' : 'transparent'}`,
        }}
      >
        <div className="container" style={{ display: 'flex', alignItems: 'center', height: 64, gap: 32 }}>
          {/* Logo */}
          <Link
            href="/"
            onMouseEnter={() => setLogoHovered(true)}
            onMouseLeave={() => setLogoHovered(false)}
            style={{
              position: 'relative',
              display: 'flex', alignItems: 'center', gap: 10,
              fontWeight: 800, fontSize: '1.1rem', color: 'var(--text-primary)', textDecoration: 'none',
              padding: '6px 10px', margin: '-6px -10px',
              borderRadius: 'var(--radius-md)',
              border: `1px solid ${logoHovered ? '#0E9300' : 'transparent'}`,
              boxShadow: logoHovered ? '0 0 0 3px rgba(14, 147, 0, 0.12)' : 'none',
              transition: 'border-color 0.2s, box-shadow 0.2s',
            }}
          >
            <div style={{
              width: 34, height: 34,
              borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center',
              flexShrink: 0, overflow: 'hidden'
            }}>
              <img src="/logo192.png" alt="AMCFOSS Logo" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            </div>
            <span>PYQ<span className="gradient-text"></span> </span>
          </Link>

          {/* Desktop nav links */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, flex: 1 }} className="nav-desktop">
            {navLinks.map(({ href, label, icon: Icon, offset }) => (
              <Link
                key={href} href={href}
                style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, padding: '8px 14px', borderRadius: 'var(--radius-full)', color: 'var(--text-secondary)', fontSize: '0.875rem', fontWeight: 500, textDecoration: 'none', transition: 'color 0.2s, background 0.2s', whiteSpace: 'nowrap' }}
                className="nav-link-item"
              >
                <span style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: 14, flexShrink: 0, marginLeft: offset }}>
                  <Icon size={14} />
                </span>
                {label}
              </Link>
            ))}
          </div>

          {/* Right side */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginLeft: 'auto' }}>
            {session ? (
              <div ref={menuRef} style={{ position: 'relative' }}>
                <button
                  id="user-menu-btn"
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  style={{
                    display: 'flex', alignItems: 'center', gap: 8, padding: '6px 12px',
                    background: 'var(--bg-card)', border: '1px solid var(--border)',
                    borderRadius: 'var(--radius-full)', color: 'var(--text-primary)',
                    cursor: 'pointer', transition: 'all 0.2s', fontSize: '0.875rem', fontWeight: 500,
                  }}
                >
                  <Image src={session.user?.image || ''} alt="" width={28} height={28} style={{ borderRadius: '50%' }} />
                  <span className="nav-username">{session.user?.name?.split(' ')[0]}</span>
                  <ChevronDown size={13} style={{ transition: 'transform 0.2s', transform: userMenuOpen ? 'rotate(180deg)' : 'none' }} />
                </button>

                {userMenuOpen && (
                  <div style={{
                    position: 'absolute', top: 'calc(100% + 8px)', right: 0,
                    background: 'var(--bg-secondary)', border: '1px solid var(--border)',
                    borderRadius: 'var(--radius-md)', padding: 6, minWidth: 190,
                    boxShadow: 'var(--shadow-md)', animation: 'fade-up 0.15s ease',
                  }}>
                    {[
                      { href: '/dashboard', label: 'My Dashboard', icon: LayoutDashboard },
                      { href: '/saved', label: 'Saved Papers', icon: Bookmark },
                      { href: '/admin', label: 'Admin Panel', icon: ShieldCheck },
                    ].map(({ href, label, icon: Icon }) => (
                      <Link key={href} href={href} onClick={() => setUserMenuOpen(false)} style={{
                        display: 'flex', alignItems: 'center', gap: 8, padding: '9px 12px',
                        borderRadius: 'var(--radius-sm)', color: 'var(--text-secondary)',
                        fontSize: '0.875rem', textDecoration: 'none', transition: 'background 0.15s, color 0.15s',
                      }} className="dropdown-item-link">
                        <Icon size={13} />{label}
                      </Link>
                    ))}
                    <div style={{ height: 1, background: 'var(--border)', margin: '4px 0' }} />
                    <button onClick={() => signOut()} style={{
                      display: 'flex', alignItems: 'center', gap: 8, padding: '9px 12px',
                      borderRadius: 'var(--radius-sm)', color: '#fca5a5',
                      fontSize: '0.875rem', background: 'transparent', border: 'none',
                      width: '100%', cursor: 'pointer', transition: 'background 0.15s',
                    }} className="dropdown-item-danger">
                      <LogOut size={13} />Sign Out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <button id="signin-btn" className="btn btn-primary btn-sm" onClick={() => signIn('github')}>
                <LogIn size={14} />Sign in with GitHub
              </button>
            )}

            {/* Mobile hamburger */}
            <button
              id="mobile-menu-btn"
              className="mobile-only"
              onClick={() => setMobileOpen(!mobileOpen)}
              style={{ background: 'transparent', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer', padding: 4 }}
            >
              {mobileOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {mobileOpen && (
          <div style={{ background: 'var(--bg-secondary)', borderTop: '1px solid var(--border)', padding: '8px 0' }}>
            {navLinks.map(({ href, label, icon: Icon }) => (
              <Link key={href} href={href} onClick={() => setMobileOpen(false)}
                style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '12px 24px', color: 'var(--text-secondary)', fontSize: '0.9rem', textDecoration: 'none' }}>
                <Icon size={15} />{label}
              </Link>
            ))}
            {session ? (
              <>
                <Link href="/dashboard" onClick={() => setMobileOpen(false)}
                  style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '12px 24px', color: 'var(--text-secondary)', fontSize: '0.9rem', textDecoration: 'none' }}>
                  <LayoutDashboard size={15} />Dashboard
                </Link>
                <button onClick={() => signOut()}
                  style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '12px 24px', color: '#fca5a5', fontSize: '0.9rem', background: 'transparent', border: 'none', width: '100%', cursor: 'pointer' }}>
                  <LogOut size={15} />Sign Out
                </button>
              </>
            ) : (
              <div style={{ padding: '8px 16px' }}>
                <button className="btn btn-primary" style={{ width: '100%', justifyContent: 'center' }} onClick={() => signIn('github')}>
                  <LogIn size={14} />Sign in with GitHub
                </button>
              </div>
            )}
          </div>
        )}
      </nav>

    </>
  );
}
