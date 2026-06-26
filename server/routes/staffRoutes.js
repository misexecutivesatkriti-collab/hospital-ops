const express = require('express');
const bcrypt = require('bcryptjs');
const supabase = require('../supabase');
const { authMiddleware } = require('../auth');
const router = express.Router();

router.use(authMiddleware);

router.get('/', async (req, res) => {
  const { data, error } = await supabase
    .from('staff').select('id, name, username, designation, email, created_at, departments(name)')
    .is('deleted_at', null).order('name');
  if (error) return res.status(500).json({ error: error.message });
  res.json(data.map(s => ({ ...s, dept_name: s.departments?.name })));
});

router.post('/', async (req, res) => {
  const { name, username, password, department_id, designation, email } = req.body;
  const hash = bcrypt.hashSync(password, 10);
  const { data, error } = await supabase.from('staff').insert({
    name, username, password: hash,
    department_id: department_id || null,
    designation, email
  }).select().single();
  if (error) return res.status(500).json({ error: error.message });
  res.json({ id: data.id });
});

router.delete('/:id', async (req, res) => {
  const { error } = await supabase.from('staff').update({ deleted_at: new Date().toISOString() }).eq('id', req.params.id);
  if (error) return res.status(500).json({ error: error.message });
  res.json({ success: true });
});

router.post('/:id/handover', async (req, res) => {
  const { pending_work, supervisor, reason } = req.body;
  const { error } = await supabase.from('handovers').insert({
    staff_id: req.params.id, pending_work, supervisor, reason
  });
  if (error) return res.status(500).json({ error: error.message });
  res.json({ success: true });
});

router.get('/handovers', async (req, res) => {
  const { data, error } = await supabase
    .from('handovers').select('*, staff(name)').order('created_at', { ascending: false });
  if (error) return res.status(500).json({ error: error.message });
  res.json(data.map(h => ({ ...h, staff_name: h.staff?.name })));
});

module.exports = router;
