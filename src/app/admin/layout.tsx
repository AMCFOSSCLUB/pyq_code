import { getAdminSession } from '@/backend/services/auth';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import {
  ShieldCheck,
  LayoutDashboard,
  FileText,
  Eye,
  Flag,
  BarChart2,
  GraduationCap
} from 'lucide-react';

const NAV_ITEMS = [
  { href: '/admin', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/admin/logs', label: 'Upload Logs', icon: FileText },
  { href: '/admin/audit', label: 'Audit Log', icon: Eye },

  // NEW
  { href: '/admin/departments', label: 'Departments', icon: GraduationCap },

  { href: '/admin/reports', label: 'Reports', icon: Flag },
  { href: '/admin/analytics', label: 'Analytics', icon: BarChart2 },
];

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await getAdminSession();
  if (!session) redirect('/');

  const adminGitHub = (session.user as any).login;

  return (
    <div style={{ display: 'flex', minHeight: '100vh', paddingTop: 64 }}>
      {/* Sidebar */}
      <aside style={{
        width: 230, flexShrink: 0,
        background: 'var(--bg-secondary)',
        borderRight: '1px solid var(--border)',
        padding: '28px 12px',
        position: 'sticky', top: 64, height: 'calc(100vh - 64px)',
        overflowY: 'auto',
      }}>
        {/* Admin badge */}
        <div style={{ padding: '10px 12px', marginBottom: 20, background: 'rgba(124,58,237,0.1)', border: '1px solid rgba(124,58,237,0.2)', borderRadius: 'var(--radius-md)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <ShieldCheck size={14} style={{ color: 'var(--violet-light)' }} />
            <span style={{ fontSize: '0.78rem', fontWeight: 600, color: 'var(--violet-light)' }}>Admin Panel</span>
          </div>
          <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: 4 }}>@{adminGitHub}</p>
        </div>

        {/* Nav */}
        <nav style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          {NAV_ITEMS.map(({ href, label, icon: Icon }) => (
            <Link
              key={href}
              href={href}
              style={{
                display: 'flex', alignItems: 'center', gap: 10,
                padding: '10px 12px', borderRadius: 'var(--radius-sm)',
                color: 'var(--text-secondary)', fontSize: '0.875rem',
                fontWeight: 500, textDecoration: 'none',
                transition: 'background 0.15s, color 0.15s',
              }}
              className="admin-nav-link"
            >
              <Icon size={15} />{label}
            </Link>
          ))}
        </nav>
      </aside>

      {/* Main */}
      <main style={{ flex: 1, padding: '36px 32px', minWidth: 0 }}>
        {children}
      </main>

    </div>
  );
}
