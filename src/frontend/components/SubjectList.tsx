'use client';
import { useState } from 'react';
import Link from 'next/link';
import { Star, ArrowRight } from 'lucide-react';
import { Subject } from '../utils/departments';

interface SubjectListProps {
  subjects: Subject[];
  favourites: string[];
  onToggleFavourite: (code: string) => void;
}

export function SubjectList({ subjects, favourites, onToggleFavourite }: SubjectListProps) {
  if (subjects.length === 0) {
    return (
      <div style={{ padding: '24px', color: 'var(--text-muted)', fontSize: '0.875rem', fontStyle: 'italic', textAlign: 'center' }}>
        No subjects listed for this selection.
      </div>
    );
  }

  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '16px', width: '100%' }}>
      {subjects.map((subject) => (
        <SubjectItem 
          key={subject.code} 
          subject={subject} 
          isFavourite={favourites.includes(subject.code)}
          onToggle={() => onToggleFavourite(subject.code)}
        />
      ))}
    </div>
  );
}

interface SubjectItemProps {
  subject: Subject;
  isFavourite: boolean;
  onToggle: () => void;
}

function SubjectItem({ subject, isFavourite, onToggle }: SubjectItemProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [isFocused, setIsFocused] = useState(false);

  const active = isHovered || isFocused;

  return (
    <div
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onFocus={() => setIsFocused(true)}
      onBlur={() => setIsFocused(false)}
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '16px',
        padding: '20px 24px',
        background: active ? 'var(--bg-card-hover)' : 'var(--bg-card)',
        border: `1px solid ${active ? '#0E9300' : 'var(--border)'}`,
        borderRadius: 'var(--radius-md)',
        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        transform: active ? 'translateY(-3px)' : 'none',
        boxShadow: active ? '0 8px 24px rgba(14, 147, 0, 0.08)' : 'none',
        position: 'relative',
      }}
    >
      {/* Top row: Code badge and Favourite button */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
        <span
          style={{
            fontFamily: 'JetBrains Mono, monospace',
            fontSize: '0.75rem',
            fontWeight: 600,
            padding: '4px 10px',
            borderRadius: '6px',
            background: active ? 'rgba(14, 147, 0, 0.12)' : 'var(--bg-secondary)',
            border: `1px solid ${active ? 'rgba(14, 147, 0, 0.3)' : 'var(--border)'}`,
            color: active ? '#0E9300' : 'var(--text-secondary)',
            transition: 'all 0.2s ease',
          }}
        >
          {subject.code}
        </span>

        {/* Favorite toggle star */}
        <button
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            onToggle();
          }}
          aria-label={isFavourite ? "Remove from favourites" : "Add to favourites"}
          style={{
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            padding: '6px',
            borderRadius: '50%',
            color: isFavourite ? '#fbbf24' : 'var(--text-muted)',
            transition: 'all 0.2s ease',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.color = isFavourite ? '#f59e0b' : '#fbbf24';
            e.currentTarget.style.background = 'rgba(251, 191, 36, 0.08)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.color = isFavourite ? '#fbbf24' : 'var(--text-muted)';
            e.currentTarget.style.background = 'none';
          }}
        >
          <Star size={17} fill={isFavourite ? '#fbbf24' : 'none'} />
        </button>
      </div>

      {/* Main Details */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        <h3
          style={{
            fontSize: '0.975rem',
            fontWeight: 700,
            color: 'var(--text-primary)',
            lineHeight: 1.3,
          }}
        >
          {subject.name}
        </h3>
        
        {/* Semester descriptors */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2px', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
          {subject.typicalSemester && (
            <span>Usually offered in Semester {subject.typicalSemester}</span>
          )}
          <span>Semester may vary by batch.</span>
        </div>
      </div>

      {/* View PYQs Button Link */}
      <Link
        href={`/search?code=${subject.code}`}
        style={{
          marginTop: 'auto',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          textDecoration: 'none',
          fontSize: '0.8rem',
          fontWeight: 600,
          color: active ? '#0E9300' : 'var(--text-secondary)',
          background: active ? 'rgba(14, 147, 0, 0.08)' : 'rgba(255, 255, 255, 0.02)',
          border: `1px solid ${active ? '#0E9300' : 'var(--border)'}`,
          padding: '10px 14px',
          borderRadius: 'var(--radius-md)',
          transition: 'all 0.2s ease',
          outline: 'none',
        }}
        onFocus={(e) => {
          setIsFocused(true);
        }}
        onBlur={(e) => {
          setIsFocused(false);
        }}
      >
        <span>View PYQs</span>
        <ArrowRight size={13} style={{ transform: active ? 'translateX(2px)' : 'none', transition: 'transform 0.2s ease' }} />
      </Link>
    </div>
  );
}
