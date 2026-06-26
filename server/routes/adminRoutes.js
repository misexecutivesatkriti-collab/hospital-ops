const express = require('express');
const bcrypt = require('bcryptjs');
const supabase = require('../supabase');
const { authMiddleware } = require('../auth');
const router = express.Router();

router.use(authMiddleware);

router.get('/', async (req, res) => {
  const { data, error } = await supabase
    .from('admins').select('id, name, username, email, is_main, permissions, created_at')
    .order('is_main', { ascending: false });
  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
});

router.post('/', async (req, res) => {
  if (!req.user.is_main) return res.status(403).json({ error: 'Main admin only' });
  const { name, username, password, email, permissions } = req.body;
  const hash = bcrypt.hashSync(password, 10);
  const { data, error } = await supabase.from('admins').insert({
    name: name || username, username, password: hash, email, permissions: permissions || {}
  }).select().single();
  if (error) return res.status(500).json({ error: error.message });
  res.json({ id: data.id });
});

router.put('/:id/permissions', async (req, res) => {
  if (!req.user.is_main) return res.status(403).json({ error: 'Main admin only' });
  const { permissions } = req.body;
  const { error } = await supabase.from('admins').update({ permissions }).eq('id', req.params.id).eq('is_main', false);
  if (error) return res.status(500).json({ error: error.message });
  res.json({ success: true });
});

router.delete('/:id', async (req, res) => {
  if (!req.user.is_main) return res.status(403).json({ error: 'Main admin only' });
  await supabase.from('admins').delete().eq('id', req.params.id).eq('is_main', false);
  res.json({ success: true });
});

module.exports = router;
