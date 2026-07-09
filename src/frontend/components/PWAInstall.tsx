'use client';
import { useEffect, useState } from 'react';
import { Download, X } from 'lucide-react';

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

const DISMISSED_KEY = 'pwa_install_dismissed';

export function PWAInstall() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    // Register the service worker
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('/sw.js').catch(() => {
        // Registration failure shouldn't break the app — PWA features just won't be available
      });
    }

    // Don't show again this browser if the student already dismissed it
    let dismissed = false;
    try {
      dismissed = localStorage.getItem(DISMISSED_KEY) === '1';
    } catch {
      // localStorage unavailable — treat as not dismissed
    }

    function handleBeforeInstallPrompt(e: Event) {
      e.preventDefault();
      if (dismissed) return;
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      setVisible(true);
    }

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    return () => window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
  }, []);

  async function handleInstall() {
    if (!deferredPrompt) return;
    await deferredPrompt.prompt();
    await deferredPrompt.userChoice;
    setVisible(false);
    setDeferredPrompt(null);
  }

  function handleDismiss() {
    setVisible(false);
    try {
      localStorage.setItem(DISMISSED_KEY, '1');
    } catch {
      // localStorage unavailable — prompt may reappear next visit, not a big deal
    }
  }

  if (!visible) return null;

  return (
    <div
      style={{
        position: 'fixed', bottom: 20, left: 20, right: 20, maxWidth: 380,
        margin: '0 auto', zIndex: 200,
        background: 'var(--bg-secondary)', border: '1px solid var(--border)',
        borderRadius: 'var(--radius-lg)', padding: '16px 18px',
        boxShadow: 'var(--shadow-md)',
        display: 'flex', alignItems: 'center', gap: 12,
        animation: 'fade-up 0.3s ease',
      }}
    >
      <div style={{
        width: 40, height: 40, flexShrink: 0, borderRadius: 10,
        background: 'var(--gradient-brand)', display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}>
        <Download size={18} color="white" />
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <p style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-primary)' }}>Install AMCFOSS PYQ</p>
        <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Quick access before exams, works offline for saved papers.</p>
      </div>
      <button
        onClick={handleInstall}
        className="btn btn-primary btn-sm"
        style={{ flexShrink: 0 }}
      >
        Install
      </button>
      <button
        onClick={handleDismiss}
        aria-label="Dismiss"
        style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', flexShrink: 0, display: 'flex' }}
      >
        <X size={16} />
      </button>
    </div>
  );
}
