'use client';
import { useState, useRef, useEffect, ChangeEvent, FormEvent } from 'react';
import { useSession, signIn } from 'next-auth/react';
import { Upload, FileText, CheckCircle, AlertCircle, X, Search } from 'lucide-react';
import { searchSubjectsByTitle, BATCH_YEARS } from '@/frontend/utils/curriculum';
import { toast } from './ui/Toast';

const EXAM_TYPES = [
  { value: 'mid',  label: 'Mid Semester'   },
  { value: 'end',  label: 'End Semester'   },
  { value: 'sup',  label: 'Supplementary'  },
];

const MONTHS = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
const currentYear = new Date().getFullYear();
const START_YEAR = 2019;
const YEARS = Array.from({ length: currentYear - START_YEAR + 1 }, (_, i) => currentYear - i);

const SUBJECT_RE = /^[0-9]{2}[A-Z]{2,4}[0-9]{3}$/;
const MAX_FILE_SIZE = 2 * 1024 * 1024; // 2 MB

type UploadState = 'idle' | 'uploading' | 'success' | 'error';

export function UploadForm() {
  const { data: session } = useSession();
  const fileRef        = useRef<HTMLInputElement>(null);
  const dropdownRef    = useRef<HTMLDivElement>(null);

  // ── Batch year (drives autocomplete curriculum) ──
  const [batchYear, setBatchYear] = useState(String(currentYear));

  // ── Form fields ──
  const [subjectCode,  setSubjectCode]  = useState('');
  const [courseTitle,  setCourseTitle]  = useState('');
  const [month,        setMonth]        = useState('Nov');
  const [year,         setYear]         = useState(String(currentYear - 1));
  const [examType,     setExamType]     = useState('mid');
  const [file,         setFile]         = useState<File | null>(null);
  const [state,        setState]        = useState<UploadState>('idle');
  const [progress,     setProgress]     = useState(0);
  const [errorMsg,     setErrorMsg]     = useState('');

  // ── Autocomplete state ──
  const [suggestions,     setSuggestions]     = useState<{ code: string; title: string }[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [autoFilled,      setAutoFilled]      = useState(false);

  // Close dropdown when clicking outside
  useEffect(() => {
    function onClickOutside(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setShowSuggestions(false);
      }
    }
    document.addEventListener('mousedown', onClickOutside);
    return () => document.removeEventListener('mousedown', onClickOutside);
  }, []);

  // ── Course title input → fuzzy-search → maybe auto-fill code ──
  function handleCourseTitleChange(value: string) {
    setCourseTitle(value);
    setAutoFilled(false);

    const results = searchSubjectsByTitle(value, parseInt(batchYear));
    setSuggestions(results);
    setShowSuggestions(results.length > 0 && value.trim().length >= 2);

    // Exact match → auto-fill immediately
    const exact = results.find(
      (r) => r.title.toLowerCase() === value.trim().toLowerCase()
    );
    if (exact) {
      setSubjectCode(exact.code);
      setAutoFilled(true);
      setShowSuggestions(false);
    }
  }

  // ── Suggestion selected from dropdown ──
  function handleSelectSuggestion(entry: { code: string; title: string }) {
    setCourseTitle(entry.title);
    setSubjectCode(entry.code);
    setAutoFilled(true);
    setShowSuggestions(false);
    setSuggestions([]);
  }

  // ── Batch year change → reset title + code ──
  function handleBatchYearChange(value: string) {
    setBatchYear(value);
    setCourseTitle('');
    setSubjectCode('');
    setAutoFilled(false);
    setSuggestions([]);
  }

  function buildFilename() {
    return `${month}${year}_${examType}.pdf`;
  }

  function validateSubjectCode(code: string) {
    return SUBJECT_RE.test(code.trim());
  }



  function handleFileChange(e: ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0];
    if (!f) return;
    if (!f.name.endsWith('.pdf') && f.type !== 'application/pdf') {
      setErrorMsg('Only PDF files are accepted.');
      return;
    }
    if (f.size > MAX_FILE_SIZE) {
      setErrorMsg('File size must be under 2 MB.');
      return;
    }
    setErrorMsg('');
    setFile(f);
  }

  async function readFileAsBase64(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload  = () => resolve((reader.result as string).split(',')[1]);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!session || !file) return;

    const code = subjectCode.trim().toUpperCase();
    if (!validateSubjectCode(code)) {
      setErrorMsg('Subject code format invalid. Expected: 23CSE203, 23MAT107, etc.');
      return;
    }

    setState('uploading');
    setProgress(0);
    setErrorMsg('');

    try {
      const filename = buildFilename();
      setProgress(10);
      const base64Content = await readFileAsBase64(file);
      setProgress(30);

      const res = await fetch('/api/upload/simple', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          subjectCode: code,
          courseTitle: courseTitle.trim(),
          filename,
          content: base64Content,
        }),
      });

      setProgress(90);

      if (!res.ok) {
        const { error } = await res.json();
        throw new Error(error || 'Upload failed.');
      }

      setProgress(100);
      setState('success');
      toast(`${filename} uploaded successfully!`, 'success');
    } catch (err: any) {
      const msg = err.message || 'Something went wrong. Please try again.';
      setErrorMsg(msg);
      setState('error');
      toast(msg, 'error');
    }
  }

  function reset() {
    setFile(null);
    setSubjectCode('');
    setCourseTitle('');
    setSuggestions([]);
    setShowSuggestions(false);
    setMonth('Nov');
    setYear(String(currentYear - 1));
    setExamType('mid');
    setState('idle');
    setProgress(0);
    setErrorMsg('');
    setAutoFilled(false);
    if (fileRef.current) fileRef.current.value = '';
  }

  // ── Not signed in ──────────────────────────────────────────────────
  if (!session) {
    return (
      <div style={{ textAlign: 'center', padding: '48px 24px' }}>
        <div style={{ width: 64, height: 64, background: 'var(--gradient-card)', border: '1px solid var(--border)', borderRadius: 16, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px' }}>
          <Upload size={28} style={{ color: 'var(--violet-light)' }} />
        </div>
        <h2 style={{ marginBottom: 10 }}>Sign in to Upload</h2>
        <p style={{ color: 'var(--text-muted)', marginBottom: 24 }}>
          You need a GitHub account to contribute papers to the repository.
        </p>
        <button id="upload-signin-btn" className="btn btn-primary btn-lg" onClick={() => signIn('github')}>
          Sign in with GitHub
        </button>
      </div>
    );
  }

  // ── Success ────────────────────────────────────────────────────────
  if (state === 'success') {
    return (
      <div style={{ textAlign: 'center', padding: '48px 24px' }}>
        <div style={{ width: 64, height: 64, background: 'rgba(18, 205, 0,0.12)', border: '1px solid rgba(18, 205, 0,0.3)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px' }}>
          <CheckCircle size={28} style={{ color: '#12cd00' }} />
        </div>
        <h2 style={{ marginBottom: 10, color: 'var(--text-primary)' }}>Upload Successful!</h2>
        <p style={{ color: 'var(--text-muted)', marginBottom: 8 }}>
          <strong style={{ fontFamily: 'JetBrains Mono, monospace', color: 'var(--text-secondary)' }}>{buildFilename()}</strong>{' '}
          has been committed to the repository.
        </p>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', marginBottom: 28 }}>
          The paper will be searchable by subject code shortly.
        </p>
        <div style={{ display: 'flex', gap: 12, justifyContent: 'center' }}>
          <button className="btn btn-primary" onClick={reset}>Upload Another</button>
          <a href={`/search?code=${subjectCode}`} className="btn btn-secondary">View Papers</a>
        </div>
      </div>
    );
  }

  const uploading = state === 'uploading';

  // ── Main form ──────────────────────────────────────────────────────
  return (
    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>

      {/* ── Batch Year ── */}
      <div className="input-group">
        <label className="input-label" htmlFor="batch-year">
          Your Batch (Joining Year) *
          <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginLeft: 8, fontWeight: 400 }}>
            determines which curriculum&apos;s codes are shown
          </span>
        </label>
        <select
          id="batch-year"
          className="input"
          value={batchYear}
          onChange={(e) => handleBatchYearChange(e.target.value)}
          disabled={uploading}
        >
          {BATCH_YEARS.map((y) => (
            <option key={y} value={y}>Batch of {y}</option>
          ))}
        </select>
      </div>

      {/* ── Course Title with autocomplete ── */}
      <div className="input-group" style={{ position: 'relative' }} ref={dropdownRef}>
        <label className="input-label" htmlFor="course-title-input">
          Course Title *
          <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginLeft: 8, fontWeight: 400 }}>
            start typing — subject code auto-fills below
          </span>
        </label>

        <div style={{ position: 'relative' }}>
          <Search
            size={15}
            style={{
              position: 'absolute', left: 12, top: '50%',
              transform: 'translateY(-50%)',
              color: 'var(--text-muted)', pointerEvents: 'none',
            }}
          />
          <input
            id="course-title-input"
            className="input"
            type="text"
            value={courseTitle}
            onChange={(e) => handleCourseTitleChange(e.target.value)}
            onFocus={() => suggestions.length > 0 && setShowSuggestions(true)}
            placeholder="e.g. Data Structures and Algorithms"
            maxLength={100}
            required
            disabled={uploading}
            style={{ paddingLeft: 36 }}
            autoComplete="off"
          />
        </div>

        {/* Suggestions dropdown */}
        {showSuggestions && suggestions.length > 0 && (
          <div style={{
            position: 'absolute', top: '100%', left: 0, right: 0, zIndex: 50,
            background: 'var(--bg-secondary, #0d1117)',
            border: '1px solid var(--border)',
            borderRadius: 'var(--radius-md)',
            marginTop: 4,
            overflow: 'hidden',
            boxShadow: '0 8px 32px rgba(0,0,0,0.5)',
          }}>
            {suggestions.map((entry, idx) => (
              <button
                key={entry.code}
                type="button"
                onClick={() => handleSelectSuggestion(entry)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  width: '100%',
                  padding: '10px 14px',
                  background: 'transparent',
                  border: 'none',
                  borderBottom: idx < suggestions.length - 1 ? '1px solid var(--border)' : 'none',
                  cursor: 'pointer',
                  textAlign: 'left',
                  gap: 12,
                  transition: 'background 0.15s',
                }}
                onMouseEnter={(e) => (e.currentTarget.style.background = 'rgba(18,205,0,0.06)')}
                onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
              >
                <span style={{ color: 'var(--text-primary)', fontSize: '0.875rem', flex: 1 }}>
                  {entry.title}
                </span>
                <span style={{
                  fontFamily: 'JetBrains Mono, monospace',
                  fontSize: '0.75rem',
                  color: '#12cd00',
                  background: 'rgba(18,205,0,0.1)',
                  padding: '2px 8px',
                  borderRadius: 4,
                  whiteSpace: 'nowrap',
                }}>
                  {entry.code}
                </span>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* ── Subject Code (auto-filled, still manually editable) ── */}
      <div className="input-group">
        <label className="input-label" htmlFor="subject-code-input">
          Subject Code *
          {autoFilled && (
            <span style={{ marginLeft: 8, fontSize: '0.78rem', color: '#12cd00', fontWeight: 400 }}>
              ✓ Auto-filled from course title
            </span>
          )}
        </label>
        <input
          id="subject-code-input"
          className={`input ${subjectCode && !validateSubjectCode(subjectCode) ? 'input-error' : ''}`}
          type="text"
          value={subjectCode}
          onChange={(e) => { setSubjectCode(e.target.value.toUpperCase()); setAutoFilled(false); }}
          placeholder="e.g. 23CSE203"
          maxLength={10}
          required
          disabled={uploading}
          style={{
            fontFamily: 'JetBrains Mono, monospace',
            letterSpacing: '0.05em',
            borderColor: autoFilled ? 'rgba(18,205,0,0.5)' : undefined,
            background:   autoFilled ? 'rgba(18,205,0,0.04)' : undefined,
            transition: 'border-color 0.2s, background 0.2s',
          }}
        />
        {subjectCode && !validateSubjectCode(subjectCode) && (
          <p style={{ fontSize: '0.78rem', color: 'var(--error)', marginTop: 4 }}>
            Format: 2 digits + 2–4 uppercase letters + 3 digits (e.g. 23CSE203, 23MAT107)
          </p>
        )}
        {!autoFilled && !subjectCode && (
          <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: 4 }}>
            Can&apos;t find it in autocomplete? Type the code directly here.
          </p>
        )}
      </div>

      {/* ── Month + Year + Type ── */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12 }}>
        <div className="input-group">
          <label className="input-label" htmlFor="exam-month">Exam Month *</label>
          <select id="exam-month" className="input" value={month} onChange={(e) => setMonth(e.target.value)} disabled={uploading}>
            {MONTHS.map((m) => <option key={m} value={m}>{m}</option>)}
          </select>
        </div>
        <div className="input-group">
          <label className="input-label" htmlFor="exam-year">Year *</label>
          <select id="exam-year" className="input" value={year} onChange={(e) => setYear(e.target.value)} disabled={uploading}>
            {YEARS.map((y) => <option key={y} value={y}>{y}</option>)}
          </select>
        </div>
        <div className="input-group">
          <label className="input-label" htmlFor="exam-type">Exam Type *</label>
          <select id="exam-type" className="input" value={examType} onChange={(e) => setExamType(e.target.value)} disabled={uploading}>
            {EXAM_TYPES.map((t) => <option key={t.value} value={t.value}>{t.label}</option>)}
          </select>
        </div>
      </div>

      {/* ── Filename preview ── */}
      <div style={{ padding: '12px 14px', background: 'rgba(18, 205, 0,0.06)', border: '1px solid rgba(18, 205, 0,0.15)', borderRadius: 'var(--radius-sm)', display: 'flex', flexDirection: 'column', gap: 6 }}>
        <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>File will be saved as:</span>
        <code style={{ fontSize: '0.85rem', color: 'var(--green-primary)', fontFamily: 'JetBrains Mono, monospace', wordBreak: 'break-all', lineHeight: 1.5 }}>
          {courseTitle.trim() || 'SUBJECT_TITLE'}/{subjectCode || 'SUBJECT_CODE'}/{buildFilename()}
        </code>
      </div>

      {/* ── File picker ── */}
      <div className="input-group">
        <label className="input-label">PDF File * (max 2 MB)</label>
        <div
          onClick={() => !uploading && fileRef.current?.click()}
          style={{
            border: `2px dashed ${file ? 'rgba(18, 205, 0,0.4)' : 'var(--border)'}`,
            borderRadius: 'var(--radius-md)',
            padding: '40px 20px',
            textAlign: 'center',
            cursor: uploading ? 'not-allowed' : 'pointer',
            transition: 'border-color 0.2s, background 0.2s',
            background: file ? 'rgba(18, 205, 0,0.04)' : 'transparent',
          }}
        >
          {file ? (
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10, flexWrap: 'wrap' }}>
              <FileText size={20} style={{ color: 'var(--green-primary)', flexShrink: 0 }} />
              <span style={{ color: 'var(--text-primary)', fontWeight: 500, wordBreak: 'break-all' }}>{file.name}</span>
              <span style={{ color: 'var(--text-muted)', fontSize: '0.82rem', whiteSpace: 'nowrap' }}>
                ({(file.size / 1024).toFixed(0)} KB)
              </span>
              <button
                type="button"
                onClick={(e) => { e.stopPropagation(); setFile(null); if (fileRef.current) fileRef.current.value = ''; }}
                style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)', borderRadius: '50%', padding: 4, cursor: 'pointer', color: '#ef4444', display: 'flex', flexShrink: 0 }}
              >
                <X size={14} />
              </button>
            </div>
          ) : (
            <>
              <Upload size={24} style={{ color: 'var(--text-muted)', marginBottom: 10 }} />
              <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Click to select PDF</p>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.78rem', marginTop: 4 }}>or drag and drop</p>
            </>
          )}
        </div>
        <input ref={fileRef} type="file" accept=".pdf,application/pdf" style={{ display: 'none' }} onChange={handleFileChange} />
      </div>

      {/* ── Progress ── */}
      {uploading && (
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
            <span style={{ fontSize: '0.82rem', color: 'var(--text-secondary)' }}>Uploading… {progress}%</span>
            <span style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>{progress}%</span>
          </div>
          <div className="progress-bar">
            <div className="progress-fill" style={{ width: `${progress}%` }} />
          </div>
        </div>
      )}

      {/* ── Error ── */}
      {(errorMsg || state === 'error') && (
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10, padding: '12px 14px', background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)', borderRadius: 'var(--radius-sm)' }}>
          <AlertCircle size={15} style={{ color: '#fca5a5', flexShrink: 0, marginTop: 1 }} />
          <p style={{ fontSize: '0.85rem', color: '#fca5a5' }}>{errorMsg}</p>
        </div>
      )}

      <button
        id="upload-submit-btn"
        type="submit"
        className="btn btn-primary btn-lg"
        style={{ justifyContent: 'center' }}
        disabled={uploading || !file || !subjectCode || !courseTitle.trim()}
      >
        {uploading
          ? <><span className="spinner" />Uploading…</>
          : <><Upload size={16} />Upload Paper</>
        }
      </button>
    </form>
  );
}
