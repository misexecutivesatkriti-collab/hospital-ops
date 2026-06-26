const express = require('express');
const supabase = require('../supabase');
const { authMiddleware } = require('../auth');
const router = express.Router();

router.use(authMiddleware);

router.get('/', async (req, res) => {
  const { data, error } = await supabase
    .from('tasks')
    .select('*, departments(name)')
    .is('deleted_at', null)
    .order('created_at', { ascending: false });
  if (error) return res.status(500).json({ error: error.message });
  res.json(data.map(t => ({ ...t, dept_name: t.departments?.name })));
});

router.post('/', async (req, res) => {
  const { title, department_id, frequency, priority, notes, scheduled_date, assigned_to } = req.body;
  const { data, error } = await supabase.from('tasks').insert({
    title, department_id: department_id || null, frequency, priority, notes,
    scheduled_date: scheduled_date || null,
    assigned_to: assigned_to || [],
    created_by: req.user.id
  }).select().single();
  if (error) return res.status(500).json({ error: error.message });
  res.json({ id: data.id });
});

router.put('/:id/complete', async (req, res) => {
  const { completion_note, delay_reason } = req.body;
  const { error } = await supabase.from('tasks').update({
    status: 'completed', completed_at: new Date().toISOString(),
    completion_note, delay_reason
  }).eq('id', req.params.id);
  if (error) return res.status(500).json({ error: error.message });
  res.json({ success: true });
});

router.delete('/:id', async (req, res) => {
  const { error } = await supabase.from('tasks').update({ deleted_at: new Date().toISOString() }).eq('id', req.params.id);
  if (error) return res.status(500).json({ error: error.message });
  res.json({ success: true });
});

router.delete('/:id/permanent', async (req, res) => {
  if (!req.user.is_main) return res.status(403).json({ error: 'Main admin only' });
  await supabase.from('tasks').delete().eq('id', req.params.id);
  res.json({ success: true });
});

module.exports = router;
