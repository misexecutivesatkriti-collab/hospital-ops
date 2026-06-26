import { createContext, useContext, useState, useCallback, useEffect, useRef } from 'react';
import { ls } from '../utils';
import { MAIN_ADMIN_USER, MAIN_ADMIN_PASS, INACTIVITY_MS } from '../constants';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [currentRole, setCurrentRole] = useState('');
  const [currentUser, setCurrentUser] = useState({ name: '', dept: '', adminId: '', perms: {} });
  const [savedStaffName, setSavedStaffName] = useState(() => ls.get('hops-saved-staff-name', ''));
  const inactivityTimer = useRef(null);
  const inactivityInterval = useRef(null);
  const [inactivityPct, setInactivityPct] = useState(100);
  const [inactivityWarning, setInactivityWarning] = useState(false);
  const [inactivitySeconds, setInactivitySeconds] = useState(INACTIVITY_MS / 1000);
  const [showSessionModal, setShowSessionModal] = useState(false);
  const currentRoleRef = useRef(currentRole);
  currentRoleRef.current = currentRole;

  const clearSession = useCallback(() => localStorage.removeItem('hops-session'), []);

  const stopInactivityTimer = useCallback(() => {
    clearTimeout(inactivityTimer.current);
    clearInterval(inactivityInterval.current);
    setInactivityWarning(false);
    setInactivityPct(100);
  }, []);

  const logout = useCallback(() => {
    clearSession();
    stopInactivityTimer();
    setCurrentRole('');
    setCurrentUser({ name: '', dept: '', adminId: '', perms: {} });
  }, [clearSession, stopInactivityTimer]);

  const startInactivityTimer = useCallback(() => {
    clearTimeout(inactivityTimer.current);
    clearInterval(inactivityInterval.current);
    setInactivityWarning(false);
    setInactivityPct(100);
    let secs = INACTIVITY_MS / 1000;
    setInactivitySeconds(secs);

    inactivityTimer.current = setTimeout(() => {
      setShowSessionModal(true);
    }, INACTIVITY_MS);

    inactivityInterval.current = setInterval(() => {
      secs -= 1;
      setInactivitySeconds(secs);
      setInactivityPct((secs / (INACTIVITY_MS / 1000)) * 100);
      if (secs <= 60) setInactivityWarning(true);
      if (secs <= 0) clearInterval(inactivityInterval.current);
    }, 1000);
  }, [logout]);

  const resetInactivity = useCallback(() => {
    if (!currentRoleRef.current) return;
    startInactivityTimer();
  }, [startInactivityTimer]);

  const continueSession = useCallback(() => {
    setShowSessionModal(false);
    startInactivityTimer();
  }, [startInactivityTimer]);

  useEffect(() => {
    if (!currentRole) return;
    startInactivityTimer();
    const events = ['mousemove', 'keydown', 'mousedown', 'touchstart', 'click', 'scroll'];
    events.forEach((ev) => document.addEventListener(ev, resetInactivity, { passive: true }));
    return () => {
      events.forEach((ev) => document.removeEventListener(ev, resetInactivity));
      stopInactivityTimer();
    };
  }, [currentRole]);

  // Restore session on mount
  useEffect(() => {
    const s = ls.get('hops-session', null);
    if (s?.role && s?.user?.name) {
      setCurrentRole(s.role);
      setCurrentUser(s.user);
    }
  }, []);

  const hasPerm = useCallback(
    (p) => {
      if (currentRole === 'mainadmin') return true;
      if (currentRole === 'admin') return currentUser.perms?.[p] === true;
      return false;
    },
    [currentRole, currentUser]
  );

  // Called by AppContext after employees load to keep perms fresh without re-login.
  // Also promotes staff → admin if permissions are added while they are logged in.
  const refreshPermsFromEmployees = useCallback((employees) => {
    if (currentRole !== 'admin' && currentRole !== 'staff') return;
    const empId = currentUser?.empId;
    if (!empId) return;
    const emp = employees.find((e) => e.id === empId);
    if (!emp) return;
    const permsArray = Array.isArray(emp.perms) ? emp.perms : [];
    const newPermsObj = {};
    permsArray.forEach((p) => { newPermsObj[p] = true; });

    if (currentRole === 'staff' && permsArray.length > 0) {
      // Staff employee just got permissions — promote to admin role live
      const updatedUser = { ...currentUser, perms: newPermsObj, dept: emp.dept };
      setCurrentRole('admin');
      setCurrentUser(updatedUser);
      ls.set('hops-session', { role: 'admin', user: updatedUser });
      return;
    }

    const permsChanged = JSON.stringify(newPermsObj) !== JSON.stringify(currentUser.perms || {});
    const deptChanged = emp.dept !== currentUser.dept;
    if (!permsChanged && !deptChanged) return;

    const updatedUser = { ...currentUser, perms: newPermsObj, dept: emp.dept };
    setCurrentUser(updatedUser);
    ls.set('hops-session', { role: currentRole, user: updatedUser });
  }, [currentRole, currentUser]);

  const adminLogin = useCallback(
    (username, password) => {
      if (!username || !password) return { ok: false, error: '❌ Please enter your username and password.' };
      if (
        username.toUpperCase() === MAIN_ADMIN_USER.toUpperCase() &&
        (password === MAIN_ADMIN_PASS || password.trim() === MAIN_ADMIN_PASS)
      ) {
        const user = { name: MAIN_ADMIN_USER, dept: 'MAIN ADMIN', adminId: 'mainadmin', perms: {} };
        setCurrentRole('mainadmin');
        setCurrentUser(user);
        ls.set('hops-session', { role: 'mainadmin', user });
        return { ok: true, role: 'mainadmin' };
      }
      return { ok: false };
    },
    []
  );

  const staffLogin = useCallback(
    (nameRaw, password, employees) => {
      if (!nameRaw || !password) return { ok: false, error: '❌ Please enter your username and password.' };
      const nUp = nameRaw.toUpperCase();
      const emp = employees.find((e) => {
        const nameMatch = e.name === nUp || e.name === nameRaw;
        const usernameMatch = e.username && (e.username === nameRaw || e.username.toLowerCase() === nameRaw.toLowerCase());
        if (!nameMatch && !usernameMatch) return false;
        return e.password === password || e.password === password.trim();
      });
      if (!emp) return { ok: false, error: '❌ Username ya Password galat hai!' };

      const hasPerms = Array.isArray(emp.perms) && emp.perms.length > 0;
      if (hasPerms) {
        // Employee with permissions → admin role
        const permsObj = {};
        emp.perms.forEach((p) => { permsObj[p] = true; });
        const user = { name: emp.name, dept: emp.dept, empId: emp.id, username: emp.username || emp.name, perms: permsObj };
        setCurrentRole('admin');
        setCurrentUser(user);
        ls.set('hops-session', { role: 'admin', user });
        return { ok: true, role: 'admin' };
      }

      // Regular staff
      const user = { name: emp.name, dept: emp.dept, empId: emp.id, username: emp.username || emp.name, perms: {} };
      setSavedStaffName(emp.name);
      ls.set('hops-saved-staff-name', emp.name);
      setCurrentRole('staff');
      setCurrentUser(user);
      ls.set('hops-session', { role: 'staff', user });
      return { ok: true, role: 'staff' };
    },
    []
  );

  return (
    <AuthContext.Provider value={{
      currentRole, currentUser, savedStaffName,
      hasPerm, refreshPermsFromEmployees, adminLogin, staffLogin, logout,
      inactivityPct, inactivityWarning, inactivitySeconds,
      showSessionModal, continueSession,
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};
