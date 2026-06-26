import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useApp } from '../context/AppContext';
import { uid } from '../utils';
import { Modal } from '../components/common/Modal';
import { EmptyState } from '../components/common/Alert';

const IS = { width: '100%', padding: '9px 13px', borderRadius: 8, border: '1.5px solid #d8e2ef', fontFamily: "'Nunito',sans-serif", fontSize: 13, color: '#1a2535', outline: 'none', background: 'white', fontWeight: 600 };
function Field({ label, children }) {
  return <div style={{ marginBottom: 13 }}><label style={{ display: 'block', fontSize: 11, fontWeight: 800, color: '#6b7a90', textTransform: 'uppercase', letterSpacing: 0.4, marginBottom: 5 }}>{label}</label>{children}</div>;
}

export default function Links() {
  const { currentUser } = useAuth();
  const { loadUserLinks, upsertUserLinks, deleteUserLink } = useApp();
  const [links, setLinks] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ name: '', url: '', emoji: '🔗' });

  useEffect(() => {
    loadUserLinks(currentUser.name).then((ls) => setLinks(ls || []));
  }, [currentUser.name]);

  async function handleSave() {
    if (!form.name.trim() || !form.url.trim()) { alert('Name and URL required!'); return; }
    const newLink = { id: uid(), name: form.name.toUpperCase(), url: form.url, emoji: form.emoji || '🔗', addedAt: new Date().toISOString() };
    const updated = [...links, newLink];
    await upsertUserLinks(currentUser.name, updated);
    setLinks(updated);
    setShowForm(false);
    setForm({ name: '', url: '', emoji: '🔗' });
  }

  async function handleDelete(id) {
    if (!confirm('Delete link?')) return;
    await deleteUserLink(id);
    setLinks((prev) => prev.filter((l) => l.id !== id));
  }

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 18 }}>
        <h2 style={{ fontFamily: "'Playfair Display',serif", fontSize: 19, color: '#0b1e3d' }}>🔗 My Link Box</h2>
        <button onClick={() => setShowForm(true)} style={{ padding: '7px 14px', borderRadius: 8, background: '#0d7377', color: 'white', border: 'none', cursor: 'pointer', fontWeight: 800, fontSize: 12 }}>+ Add Link</button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(220px,1fr))', gap: 12 }}>
        {links.length ? links.map((l) => (
          <div key={l.id} style={{ background: 'white', borderRadius: 12, border: '1px solid #d8e2ef', padding: 16 }}>
            <div style={{ fontSize: 13, fontWeight: 800, marginBottom: 8, color: '#0b1e3d' }}>{l.emoji} {l.name}</div>
            <a href={l.url} target="_blank" rel="noopener noreferrer" style={{ fontSize: 11, color: '#0d7377', wordBreak: 'break-all', display: 'block', marginBottom: 10, fontWeight: 600 }}>{l.url}</a>
            <div style={{ display: 'flex', gap: 5 }}>
              <a href={l.url} target="_blank" rel="noopener noreferrer" style={{ flex: 1, padding: '5px 0', borderRadius: 7, background: '#0d7377', color: 'white', cursor: 'pointer', fontWeight: 700, fontSize: 11, textAlign: 'center', textDecoration: 'none', display: 'block' }}>🌐 Open</a>
              <button onClick={() => handleDelete(l.id)} style={{ padding: '5px 9px', borderRadius: 7, background: 'transparent', border: '1px solid #d8e2ef', cursor: 'pointer', fontSize: 12 }}>🗑️</button>
            </div>
          </div>
        )) : <div style={{ gridColumn: '1/-1' }}><EmptyState icon="🔗" message="NO LINKS FOUND — ADD ONE!" /></div>}
      </div>

      <Modal open={showForm} onClose={() => setShowForm(false)} title="Add Link">
        <Field label="Link Name *"><input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="e.g. HOSPITAL PORTAL" style={IS} /></Field>
        <Field label="URL *"><input type="url" value={form.url} onChange={(e) => setForm({ ...form, url: e.target.value })} placeholder="https://..." style={IS} /></Field>
        <Field label="Emoji"><input value={form.emoji} onChange={(e) => setForm({ ...form, emoji: e.target.value })} placeholder="🔗" style={{ ...IS, width: 80 }} /></Field>
        <div style={{ display: 'flex', gap: 8, marginTop: 16, paddingTop: 16, borderTop: '1px solid #d8e2ef' }}>
          <button onClick={handleSave} style={{ padding: '9px 18px', borderRadius: 8, background: '#0d7377', color: 'white', border: 'none', cursor: 'pointer', fontWeight: 800, fontSize: 13 }}>🔗 Save Link</button>
          <button onClick={() => setShowForm(false)} style={{ padding: '9px 18px', borderRadius: 8, background: 'transparent', color: '#0d7377', border: '1.5px solid #0d7377', cursor: 'pointer', fontWeight: 800, fontSize: 13 }}>Cancel</button>
        </div>
      </Modal>
    </div>
  );
}
