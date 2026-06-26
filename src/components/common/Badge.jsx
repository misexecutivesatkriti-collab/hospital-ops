const VARIANTS = {
  green: 'bg-emerald-100 text-emerald-800',
  red: 'bg-red-100 text-red-800',
  gold: 'bg-amber-100 text-amber-800',
  teal: 'bg-teal-100 text-teal-800',
  blue: 'bg-blue-100 text-blue-800',
  gray: 'bg-slate-100 text-slate-600',
  orange: 'bg-orange-100 text-orange-800',
  purple: 'bg-purple-100 text-purple-800',
  navy: 'bg-[#0b1e3d] text-amber-300',
};

const PRIORITY_MAP = {
  high: { variant: 'red', label: '🔴 HIGH' },
  medium: { variant: 'gold', label: '🟡 MEDIUM' },
  low: { variant: 'green', label: '🟢 LOW' },
};

const STATUS_MAP = {
  open: { variant: 'red', label: 'OPEN' },
  resolved: { variant: 'green', label: 'RESOLVED' },
  'in-progress': { variant: 'gold', label: 'IN PROGRESS' },
};

const HO_STATUS_MAP = {
  pending: { variant: 'gold', label: 'PENDING' },
  complete: { variant: 'green', label: 'COMPLETE' },
  'in-progress': { variant: 'teal', label: 'IN PROGRESS' },
};

export function Badge({ variant = 'gray', children, className = '' }) {
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10.5px] font-extrabold whitespace-nowrap ${VARIANTS[variant] || VARIANTS.gray} ${className}`}>
      {children}
    </span>
  );
}

export function PriorityBadge({ priority }) {
  const m = PRIORITY_MAP[priority] || { variant: 'gray', label: '—' };
  return <Badge variant={m.variant}>{m.label}</Badge>;
}

export function StatusBadge({ status }) {
  const m = STATUS_MAP[status] || { variant: 'gray', label: '—' };
  return <Badge variant={m.variant}>{m.label}</Badge>;
}

export function HandoverStatusBadge({ status }) {
  const m = HO_STATUS_MAP[status] || { variant: 'gray', label: '—' };
  return <Badge variant={m.variant}>{m.label}</Badge>;
}

export function DeptTag({ name }) {
  return (
    <span className="inline-block px-2 py-0.5 rounded text-[11px] font-extrabold bg-blue-50 text-blue-700">
      {name || '—'}
    </span>
  );
}

export function FreqBadge({ freq }) {
  const labels = { daily: 'DAILY', '15-day': 'HAR 15 DIN', monthly: 'MONTHLY', quarterly: 'QUARTERLY', 'half-yearly': 'HALF-YEARLY', yearly: 'YEARLY' };
  return <Badge variant="gray">{labels[freq] || freq?.toUpperCase()}</Badge>;
}
