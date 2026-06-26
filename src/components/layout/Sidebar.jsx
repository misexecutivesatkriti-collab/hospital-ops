import { NavLink, useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  LayoutDashboard, CheckSquare, List, AlertTriangle, TrendingUp,
  Users, RefreshCw, Building2, Share2, Activity, UserCog,
  FileText, BarChart2, Trash2, Link2, Settings, ShieldCheck,
  ClipboardList, AlertOctagon, LogOut
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useEffect, useState } from 'react';
import { api } from '../../lib/api';

export default function Sidebar() {
  const { user, logout, isMainadmin, isAdmin } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [badges, setBadges] = useState({ tasks: 0, issues: 0, delegations: 0 });

  const roleType = user?.roleType || user?.role || 'staff';
  const isMain = isMainadmin;
  const isAdminRole = isAdmin && !isMain;
  const isStaff = roleType === 'staff';

  useEffect(() => {
    Promise.all([
      api.get('/tasks').catch(() => []),
      api.get('/issues').catch(() => []),
      api.get('/delegations').catch(() => []),
    ]).then(([tasks, issues, delegations]) => {
      setBadges({
        tasks: tasks.filter(t => t.status === 'pending').length,
        issues: issues.filter(i => i.status === 'open').length,
        delegations: delegations.filter(d => d.status === 'pending').length,
      });
    });
  }, [location.pathname]);

  const handleLogout = () => { logout(); navigate('/login'); };

  const initials = (name) => {
    if (!name) return '?';
    return name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2);
  };

  const roleChip = {
    mainadmin: { bg: 'var(--warning-light)', color: '#92400E', label: '👑 Main Admin' },
    admin:     { bg: 'var(--primary-light)', color: 'var(--primary)', label: '🛡️ Admin' },
    staff:     { bg: 'var(--success-light)', color: 'var(--success)', label: '👷 Staff' },
  };
  const chip = roleChip[roleType] || roleChip.staff;

  const hasPerm = (p) => {
    if (isMain) return true;
    if (isAdminRole) return !!(user?.permissions?.[p]);
    return false;
  };

  const NavItem = ({ to, Icon, label, badge }) => {
    const isActive = location.pathname === to;
    return (
      <NavLink to={to}
        style={{
          display: 'flex', alignItems: 'center', gap: 8, padding: '0 12px',
          borderRadius: 8, fontSize: 13, fontWeight: isActive ? 700 : 600,
          textDecoration: 'none', cursor: 'pointer', transition: 'all 0.15s',
          marginBottom: 2, height: 36,
          color: isActive ? 'var(--primary)' : 'var(--text-secondary)',
          background: isActive ? 'var(--primary-light)' : 'transparent',
          borderLeft: isActive ? '3px solid var(--primary)' : '3px solid transparent',
        }}
        onMouseEnter={e => {
          if (!isActive) {
            e.currentTarget.style.background = '#F1F5F9';
            e.currentTarget.style.color = 'var(--text)';
          }
        }}
        onMouseLeave={e => {
          if (!isActive) {
            e.currentTarget.style.background = 'transparent';
            e.currentTarget.style.color = 'var(--text-secondary)';
          }
        }}
      >
        <Icon size={15} style={{ flexShrink: 0 }} />
        <span style={{ flex: 1 }}>{label}</span>
        {badge > 0 && (
          <span style={{
            background: 'var(--danger)', color: 'white', borderRadius: 20,
            fontSize: 10, fontWeight: 700, minWidth: 18, height: 18,
            display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '0 5px',
          }}>
            {badge > 99 ? '99+' : badge}
          </span>
        )}
      </NavLink>
    );
  };

  const Group = ({ label }) => (
    <div style={{
      fontSize: 10, fontWeight: 700, color: 'var(--text-muted)',
      letterSpacing: 0.8, textTransform: 'uppercase',
      padding: '14px 16px 5px',
    }}>
      {label}
    </div>
  );

  return (
    <motion.aside
      initial={{ x: -10, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      style={{
        width: 260,
        background: 'var(--sidebar-bg)',
        borderRight: '1px solid var(--border)',
        boxShadow: '1px 0 0 var(--border)',
        display: 'flex',
        flexDirection: 'column',
        height: '100vh',
        position: 'fixed',
        left: 0, top: 0, bottom: 0,
        zIndex: 30,
        fontFamily: "'Nunito', sans-serif",
        overflowY: 'auto',
      }}
    >
      {/* Brand */}
      <div style={{
        padding: '16px 16px 14px',
        borderBottom: '1px solid var(--border)',
        flexShrink: 0,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
          <div style={{
            width: 32, height: 32, borderRadius: 10,
            background: 'linear-gradient(135deg, #2563EB, #7C3AED)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 16, flexShrink: 0,
          }}>🏥</div>
          <div>
            <div style={{
              fontFamily: "'Nunito', sans-serif",
              fontSize: 15, color: 'var(--navy)', fontWeight: 800, lineHeight: 1.2,
            }}>Hospital Ops</div>
            <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 1 }}>Management System</div>
          </div>
        </div>
        <div style={{
          display: 'inline-flex', alignItems: 'center',
          padding: '3px 10px', borderRadius: 20,
          background: chip.bg, color: chip.color,
          fontSize: 10, fontWeight: 700,
        }}>
          {chip.label}
        </div>
      </div>

      {/* Nav */}
      <nav style={{ flex: 1, padding: '4px 8px 10px', overflowY: 'auto' }}>
        <Group label="Overview" />
        <NavItem to="/dashboard" Icon={LayoutDashboard} label="Dashboard" />

        {(isMain || isAdminRole) && (<>
          <Group label="Tasks & Checklists" />
          {(isMain || hasPerm('tasks_view')) && <NavItem to="/tasks" Icon={CheckSquare} label="Manage Tasks" badge={badges.tasks} />}
          {(isMain || hasPerm('checklist_view')) && <NavItem to="/checklist" Icon={ClipboardList} label="Checklists" />}

          <Group label="Issues" />
          {(isMain || hasPerm('issues_view')) && <NavItem to="/issues" Icon={AlertTriangle} label="Issues" badge={badges.issues} />}
          {(isMain || hasPerm('escalation_view')) && <NavItem to="/escalation" Icon={AlertOctagon} label="Escalation" />}

          <Group label="Staff & Depts" />
          {(isMain || hasPerm('employees_view')) && <NavItem to="/staff" Icon={Users} label="Employees" />}
          {(isMain || hasPerm('handover_view')) && <NavItem to="/handover" Icon={RefreshCw} label="Handover" />}
          {(isMain || hasPerm('departments_view')) && <NavItem to="/departments" Icon={Building2} label="Departments" />}

          <Group label="Delegation" />
          {(isMain || hasPerm('delegation_view')) && <NavItem to="/delegations" Icon={Share2} label="Delegation" badge={badges.delegations} />}
          {(isMain || hasPerm('tracking_view')) && <NavItem to="/tracking" Icon={TrendingUp} label="Live Tracking" />}

          {isMain && (<>
            <Group label="Main Admin" />
            <NavItem to="/admins" Icon={ShieldCheck} label="Admin List" />
            <NavItem to="/activity" Icon={Activity} label="Activity Log" />
            <NavItem to="/mis" Icon={BarChart2} label="MIS Reporting" />
          </>)}
          {!isMain && hasPerm('mis_view') && (<>
            <Group label="Reports" />
            <NavItem to="/mis" Icon={BarChart2} label="MIS Reporting" />
          </>)}

          <Group label="System" />
          {(isMain || hasPerm('trash_view')) && <NavItem to="/trash" Icon={Trash2} label="Trash" />}
          <NavItem to="/links" Icon={Link2} label="Link Box" />
          <NavItem to="/settings" Icon={Settings} label="Settings" />
        </>)}

        {isStaff && (<>
          <Group label="My Work" />
          <NavItem to="/my-tasks" Icon={CheckSquare} label="My Tasks" badge={badges.tasks} />
          <NavItem to="/assign-task" Icon={ClipboardList} label="Assign Task" />

          <Group label="Report" />
          <NavItem to="/report-issue" Icon={AlertTriangle} label="Report Problem" />
          <NavItem to="/all-issues" Icon={List} label="All Issues" />
          <NavItem to="/my-handover" Icon={RefreshCw} label="Handover Form" />
          <NavItem to="/my-delegations" Icon={Share2} label="My Delegations" />

          <Group label="Tools" />
          <NavItem to="/links" Icon={Link2} label="Link Box" />
          <NavItem to="/settings" Icon={Settings} label="Settings" />
        </>)}
      </nav>

      {/* Footer */}
      <div style={{ padding: '10px 10px 14px', borderTop: '1px solid var(--border)', flexShrink: 0 }}>
        <div style={{
          display: 'flex', alignItems: 'center', gap: 9, padding: '8px 10px',
          borderRadius: 10, background: 'var(--bg)', marginBottom: 8,
          border: '1px solid var(--border)',
        }}>
          <div style={{
            width: 32, height: 32, borderRadius: '50%',
            background: 'linear-gradient(135deg, #2563EB, #7C3AED)',
            color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontWeight: 800, fontSize: 12, flexShrink: 0,
          }}>
            {initials(user?.name || user?.username)}
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{
              fontSize: 13, color: 'var(--navy)', fontWeight: 700,
              overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
            }}>{user?.name || user?.username}</div>
            <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 1 }}>
              {user?.department || roleType}
            </div>
          </div>
        </div>
        <button
          onClick={handleLogout}
          style={{
            width: '100%', display: 'flex', alignItems: 'center', gap: 7,
            padding: '7px 12px', borderRadius: 8, border: '1px solid var(--border)',
            cursor: 'pointer', background: 'transparent', color: 'var(--text-secondary)',
            fontFamily: "'Nunito', sans-serif", fontSize: 12, fontWeight: 700,
            transition: 'all 0.15s',
          }}
          onMouseEnter={e => {
            e.currentTarget.style.background = 'var(--danger-light)';
            e.currentTarget.style.color = 'var(--danger)';
            e.currentTarget.style.borderColor = 'var(--danger)';
          }}
          onMouseLeave={e => {
            e.currentTarget.style.background = 'transparent';
            e.currentTarget.style.color = 'var(--text-secondary)';
            e.currentTarget.style.borderColor = 'var(--border)';
          }}
        >
          <LogOut size={13} /> Sign Out
        </button>
      </div>
    </motion.aside>
  );
}
