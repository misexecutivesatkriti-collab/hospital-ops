const priorityConfigs = {
  high:   { bg: 'var(--danger-light)',  color: 'var(--danger)',  label: 'High' },
  medium: { bg: 'var(--warning-light)', color: '#92400E',        label: 'Medium' },
  low:    { bg: 'var(--success-light)', color: 'var(--success)', label: 'Low' },
};

export function PriorityBadge({ priority }) {
  const c = priorityConfigs[priority] || priorityConfigs.medium;
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: 5,
      height: 22, padding: '0 8px', borderRadius: 6,
      fontSize: 11, fontWeight: 700,
      background: c.bg, color: c.color,
    }}>
      <span style={{
        width: 5, height: 5, borderRadius: '50%',
        background: c.color, flexShrink: 0,
      }} />
      {c.label}
    </span>
  );
}

export function StatusBadge({ status }) {
  const configs = {
    pending:     { bg: '#F1F5F9',             color: 'var(--text-secondary)', label: 'Pending' },
    completed:   { bg: 'var(--success-light)', color: 'var(--success)',        label: 'Completed' },
    open:        { bg: 'var(--primary-light)', color: 'var(--primary)',         label: 'Open' },
    resolved:    { bg: 'var(--success-light)', color: 'var(--success)',        label: 'Resolved' },
    in_progress: { bg: 'var(--warning-light)', color: '#92400E',               label: 'In Progress' },
  };
  const c = configs[status] || configs.pending;
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center',
      height: 22, padding: '0 8px', borderRadius: 6,
      fontSize: 11, fontWeight: 700,
      background: c.bg, color: c.color,
    }}>
      {c.label}
    </span>
  );
}
