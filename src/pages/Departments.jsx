import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useApp } from '../context/AppContext';
import { uid, exportToExcel } from '../utils';
import { Modal } from '../components/common/Modal';
import { EmptyState } from '../components/common/Alert';

const IS = { width: '100%', padding: '9px 13px', borderRadius: 8, border: '1.5px solid #d8e2ef', fontFamily: "'Nunito',sans-serif", fontSize: 13, color: '#1a2535', outline: 'none', background: 'white', fontWeight: 600 };
function Field({ label, children }) {
  return <div style={{ marginBottom: 13 }}><label style={{ display: 'block', fontSize: 11, fontWeight: 800, color: '#6b7a90', textTransform: 'uppercase', letterSpacing: 0.4, marginBottom: 5 }}>{label}</label>{children}</div>;
}

export default function Departments() {
  const { hasPerm, currentRole } = useAuth();
  const { depts, employees, tasks, issues, save, logAct, moveToTrash } = useApp();
  const [showForm, setShowForm] = useState(false);
  const [editDept, setEditDept] = useState(null);
  const [form, setForm] = useState({ name: '', hod: '', phone: '', email: '', floor: '' });

  const canEdit = currentRole === 'mainadmin' || hasPerm('departments_edit');

  function openNew() { setForm({ name: '', hod: '', phone: '', email: '', floor: '' }); setEditDept(null); setShowForm(true); }
  function openEdit(d) { setForm({ name: d.name, hod: d.hod || '', phone: d.phone || '', email: d.email || '', floor: d.floor || '' }); setEditDept(d); setShowForm(true); }

  async function handleSave() {
    if (!form.name.trim()) { alert('Department name required!'); return; }
    const obj = { id: editDept?.id || uid(), name: form.name.toUpperCase().trim(), hod: form.hod.toUpperCase(), phone: form.phone, email: form.email, floor: form.floor };
    const newDepts = editDept ? depts.map((d) => d.id === obj.id ? obj : d) : [...depts, obj];
    await save('hops-depts', newDepts);
    await logAct(editDept ? 'DEPT UPDATED' : 'DEPT ADDED', obj.name);
    setShowForm(false);
  }

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 18, flexWrap: 'wrap', gap: 8 }}>
        <h2 style={{ fontFamily: "'Playfair Display',serif", fontSize: 19, color: '#0b1e3d' }}>Departments ({depts.length})</h2>
        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
          <button onClick={() => exportToExcel(depts.map(d => ({ Name: d.name, HOD: d.hod, Contact: d.contact, Email: d.email, Floor: d.floor })), 'departments-export')} style={{ padding: '7px 14px', borderRadius: 8, background: '#1a7a4a', color: 'white', border: 'none', cursor: 'pointer', fontWeight: 800, fontSize: 12 }}>⬇ Export</button>
          <button onClick={() => window.print()} style={{ padding: '7px 14px', borderRadius: 8, background: '#334155', color: 'white', border: 'none', cursor: 'pointer', fontWeight: 800, fontSize: 12 }}>🖨 Print</button>
          {canEdit && <button onClick={openNew} style={{ padding: '7px 14px', borderRadius: 8, background: '#0d7377', color: 'white', border: 'none', cursor: 'pointer', fontWeight: 800, fontSize: 12 }}>+ Add Dept</button>}
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(260px,1fr))', gap: 14 }}>
        {depts.length ? depts.map((d) => {
          const dStaff = employees.filter((e) => e.dept === d.name).length;
          const dTasks = tasks.filter((t) => t.dept === d.name).length;
          const dDone = tasks.filter((t) => t.dept === d.name && t.status === 'done').length;
          const dIssues = issues.filter((i) => i.dept === d.name && i.status !== 'resolved').length;
          const pct = dTasks ? Math.round(dDone / dTasks * 100) : 100;
          return (
            <div key={d.id} style={{ background: 'white', borderRadius: 13, border: '1px solid #d8e2ef', padding: 18 }}>
              <div style={{ fontFamily: "'Playfair Display',serif", fontSize: 15, color: '#0b1e3d', marginBottom: 6 }}>🏢 {d.name}</div>
              {d.hod && <div style={{ fontSize: 12, color: '#6b7a90', marginBottom: 2 }}>👨‍⚕️ HOD: {d.hod}</div>}
              {d.phone && <div style={{ fontSize: 12, color: '#6b7a90', marginBottom: 2 }}>📞 {d.phone}</div>}
              {d.floor && <div style={{ fontSize: 12, color: '#6b7a90', marginBottom: 2 }}>🏬 Floor: {d.floor}</div>}
              <div style={{ display: 'flex', gap: 8, marginTop: 10, flexWrap: 'wrap' }}>
                <span style={{ background: '#e8f4fd', color: '#0d7377', padding: '3px 9px', borderRadius: 20, fontSize: 11, fontWeight: 700 }}>👥 {dStaff}</span>
                <span style={{ background: '#d4edda', color: '#1a7a4a', padding: '3px 9px', borderRadius: 20, fontSize: 11, fontWeight: 700 }}>✅ {dDone}/{dTasks}</span>
                {dIssues > 0 && <span style={{ background: '#fde8e8', color: '#c0392b', padding: '3px 9px', borderRadius: 20, fontSize: 11, fontWeight: 700 }}>⚠️ {dIssues}</span>}
              </div>
              <div style={{ marginTop: 8, height: 5, background: '#e4eaf2', borderRadius: 10, overflow: 'hidden' }}>
                <div style={{ height: '100%', width: `${pct}%`, background: pct === 100 ? '#1a7a4a' : pct > 60 ? '#0d7377' : '#d4920a', borderRadius: 10 }} />
              </div>
              <div style={{ fontSize: 10, color: '#6b7a90', textAlign: 'right', marginTop: 2 }}>{pct}%</div>
              {canEdit && (
                <div style={{ display: 'flex', gap: 5, marginTop: 12 }}>
                  <button onClick={() => openEdit(d)} style={{ flex: 1, padding: '5px 0', borderRadius: 7, background: '#e8f4fd', color: '#0d7377', border: 'none', cursor: 'pointer', fontWeight: 700, fontSize: 11 }}>✏️ Edit</button>
                  <button onClick={async () => { if (confirm('Delete dept?')) await moveToTrash('dept', d.id); }} style={{ padding: '5px 9px', borderRadius: 7, background: 'transparent', border: '1px solid #d8e2ef', cursor: 'pointer', fontSize: 12 }}>🗑️</button>
                </div>
              )}
            </div>
          );
        }) : <div style={{ gridColumn: '1/-1' }}><EmptyState icon="🏢" message="KOI DEPARTMENTS NAHI" /></div>}
      </div>

      <Modal open={showForm} onClose={() => setShowForm(false)} title={editDept ? 'Edit Department' : 'Add Department'}>
        <Field label="Department Name *"><input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="e.g. ICU" style={IS} /></Field>
        <Field label="Head of Dept (HOD)"><input value={form.hod} onChange={(e) => setForm({ ...form, hod: e.target.value })} placeholder="DR. NAME" style={IS} /></Field>
        <Field label="Contact / Phone"><input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} placeholder="EXT. NUMBER" style={IS} /></Field>
        <Field label="Email"><input value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="dept@hospital.com" style={IS} /></Field>
        <Field label="Floor / Location"><input value={form.floor} onChange={(e) => setForm({ ...form, floor: e.target.value })} placeholder="2ND FLOOR" style={IS} /></Field>
        <div style={{ display: 'flex', gap: 8, marginTop: 16, paddingTop: 16, borderTop: '1px solid #d8e2ef' }}>
          <button onClick={handleSave} style={{ padding: '9px 18px', borderRadius: 8, background: '#0d7377', color: 'white', border: 'none', cursor: 'pointer', fontWeight: 800, fontSize: 13 }}>💾 Save</button>
          <button onClick={() => setShowForm(false)} style={{ padding: '9px 18px', borderRadius: 8, background: 'transparent', color: '#0d7377', border: '1.5px solid #0d7377', cursor: 'pointer', fontWeight: 800, fontSize: 13 }}>Cancel</button>
        </div>
      </Modal>
    </div>
  );
}
