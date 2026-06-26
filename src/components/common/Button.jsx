const VARIANTS = {
  teal: 'bg-[#0d7377] hover:bg-[#14a5ab] text-white',
  red: 'bg-[#c0392b] hover:bg-[#e74c3c] text-white',
  green: 'bg-[#1a7a4a] hover:bg-[#27ae60] text-white',
  blue: 'bg-[#1a56db] hover:bg-[#3b82f6] text-white',
  gold: 'bg-[#d4920a] hover:bg-[#f5c842] hover:text-[#0a0f1e] text-white',
  orange: 'bg-[#c05a00] hover:bg-orange-600 text-white',
  gray: 'bg-[#6b7a90] hover:bg-slate-600 text-white',
  purple: 'bg-[#6d28d9] hover:bg-purple-600 text-white',
  outline: 'bg-transparent border-[1.5px] border-[#0d7377] text-[#0d7377] hover:bg-[#0d7377] hover:text-white',
  print: 'bg-[#2d6a4f] hover:bg-[#1b4332] text-white',
  excel: 'bg-[#217346] hover:bg-[#1a5c38] text-white',
  ghost: 'bg-transparent hover:bg-slate-100 text-slate-600',
};

export function Button({ variant = 'teal', size = 'md', children, className = '', loading = false, ...props }) {
  const sizes = { sm: 'px-3 py-1.5 text-[11px]', md: 'px-3.5 py-[7px] text-[12px]', lg: 'px-5 py-2.5 text-[13px]' };
  return (
    <button
      className={`inline-flex items-center gap-1.5 rounded-lg border-0 cursor-pointer font-extrabold uppercase tracking-wide transition-all duration-150 hover:-translate-y-0.5 hover:shadow-md active:translate-y-0 active:scale-[.97] disabled:opacity-60 disabled:cursor-not-allowed ${VARIANTS[variant]} ${sizes[size]} ${className}`}
      disabled={loading || props.disabled}
      {...props}
    >
      {loading && <span className="inline-block w-3.5 h-3.5 border-2 border-white/40 border-t-white rounded-full animate-spin" />}
      {children}
    </button>
  );
}
