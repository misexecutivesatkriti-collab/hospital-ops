const express = require('express');
const supabase = require('../supabase');
const { authMiddleware } = require('../auth');
const router = express.Router();

router.use(authMiddleware);

router.get('/', async (req, res) => {
  const [tasks, issues, depts, staff] = await Promise.all([
    supabase.from('tasks').select('id, title, deleted_at').not('deleted_at', 'is', null),
    supabase.from('issues').select('id, title, deleted_at').not('deleted_at', 'is', null),
    supabase.from('departments').select('id, name, deleted_at').not('deleted_at', 'is', null),
    supabase.from('staff').select('id, name, deleted_at').not('deleted_at', 'is', null),
  ]);
  const all = [
    ...(tasks.data || []).map(r => ({ ...r, type: 'task' })),
    ...(issues.data || []).map(r => ({ ...r, type: 'issue' })),
    ...(depts.data || []).map(r => ({ ...r, title: r.name, type: 'department' })),
    ...(staff.data || []).map(r => ({ ...r, title: r.name, type: 'staff' })),
  ].sort((a, b) => new Date(b.deleted_at) - new Date(a.deleted_at));
  res.json(all);
});

router.post('/restore/:type/:id', async (req, res) => {
  const tableMap = { task: 'tasks', issue: 'issues', department: 'departments', staff: 'staff' };
  const table = tableMap[req.params.type];
  if (!table) return res.status(400).json({ error: 'Invalid type' });
  await supabase.from(table).update({ deleted_at: null }).eq('id', req.params.id);
  res.json({ success: true });
});

router.delete('/permanent/:type/:id', async (req, res) => {
  if (!req.user.is_main) return res.status(403).json({ error: 'Main admin only' });
  const tableMap = { task: 'tasks', issue: 'issues', department: 'departments', staff: 'staff' };
  const table = tableMap[req.params.type];
  if (!table) return res.status(400).json({ error: 'Invalid type' });
  await supabase.from(table).delete().eq('id', req.params.id);
  res.json({ success: true });
});

router.delete('/clear-all', async (req, res) => {
  if (!req.user.is_main) return res.status(403).json({ error: 'Main admin only' });
  await Promise.all([
    supabase.from('tasks').delete().not('deleted_at', 'is', null),
    supabase.from('issues').delete().not('deleted_at', 'is', null),
    supabase.from('departments').delete().not('deleted_at', 'is', null),
    supabase.from('staff').delete().not('deleted_at', 'is', null),
  ]);
  res.json({ success: true });
});

module.exports = router;
