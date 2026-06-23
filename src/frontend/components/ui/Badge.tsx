interface BadgeProps {
  children: React.ReactNode;
  variant?: 'violet' | 'cyan' | 'green' | 'red' | 'yellow' | 'gray';
}

export function Badge({ children, variant = 'gray' }: BadgeProps) {
  return <span className={`badge badge-${variant}`}>{children}</span>;
}

export function StatusBadge({ status }: { status: string }) {
  const map: Record<string, { variant: BadgeProps['variant']; label: string }> = {
    active:  { variant: 'green',  label: 'Active' },
    removed: { variant: 'red',    label: 'Removed' },
    flagged: { variant: 'yellow', label: 'Flagged' },
  };
  const cfg = map[status] ?? { variant: 'gray', label: status };
  return <Badge variant={cfg.variant}>{cfg.label}</Badge>;
}
