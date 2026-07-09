'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  ArrowLeft, Users, Trophy, BookOpen, Send, Github,
  Terminal, ShieldCheck, Mail, MapPin, ExternalLink, Globe, Linkedin, Instagram
} from 'lucide-react';
import { Breadcrumb } from '@/frontend/components/ui/Breadcrumb';

function UplinkPopup({ onClose }: { onClose: () => void }) {
  const [scrambleText, setScrambleText] = useState('Open Minds, Open Code, Endless Possibilities.');

  // Glitch/Scramble Effect on the Quote in the Popup
  useEffect(() => {
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
  }, []);

  return (
    <div style={{
      position: 'fixed', inset: 0, background: 'rgba(3,3,3,0.85)',
      backdropFilter: 'blur(12px)', zIndex: 1000,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      animation: 'fade-in 0.25s ease-out',
    }}>
      {/* Cybernetic Glitch Panel */}
      <div className="glass-card" style={{
        width: '90%', maxWidth: 540, padding: 32, position: 'relative',
        border: '2px solid var(--green-primary)',
        boxShadow: '0 0 30px rgba(18, 205, 0, 0.3)',
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
        <div style={{ position: 'absolute', top: 8, left: 8, width: 14, height: 14, borderTop: '2px solid var(--green-primary)', borderLeft: '2px solid var(--green-primary)' }} />
        <div style={{ position: 'absolute', top: 8, right: 8, width: 14, height: 14, borderTop: '2px solid var(--green-primary)', borderRight: '2px solid var(--green-primary)' }} />
        <div style={{ position: 'absolute', bottom: 8, left: 8, width: 14, height: 14, borderBottom: '2px solid var(--green-primary)', borderLeft: '2px solid var(--green-primary)' }} />
        <div style={{ position: 'absolute', bottom: 8, right: 8, width: 14, height: 14, borderBottom: '2px solid var(--green-primary)', borderRight: '2px solid var(--green-primary)' }} />

        {/* Title */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 20 }}>
          <Terminal size={18} style={{ color: 'var(--green-primary)', animation: 'pulse 1s infinite' }} />
          <span style={{ fontSize: '0.8rem', letterSpacing: 2, fontFamily: 'JetBrains Mono, monospace', color: 'var(--green-primary)', fontWeight: 700 }}>
            UPLINK_TRANSMISSION_DECRYPTED
          </span>
        </div>

        {/* Quote with glitch effect */}
        <div style={{
          background: 'rgba(18, 205, 0, 0.04)',
          border: '1px solid rgba(18, 205, 0, 0.2)',
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
            textShadow: '0 0 10px rgba(18, 205, 0, 0.6)',
          }}>
            &quot;{scrambleText}&quot;
          </h3>
        </div>

        {/* Animated Soundwave Visualizer in Waveform */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 3, height: 28, marginBottom: 24 }}>
          {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15].map((i) => (
            <div key={i} style={{
              width: 3,
              backgroundColor: 'var(--green-primary)',
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
          onClick={onClose}
          style={{ width: '100%', justifyContent: 'center', fontFamily: 'JetBrains Mono, monospace', letterSpacing: 1 }}
        >
          Acknowledge Uplink
        </button>
      </div>
    </div>
  );
}

export default function AboutPage() {
  const [showPopup, setShowPopup] = useState(true);
  const [activeCard, setActiveCard] = useState<number | null>(null);

  const handleCardClick = (index: number) => {
    setActiveCard(index);
    setTimeout(() => setActiveCard(null), 400); // momentary flash effect
  };

  const committeeMembers = [
    { name: 'Sreenandha', role: 'President' },
    { name: 'Mithra', role: 'Vice President' },
    { name: 'Ruhan', role: 'Secretary' },
    { name: 'Ansika Pandey', role: 'Joint Secretary' },
    { name: 'Annu ', role: 'Office Bearer' },
    { name: 'Akshitha', role: 'Office Bearer' },
    { name: 'Praveen G', role: 'Office Bearer' },
    { name: 'Bharadwaj', role: 'Office Bearer' },
    

  ];

  return (
    <div className="page-top section" style={{ minHeight: '100vh', position: 'relative', zIndex: 1 }}>
      <div className="container" style={{ maxWidth: 1000 }}>
        <Breadcrumb items={[{ label: 'Home', href: '/' }, { label: 'About FOSS' }]} />
        {/* Back navigation and Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 40, flexWrap: 'wrap', gap: 20 }}>
          <div>
            <Link href="/" className="btn btn-secondary btn-sm" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, fontFamily: 'JetBrains Mono, monospace', marginBottom: 16 }}>
              <ArrowLeft size={14} /> Back to Home
            </Link>
            <h1 className="scramble-text" style={{ fontSize: '2.5rem', fontFamily: 'JetBrains Mono, monospace', margin: 0 }}>
              About AMCFOSS
            </h1>
          </div>
          <button className="btn btn-secondary" onClick={() => setShowPopup(true)} style={{ fontFamily: 'JetBrains Mono, monospace' }}>
            <Terminal size={14} style={{ marginRight: 6 }} /> Re-engage Uplink Quote
          </button>
        </div>

        {/* Mission Statement Header */}
        <div style={{ marginBottom: 48, padding: 32, borderRadius: 'var(--radius-lg)', background: 'linear-gradient(135deg, rgba(18, 205, 0,0.1), rgba(124,58,237,0.05))', border: '1px solid rgba(18, 205, 0,0.3)', boxShadow: '0 4px 30px rgba(0, 0, 0, 0.1)', backdropFilter: 'blur(5px)', display: 'flex', flexDirection: 'column', gap: 16 }}>
          <h2 style={{ fontSize: '1.4rem', fontFamily: 'JetBrains Mono, monospace', margin: 0, color: 'var(--green-primary)' }}>Our Mission</h2>
          <p style={{ color: 'var(--text-primary)', lineHeight: 1.6, fontSize: '1.15rem', fontStyle: 'italic', margin: 0 }}>
            &quot;Building freedom through open source. Join AMC FOSS Club to collaborate, innovate, and contribute to real-world software that shapes the future.&quot;
          </p>
        </div>

        {/* ── Main Layout ─────────────────────────────── */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: 64 }}>
          
          {/* Core Committee Dashboard */}
          <section id="core-committee">
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 28, borderBottom: '1px solid var(--border)', paddingBottom: 12 }}>
              <Users size={22} style={{ color: 'var(--green-primary)' }} />
              <h2 style={{ fontSize: '1.4rem', fontFamily: 'JetBrains Mono, monospace', margin: 0 }}>Core Committee Members</h2>
            </div>
            
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 20 }}>
              {committeeMembers.map((member, index) => (
                <div 
                  key={index}
                  onClick={() => handleCardClick(index)}
                  style={{
                    padding: 24,
                    background: 'rgba(10, 10, 10, 0.4)',
                    backdropFilter: 'blur(16px)',
                    WebkitBackdropFilter: 'blur(16px)',
                    border: activeCard === index ? '1px solid rgba(18, 205, 0, 0.8)' : '1px solid rgba(255, 255, 255, 0.05)',
                    borderRadius: 'var(--radius-md)',
                    boxShadow: activeCard === index ? '0 0 20px rgba(18, 205, 0, 0.4), inset 0 0 10px rgba(18, 205, 0, 0.1)' : '0 4px 30px rgba(0, 0, 0, 0.2)',
                    transition: 'all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1)',
                    cursor: 'pointer',
                    transform: activeCard === index ? 'scale(1.02)' : 'scale(1)',
                    position: 'relative',
                    overflow: 'hidden'
                  }}
                  className="glass-panel"
                >
                  <div style={{
                    position: 'absolute', inset: 0,
                    background: 'radial-gradient(circle at top right, rgba(18, 205, 0, 0.15) 0%, transparent 60%)',
                    opacity: activeCard === index ? 1 : 0.3,
                    transition: 'opacity 0.3s ease',
                    pointerEvents: 'none'
                  }} />
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 16, position: 'relative', zIndex: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <Terminal size={14} style={{ color: 'var(--green-primary)' }} />
                        <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontFamily: 'JetBrains Mono, monospace', letterSpacing: 1 }}>USR_{String(index + 1).padStart(3, '0')}</span>
                      </div>
                      <div style={{ width: 8, height: 8, borderRadius: '50%', backgroundColor: activeCard === index ? 'var(--green-primary)' : 'rgba(255,255,255,0.1)', boxShadow: activeCard === index ? '0 0 10px var(--green-primary)' : 'none', transition: 'all 0.3s ease' }} />
                    </div>
                    <div>
                      <h3 style={{ fontSize: '1.15rem', margin: '0 0 8px 0', color: '#fff', fontFamily: 'JetBrains Mono, monospace', fontWeight: 600, letterSpacing: 0.5, textTransform: 'uppercase', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        &gt; {member.name}
                      </h3>
                      <div style={{ display: 'inline-flex', alignItems: 'center', background: 'rgba(18, 205, 0, 0.05)', border: '1px solid rgba(18, 205, 0, 0.2)', padding: '4px 10px', borderRadius: '4px' }}>
                        <p style={{ fontSize: '0.75rem', color: 'var(--green-primary)', margin: 0, fontFamily: 'Inter, sans-serif', fontWeight: 500, letterSpacing: 0.5 }}>
                          {member.role}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Wall of Fame */}
          <section id="wall-of-fame">
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 28, borderBottom: '1px solid var(--border)', paddingBottom: 12 }}>
              <Users size={22} style={{ color: 'var(--green-primary)' }} />
              <h2 style={{ fontSize: '1.4rem', fontFamily: 'JetBrains Mono, monospace', margin: 0 }}>Wall of Fame</h2>
            </div>
            
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 320px', gap: 40, alignItems: 'center', flexWrap: 'wrap' }} className="grid-responsive-about">
              <div>
                <p style={{ color: 'var(--text-secondary)', lineHeight: 1.7, marginBottom: 20 }}>
                  We celebrate the core minds driving software freedom at Amrita. The AMCFOSS Club is a collaborative network of developers, designers, and systems architects building the next generation of academic utilities.
                </p>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 20 }}>
                  <div className="glass-card" style={{ padding: 20, borderLeft: '3px solid var(--green-primary)' }}>
                    <h3 style={{ fontSize: '1rem', marginBottom: 4, fontFamily: 'JetBrains Mono, monospace' }}>Core Maintainers</h3>
                    <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>AMCFOSS Systems Group</p>
                  </div>
                  <div className="glass-card" style={{ padding: 20, borderLeft: '3px solid var(--green-primary)' }}>
                    <h3 style={{ fontSize: '1rem', marginBottom: 4, fontFamily: 'JetBrains Mono, monospace' }}>Contributors</h3>
                    <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>40+ Student Developers</p>
                  </div>
                </div>
              </div>
              <div style={{ position: 'relative', width: '100%', height: 210, borderRadius: 'var(--radius-xl)', overflow: 'hidden', border: '1px solid var(--border)' }}>
                <Image
                  src="/assets/images/club-group-photo-1.jpg"
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
              <Trophy size={22} style={{ color: 'var(--green-primary)' }} />
              <h2 style={{ fontSize: '1.4rem', fontFamily: 'JetBrains Mono, monospace', margin: 0 }}>Hackathons</h2>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '320px 1fr', gap: 40, alignItems: 'center' }} className="grid-responsive-about">
              <div className="mobile-order-2" style={{ position: 'relative', width: '100%', height: 210, borderRadius: 'var(--radius-xl)', overflow: 'hidden', border: '1px solid var(--border)' }}>
                <Image
                  src="/assets/images/club-group-photo-2.jpg"
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
              <BookOpen size={22} style={{ color: 'var(--green-primary)' }} />
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
                  src="/assets/images/club-group-photo-3.jpg"
                  alt="AMCFOSS coding workshops"
                  fill
                  style={{ objectFit: 'cover' }}
                />
              </div>
            </div>

            {/* Fourth Wing Workshop */}
            <div style={{ display: 'grid', gridTemplateColumns: '320px 1fr', gap: 40, alignItems: 'center', marginTop: 40 }} className="grid-responsive-about">
              <div className="mobile-order-2" style={{ position: 'relative', width: '100%', height: 210, borderRadius: 'var(--radius-xl)', overflow: 'hidden', border: '1px solid var(--border)' }}>
                <Image
                  src="/assets/images/fw.jpeg"
                  alt="Fourth Wing Workshop"
                  fill
                  style={{ objectFit: 'cover' }}
                />
              </div>
              <div className="mobile-order-1">
                <h3 style={{ fontSize: '1.15rem', marginBottom: 8, fontFamily: 'JetBrains Mono, monospace', color: 'var(--text-primary)' }}>&quot;Fourth Wing&quot; Open Source Initiative</h3>
                <p style={{ color: 'var(--text-secondary)', lineHeight: 1.7, marginBottom: 20 }}>
                  Our flagship workshop, &quot;Fourth Wing&quot;, successfully engaged over 40 enthusiastic students. We guided them through the fundamentals of collaborative development, helping them learn, discover, and actively contribute to the vast ecosystem of open source software.
                </p>
                <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
                  <span className="badge badge-green">40+ Students Engaged</span>
                  <span className="badge badge-gray">Open Source Discovery</span>
                  <span className="badge badge-gray">Hands-on Learning</span>
                </div>
              </div>
            </div>
          </section>

          {/* Contact Us & Details */}
          <section id="contact">
            <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: 40, maxWidth: 600, margin: '0 auto' }}>
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
                    <Mail size={16} style={{ color: 'var(--green-primary)' }} />
                    <span style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>amcfoss@amrita.edu</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <MapPin size={16} style={{ color: 'var(--green-primary)' }} />
                    <span style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Amrita School of Engineering, Chennai</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <Globe size={16} style={{ color: 'var(--green-primary)' }} />
                    <a href="https://amcfoss.vercel.app" target="_blank" rel="noopener noreferrer" style={{ fontSize: '0.9rem', color: 'var(--success)', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 4 }}>
                      amcfoss <ExternalLink size={12} />
                    </a>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <Linkedin size={16} style={{ color: 'var(--green-primary)' }} />
                    <a href="https://www.linkedin.com/company/amcfoss/" target="_blank" rel="noopener noreferrer" style={{ fontSize: '0.9rem', color: 'var(--text-primary)', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 4 }}>
                      <strong>LinkedIn Profile</strong> <ExternalLink size={12} />
                    </a>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <Instagram size={16} style={{ color: 'var(--green-primary)' }} />
                    <a href="https://www.instagram.com/amcfoss?igsh=M2tucHV0dzYwbjhq" target="_blank" rel="noopener noreferrer" style={{ fontSize: '0.9rem', color: 'var(--text-primary)', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 4 }}>
                      Do follow us on Instagram <ExternalLink size={12} />
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </section>

        </div>

      </div>

      {/* ── Robotic/Electric Wave Quote Popup ───────── */}
      {showPopup && (
        <UplinkPopup onClose={() => setShowPopup(false)} />
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
