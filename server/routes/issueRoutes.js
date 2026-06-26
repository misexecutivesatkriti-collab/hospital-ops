const express = require('express');
const supabase = require('../supabase');
const { authMiddleware } = require('../auth');
const router = express.Router();

router.use(authMiddleware);

router.get('/', async (req, res) => {
  const { data, error } = await supabase
    .from('issues').select('*, departments(name)')
    .is('deleted_at', null).order('created_at', { ascending: false });
  if (error) return res.status(500).json({ error: error.message });
  res.json(data.map(i => ({ ...i, dept_name: i.departments?.name })));
});

router.post('/', async (req, res) => {
  const { title, department_id, priority, description } = req.body;
  const { data, error } = await supabase.from('issues').insert({
    title, department_id: department_id || null, priority, description,
    reported_by: req.user.username
  }).select().single();
  if (error) return res.status(500).json({ error: error.message });
  res.json({ id: data.id });
});

router.put('/:id/resolve', async (req, res) => {
  const { resolution_remarks } = req.body;
  const { error } = await supabase.from('issues').update({
    status: 'resolved', resolved_at: new Date().toISOString(), resolution_remarks
  }).eq('id', req.params.id);
  if (error) return res.status(500).json({ error: error.message });
  res.json({ success: true });
});

router.delete('/:id', async (req, res) => {
  const { error } = await supabase.from('issues').update({ deleted_at: new Date().toISOString() }).eq('id', req.params.id);
  if (error) return res.status(500).json({ error: error.message });
  res.json({ success: true });
});

module.exports = router;
