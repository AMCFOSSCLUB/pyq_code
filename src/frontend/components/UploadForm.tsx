'use client';
import { useState, useRef, ChangeEvent, FormEvent } from 'react';
import { useSession, signIn } from 'next-auth/react';
import { Upload, FileText, CheckCircle, AlertCircle, X } from 'lucide-react';

const EXAM_TYPES = [
  { value: 'mid', label: 'Mid Semester' },
  { value: 'end', label: 'End Semester' },
  { value: 'sup', label: 'Supplementary' },
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
  const fileRef = useRef<HTMLInputElement>(null);

  const [subjectCode, setSubjectCode] = useState('');
  const [courseTitle, setCourseTitle] = useState('');
  const [month, setMonth] = useState('Nov');
  const [year, setYear] = useState(String(currentYear - 1));
  const [examType, setExamType] = useState('mid');
  const [file, setFile] = useState<File | null>(null);
  const [state, setState] = useState<UploadState>('idle');
  const [progress, setProgress] = useState(0);
  const [errorMsg, setErrorMsg] = useState('');

  function buildFilename() {
    const formattedTitle = courseTitle.trim() ? courseTitle.trim().replace(/[^a-zA-Z0-9]+/g, '_') + '_' : '';
    const codePart = subjectCode.trim() ? subjectCode.trim().toUpperCase() + '_' : '';
    return `${formattedTitle}${codePart}${month}${year}_${examType}.pdf`;
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
      reader.onload = () => {
        const result = reader.result as string;
        // result is data:application/pdf;base64,XXXXX
        resolve(result.split(',')[1]);
      };
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!session || !file) return;

    const code = subjectCode.trim().toUpperCase();
    if (!validateSubjectCode(code)) {
      setErrorMsg('Subject code format invalid. Expected: 22CSE301, 19MA201, etc.');
      return;
    }

    setState('uploading');
    setProgress(0);
    setErrorMsg('');

    try {
      const filename = buildFilename();
      setProgress(10);

      // Read entire file as base64
      const base64Content = await readFileAsBase64(file);
      setProgress(30);

      // Single-shot upload
      const res = await fetch('/api/upload/simple', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          subjectCode: code,
          courseTitle: courseTitle.trim(),
          month,
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
    } catch (err: any) {
      setErrorMsg(err.message || 'Something went wrong. Please try again.');
      setState('error');
    }
  }

  function reset() {
    setFile(null);
    setSubjectCode('');
    setCourseTitle('');
    setMonth('Nov');
    setYear(String(currentYear - 1));
    setExamType('mid');
    setState('idle');
    setProgress(0);
    setErrorMsg('');
    if (fileRef.current) fileRef.current.value = '';
  }

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

  if (state === 'success') {
    return (
      <div style={{ textAlign: 'center', padding: '48px 24px' }}>
        <div style={{ width: 64, height: 64, background: 'rgba(16,185,129,0.12)', border: '1px solid rgba(16,185,129,0.3)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px' }}>
          <CheckCircle size={28} style={{ color: '#6ee7b7' }} />
        </div>
        <h2 style={{ marginBottom: 10, color: 'var(--text-primary)' }}>Upload Successful!</h2>
        <p style={{ color: 'var(--text-muted)', marginBottom: 8 }}>
          <strong style={{ fontFamily: 'JetBrains Mono, monospace', color: 'var(--text-secondary)' }}>{buildFilename()}</strong> has been committed to the repository.
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

  return (
    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      {/* Course Title */}
      <div className="input-group">
        <label className="input-label" htmlFor="course-title-input">Course Title *</label>
        <input
          id="course-title-input"
          className="input"
          type="text"
          value={courseTitle}
          onChange={(e) => setCourseTitle(e.target.value)}
          placeholder="e.g. Data Structures and Algorithms"
          maxLength={30}
          required
          disabled={uploading}
        />
      </div>

      {/* Subject Code */}
      <div className="input-group">
        <label className="input-label" htmlFor="subject-code-input">Subject Code *</label>
        <input
          id="subject-code-input"
          className={`input ${subjectCode && !validateSubjectCode(subjectCode) ? 'input-error' : ''}`}
          type="text"
          value={subjectCode}
          onChange={(e) => setSubjectCode(e.target.value.toUpperCase())}
          placeholder="e.g. 22CSE301"
          maxLength={10}
          required
          disabled={uploading}
          style={{ fontFamily: 'JetBrains Mono, monospace', letterSpacing: '0.05em' }}
        />
        {subjectCode && !validateSubjectCode(subjectCode) && (
          <p style={{ fontSize: '0.78rem', color: 'var(--error)', marginTop: 4 }}>
            Format: 2 digits + 2–4 uppercase letters + 3 digits (e.g. 22CSE301, 19MA201)
          </p>
        )}
      </div>

      {/* Month + Year + Type */}
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

      {/* Filename preview */}
      <div style={{ padding: '10px 14px', background: 'rgba(124,58,237,0.06)', border: '1px solid rgba(124,58,237,0.15)', borderRadius: 'var(--radius-sm)' }}>
        <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>File will be saved as: </span>
        <code style={{ fontSize: '0.85rem', color: 'var(--violet-light)', fontFamily: 'JetBrains Mono, monospace' }}>
          {courseTitle.trim() || 'SUBJECT_TITLE'}/{subjectCode || 'SUBJECT_CODE'}/{month}/{buildFilename()}
        </code>
      </div>

      {/* File picker */}
      <div className="input-group">
        <label className="input-label">PDF File * (max 2 MB)</label>
        <div
          onClick={() => !uploading && fileRef.current?.click()}
          style={{
            border: `2px dashed ${file ? 'rgba(124,58,237,0.4)' : 'var(--border)'}`,
            borderRadius: 'var(--radius-md)',
            padding: '28px 20px',
            textAlign: 'center',
            cursor: uploading ? 'not-allowed' : 'pointer',
            transition: 'border-color 0.2s, background 0.2s',
            background: file ? 'rgba(124,58,237,0.04)' : 'transparent',
          }}
        >
          {file ? (
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10 }}>
              <FileText size={20} style={{ color: 'var(--violet-light)' }} />
              <span style={{ color: 'var(--text-primary)', fontWeight: 500 }}>{file.name}</span>
              <span style={{ color: 'var(--text-muted)', fontSize: '0.82rem' }}>({(file.size / 1024).toFixed(0)} KB)</span>
              <button type="button" onClick={(e) => { e.stopPropagation(); setFile(null); if (fileRef.current) fileRef.current.value = ''; }}
                style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', display: 'flex' }}>
                <X size={15} />
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

      {/* Progress */}
      {uploading && (
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
            <span style={{ fontSize: '0.82rem', color: 'var(--text-secondary)' }}>
              Uploading… {progress}%
            </span>
            <span style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>{progress}%</span>
          </div>
          <div className="progress-bar">
            <div className="progress-fill" style={{ width: `${progress}%` }} />
          </div>
        </div>
      )}

      {/* Error */}
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
        {uploading ? <><span className="spinner" />Uploading…</> : <><Upload size={16} />Upload Paper</>}
      </button>
    </form>
  );
}
