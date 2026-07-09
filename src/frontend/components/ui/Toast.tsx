'use client';
import { useState, useEffect } from 'react';
import { CheckCircle, XCircle, Info, X } from 'lucide-react';

type ToastType = 'success' | 'error' | 'info';
interface Toast { id: number; message: string; type: ToastType; }

// ── Global imperative toast ─────────────────────────────────────────────────
// A simple event bus so any component can call toast() without needing context/drilling.
let _counter = 0;
type ToastListener = (toasts: Toast[]) => void;
let _toasts: Toast[] = [];
const _listeners: Set<ToastListener> = new Set();

function notify() {
  _listeners.forEach((fn) => fn([..._toasts]));
}

export function toast(message: string, type: ToastType = 'info') {
  const id = ++_counter;
  _toasts = [..._toasts, { id, message, type }];
  notify();
  setTimeout(() => {
    _toasts = _toasts.filter((t) => t.id !== id);
    notify();
  }, 4500);
}

function dismissToast(id: number) {
  _toasts = _toasts.filter((t) => t.id !== id);
  notify();
}

export function ToastContainer() {
  const [toasts, setToasts] = useState<Toast[]>([]);

  useEffect(() => {
    _listeners.add(setToasts);
    return () => { _listeners.delete(setToasts); };
  }, []);

  return (
    <div className="toast-container">
      {toasts.map((t) => (
        <div key={t.id} className={`toast toast-${t.type}`}>
          {t.type === 'success' && <CheckCircle size={16} />}
          {t.type === 'error'   && <XCircle size={16} />}
          {t.type === 'info'    && <Info size={16} />}
          <span style={{ flex: 1 }}>{t.message}</span>
          <button onClick={() => dismissToast(t.id)} style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: 'inherit', padding: 2, display: 'flex' }}>
            <X size={14} />
          </button>
        </div>
      ))}
    </div>
  );
}
