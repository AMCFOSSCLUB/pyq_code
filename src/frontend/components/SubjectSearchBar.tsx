'use client';
import { useState, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { Search } from 'lucide-react';

interface Props {
  defaultValue?: string;
  autoFocus?: boolean;
  large?: boolean;
}

export function SubjectSearchBar({ defaultValue = '', autoFocus = false, large = false }: Props) {
  const [code, setCode] = useState(defaultValue);
  const router = useRouter();

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    const trimmed = code.trim().toUpperCase();
    if (!trimmed) return;
    router.push(`/search?code=${encodeURIComponent(trimmed)}`);
  }

  return (
    <form onSubmit={handleSubmit} style={{ display: 'flex', gap: 10, alignItems: 'center', width: '100%' }}>
      <div style={{ position: 'relative', flex: 1 }}>
        <Search
          size={large ? 18 : 15}
          style={{ position: 'absolute', left: large ? 18 : 14, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)', pointerEvents: 'none' }}
        />
        <input
          id="subject-search-input"
          type="text"
          className="input"
          value={code}
          onChange={(e) => setCode(e.target.value.toUpperCase())}
          placeholder={large ? 'Enter subject code — e.g. 23CSE301' : 'Subject code…'}
          autoFocus={autoFocus}
          maxLength={10}
          style={{
            paddingLeft: large ? 50 : 40,
            height: large ? 56 : undefined,
            fontSize: large ? '1.05rem' : undefined,
            fontFamily: 'JetBrains Mono, monospace',
          }}
        />
      </div>
      <button
        id="subject-search-btn"
        type="submit"
        className={`btn btn-primary ${large ? 'btn-lg' : ''}`}
        style={large ? { height: 56, padding: '0 28px' } : {}}
      >
        <Search size={large ? 16 : 14} />
        {large ? 'Search Papers' : 'Search'}
      </button>
    </form>
  );
}
