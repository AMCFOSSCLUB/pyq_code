'use client';
import { useState, FormEvent, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Search } from 'lucide-react';
import { SUBJECTS } from '@/frontend/data/subjects';

interface Props {
  defaultValue?: string;
  autoFocus?: boolean;
  large?: boolean;
}

export function SubjectSearchBar({ defaultValue = '', autoFocus = false, large = false }: Props) {
  const [query, setQuery] = useState(defaultValue);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const router = useRouter();
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const trimmedQuery = query.trim().toUpperCase();
  
  const suggestions = trimmedQuery
    ? SUBJECTS.filter((s) => s.code.includes(trimmedQuery) || s.title.toUpperCase().includes(trimmedQuery)).slice(0, 6)
    : [];

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!trimmedQuery) return;
    
    const exactTitleMatch = SUBJECTS.find(s => s.title.toUpperCase() === trimmedQuery);
    const finalCode = exactTitleMatch ? exactTitleMatch.code : trimmedQuery;

    setShowSuggestions(false);
    router.push(`/search?code=${encodeURIComponent(finalCode.toUpperCase())}`);
  }

  function handleSuggestionClick(subject: typeof SUBJECTS[0]) {
    setQuery(subject.code);
    setShowSuggestions(false);
    router.push(`/search?code=${encodeURIComponent(subject.code)}`);
  }

  return (
    <form onSubmit={handleSubmit} style={{ display: 'flex', gap: 10, alignItems: 'flex-start', width: '100%', position: 'relative' }}>
      <div style={{ position: 'relative', flex: 1 }} ref={wrapperRef}>
        <div style={{ position: 'relative' }}>
          <Search
            size={large ? 18 : 15}
            style={{ position: 'absolute', left: large ? 18 : 14, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)', pointerEvents: 'none', zIndex: 2 }}
          />
          <input
            id="subject-search-input"
            type="text"
            className="input"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setShowSuggestions(true);
            }}
            onFocus={() => setShowSuggestions(true)}
            placeholder={large ? 'Enter subject code or title — e.g. Data Structures' : 'Subject code or title…'}
            autoFocus={autoFocus}
            maxLength={100}
            autoComplete="off"
            style={{
              paddingLeft: large ? 50 : 40,
              height: large ? 56 : undefined,
              fontSize: large ? '1.05rem' : undefined,
              fontFamily: 'JetBrains Mono, monospace',
            }}
          />
        </div>
        {showSuggestions && suggestions.length > 0 && (
          <div
            style={{
              position: 'absolute',
              top: '100%',
              left: 0,
              right: 0,
              marginTop: 8,
              background: 'var(--bg-card)',
              border: '1px solid var(--border-color)',
              borderRadius: 8,
              zIndex: 100,
              boxShadow: '0 8px 32px rgba(0, 0, 0, 0.8)',
              overflow: 'hidden',
              display: 'flex',
              flexDirection: 'column',
            }}
          >
            {suggestions.map((subject, idx) => (
              <div
                key={subject.code}
                onClick={() => handleSuggestionClick(subject)}
                style={{
                  padding: '12px 16px',
                  cursor: 'pointer',
                  borderBottom: idx === suggestions.length - 1 ? 'none' : '1px solid var(--border-color)',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  background: 'transparent',
                  transition: 'background 0.2s',
                  color: '#ffffff', // bright color
                }}
                onMouseEnter={(e) => (e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)')}
                onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
              >
                <span style={{ fontWeight: 700, color: '#ffffff', fontFamily: 'JetBrains Mono, monospace' }}>{subject.code}</span>
                <span style={{ fontSize: '0.95rem', color: '#ffffff', textAlign: 'right', flex: 1, paddingLeft: 16 }}>{subject.title}</span>
              </div>
            ))}
          </div>
        )}
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
