'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import * as Icons from 'lucide-react';
import { DEPARTMENTS, Department, Subject } from "@/shared/departments";
import { SubjectList } from '@/frontend/components/SubjectList';


interface DepartmentPageProps {
  params: {
    department: string;
  };
}

// Local shape used for the Add/Edit modal form state.
// `note` is included here even if it isn't part of the shared Subject type,
// since the API contract requires it.
interface SubjectFormState {
  code: string;
  name: string;
  typicalSemester: string;
  note: string;
}

export default function DepartmentPage({ params }: DepartmentPageProps) {
  const departmentId = params.department.toLowerCase();
  const [department, setDepartment] = useState<Department | null>(null);
  const [loading, setLoading] = useState(true);
  const [showAddSubject, setShowAddSubject] = useState(false);
  const [editingSubjectCode, setEditingSubjectCode] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const [newSubject, setNewSubject] = useState<SubjectFormState>({
    code: "",
    name: "",
    typicalSemester: "",
    note: "",
  });

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSemester, setSelectedSemester] = useState<number | null>(null);
  const [favourites, setFavourites] = useState<string[]>([]);
  const [showFavouritesOnly, setShowFavouritesOnly] = useState(false);
  const [collapsedSemesters, setCollapsedSemesters] = useState<Record<number, boolean>>({});

  // Local, editable copy of the department's subjects so Add/Edit/Delete
  // can update the UI immediately without a full page reload.
  const [subjects, setSubjects] = useState<Subject[]>([]);

  const dept =
    department ??
    (DEPARTMENTS.find((d) => d.id.toLowerCase() === departmentId) || null);

  useEffect(() => {
    async function loadDepartment() {
      setLoading(true);
      try {
        const res = await fetch(`/api/admin/departments/${departmentId}`);
        const result = await res.json();

        if (result.success && result.data) {
          setDepartment(result.data);
          setSubjects(result.data.subjects ?? []);
        } else {
          const fallback = DEPARTMENTS.find(
            (d) => d.id.toLowerCase() === departmentId
          );
          setDepartment(fallback ?? null);
          setSubjects(fallback?.subjects ?? []);
        }
      } catch (e) {
        console.error(e);
        const fallback = DEPARTMENTS.find(
          (d) => d.id.toLowerCase() === departmentId
        );
        setDepartment(fallback ?? null);
        setSubjects(fallback?.subjects ?? []);
      } finally {
        setLoading(false);
      }
    }

    loadDepartment();
  }, [departmentId]);

  const inputStyle = {
    width: "100%",
    padding: "12px",
    marginTop: 12,
    borderRadius: 8,
    border: "1px solid var(--border)",
    background: "var(--bg-secondary)",
    color: "white",
  };

  // Load favourites from localStorage
  useEffect(() => {
    try {
      const stored = localStorage.getItem('favorite_subjects');
      if (stored) {
        setFavourites(JSON.parse(stored));
      }
    } catch (e) {
      console.error(e);
    }
  }, []);

  function openAddModal() {
    setEditingSubjectCode(null);
    setNewSubject({ code: "", name: "", typicalSemester: "", note: "" });
    setShowAddSubject(true);
  }

  function openEditModal(subject: Subject) {
    setEditingSubjectCode(subject.code);
    setNewSubject({
      code: subject.code,
      name: subject.name,
      typicalSemester:
        subject.typicalSemester !== undefined && subject.typicalSemester !== null
          ? String(subject.typicalSemester)
          : "",
      note: (subject as any).note || "",
    });
    setShowAddSubject(true);
  }

  function closeModal() {
    setShowAddSubject(false);
    setEditingSubjectCode(null);
    setNewSubject({ code: "", name: "", typicalSemester: "", note: "" });
  }

  async function saveSubject() {
    if (!dept) return;

    if (!newSubject.code.trim() || !newSubject.name.trim()) {
      alert("Subject Code and Subject Name are required.");
      return;
    }

    setSaving(true);
    try {
      const isEditing = !!editingSubjectCode;
      const url = isEditing
        ? `/api/admin/departments/${dept.id}/subjects/${editingSubjectCode}`
        : `/api/admin/departments/${dept.id}/subjects`;

      const res = await fetch(url, {
        method: isEditing ? "PUT" : "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          code: newSubject.code,
          name: newSubject.name,
          typicalSemester: Number(newSubject.typicalSemester),
          note: newSubject.note,
        }),
      });

      const result = await res.json();

      if (result.success) {
        const savedSubject: Subject = {
          ...(result.subject || {}),
          code: newSubject.code,
          name: newSubject.name,
          typicalSemester: Number(newSubject.typicalSemester),
          note: newSubject.note,
        } as Subject;

        setSubjects((prev) => {
          if (isEditing) {
            return prev.map((s) =>
              s.code === editingSubjectCode ? savedSubject : s
            );
          }
          return [...prev, savedSubject];
        });

        alert(isEditing ? "Subject updated successfully." : "Subject added successfully.");
        closeModal();
      } else {
        alert(result.message || "Something went wrong.");
      }
    } catch (e) {
      console.error(e);
      alert("Failed to save subject. Please try again.");
    } finally {
      setSaving(false);
    }
  }

  async function deleteSubject(subject: Subject) {
    if (!dept) return;

    const confirmed = window.confirm(
      `Delete ${subject.code} - ${subject.name}? This cannot be undone.`
    );
    if (!confirmed) return;

    try {
      const res = await fetch(
        `/api/admin/departments/${dept.id}/subjects/${subject.code}`,
        { method: "DELETE" }
      );
      const result = await res.json();

      if (result.success) {
        setSubjects((prev) => prev.filter((s) => s.code !== subject.code));
        alert("Subject deleted successfully.");
      } else {
        alert(result.message || "Failed to delete subject.");
      }
    } catch (e) {
      console.error(e);
      alert("Failed to delete subject. Please try again.");
    }
  }

  // Save recently viewed department when page is loaded
  useEffect(() => {
    if (dept) {
      try {
        const recent = localStorage.getItem('recent_departments');
        let recentIds: string[] = recent ? JSON.parse(recent) : [];
        recentIds = recentIds.filter((id) => id !== dept.id);
        recentIds.unshift(dept.id);
        recentIds = recentIds.slice(0, 4);
        localStorage.setItem('recent_departments', JSON.stringify(recentIds));
      } catch (e) {
        console.error(e);
      }
    }
  }, [dept]);

  if (!dept) {
    return (
      <div className="container page-top section" style={{ textAlign: 'center' }}>
        <div style={{ maxWidth: '480px', margin: '0 auto', padding: '40px 24px' }}>
          <div
            style={{
              width: '64px',
              height: '64px',
              borderRadius: '50%',
              background: 'rgba(239, 68, 68, 0.1)',
              border: '1px solid rgba(239, 68, 68, 0.2)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#ef4444',
              margin: '0 auto 24px',
            }}
          >
            <Icons.AlertCircle size={28} />
          </div>
          <h2 style={{ marginBottom: '12px' }}>Department Not Found</h2>
          <p style={{ color: 'var(--text-secondary)', marginBottom: '28px' }}>
            The department route &quot;{params.department}&quot; does not exist. Please check the URL or return to the catalog.
          </p>
          <Link href="/departments" className="btn btn-primary">
            <Icons.ArrowLeft size={14} /> Back to Departments
          </Link>
        </div>
      </div>
    );
  }

  const IconComponent = (Icons as any)[dept.icon] || Icons.GraduationCap;

  const toggleFavourite = (code: string) => {
    try {
      const next = favourites.includes(code)
        ? favourites.filter((c) => c !== code)
        : [...favourites, code];
      setFavourites(next);
      localStorage.setItem('favorite_subjects', JSON.stringify(next));
    } catch (e) {
      console.error(e);
    }
  };

  // Filter subjects based on search, semester, and favourites
  const filteredSubjects = subjects.filter((subject) => {
    const matchesSearch =
      subject.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
      subject.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesSem =
      selectedSemester === null || subject.typicalSemester === selectedSemester;
    const matchesFav = !showFavouritesOnly || favourites.includes(subject.code);
    return matchesSearch && matchesSem && matchesFav;
  });

  // Unique semesters available in the subjects list
  const semesters = Array.from(
    new Set(
      subjects
        .map((s) => s.typicalSemester)
        .filter(Boolean) as number[]
    )
  ).sort((a, b) => a - b);

  // Group filtered subjects by semester
  const subjectsBySemester: Record<number, Subject[]> = {};
  filteredSubjects.forEach((sub) => {
    const sem = sub.typicalSemester || 99; // Fallback to 99 for undefined semesters
    if (!subjectsBySemester[sem]) {
      subjectsBySemester[sem] = [];
    }
    subjectsBySemester[sem].push(sub);
  });

  const sortedSemesters = Object.keys(subjectsBySemester)
    .map(Number)
    .sort((a, b) => a - b);

  const toggleSemester = (sem: number) => {
    setCollapsedSemesters((prev) => ({
      ...prev,
      [sem]: !prev[sem],
    }));
  };

  return (
    <div className="container page-top section-sm">
      {/* Breadcrumbs */}
      <nav 
        aria-label="Breadcrumb"
        style={{ 
          display: 'flex', 
          alignItems: 'center', 
          gap: '8px', 
          fontSize: '0.85rem', 
          color: 'var(--text-secondary)',
          marginBottom: '24px'
        }}
      >
        <Link href="/" style={{ color: 'var(--text-secondary)', transition: 'color 0.2s' }} onMouseEnter={(e) => e.currentTarget.style.color = '#0E9300'} onMouseLeave={(e) => e.currentTarget.style.color = 'var(--text-secondary)'}>
          Home
        </Link>
        <Icons.ChevronRight size={14} style={{ color: 'var(--text-muted)' }} />
        <Link href="/departments" style={{ color: 'var(--text-secondary)', transition: 'color 0.2s' }} onMouseEnter={(e) => e.currentTarget.style.color = '#0E9300'} onMouseLeave={(e) => e.currentTarget.style.color = 'var(--text-secondary)'}>
          Departments
        </Link>
        <Icons.ChevronRight size={14} style={{ color: 'var(--text-muted)' }} />
        <span style={{ color: '#0E9300', fontWeight: 600 }}>{dept.name.replace('Computer Science and Engineering', 'CSE')}</span>
      </nav>

      {/* Hero card showing department info */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '24px',
          background: 'linear-gradient(145deg, rgba(14, 147, 0, 0.05) 0%, rgba(7, 11, 24, 0.4) 100%)',
          border: '1px solid var(--border)',
          borderRadius: 'var(--radius-lg)',
          padding: '32px',
          marginBottom: '40px',
          backdropFilter: 'blur(12px)',
        }}
      >
        <div
          style={{
            width: '56px',
            height: '56px',
            borderRadius: '14px',
            background: 'rgba(14, 147, 0, 0.15)',
            border: '1px solid rgba(14, 147, 0, 0.3)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#0E9300',
            flexShrink: 0,
          }}
        >
          <IconComponent size={26} />
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
          <h1 style={{ fontSize: 'clamp(1.5rem, 4vw, 2.25rem)', fontWeight: 800, color: 'var(--text-primary)', lineHeight: 1.2 }}>
            {dept.name}
          </h1>
          <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
            {dept.description}
          </p>
        </div>
      </div>

      {/* Filters Section */}
      <div style={{ marginBottom: '32px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
        <div style={{ display: 'flex', gap: '16px', alignItems: 'center', flexWrap: 'wrap', justifyContent: 'space-between' }}>
          <div>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '4px' }}>
              Course Subjects
            </h2>
            <p style={{ fontSize: '0.8125rem', color: 'var(--text-muted)' }}>
              Explore core subjects or filter by semester to find papers.
            </p>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ fontSize: '0.8125rem', color: 'var(--text-muted)' }}>
              Showing {filteredSubjects.length} of {subjects.length} subjects
            </div>
          </div>
        </div>

        {/* Search input and pills filter row */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', alignItems: 'center', width: '100%' }}>
            {/* Search Input */}
            <div style={{ position: 'relative', flex: 1, minWidth: '260px' }}>
              <Icons.Search
                size={15}
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
                placeholder="Search subject code or name..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{
                  width: '100%',
                  paddingLeft: '40px',
                  paddingRight: '40px',
                  background: 'rgba(255, 255, 255, 0.02)',
                  border: '1px solid var(--border)',
                  borderRadius: 'var(--radius-md)',
                  height: '42px',
                  fontSize: '0.85rem',
                  color: 'var(--text-primary)',
                  outline: 'none',
                }}
                onFocus={(e) => e.target.style.borderColor = '#0E9300'}
                onBlur={(e) => e.target.style.borderColor = 'var(--border)'}
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  style={{
                    position: 'absolute',
                    right: '12px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    background: 'none',
                    border: 'none',
                    color: 'var(--text-muted)',
                    cursor: 'pointer',
                  }}
                >
                  <Icons.X size={14} />
                </button>
              )}
            </div>

            {/* Bookmark Filter Button */}
            <button
              onClick={() => setShowFavouritesOnly(!showFavouritesOnly)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '0 16px',
                height: '42px',
                borderRadius: 'var(--radius-md)',
                fontSize: '0.825rem',
                fontWeight: 600,
                cursor: 'pointer',
                transition: 'all 0.2s',
                background: showFavouritesOnly ? 'rgba(14, 147, 0, 0.15)' : 'rgba(255, 255, 255, 0.02)',
                color: showFavouritesOnly ? '#0E9300' : 'var(--text-secondary)',
                border: `1px solid ${showFavouritesOnly ? '#0E9300' : 'var(--border)'}`,
              }}
            >
              <Icons.Star size={15} fill={showFavouritesOnly ? '#0E9300' : 'none'} />
              <span>Favourites Only</span>
            </button>
          </div>

          {/* Semester badges filter */}
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', alignItems: 'center' }}>
            <button
              onClick={() => setSelectedSemester(null)}
              style={{
                padding: '6px 14px',
                borderRadius: 'var(--radius-full)',
                fontSize: '0.78rem',
                fontWeight: 600,
                cursor: 'pointer',
                transition: 'all 0.2s',
                background: selectedSemester === null ? '#0E9300' : 'rgba(255, 255, 255, 0.03)',
                color: selectedSemester === null ? '#ffffff' : 'var(--text-secondary)',
                border: `1px solid ${selectedSemester === null ? '#0E9300' : 'var(--border)'}`,
              }}
            >
              All Semesters
            </button>
            {semesters.map((sem) => (
              <button
                key={sem}
                onClick={() => setSelectedSemester(sem)}
                style={{
                  padding: '6px 14px',
                  borderRadius: 'var(--radius-full)',
                  fontSize: '0.78rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                  background: selectedSemester === sem ? '#0E9300' : 'rgba(255, 255, 255, 0.03)',
                  color: selectedSemester === sem ? '#ffffff' : 'var(--text-secondary)',
                  border: `1px solid ${selectedSemester === sem ? '#0E9300' : 'var(--border)'}`,
                }}
              >
                Semester {sem}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Subjects Accordion List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', maxWidth: '850px' }}>
        {sortedSemesters.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '40px 24px', border: '1px dashed var(--border)', borderRadius: 'var(--radius-lg)', color: 'var(--text-muted)' }}>
            No subjects match your current filter selection.
          </div>
        ) : (
          sortedSemesters.map((sem) => {
            const isCollapsed = !!collapsedSemesters[sem];
            const semSubjects = subjectsBySemester[sem];
            return (
              <div 
                key={sem} 
                style={{ 
                  background: 'rgba(255, 255, 255, 0.01)', 
                  border: '1px solid var(--border)', 
                  borderRadius: 'var(--radius-lg)', 
                  overflow: 'hidden' 
                }}
              >
                {/* Accordion Header */}
                <button
                  onClick={() => toggleSemester(sem)}
                  style={{
                    width: '100%',
                    padding: '16px 20px',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    background: 'rgba(255, 255, 255, 0.02)',
                    border: 'none',
                    borderBottom: isCollapsed ? 'none' : '1px solid var(--border)',
                    color: 'var(--text-primary)',
                    cursor: 'pointer',
                    outline: 'none',
                    textAlign: 'left',
                    transition: 'background-color 0.2s',
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.04)'}
                  onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.02)'}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <span style={{ fontSize: '1.05rem', fontWeight: 700 }}>
                      {sem === 99 ? 'Other Subjects' : `Semester ${sem}`}
                    </span>
                    <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', background: 'rgba(255, 255, 255, 0.04)', padding: '2px 8px', borderRadius: '6px' }}>
                      {semSubjects.length} {semSubjects.length === 1 ? 'Subject' : 'Subjects'}
                    </span>
                  </div>
                  {isCollapsed ? <Icons.ChevronDown size={18} /> : <Icons.ChevronUp size={18} />}
                </button>

                {/* Accordion Content */}
                {!isCollapsed && (
                  <div style={{ padding: '20px' }}>
                    {/*
                      NOTE: SubjectList doesn't currently support per-item
                      Edit/Delete actions, and this task is scoped to this
                      file only, so admin rows are rendered inline here
                      (same card styling) instead of via <SubjectList>.
                    */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                      {semSubjects.map((subject) => (
                        <div
                          key={subject.code}
                          style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            gap: '12px',
                            padding: '14px 16px',
                            borderRadius: 'var(--radius-md)',
                            border: '1px solid var(--border)',
                            background: 'rgba(255, 255, 255, 0.02)',
                            flexWrap: 'wrap',
                          }}
                        >
                          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', minWidth: '200px' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                              <span style={{ fontWeight: 700, color: 'var(--text-primary)', fontSize: '0.9rem' }}>
                                {subject.code}
                              </span>
                              <span style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>
                                {subject.name}
                              </span>
                            </div>
                            {(subject as any).note && (
                              <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                                {(subject as any).note}
                              </span>
                            )}
                          </div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <button
                              onClick={() => toggleFavourite(subject.code)}
                              style={{ background: 'none', border: 'none', cursor: 'pointer', color: favourites.includes(subject.code) ? '#0E9300' : 'var(--text-muted)' }}
                              aria-label="Toggle favourite"
                            >
                              <Icons.Star size={16} fill={favourites.includes(subject.code) ? '#0E9300' : 'none'} />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>

      {showAddSubject && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,.6)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 999,
          }}
        >
          <div
            className="glass-card"
            style={{
              width: 500,
              padding: 25,
            }}
          >
            <h2>{editingSubjectCode ? "Edit Subject" : "Add Subject"}</h2>

            <input
              placeholder="Subject Code"
              value={newSubject.code}
              disabled={!!editingSubjectCode}
              onChange={(e) =>
                setNewSubject({
                  ...newSubject,
                  code: e.target.value,
                })
              }
              style={inputStyle}
            />

            <input
              placeholder="Subject Name"
              value={newSubject.name}
              onChange={(e) =>
                setNewSubject({
                  ...newSubject,
                  name: e.target.value,
                })
              }
              style={inputStyle}
            />

            <input
              placeholder="Semester"
              value={newSubject.typicalSemester}
              onChange={(e) =>
                setNewSubject({
                  ...newSubject,
                  typicalSemester: e.target.value,
                })
              }
              style={inputStyle}
            />

            <input
              placeholder="Note"
              value={newSubject.note}
              onChange={(e) =>
                setNewSubject({
                  ...newSubject,
                  note: e.target.value,
                })
              }
              style={inputStyle}
            />

            <div
              style={{
                display: "flex",
                justifyContent: "flex-end",
                gap: 10,
                marginTop: 20,
              }}
            >
              <button
                className="btn"
                onClick={closeModal}
                disabled={saving}
              >
                Cancel
              </button>

              <button
                className="btn"
                onClick={saveSubject}
                disabled={saving}
              >
                {saving ? "Saving..." : "Save"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}