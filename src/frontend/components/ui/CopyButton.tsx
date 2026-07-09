'use client';
import { useState } from 'react';
import { Copy, Check } from 'lucide-react';

interface CopyButtonProps {
  value: string;
  size?: number;
  label?: string; // optional accessible label
}

export function CopyButton({ value, size = 12, label }: CopyButtonProps) {
  const [copied, setCopied] = useState(false);

  async function handleCopy(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      // clipboard API unavailable — fail silently, nothing to recover
    }
  }

  return (
    <button
      type="button"
      onClick={handleCopy}
      title={label || `Copy ${value}`}
      aria-label={label || `Copy ${value}`}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'transparent',
        border: 'none',
        cursor: 'pointer',
        color: copied ? '#0E9300' : 'var(--text-muted)',
        padding: 2,
        transition: 'color 0.15s',
        flexShrink: 0,
      }}
    >
      {copied ? <Check size={size} /> : <Copy size={size} />}
    </button>
  );
}
