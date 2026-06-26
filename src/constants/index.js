export const MAIN_ADMIN_USER = 'VIBHAV';
export const MAIN_ADMIN_PASS = 'Vibhav@0206';
export const INACTIVITY_MS = 5 * 60 * 1000;
export const ONE_YEAR_MS = 365 * 24 * 60 * 60 * 1000;

export const FREQ_LABELS = {
  daily: 'DAILY',
  '15-day': 'HAR 15 DIN',
  monthly: 'MONTHLY',
  quarterly: 'QUARTERLY',
  'half-yearly': 'HALF-YEARLY',
  yearly: 'YEARLY',
  delegation: '📤 DELEGATION',
};

export const ALL_PERMS = [
  { id: 'tasks_view', label: 'Tasks Dekhna' },
  { id: 'tasks_add', label: 'Task Add Karna' },
  { id: 'tasks_edit', label: 'Task Edit Karna' },
  { id: 'tasks_delete', label: 'Task Delete Karna' },
  { id: 'tasks_assign', label: 'Task Assign Karna' },
  { id: 'issues_view', label: 'Issues Dekhna' },
  { id: 'issues_add', label: 'Issue Report Karna' },
  { id: 'issues_resolve', label: 'Issue Resolve Karna' },
  { id: 'employees_view', label: 'Employees Dekhna' },
  { id: 'employees_edit', label: 'Employee Add/Edit' },
  { id: 'handover_view', label: 'Handover Dekhna' },
  { id: 'handover_edit', label: 'Handover Add/Edit' },
  { id: 'departments_view', label: 'Departments Dekhna' },
  { id: 'departments_edit', label: 'Dept Add/Edit' },
  { id: 'tracking_view', label: 'Live Tracking' },
  { id: 'checklist_view', label: 'Checklists Dekhna' },
  { id: 'escalation_view', label: 'Escalation Tracker' },
  { id: 'mis_view', label: 'MIS Report Dekhna' },
  { id: 'trash_view', label: 'Trash Dekhna' },
  { id: 'delegation_view', label: 'Delegation Dekhna' },
  { id: 'delegation_add', label: 'Delegation Add/Manage' },
  { id: 'all_task_details', label: 'All Task Details Dekhna' },
];

export const PRIORITY_OPTIONS = [
  { value: 'high', label: '🔴 HIGH' },
  { value: 'medium', label: '🟡 MEDIUM' },
  { value: 'low', label: '🟢 LOW' },
];

export const FREQ_OPTIONS = [
  { value: 'daily', label: 'DAILY' },
  { value: '15-day', label: 'HAR 15 DIN' },
  { value: 'monthly', label: 'MONTHLY' },
  { value: 'quarterly', label: 'QUARTERLY' },
  { value: 'half-yearly', label: 'HALF-YEARLY' },
  { value: 'yearly', label: 'YEARLY' },
  { value: 'delegation', label: '📤 DELEGATION (ONE-TIME)' },
];

export const NAV_ITEMS_ADMIN = [
  { group: 'OVERVIEW', items: [{ id: 'dashboard', label: 'Dashboard', icon: '📊', perm: null }] },
  {
    group: 'TASKS & CHECKLISTS',
    items: [
      { id: 'tasks', label: 'Manage Tasks', icon: '✅', perm: 'tasks_view', badge: 'tasks' },
      { id: 'checklist', label: 'Checklists', icon: '📋', perm: 'checklist_view' },
    ],
  },
  {
    group: 'ISSUES',
    items: [
      { id: 'issues', label: 'Issues', icon: '⚠️', perm: 'issues_view', badge: 'issues' },
      { id: 'escalation', label: 'Escalation', icon: '🔺', perm: 'escalation_view', badge: 'escalation' },
    ],
  },
  {
    group: 'STAFF & DEPTS',
    items: [
      { id: 'employees', label: 'Employees', icon: '👥', perm: 'employees_view' },
      { id: 'handover', label: 'Handover', icon: '🔄', perm: 'handover_view', badge: 'handover' },
      { id: 'departments', label: 'Departments', icon: '🏢', perm: 'departments_view' },
    ],
  },
  {
    group: 'DELEGATION',
    items: [
      { id: 'delegation', label: 'Delegation', icon: '📤', perm: 'delegation_view', badge: 'delegation' },
      { id: 'tracking', label: 'Live Tracking', icon: '📈', perm: 'tracking_view' },
    ],
  },
  {
    group: 'MAIN ADMIN',
    mainAdminOnly: true,
    items: [
      { id: 'admins', label: 'Admin List', icon: '👨‍💼', perm: null },
      { id: 'activity', label: 'Activity Log', icon: '📜', perm: null },
      { id: 'mis', label: 'MIS Reporting', icon: '📑', perm: null },
    ],
  },
  {
    group: 'REPORTS',
    items: [{ id: 'mis', label: 'MIS Reporting', icon: '📑', perm: 'mis_view' }],
    adminOnly: true,
  },
  {
    group: 'SYSTEM',
    items: [
      { id: 'trash', label: 'Trash', icon: '🗑️', perm: 'trash_view' },
      { id: 'link-box', label: 'Link Box', icon: '🔗', perm: null },
      { id: 'settings', label: 'Settings', icon: '⚙️', perm: null },
    ],
  },
];

export const NAV_ITEMS_STAFF = [
  {
    group: 'OVERVIEW',
    items: [{ id: 'dashboard', label: 'Dashboard', icon: '📊' }],
  },
  {
    group: 'MY WORK',
    items: [
      { id: 'my-tasks', label: 'My Tasks', icon: '✅', badge: 'myTasks' },
      { id: 'assign-task', label: 'Assign Task', icon: '📋' },
    ],
  },
  {
    group: 'REPORT',
    items: [
      { id: 'report-issue', label: 'Report Problem', icon: '⚠️' },
      { id: 'all-issues', label: 'All Issues', icon: '📋', badge: 'issues' },
      { id: 'my-handover', label: 'Handover Form', icon: '🔄' },
      { id: 'my-delegation', label: 'My Delegations', icon: '📤', badge: 'myDelegation' },
    ],
  },
  {
    group: 'TOOLS',
    items: [
      { id: 'link-box', label: 'Link Box', icon: '🔗' },
      { id: 'settings', label: 'Settings', icon: '⚙️' },
    ],
  },
];
