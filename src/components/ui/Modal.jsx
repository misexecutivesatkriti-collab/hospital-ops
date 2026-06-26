import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';

const SIZES = { sm: 440, md: 560, lg: 720, xl: 900 };

export function Modal({ open, onClose, title, children, size = 'md' }) {
  if (!open) return null;
  return (
    <AnimatePresence>
      {open && (
        <div style={{
          position: 'fixed', inset: 0, zIndex: 1000,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          padding: 20,
        }}>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={onClose}
            style={{
              position: 'absolute', inset: 0,
              background: 'rgba(15,23,42,0.5)',
              backdropFilter: 'blur(8px)',
            }}
          />
          {/* Panel */}
          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: 14 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 14 }}
            transition={{ type: 'spring', duration: 0.28, bounce: 0.18 }}
            style={{
              position: 'relative', zIndex: 1,
              background: 'white',
              borderRadius: 16,
              width: '100%',
              maxWidth: SIZES[size] || 560,
              maxHeight: '85vh',
              overflowY: 'auto',
              boxShadow: '0 20px 60px rgba(0,0,0,0.15), 0 8px 24px rgba(0,0,0,0.08)',
            }}
          >
            {/* Header */}
            <div style={{
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              padding: '20px 24px',
              borderBottom: '1px solid var(--border)',
              background: 'white',
              borderRadius: '16px 16px 0 0',
              position: 'sticky', top: 0, zIndex: 2,
            }}>
              <h2 style={{
                fontFamily: "'Nunito', sans-serif",
                fontSize: 16, fontWeight: 700, color: 'var(--text)',
                margin: 0,
              }}>{title}</h2>
              <button
                onClick={onClose}
                style={{
                  background: '#F1F5F9', border: 'none', borderRadius: 8,
                  width: 28, height: 28, display: 'flex', alignItems: 'center',
                  justifyContent: 'center', cursor: 'pointer', transition: 'background 0.15s',
                  color: 'var(--text-secondary)', flexShrink: 0,
                }}
                onMouseEnter={e => e.currentTarget.style.background = '#E2E8F0'}
                onMouseLeave={e => e.currentTarget.style.background = '#F1F5F9'}
              >
                <X size={16} />
              </button>
            </div>
            {/* Body */}
            <div style={{ padding: '24px' }}>
              {children}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
