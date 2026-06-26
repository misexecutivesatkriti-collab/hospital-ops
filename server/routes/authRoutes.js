const express = require('express');
const bcrypt = require('bcryptjs');
const supabase = require('../supabase');
const { signToken, authMiddleware } = require('../auth');
const router = express.Router();

router.post('/admin/login', async (req, res) => {
  const { username, password } = req.body;
  const { data: admin, error } = await supabase
    .from('admins').select('*').eq('username', username).single();
  if (error || !admin || !bcrypt.compareSync(password, admin.password))
    return res.status(401).json({ error: 'Invalid credentials' });
  const token = signToken({ id: admin.id, role: 'admin', username: admin.username, is_main: admin.is_main });
  res.json({ token, user: { id: admin.id, username: admin.username, role: 'admin', is_main: admin.is_main, permissions: admin.permissions || {} } });
});

router.post('/staff/login', async (req, res) => {
  const { username, password } = req.body;
  const { data: staff, error } = await supabase
    .from('staff').select('*, departments(name)').eq('username', username).is('deleted_at', null).single();
  if (error || !staff || !bcrypt.compareSync(password, staff.password))
    return res.status(401).json({ error: 'Invalid credentials' });
  const token = signToken({ id: staff.id, role: 'staff', username: staff.username });
  res.json({ token, user: { id: staff.id, username: staff.username, name: staff.name, role: 'staff', department: staff.departments?.name, designation: staff.designation } });
});

router.post('/change-password', authMiddleware, async (req, res) => {
  const { current_password, new_password } = req.body;
  const table = req.user.role === 'admin' ? 'admins' : 'staff';
  const { data: row } = await supabase.from(table).select('*').eq('id', req.user.id).single();
  if (!row || !bcrypt.compareSync(current_password, row.password))
    return res.status(400).json({ error: 'Current password incorrect' });
  const hash = bcrypt.hashSync(new_password, 10);
  await supabase.from(table).update({ password: hash }).eq('id', req.user.id);
  res.json({ success: true });
});

module.exports = router;
