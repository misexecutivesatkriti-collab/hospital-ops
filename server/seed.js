require('dotenv').config({ path: require('path').join(__dirname, '.env') });
const bcrypt = require('bcryptjs');
const supabase = require('./supabase');

async function seed() {
  console.log('Seeding Supabase...');

  // Seed departments
  const depts = ['General Ward', 'ICU', 'OPD', 'Pharmacy', 'Radiology', 'Laboratory', 'Administration'];
  for (const name of depts) {
    const { error } = await supabase.from('departments').upsert({ name, head_role: `Head of ${name}` }, { onConflict: 'name' });
    if (error) console.error('Dept error:', error.message);
  }
  console.log('✓ Departments seeded');

  // Seed main admin
  const hash = bcrypt.hashSync('admin123', 10);
  const { error: adminErr } = await supabase.from('admins').upsert({
    username: 'admin', password: hash, is_main: true, permissions: { all: true }
  }, { onConflict: 'username' });
  if (adminErr) console.error('Admin error:', adminErr.message);
  else console.log('✓ Admin seeded (username: admin, password: admin123)');

  console.log('\nDone! You can now start the server with: node index.js');
}

seed().catch(console.error);
