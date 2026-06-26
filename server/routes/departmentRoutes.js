const express = require('express');
const supabase = require('../supabase');
const { authMiddleware } = require('../auth');
const router = express.Router();

router.use(authMiddleware);

router.get('/', async (req, res) => {
  const { data, error } = await supabase
    .from('departments').select('*').is('deleted_at', null).order('name');
  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
});

router.post('/', async (req, res) => {
  const { name, head_role, contact } = req.body;
  const { data, error } = await supabase.from('departments').insert({ name, head_role, contact }).select().single();
  if (error) return res.status(500).json({ error: error.message });
  res.json({ id: data.id });
});

router.delete('/:id', async (req, res) => {
  const { error } = await supabase.from('departments').update({ deleted_at: new Date().toISOString() }).eq('id', req.params.id);
  if (error) return res.status(500).json({ error: error.message });
  res.json({ success: true });
});

module.exports = router;
