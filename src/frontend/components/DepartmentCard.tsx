'use client';
import { useState } from 'react';
import Link from 'next/link';
import * as Icons from 'lucide-react';
import { Department } from '../utils/departments';

interface DepartmentCardProps {
  department: Department;
}

export function DepartmentCard({ department }: DepartmentCardProps) {
  const [isFocused, setIsFocused] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const active = isHovered || isFocused;

  // Dynamically resolve the icon from Lucide React
  // Fallback to GraduationCap if icon not found
  const IconComponent = (Icons as any)[department.icon] || Icons.GraduationCap;

  const handleCardClick = () => {
    try {
      const recent = localStorage.getItem('recent_departments');
      let recentIds: string[] = recent ? JSON.parse(recent) : [];
      recentIds = recentIds.filter((id) => id !== department.id);
      recentIds.unshift(department.id);
      recentIds = recentIds.slice(0, 4); // Store last 4
      localStorage.setItem('recent_departments', JSON.stringify(recentIds));
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <Link
      href={`/departments/${department.id}`}
      style={{ textDecoration: 'none', color: 'inherit', outline: 'none' }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onFocus={() => setIsFocused(true)}
      onBlur={() => setIsFocused(false)}
      onClick={handleCardClick}
    >
      <div
        style={{
          background: active ? 'var(--bg-card-hover)' : 'var(--bg-card)',
          border: `1px solid ${active ? '#0E9300' : 'var(--border)'}`,
          borderRadius: 'var(--radius-lg)',
          padding: '28px 24px',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'flex-start',
          gap: '16px',
          backdropFilter: 'blur(12px)',
          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          transform: active ? 'translateY(-6px)' : 'none',
          boxShadow: active 
            ? '0 12px 30px rgba(14, 147, 0, 0.15)' 
            : 'var(--shadow-sm)',
        }}
      >
        {/* Icon wrapper & subject count */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
          <div
            style={{
              width: '48px',
              height: '48px',
              borderRadius: '12px',
              background: active ? 'rgba(14, 147, 0, 0.12)' : 'var(--bg-secondary)',
              border: `1px solid ${active ? 'rgba(14, 147, 0, 0.3)' : 'var(--border)'}`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'all 0.3s ease',
              color: active ? '#0E9300' : 'var(--text-secondary)',
            }}
          >
            <IconComponent size={22} />
          </div>

          <span
            style={{
              fontSize: '0.75rem',
              fontWeight: 600,
              color: '#0E9300',
              background: 'rgba(14, 147, 0, 0.08)',
              padding: '4px 10px',
              borderRadius: '8px',
              border: '1px solid rgba(14, 147, 0, 0.15)',
              fontFamily: 'system-ui, -apple-system, sans-serif',
            }}
          >
            {department.subjects.length} Subjects
          </span>
        </div>

        {/* Text Details */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', width: '100%' }}>
          <h3
            style={{
              fontSize: '1.15rem',
              fontWeight: 700,
              color: active ? '#0E9300' : 'var(--text-primary)',
              transition: 'color 0.2s ease',
              lineHeight: 1.3,
            }}
          >
            {department.name}
          </h3>
          <p
            style={{
              fontSize: '0.875rem',
              color: 'var(--text-secondary)',
              lineHeight: 1.6,
            }}
          >
            {department.description}
          </p>
        </div>

        {/* View Subjects Button Indicator */}
        <div
          style={{
            marginTop: 'auto',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            fontSize: '0.8125rem',
            fontWeight: 600,
            color: active ? '#0E9300' : 'var(--text-muted)',
            transition: 'color 0.2s ease',
          }}
        >
          <span>Explore Subjects</span>
          <Icons.ArrowRight size={13} style={{ transform: active ? 'translateX(4px)' : 'none', transition: 'transform 0.2s ease' }} />
        </div>
      </div>
    </Link>
  );
}
