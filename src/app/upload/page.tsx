import { UploadForm } from '@/frontend/components/UploadForm';
import { Shield, CheckCircle } from 'lucide-react';
import type { Metadata } from 'next';

export const metadata: Metadata = { title: 'Upload Paper' };

const RULES = [
  { icon: CheckCircle, text: 'PDF files only, max 2 MB' },
  { icon: CheckCircle, text: 'Must be an actual Amrita Chennai exam paper' },
  { icon: CheckCircle, text: 'Filename is auto-generated from subject code + date' },
  { icon: CheckCircle, text: 'GitHub account required (for traceability)' },
];

export default function UploadPage() {
  return (
    <div className="page-top section">
      <div className="container" style={{ maxWidth: 860 }}>
        <div style={{ marginBottom: 40 }}>
          <h1 style={{ marginBottom: 8 }}>Upload a <span className="gradient-text">Question Paper</span></h1>
          <p style={{ color: 'var(--text-muted)' }}>Contribute to the community repository. Papers are stored on GitHub and available to all students instantly.</p>
        </div>

        <div className="upload-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: 40, alignItems: 'start' }}>
          {/* Upload form */}
          <div className="glass-card" style={{ padding: 32 }}>
            <UploadForm />
          </div>

          {/* Sidebar info */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            {/* Guidelines */}
            <div className="glass-card" style={{ padding: 24 }}>
              <h3 style={{ fontSize: '0.95rem', marginBottom: 16, display: 'flex', alignItems: 'center', gap: 8 }}>
                <Shield size={16} style={{ color: 'var(--violet-light)' }} /> Upload Guidelines
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {RULES.map(({ icon: Icon, text }) => (
                  <div key={text} style={{ display: 'flex', alignItems: 'flex-start', gap: 9 }}>
                    <Icon size={13} style={{ color: 'var(--success)', marginTop: 2, flexShrink: 0 }} />
                    <p style={{ fontSize: '0.84rem', color: 'var(--text-muted)', lineHeight: 1.6 }}>{text}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
