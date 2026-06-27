'use client';
import { useState, useEffect } from 'react';
import { DEPARTMENTS, Department, Subject } from '@/frontend/utils/departments';
import { DepartmentCard } from '@/frontend/components/DepartmentCard';
import { GraduationCap, Search, X, ChevronRight, Clock, Trash2, BookOpen } from 'lucide-react';
import Link from 'next/link';

export default function DepartmentsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDomain, setSelectedDomain] = useState('All');
  const [recentDepts, setRecentDepts] = useState<Department[]>([]);

  useEffect(() => {
    try {
      const recent = localStorage.getItem('recent_departments');
      if (recent) {
        const recentIds: string[] = JSON.parse(recent);
        const matched = recentIds
          .map(id => DEPARTMENTS.find(d => d.id === id))
          .filter(Boolean) as Department[];
        setRecentDepts(matched);
      }
    } catch (e) {
      console.error(e);
    }
  }, []);

  const clearRecentDepts = () => {
    try {
      localStorage.removeItem('recent_departments');
      setRecentDepts([]);
    } catch (e) {
      console.error(e);
    }
  };

  const domains = ['All', 'Computer Science', 'Electronics', 'Mechanical', 'Robotics'];

  const filterDepartmentsByDomain = (deptId: string, domain: string): boolean => {
    if (domain === 'All') return true;
    if (domain === 'Computer Science') {
      return ['cse', 'cys', 'cse-ai', 'aids', 'cce', 'rai'].includes(deptId);
    }
    if (domain === 'Electronics') {
      return ['ece', 'cce'].includes(deptId);
    }
    if (domain === 'Mechanical') {
      return ['mech', 'rai', 'are'].includes(deptId);
    }
    if (domain === 'Robotics') {
      return ['rai', 'are', 'cse-ai'].includes(deptId);
    }
    return true;
  };

  // Find matching departments
  const filteredDepartments = DEPARTMENTS.filter(dept => {
    const matchesDomain = filterDepartmentsByDomain(dept.id, selectedDomain);
    const matchesSearch = searchQuery === '' || 
      dept.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      dept.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesDomain && matchesSearch;
  });

  // Find matching subjects across all departments
  interface MatchedSubject {
    subject: Subject;
    department: Department;
  }
  
  const matchedSubjects: MatchedSubject[] = [];
  if (searchQuery.trim() !== '') {
    DEPARTMENTS.forEach(dept => {
      dept.subjects.forEach(sub => {
        if (
          sub.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
          sub.name.toLowerCase().includes(searchQuery.toLowerCase())
        ) {
          matchedSubjects.push({ subject: sub, department: dept });
        }
      });
    });
  }

  const handleRecentClick = (deptId: string) => {
    try {
      const recent = localStorage.getItem('recent_departments');
      let recentIds: string[] = recent ? JSON.parse(recent) : [];
      recentIds = recentIds.filter((id) => id !== deptId);
      recentIds.unshift(deptId);
      localStorage.setItem('recent_departments', JSON.stringify(recentIds));
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="container page-top section-sm">
      <style dangerouslySetInnerHTML={{ __html: `
        .departments-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 24px;
        }
        .subject-results-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 16px;
        }
        @media (max-width: 992px) {
          .departments-grid {
            grid-template-columns: repeat(2, 1fr);
          }
          .subject-results-grid {
            grid-template-columns: 1fr;
          }
        }
        @media (max-width: 640px) {
          .departments-grid {
            grid-template-columns: 1fr;
          }
        }
      `}} />

      {/* Breadcrumbs */}
      <nav 
        aria-label="Breadcrumb"
        style={{ 
          display: 'flex', 
          alignItems: 'center', 
          gap: '8px', 
          fontSize: '0.85rem', 
          color: 'var(--text-secondary)',
          marginBottom: '32px'
        }}
      >
        <Link href="/" style={{ color: 'var(--text-secondary)', transition: 'color 0.2s' }} onMouseEnter={(e) => e.currentTarget.style.color = '#0E9300'} onMouseLeave={(e) => e.currentTarget.style.color = 'var(--text-secondary)'}>
          Home
        </Link>
        <ChevronRight size={14} style={{ color: 'var(--text-muted)' }} />
        <span style={{ color: '#0E9300', fontWeight: 600 }}>Departments</span>
      </nav>

      {/* Header section with green branding and lucide icons */}
      <div 
        style={{ 
          textAlign: 'center', 
          maxWidth: '700px', 
          margin: '0 auto 40px', 
          display: 'flex', 
          flexDirection: 'column', 
          alignItems: 'center', 
          gap: '16px' 
        }}
      >
        <div
          style={{
            width: '56px',
            height: '56px',
            borderRadius: '16px',
            background: 'rgba(14, 147, 0, 0.1)',
            border: '1px solid rgba(14, 147, 0, 0.3)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#0E9300',
            marginBottom: '8px',
          }}
        >
          <GraduationCap size={28} />
        </div>
        
        <h1 style={{ fontWeight: 800, fontSize: 'clamp(2.25rem, 5vw, 3rem)', lineHeight: 1.1 }}>
          Academic <span style={{ color: '#0E9300' }}>Programmes</span>
        </h1>
        
        <p style={{ fontSize: '1.05rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
          Select your engineering department to browse course subjects and download previous year question papers.
        </p>
      </div>

      {/* Recently Viewed */}
      {recentDepts.length > 0 && (
        <div style={{ marginBottom: '32px', background: 'rgba(255, 255, 255, 0.01)', border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)', padding: '20px 24px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-primary)', fontSize: '0.9rem', fontWeight: 600 }}>
              <Clock size={16} style={{ color: '#0E9300' }} />
              <span>Recently Viewed</span>
            </div>
            <button 
              onClick={clearRecentDepts}
              style={{ display: 'flex', alignItems: 'center', gap: '4px', background: 'none', border: 'none', color: 'var(--text-muted)', fontSize: '0.78rem', cursor: 'pointer', transition: 'color 0.2s' }}
              onMouseEnter={(e) => e.currentTarget.style.color = '#ef4444'}
              onMouseLeave={(e) => e.currentTarget.style.color = 'var(--text-muted)'}
            >
              <Trash2 size={13} />
              <span>Clear History</span>
            </button>
          </div>
          <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
            {recentDepts.map(dept => (
              <Link 
                key={dept.id} 
                href={`/departments/${dept.id}`}
                onClick={() => handleRecentClick(dept.id)}
                style={{ 
                  textDecoration: 'none', 
                  fontSize: '0.825rem', 
                  color: 'var(--text-secondary)', 
                  background: 'rgba(255, 255, 255, 0.03)', 
                  border: '1px solid var(--border)',
                  padding: '8px 14px',
                  borderRadius: 'var(--radius-full)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  transition: 'all 0.2s ease',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = '#0E9300';
                  e.currentTarget.style.color = '#0E9300';
                  e.currentTarget.style.background = 'rgba(14, 147, 0, 0.05)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = 'var(--border)';
                  e.currentTarget.style.color = 'var(--text-secondary)';
                  e.currentTarget.style.background = 'rgba(255, 255, 255, 0.03)';
                }}
              >
                <span>{dept.name.replace('Computer Science and Engineering', 'CSE')}</span>
                <ChevronRight size={12} />
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Filters & Search Controls */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', marginBottom: '32px' }}>
        {/* Search inputs row */}
        <div style={{ display: 'flex', gap: '16px', alignItems: 'center', flexWrap: 'wrap', width: '100%' }}>
          <div style={{ position: 'relative', flex: 1, minWidth: '280px' }}>
            <Search
              size={18}
              style={{
                position: 'absolute',
                left: '14px',
                top: '50%',
                transform: 'translateY(-50%)',
                color: 'var(--text-muted)',
                pointerEvents: 'none',
              }}
            />
            <input
              type="text"
              placeholder="Search departments or subjects (e.g. Operating Systems)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{
                width: '100%',
                paddingLeft: '44px',
                paddingRight: '40px',
                background: 'rgba(255, 255, 255, 0.02)',
                border: '1px solid var(--border)',
                borderRadius: 'var(--radius-md)',
                height: '46px',
                fontSize: '0.9rem',
                color: 'var(--text-primary)',
                outline: 'none',
                transition: 'border-color 0.2s',
              }}
              onFocus={(e) => e.target.style.borderColor = '#0E9300'}
              onBlur={(e) => e.target.style.borderColor = 'var(--border)'}
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                style={{
                  position: 'absolute',
                  right: '14px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  background: 'none',
                  border: 'none',
                  color: 'var(--text-muted)',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <X size={16} />
              </button>
            )}
          </div>
        </div>

        {/* Domain Filter Pills */}
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', alignItems: 'center' }}>
          {domains.map((domain) => (
            <button
              key={domain}
              onClick={() => setSelectedDomain(domain)}
              style={{
                padding: '8px 16px',
                borderRadius: 'var(--radius-full)',
                fontSize: '0.825rem',
                fontWeight: 600,
                cursor: 'pointer',
                transition: 'all 0.2s',
                background: selectedDomain === domain ? '#0E9300' : 'rgba(255, 255, 255, 0.03)',
                color: selectedDomain === domain ? '#ffffff' : 'var(--text-secondary)',
                border: `1px solid ${selectedDomain === domain ? '#0E9300' : 'var(--border)'}`,
              }}
              onMouseEnter={(e) => {
                if (selectedDomain !== domain) {
                  e.currentTarget.style.borderColor = '#0E9300';
                  e.currentTarget.style.color = '#0E9300';
                }
              }}
              onMouseLeave={(e) => {
                if (selectedDomain !== domain) {
                  e.currentTarget.style.borderColor = 'var(--border)';
                  e.currentTarget.style.color = 'var(--text-secondary)';
                }
              }}
            >
              {domain}
            </button>
          ))}
        </div>
      </div>

      {/* Main Results Body */}
      {searchQuery.trim() !== '' && matchedSubjects.length > 0 && (
        <div style={{ marginBottom: '40px', background: 'rgba(14, 147, 0, 0.02)', border: '1px solid rgba(14, 147, 0, 0.15)', borderRadius: 'var(--radius-lg)', padding: '24px' }}>
          <h2 style={{ fontSize: '1.2rem', fontWeight: 700, color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
            <BookOpen size={18} style={{ color: '#0E9300' }} />
            <span>Matching Subjects ({matchedSubjects.length})</span>
          </h2>
          <div className="subject-results-grid">
            {matchedSubjects.map(({ subject, department }) => (
              <Link 
                key={subject.code}
                href={`/search?code=${subject.code}`}
                style={{ 
                  textDecoration: 'none', 
                  background: 'var(--bg-card)', 
                  border: '1px solid var(--border)',
                  borderRadius: 'var(--radius-md)',
                  padding: '16px 18px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '8px',
                  transition: 'all 0.2s',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = '#0E9300';
                  e.currentTarget.style.background = 'var(--bg-card-hover)';
                  e.currentTarget.style.transform = 'translateY(-2px)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = 'var(--border)';
                  e.currentTarget.style.background = 'var(--bg-card)';
                  e.currentTarget.style.transform = 'none';
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '8px' }}>
                  <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '0.75rem', padding: '3px 8px', borderRadius: '4px', background: 'rgba(255,255,255,0.04)', border: '1px solid var(--border)', color: 'var(--text-secondary)' }}>
                    {subject.code}
                  </span>
                  <span style={{ fontSize: '0.72rem', color: '#0E9300', fontWeight: 600 }}>
                    {department.name.replace('Computer Science and Engineering', 'CSE')}
                  </span>
                </div>
                <h4 style={{ fontSize: '0.925rem', fontWeight: 600, color: 'var(--text-primary)' }}>{subject.name}</h4>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                  <span>Usually Semester {subject.typicalSemester}</span>
                  <span>•</span>
                  <span>Semester may vary by batch.</span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Departments Grid */}
      <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '20px' }}>
        {selectedDomain} Departments ({filteredDepartments.length})
      </h2>
      
      {filteredDepartments.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '48px', border: '1px dashed var(--border)', borderRadius: 'var(--radius-lg)', color: 'var(--text-muted)' }}>
          No departments matched your filters or search query.
        </div>
      ) : (
        <div className="departments-grid">
          {filteredDepartments.map((dept) => (
            <DepartmentCard key={dept.id} department={dept} />
          ))}
        </div>
      )}
    </div>
  );
}
