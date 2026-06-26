const VARIANTS = {
  red: 'bg-red-50 text-red-800 border-l-red-500',
  gold: 'bg-amber-50 text-amber-800 border-l-amber-500',
  teal: 'bg-teal-50 text-teal-800 border-l-teal-500',
  blue: 'bg-blue-50 text-blue-800 border-l-blue-500',
  green: 'bg-emerald-50 text-emerald-800 border-l-emerald-500',
  orange: 'bg-orange-50 text-orange-800 border-l-orange-500',
  gray: 'bg-slate-50 text-slate-700 border-l-slate-400',
  purple: 'bg-purple-50 text-purple-800 border-l-purple-500',
};

export function Alert({ variant = 'blue', children, className = '' }) {
  return (
    <div className={`px-4 py-3 rounded-lg text-[12.5px] mb-3 flex items-start gap-2.5 border-l-[3px] ${VARIANTS[variant]} ${className}`}>
      {children}
    </div>
  );
}

export function EmptyState({ icon = '📋', message = 'NO DATA' }) {
  return (
    <div className="text-center py-12 text-slate-400">
      <div className="text-4xl mb-2">{icon}</div>
      <p className="font-bold text-sm">{message}</p>
    </div>
  );
}
