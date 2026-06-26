import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useApp } from '../context/AppContext';
import { uid, exportToExcel } from '../utils';
import { sendWelcomeEmail } from '../lib/emailService';
import { ALL_PERMS } from '../constants';
import { Modal } from '../components/common/Modal';
import { EmptyState } from '../components/common/Alert';
import { Pagination, paginate } from '../components/common/Pagination';

const IS = { width: '100%', padding: '9px 13px', borderRadius: 8, border: '1.5px solid #d8e2ef', fontFamily: "'Nunito',sans-serif", fontSize: 13, color: '#1a2535', outline: 'none', background: 'white', fontWeight: 600 };
function Field({ label, children }) {
  return <div style={{ marginBottom: 13 }}><label style={{ display: 'block', fontSize: 11, fontWeight: 800, color: '#6b7a90', textTransform: 'uppercase', letterSpacing: 0.4, marginBottom: 5 }}>{label}</label>{children}</div>;
}

function EmpPwField({ value, onChange }) {
  const [show, setShow] = useState(false);
  return (
    <div style={{ position: 'relative' }}>
      <input type={show ? 'text' : 'password'} value={value} onChange={(e) => onChange(e.target.value)} placeholder="SET PASSWORD" style={{ ...IS, paddingRight: 40 }} />
      <button type="button" onClick={() => setShow((s) => !s)} tabIndex={-1} style={{ position: 'absolute', right: 10, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', fontSize: 15, color: '#6b7a90', lineHeight: 1 }}>
        {show ? '🙈' : '👁️'}
      </button>
    </div>
  );
}

export default function Staff() {
  const { hasPerm, currentRole } = useAuth();
  const { employees, depts, save, logAct, moveToTrash } = useApp();
  const [search, setSearch] = useState('');
  const [filterDept, setFilterDept] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editEmp, setEditEmp] = useState(null);
  const [form, setForm] = useState({ name: '', dept: '', role: '', contact: '', email: '', password: '' });
  const [perms, setPerms] = useState([]);
  const [page, setPage] = useState(1);

  const canEdit = currentRole === 'mainadmin' || hasPerm('employees_edit');

  const filtered = employees.filter((e) => {
    if (search && !e.name.toUpperCase().includes(search.toUpperCase())) return false;
    if (filterDept && e.dept !== filterDept) return false;
    return true;
  });
  const paged = paginate(filtered, page);

  function openNew() { setForm({ name: '', dept: '', role: '', contact: '', email: '', password: '' }); setPerms([]); setEditEmp(null); setShowForm(true); }
  function openEdit(e) { setForm({ name: e.name, dept: e.dept, role: e.role || '', contact: e.contact || '', email: e.email || '', password: e.password || '' }); setPerms(e.perms || []); setEditEmp(e); setShowForm(true); }

  async function handleSave() {
    if (!form.name.trim() || !form.dept) { alert('Name and Department required!'); return; }
    if (!editEmp && !form.password.trim()) { alert('Password required for new staff!'); return; }
    const obj = { id: editEmp?.id || uid(), name: form.name.toUpperCase().trim(), dept: form.dept, role: form.role.toUpperCase(), contact: form.contact, email: form.email, password: form.password || editEmp?.password || '', perms };
    const isNew = !editEmp;
    const newEmps = editEmp ? employees.map((e) => e.id === obj.id ? obj : e) : [...employees, obj];
    await save('hops-employees', newEmps);
    await logAct(editEmp ? 'EMPLOYEE UPDATED' : 'EMPLOYEE ADDED', obj.name);
    if (isNew && obj.email) sendWelcomeEmail(obj);
    setShowForm(false);
  }

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 18, flexWrap: 'wrap', gap: 8 }}>
        <h2 style={{ fontFamily: "'Playfair Display',serif", fontSize: 19, color: '#0b1e3d' }}>Employee List</h2>
        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
          <button onClick={() => exportToExcel(filtered.map(e => ({ Name: e.name, Department: e.dept, Role: e.role, Contact: e.contact, Email: e.email })), 'employees-export')} style={{ padding: '7px 14px', borderRadius: 8, background: '#1a7a4a', color: 'white', border: 'none', cursor: 'pointer', fontWeight: 800, fontSize: 12 }}>⬇ Export</button>
          <button onClick={() => window.print()} style={{ padding: '7px 14px', borderRadius: 8, background: '#334155', color: 'white', border: 'none', cursor: 'pointer', fontWeight: 800, fontSize: 12 }}>🖨 Print</button>
          {canEdit && <button onClick={openNew} style={{ padding: '7px 14px', borderRadius: 8, background: '#0d7377', color: 'white', border: 'none', cursor: 'pointer', fontWeight: 800, fontSize: 12 }}>+ Add Employee</button>}
        </div>
      </div>

      <div style={{ display: 'flex', gap: 8, marginBottom: 14, flexWrap: 'wrap' }}>
        <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="🔍 SEARCH..." style={{ ...IS, flex: 1, minWidth: 160 }} />
        <select value={filterDept} onChange={(e) => setFilterDept(e.target.value)} style={{ ...IS, width: 'auto' }}>
          <option value="">ALL DEPTS</option>
          {depts.map((d) => <option key={d.id} value={d.name}>{d.name}</option>)}
        </select>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(240px,1fr))', gap: 12 }}>
        {paged.items.length ? paged.items.map((e) => (
          <div key={e.id} style={{ background: 'white', borderRadius: 12, border: '1px solid #d8e2ef', padding: 16, position: 'relative' }}>
            <div style={{ width: 44, height: 44, borderRadius: '50%', background: '#e8f4fd', color: '#0d7377', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: 18, marginBottom: 10 }}>
              {e.name.charAt(0)}
            </div>
            <div style={{ fontWeight: 800, fontSize: 14, marginBottom: 3 }}>{e.name}</div>
            <div style={{ fontSize: 11, color: '#6b7a90', marginBottom: 2 }}>👔 {e.role || '—'}</div>
            <div style={{ fontSize: 11, color: '#6b7a90', marginBottom: 2 }}>🏢 {e.dept || '—'}</div>
            {e.contact && <div style={{ fontSize: 11, color: '#6b7a90' }}>📞 {e.contact}</div>}
            {canEdit && (
              <div style={{ display: 'flex', gap: 5, marginTop: 12 }}>
                <button onClick={() => openEdit(e)} style={{ flex: 1, padding: '5px 0', borderRadius: 7, background: '#e8f4fd', color: '#0d7377', border: 'none', cursor: 'pointer', fontWeight: 700, fontSize: 11 }}>✏️ Edit</button>
                <button onClick={async () => { if (confirm('Remove employee?')) { await moveToTrash('employee', e.id); } }} style={{ padding: '5px 9px', borderRadius: 7, background: 'transparent', border: '1px solid #d8e2ef', cursor: 'pointer', fontSize: 12 }}>🗑️</button>
              </div>
            )}
          </div>
        )) : <div style={{ gridColumn: '1/-1' }}><EmptyState icon="👥" message="KOI EMPLOYEES NAHI" /></div>}
      </div>
      <Pagination {...paged} onPage={(p) => setPage(p)} />

      <Modal open={showForm} onClose={() => setShowForm(false)} title={editEmp ? 'Edit Employee' : 'Add Employee'}>
        <Field label="Full Name *">
          <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="EMPLOYEE NAME" style={IS} autoFocus />
        </Field>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
          <Field label="Department *">
            <select value={form.dept} onChange={(e) => setForm({ ...form, dept: e.target.value })} style={IS}>
              <option value="">Select...</option>
              {depts.map((d) => <option key={d.id} value={d.name}>{d.name}</option>)}
            </select>
          </Field>
          <Field label="Role / Designation">
            <input value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })} placeholder="NURSE / WARD BOY..." style={IS} />
          </Field>
          <Field label="Contact Number">
            <input value={form.contact} onChange={(e) => setForm({ ...form, contact: e.target.value })} placeholder="PHONE" style={IS} />
          </Field>
          <Field label="Email">
            <input value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="EMAIL" style={IS} />
          </Field>
        </div>
        <Field label={editEmp ? 'Password (leave blank = no change)' : 'Password *'}>
          <EmpPwField value={form.password} onChange={(v) => setForm({ ...form, password: v })} />
        </Field>

        {/* Permissions — only mainadmin can set */}
        {currentRole === 'mainadmin' && (
          <div style={{ marginTop: 8 }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
              <label style={{ fontSize: 11, fontWeight: 800, color: '#6b7a90', textTransform: 'uppercase', letterSpacing: 0.4 }}>
                🔐 Admin Permissions
              </label>
              <div style={{ display: 'flex', gap: 6 }}>
                <button type="button" onClick={() => setPerms(ALL_PERMS.map((p) => p.id))} style={{ fontSize: 10, fontWeight: 800, padding: '3px 8px', borderRadius: 5, border: '1.5px solid #0d7377', background: '#e8f8ef', color: '#0d7377', cursor: 'pointer' }}>Select All</button>
                <button type="button" onClick={() => setPerms([])} style={{ fontSize: 10, fontWeight: 800, padding: '3px 8px', borderRadius: 5, border: '1.5px solid #d8e2ef', background: 'transparent', color: '#6b7a90', cursor: 'pointer' }}>Clear</button>
              </div>
            </div>
            <div style={{ border: '1.5px solid #d8e2ef', borderRadius: 8, padding: '10px 12px', background: '#f8fbff', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '4px 12px', maxHeight: 220, overflowY: 'auto' }}>
              {ALL_PERMS.map((p) => (
                <label key={p.id} style={{ display: 'flex', alignItems: 'center', gap: 7, fontSize: 11.5, fontWeight: 600, cursor: 'pointer', padding: '5px 7px', borderRadius: 6, background: perms.includes(p.id) ? '#e8f8ef' : 'transparent', border: `1px solid ${perms.includes(p.id) ? '#86efac' : 'transparent'}`, transition: 'all 0.15s' }}>
                  <input
                    type="checkbox"
                    checked={perms.includes(p.id)}
                    onChange={() => setPerms((prev) => prev.includes(p.id) ? prev.filter((x) => x !== p.id) : [...prev, p.id])}
                    style={{ width: 13, height: 13, accentColor: '#0d7377', cursor: 'pointer' }}
                  />
                  {p.label}
                </label>
              ))}
            </div>
            {perms.length > 0 && (
              <div style={{ marginTop: 5, fontSize: 11, color: '#0d7377', fontWeight: 700 }}>
                ✅ {perms.length} permission{perms.length > 1 ? 's' : ''} selected — employee will login as Admin
              </div>
            )}
          </div>
        )}

        <div style={{ display: 'flex', gap: 8, marginTop: 16, paddingTop: 16, borderTop: '1px solid #d8e2ef' }}>
          <button onClick={handleSave} style={{ padding: '9px 18px', borderRadius: 8, background: '#0d7377', color: 'white', border: 'none', cursor: 'pointer', fontWeight: 800, fontSize: 13 }}>💾 Save</button>
          <button onClick={() => setShowForm(false)} style={{ padding: '9px 18px', borderRadius: 8, background: 'transparent', color: '#0d7377', border: '1.5px solid #0d7377', cursor: 'pointer', fontWeight: 800, fontSize: 13 }}>Cancel</button>
        </div>
      </Modal>
    </div>
  );
}
