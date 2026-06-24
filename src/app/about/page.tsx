'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  ArrowLeft, Users, Trophy, BookOpen, Send, Github,
  Terminal, ShieldCheck, Mail, MapPin, ExternalLink, Globe,
} from 'lucide-react';

export default function AboutPage() {
  const [showPopup, setShowPopup] = useState(true);
  const [scrambleText, setScrambleText] = useState('Open Minds, Open Code, Endless Possibilities.');
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [submitted, setSubmitted] = useState(false);

  // Glitch/Scramble Effect on the Quote in the Popup
  useEffect(() => {
    if (!showPopup) return;
    const originalText = 'Open Minds, Open Code, Endless Possibilities.';
    const chars = '!@#$%^&*()_+~|{}[]:;?><,./';
    let iterations = 0;
    
    const interval = setInterval(() => {
      setScrambleText(originalText
        .split('')
        .map((char, index) => {
          if (char === ' ' || char === ',') return char;
          if (index < iterations) return originalText[index];
          return chars[Math.floor(Math.random() * chars.length)];
        })
        .join('')
      );
      
      iterations += 1;
      if (iterations >= originalText.length) {
        clearInterval(interval);
        setScrambleText(originalText);
      }
    }, 45);

    return () => clearInterval(interval);
  }, [showPopup]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => {
      setFormData({ name: '', email: '', message: '' });
      setSubmitted(false);
    }, 3000);
  };

  return (
    <div className="page-top section" style={{ minHeight: '100vh', position: 'relative', zIndex: 1 }}>
      <div className="container" style={{ maxWidth: 1000 }}>
        {/* Back navigation and Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 40, flexWrap: 'wrap', gap: 20 }}>
          <div>
            <Link href="/" className="btn btn-secondary btn-sm" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, fontFamily: 'JetBrains Mono, monospace', marginBottom: 16 }}>
              <ArrowLeft size={14} /> Back to Home
            </Link>
            <h1 className="scramble-text" style={{ fontSize: '2.5rem', fontFamily: 'JetBrains Mono, monospace', margin: 0 }}>
              About AMCFOSS
            </h1>
            <p style={{ color: 'var(--text-muted)', marginTop: 4 }}>
              The open-source engine powering the Amrita Chennai academic developer community.
            </p>
          </div>
          <button className="btn btn-secondary" onClick={() => setShowPopup(true)} style={{ fontFamily: 'JetBrains Mono, monospace' }}>
            <Terminal size={14} style={{ marginRight: 6 }} /> Re-engage Uplink Quote
          </button>
        </div>

        {/* ── Main Layout ─────────────────────────────── */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: 64 }}>
          
          {/* Wall of Fame */}
          <section id="wall-of-fame">
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 28, borderBottom: '1px solid var(--border)', paddingBottom: 12 }}>
              <Users size={22} style={{ color: 'var(--green-neon)' }} />
              <h2 style={{ fontSize: '1.4rem', fontFamily: 'JetBrains Mono, monospace', margin: 0 }}>Wall of Fame</h2>
            </div>
            
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 320px', gap: 40, alignItems: 'center', flexWrap: 'wrap' }} className="grid-responsive-about">
              <div>
                <p style={{ color: 'var(--text-secondary)', lineHeight: 1.7, marginBottom: 20 }}>
                  We celebrate the core minds driving software freedom at Amrita. The AMCFOSS Club is a collaborative network of developers, designers, and systems architects building the next generation of academic utilities.
                </p>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 20 }}>
                  <div className="glass-card" style={{ padding: 20, borderLeft: '3px solid var(--green-neon)' }}>
                    <h3 style={{ fontSize: '1rem', marginBottom: 4, fontFamily: 'JetBrains Mono, monospace' }}>Core Maintainers</h3>
                    <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>AMCFOSS Systems Group</p>
                  </div>
                  <div className="glass-card" style={{ padding: 20, borderLeft: '3px solid var(--green-neon)' }}>
                    <h3 style={{ fontSize: '1rem', marginBottom: 4, fontFamily: 'JetBrains Mono, monospace' }}>Contributors</h3>
                    <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>30+ Student Developers</p>
                  </div>
                </div>
              </div>
              <div style={{ position: 'relative', width: '100%', height: 210, borderRadius: 'var(--radius-xl)', overflow: 'hidden', border: '1px solid var(--border)' }}>
                <Image
                  src="/team_collaboration.png"
                  alt="AMCFOSS Team collaborating"
                  fill
                  style={{ objectFit: 'cover' }}
                />
              </div>
            </div>
          </section>

          {/* Hackathons */}
          <section id="hackathons">
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 28, borderBottom: '1px solid var(--border)', paddingBottom: 12 }}>
              <Trophy size={22} style={{ color: 'var(--green-neon)' }} />
              <h2 style={{ fontSize: '1.4rem', fontFamily: 'JetBrains Mono, monospace', margin: 0 }}>Hackathons</h2>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '320px 1fr', gap: 40, alignItems: 'center' }} className="grid-responsive-about">
              <div className="mobile-order-2" style={{ position: 'relative', width: '100%', height: 210, borderRadius: 'var(--radius-xl)', overflow: 'hidden', border: '1px solid var(--border)' }}>
                <Image
                  src="/team_hackathon.png"
                  alt="AMCFOSS Hackathon event"
                  fill
                  style={{ objectFit: 'cover' }}
                />
              </div>
              <div className="mobile-order-1">
                <h3 style={{ fontSize: '1.15rem', marginBottom: 8, fontFamily: 'JetBrains Mono, monospace', color: 'var(--text-primary)' }}>FOSS Hack & Local Sprints</h3>
                <p style={{ color: 'var(--text-secondary)', lineHeight: 1.7, marginBottom: 20 }}>
                  We host and coordinate intense coding sprints to build decentralized systems, academic APIs, and platform utilities. Our hackathons drive peer-to-peer building, testing, and deployment.
                </p>
                <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
                  <span className="badge badge-green">24-Hour Sprints</span>
                  <span className="badge badge-gray">Mentorship Tracks</span>
                  <span className="badge badge-gray">Open Source Grants</span>
                </div>
              </div>
            </div>
          </section>

          {/* Workshops */}
          <section id="workshops">
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 28, borderBottom: '1px solid var(--border)', paddingBottom: 12 }}>
              <BookOpen size={22} style={{ color: 'var(--green-neon)' }} />
              <h2 style={{ fontSize: '1.4rem', fontFamily: 'JetBrains Mono, monospace', margin: 0 }}>Workshops</h2>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 320px', gap: 40, alignItems: 'center' }} className="grid-responsive-about">
              <div>
                <h3 style={{ fontSize: '1.15rem', marginBottom: 8, fontFamily: 'JetBrains Mono, monospace', color: 'var(--text-primary)' }}>Systems & Open Source Literacy</h3>
                <p style={{ color: 'var(--text-secondary)', lineHeight: 1.7, marginBottom: 20 }}>
                  From Git workflows to hosting scalable Linux containers, we run hands-on technical workshops. We empower student builders to move from consumers of closed codebases to contributors of global open systems.
                </p>
                <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
                  <span className="badge badge-green">Git Mastery</span>
                  <span className="badge badge-gray">Docker Systems</span>
                  <span className="badge badge-gray">Next.js Pipelines</span>
                </div>
              </div>
              <div style={{ position: 'relative', width: '100%', height: 210, borderRadius: 'var(--radius-xl)', overflow: 'hidden', border: '1px solid var(--border)' }}>
                <Image
                  src="/team_workshop.png"
                  alt="AMCFOSS coding workshops"
                  fill
                  style={{ objectFit: 'cover' }}
                />
              </div>
            </div>
          </section>

          {/* Contact Us & Details */}
          <section id="contact">
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 40 }} className="grid-responsive-about">
              {/* Info panel */}
              <div className="glass-card" style={{ padding: 32 }}>
                <h2 style={{ fontSize: '1.3rem', fontFamily: 'JetBrains Mono, monospace', marginBottom: 24, borderBottom: '1px solid var(--border)', paddingBottom: 10 }}>
                  Contact Uplink
                </h2>
                <p style={{ color: 'var(--text-muted)', marginBottom: 24, fontSize: '0.9rem', lineHeight: 1.6 }}>
                  Reach out to the AMCFOSS maintainers with questions, feedback, or contribution partnerships.
                </p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <Mail size={16} style={{ color: 'var(--green-neon)' }} />
                    <span style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>foss@amrita.edu</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <MapPin size={16} style={{ color: 'var(--green-neon)' }} />
                    <span style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Amrita School of Engineering, Chennai</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <Globe size={16} style={{ color: 'var(--green-neon)' }} />
                    <a href="https://amcfoss.club" target="_blank" rel="noopener noreferrer" style={{ fontSize: '0.9rem', color: 'var(--success)', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 4 }}>
                      amcfoss.club <ExternalLink size={12} />
                    </a>
                  </div>
                </div>
              </div>

              {/* Form panel */}
              <div className="glass-card" style={{ padding: 32 }}>
                <h2 style={{ fontSize: '1.3rem', fontFamily: 'JetBrains Mono, monospace', marginBottom: 24, borderBottom: '1px solid var(--border)', paddingBottom: 10 }}>
                  Transmit Message
                </h2>
                {submitted ? (
                  <div style={{ textAlign: 'center', padding: '40px 0', animation: 'fade-in 0.3s' }}>
                    <ShieldCheck size={40} style={{ color: 'var(--success)', marginBottom: 12 }} />
                    <h3 style={{ fontSize: '1rem', fontFamily: 'JetBrains Mono, monospace', color: 'var(--success)' }}>Transmission Succeeded</h3>
                    <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: 4 }}>Message successfully saved to community feed buffer.</p>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                    <div>
                      <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: 6, fontFamily: 'JetBrains Mono, monospace' }}>NAME</label>
                      <input
                        type="text" required
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        style={{ width: '100%', padding: '10px 14px', background: 'var(--bg-secondary)', border: '1px solid var(--border)', borderRadius: 'var(--radius-sm)', color: 'white', fontSize: '0.9rem' }}
                      />
                    </div>
                    <div>
                      <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: 6, fontFamily: 'JetBrains Mono, monospace' }}>EMAIL</label>
                      <input
                        type="email" required
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        style={{ width: '100%', padding: '10px 14px', background: 'var(--bg-secondary)', border: '1px solid var(--border)', borderRadius: 'var(--radius-sm)', color: 'white', fontSize: '0.9rem' }}
                      />
                    </div>
                    <div>
                      <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: 6, fontFamily: 'JetBrains Mono, monospace' }}>MESSAGE BODY</label>
                      <textarea
                        required rows={3}
                        value={formData.message}
                        onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                        style={{ width: '100%', padding: '10px 14px', background: 'var(--bg-secondary)', border: '1px solid var(--border)', borderRadius: 'var(--radius-sm)', color: 'white', fontSize: '0.9rem', resize: 'vertical' }}
                      />
                    </div>
                    <button type="submit" className="btn btn-primary" style={{ width: '100%', fontFamily: 'JetBrains Mono, monospace', justifyContent: 'center' }}>
                      Send Transmission <Send size={13} style={{ marginLeft: 6 }} />
                    </button>
                  </form>
                )}
              </div>
            </div>
          </section>

        </div>

      </div>

      {/* ── Robotic/Electric Wave Quote Popup ───────── */}
      {showPopup && (
        <div style={{
          position: 'fixed', inset: 0, background: 'rgba(3,3,3,0.85)',
          backdropFilter: 'blur(12px)', zIndex: 1000,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          animation: 'fade-in 0.25s ease-out',
        }}>
          {/* Cybernetic Glitch Panel */}
          <div className="glass-card" style={{
            width: '90%', maxWidth: 540, padding: 32, position: 'relative',
            border: '2px solid var(--green-neon)',
            boxShadow: '0 0 30px rgba(14, 147, 0, 0.3)',
            animation: 'scale-up 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)',
            overflow: 'hidden',
          }}>
            {/* Cyber Scanline overlay */}
            <div style={{
              position: 'absolute', inset: 0,
              background: 'linear-gradient(rgba(18, 16, 16, 0) 50%, rgba(0, 0, 0, 0.25) 50%), linear-gradient(90deg, rgba(255, 0, 0, 0.06), rgba(0, 255, 0, 0.02), rgba(0, 0, 255, 0.06))',
              backgroundSize: '100% 4px, 6px 100%',
              pointerEvents: 'none',
              zIndex: 1,
            }} />

            {/* Glowing Laser corner ticks */}
            <div style={{ position: 'absolute', top: 8, left: 8, width: 14, height: 14, borderTop: '2px solid var(--green-neon)', borderLeft: '2px solid var(--green-neon)' }} />
            <div style={{ position: 'absolute', top: 8, right: 8, width: 14, height: 14, borderTop: '2px solid var(--green-neon)', borderRight: '2px solid var(--green-neon)' }} />
            <div style={{ position: 'absolute', bottom: 8, left: 8, width: 14, height: 14, borderBottom: '2px solid var(--green-neon)', borderLeft: '2px solid var(--green-neon)' }} />
            <div style={{ position: 'absolute', bottom: 8, right: 8, width: 14, height: 14, borderBottom: '2px solid var(--green-neon)', borderRight: '2px solid var(--green-neon)' }} />

            {/* Title */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 20 }}>
              <Terminal size={18} style={{ color: 'var(--green-neon)', animation: 'pulse 1s infinite' }} />
              <span style={{ fontSize: '0.8rem', letterSpacing: 2, fontFamily: 'JetBrains Mono, monospace', color: 'var(--green-neon)', fontWeight: 700 }}>
                UPLINK_TRANSMISSION_DECRYPTED
              </span>
            </div>

            {/* Quote with glitch effect */}
            <div style={{
              background: 'rgba(14, 147, 0, 0.04)',
              border: '1px solid rgba(14, 147, 0, 0.2)',
              borderRadius: 'var(--radius-md)',
              padding: 24,
              marginBottom: 24,
              textAlign: 'center',
              position: 'relative',
            }}>
              <h3 style={{
                fontSize: '1.25rem',
                color: '#fff',
                fontFamily: 'JetBrains Mono, monospace',
                margin: 0,
                lineHeight: 1.6,
                textShadow: '0 0 10px rgba(14, 147, 0, 0.6)',
              }}>
                "{scrambleText}"
              </h3>
            </div>

            {/* Animated Soundwave Visualizer in Waveform */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 3, height: 28, marginBottom: 24 }}>
              {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15].map((i) => (
                <div key={i} style={{
                  width: 3,
                  backgroundColor: 'var(--green-neon)',
                  borderRadius: 1.5,
                  height: '100%',
                  transform: 'scaleY(0.2)',
                  transformOrigin: 'center',
                  animation: `equalizer-wave 1.${i % 5 + 1}s ease-in-out infinite alternate`,
                }} />
              ))}
            </div>

            {/* Dismiss button */}
            <button
              className="btn btn-primary"
              onClick={() => setShowPopup(false)}
              style={{ width: '100%', justifyContent: 'center', fontFamily: 'JetBrains Mono, monospace', letterSpacing: 1 }}
            >
              Acknowledge Uplink
            </button>
          </div>
        </div>
      )}

      {/* Embedded CSS Animations */}
      <style jsx global>{`
        @keyframes equalizer-wave {
          0% { transform: scaleY(0.15); }
          100% { transform: scaleY(1); }
        }
        .grid-responsive-about {
          display: grid;
        }
        @media (max-width: 768px) {
          .grid-responsive-about {
            grid-template-columns: 1fr !important;
          }
          .mobile-order-1 {
            order: 1 !important;
          }
          .mobile-order-2 {
            order: 2 !important;
          }
        }
      `}</style>
    </div>
  );
}
