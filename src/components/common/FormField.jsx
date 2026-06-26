export function FormField({ label, error, children, className = '' }) {
  return (
    <div className={`flex flex-col gap-1 mb-3 ${className}`}>
      {label && (
        <label className="text-[11px] font-extrabold text-slate-500 uppercase tracking-[0.4px]">
          {label}
        </label>
      )}
      {children}
      {error && <span className="text-[11px] text-red-600 font-semibold">{error}</span>}
    </div>
  );
}

const inputBase =
  'w-full px-3 py-2 rounded-lg border-[1.5px] border-slate-200 font-[Nunito,sans-serif] text-[13px] text-slate-800 font-semibold outline-none transition-colors focus:border-[#0d7377] bg-white disabled:bg-slate-50 disabled:text-slate-400 disabled:cursor-not-allowed';

export function Input({ className = '', ...props }) {
  return <input className={`${inputBase} ${className}`} {...props} />;
}

export function Select({ children, className = '', ...props }) {
  return (
    <select className={`${inputBase} ${className}`} {...props}>
      {children}
    </select>
  );
}

export function Textarea({ className = '', ...props }) {
  return <textarea className={`${inputBase} min-h-[70px] resize-y ${className}`} {...props} />;
}

export function PwField({ id, label, value, onChange, placeholder = '••••••', autoComplete = 'current-password' }) {
  const [show, setShow] = window.React ? window.React.useState(false) : [false, () => {}];
  // Use a closure workaround for useState in non-hook context
  return null; // placeholder — use PwInput component below
}

import { useState } from 'react';
export function PwInput({ className = '', ...props }) {
  const [show, setShow] = useState(false);
  return (
    <div className="relative">
      <input
        type={show ? 'text' : 'password'}
        className={`${inputBase} pr-10 ${className}`}
        {...props}
      />
      <button
        type="button"
        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-teal-600 text-sm transition-colors"
        onClick={() => setShow((s) => !s)}
        tabIndex={-1}
      >
        {show ? '🙈' : '👁️'}
      </button>
    </div>
  );
}

export function FormGrid({ children, cols = 2 }) {
  return (
    <div className={`grid grid-cols-1 ${cols === 2 ? 'sm:grid-cols-2' : ''} gap-3`}>
      {children}
    </div>
  );
}

export function FullCol({ children }) {
  return <div className="sm:col-span-2">{children}</div>;
}

export function FormActions({ children }) {
  return (
    <div className="flex gap-2 mt-5 pt-4 border-t border-slate-200">
      {children}
    </div>
  );
}
