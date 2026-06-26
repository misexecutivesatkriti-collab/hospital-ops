import { useState } from 'react';
import { Modal } from './Modal';
import { toDay } from '../../utils';

const IS = { width: '100%', padding: '9px 13px', borderRadius: 8, border: '1.5px solid #d8e2ef', fontFamily: "'Nunito',sans-serif", fontSize: 13, color: '#1a2535', outline: 'none', background: 'white', fontWeight: 600 };
function Field({ label, children }) {
  return <div style={{ marginBottom: 13 }}><label style={{ display: 'block', fontSize: 11, fontWeight: 800, color: '#6b7a90', textTransform: 'uppercase', letterSpacing: 0.4, marginBottom: 5 }}>{label}</label>{children}</div>;
}

export function DateRangeExportModal({ open, onClose, onExport, title = 'Export to Excel' }) {
  const today = toDay();
  const [from, setFrom] = useState('');
  const [to, setTo] = useState('');
  const [err, setErr] = useState('');

  function handleExport() {
    if (!from || !to) { setErr('Please fill in both dates'); return; }
    if (from > to) { setErr('From date must be before To date'); return; }
    setErr('');
    onExport(from, to);
    onClose();
  }

  function handleClose() {
    setErr('');
    onClose();
  }

  return (
    <Modal open={open} onClose={handleClose} title={`📊 ${title}`} maxWidth="max-w-sm">
      <div style={{ background: '#f0f9ff', border: '1px solid #bae6fd', borderRadius: 8, padding: '10px 13px', marginBottom: 14, fontSize: 12, color: '#0369a1' }}>
        Data will be filtered by date range and exported to Excel.
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
        <Field label="From Date *">
          <input type="date" value={from} max={to || today} onChange={e => { setFrom(e.target.value); setErr(''); }} style={IS} />
        </Field>
        <Field label="To Date *">
          <input type="date" value={to} min={from} max={today} onChange={e => { setTo(e.target.value); setErr(''); }} style={IS} />
        </Field>
      </div>
      {err && <div style={{ color: '#c0392b', fontSize: 12, fontWeight: 700, marginBottom: 10 }}>⚠️ {err}</div>}
      <div style={{ display: 'flex', gap: 8, marginTop: 4 }}>
        <button onClick={handleExport} style={{ flex: 1, padding: '9px 0', borderRadius: 8, background: '#1a7a4a', color: 'white', border: 'none', cursor: 'pointer', fontWeight: 800, fontSize: 13 }}>
          ⬇ Export Excel
        </button>
        <button onClick={handleClose} style={{ padding: '9px 16px', borderRadius: 8, background: 'transparent', color: '#0d7377', border: '1.5px solid #0d7377', cursor: 'pointer', fontWeight: 800, fontSize: 13 }}>
          Cancel
        </button>
      </div>
    </Modal>
  );
}
