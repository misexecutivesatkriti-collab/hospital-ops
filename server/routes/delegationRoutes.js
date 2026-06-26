const express = require('express');
const supabase = require('../supabase');
const { authMiddleware } = require('../auth');
const router = express.Router();

router.use(authMiddleware);

router.get('/', async (req, res) => {
  const { data, error } = await supabase
    .from('delegations').select('*').is('deleted_at', null).order('created_at', { ascending: false });
  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
});

router.post('/', async (req, res) => {
  const { title, delegated_to, priority, expected_date, notes } = req.body;
  const { data, error } = await supabase.from('delegations').insert({
    title, delegated_to, priority,
    expected_date: expected_date || null, notes
  }).select().single();
  if (error) return res.status(500).json({ error: error.message });
  res.json({ id: data.id });
});

router.put('/:id/complete', async (req, res) => {
  const { completion_note, delay_reason } = req.body;
  const { error } = await supabase.from('delegations').update({
    status: 'completed', completed_at: new Date().toISOString(),
    completion_note, delay_reason
  }).eq('id', req.params.id);
  if (error) return res.status(500).json({ error: error.message });
  res.json({ success: true });
});

router.put('/:id/extend', async (req, res) => {
  const { expected_date } = req.body;
  const { error } = await supabase.from('delegations').update({ expected_date }).eq('id', req.params.id);
  if (error) return res.status(500).json({ error: error.message });
  res.json({ success: true });
});

router.delete('/:id', async (req, res) => {
  const { error } = await supabase.from('delegations').update({ deleted_at: new Date().toISOString() }).eq('id', req.params.id);
  if (error) return res.status(500).json({ error: error.message });
  res.json({ success: true });
});

module.exports = router;
