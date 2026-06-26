-- Run this entire file in Supabase → SQL Editor → New Query

-- Departments
create table if not exists departments (
  id uuid primary key default gen_random_uuid(),
  name text unique not null,
  head_role text,
  contact text,
  created_at timestamptz default now(),
  deleted_at timestamptz
);

-- Admins
create table if not exists admins (
  id uuid primary key default gen_random_uuid(),
  username text unique not null,
  password text not null,
  email text,
  is_main boolean default false,
  permissions jsonb default '{}',
  created_at timestamptz default now()
);

-- Staff
create table if not exists staff (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  username text unique not null,
  password text not null,
  department_id uuid references departments(id),
  designation text,
  email text,
  created_at timestamptz default now(),
  deleted_at timestamptz
);

-- Tasks
create table if not exists tasks (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  department_id uuid references departments(id),
  frequency text default 'DAILY',
  priority text default 'medium',
  notes text,
  scheduled_date date,
  assigned_to jsonb default '[]',
  created_by uuid,
  status text default 'pending',
  created_at timestamptz default now(),
  completed_at timestamptz,
  completion_note text,
  delay_reason text,
  deleted_at timestamptz
);

-- Issues
create table if not exists issues (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  department_id uuid references departments(id),
  priority text default 'medium',
  description text,
  reported_by text,
  status text default 'open',
  created_at timestamptz default now(),
  resolved_at timestamptz,
  resolution_remarks text,
  deleted_at timestamptz
);

-- Delegations
create table if not exists delegations (
  id uuid primary key default gen_random_uuid(),
  task_id uuid references tasks(id),
  title text not null,
  delegated_to text,
  priority text default 'medium',
  expected_date date,
  notes text,
  status text default 'pending',
  created_at timestamptz default now(),
  completed_at timestamptz,
  completion_note text,
  delay_reason text,
  deleted_at timestamptz
);

-- Handovers
create table if not exists handovers (
  id uuid primary key default gen_random_uuid(),
  staff_id uuid references staff(id),
  pending_work text,
  supervisor text,
  reason text,
  approved boolean default false,
  created_at timestamptz default now()
);

-- Seed: Main admin (password = admin123)
insert into admins (username, password, is_main, permissions)
values (
  'admin',
  '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi',
  true,
  '{"all": true}'
)
on conflict (username) do nothing;

-- Seed: Departments
insert into departments (name, head_role) values
  ('General Ward',   'Head of General Ward'),
  ('ICU',            'Head of ICU'),
  ('OPD',            'Head of OPD'),
  ('Pharmacy',       'Head of Pharmacy'),
  ('Radiology',      'Head of Radiology'),
  ('Laboratory',     'Head of Laboratory'),
  ('Administration', 'Head of Administration')
on conflict (name) do nothing;

-- Disable RLS for all tables (service role bypasses anyway, but this ensures no policy blocks)
alter table departments disable row level security;
alter table admins disable row level security;
alter table staff disable row level security;
alter table tasks disable row level security;
alter table issues disable row level security;
alter table delegations disable row level security;
alter table handovers disable row level security;
