'use client';
import Link from 'next/link';
import * as Icons from 'lucide-react';
import { Department } from '../utils/departments';

interface DepartmentCardProps {
  department: Department;
}

export function DepartmentCard({ department }: DepartmentCardProps) {
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
      onClick={handleCardClick}
    >
      <div
        style={{
          background: 'var(--bg-card)',
          border: '1px solid var(--border)',
          borderRadius: 'var(--radius-lg)',
          padding: '28px 24px',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'flex-start',
          gap: '16px',
          backdropFilter: 'blur(12px)',
          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          boxShadow: 'var(--shadow-sm)',
        }}
      >
        {/* Icon wrapper & subject count */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
          <div
            style={{
              width: '48px',
              height: '48px',
              borderRadius: '12px',
              background: 'var(--bg-secondary)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'all 0.3s ease',
              color: 'var(--text-secondary)',
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
              color: 'var(--text-primary)',
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
            color: 'var(--text-muted)',
            transition: 'color 0.2s ease',
          }}
        >
          <span>Explore Subjects</span>
          <Icons.ArrowRight size={13} style={{ transition: 'transform 0.2s ease' }} />
        </div>
      </div>
    </Link>
  );
}
