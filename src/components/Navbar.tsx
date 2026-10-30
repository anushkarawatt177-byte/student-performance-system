import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { DEMO_USERS } from '../data/mockStudents';
import {
  Bell,
  Sun,
  Moon,
  ChevronDown,
  UserCheck,
  GraduationCap,
  Sparkles,
  AlertTriangle,
  CheckCircle,
  LogIn,
  Search
} from 'lucide-react';

export const Navbar: React.FC = () => {
  const {
    currentUser,
    setCurrentUser,
    students,
    activeStudent,
    setActiveStudent,
    theme,
    toggleTheme,
    notifications,
    markNotificationRead,
    setIsAuthModalOpen,
    searchTerm,
    setSearchTerm,
    setActiveTab,
  } = useApp();

  const [showNotifications, setShowNotifications] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showStudentPicker, setShowStudentPicker] = useState(false);

  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <header className="sticky top-0 z-40 w-full bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-4">
          {/* Brand Logo & Name */}
          <div className="flex items-center gap-3 min-w-0">
            <div className="h-10 w-10 rounded-xl bg-gradient-to-tr from-indigo-700 via-blue-600 to-purple-600 flex items-center justify-center text-white shadow-md shadow-blue-500/20 shrink-0">
              <GraduationCap className="w-5 h-5" />
            </div>
            <div className="min-w-0 cursor-pointer" onClick={() => setActiveTab('overview')}>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-base sm:text-lg text-slate-900 dark:text-white tracking-tight truncate">
                  EduAnalytics <span className="text-blue-600 dark:text-blue-400">AI</span>
                </span>
                <span className="hidden sm:inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-blue-100 dark:bg-blue-950/80 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800">
                  <Sparkles className="w-2.5 h-2.5" /> BTech AI Engine
                </span>
              </div>
              <p className="hidden md:block text-xs text-slate-500 dark:text-slate-400 truncate">
                Intelligent Student Performance Analytics System
              </p>
            </div>
          </div>

          {/* Search bar */}
          <div className="hidden lg:flex items-center relative flex-1 max-w-xs">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 pointer-events-none" />
            <input
              type="text"
              placeholder="Search student, roll number..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 text-xs rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-100 placeholder-slate-400 border border-transparent focus:border-blue-500 focus:bg-white dark:focus:bg-slate-900 focus:outline-none transition-all"
            />
          </div>

          {/* Quick Select Student (Interactive Demo Switcher) */}
          <div className="relative">
            <button
              onClick={() => setShowStudentPicker(!showStudentPicker)}
              className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 transition"
              title="Quick switch student view"
            >
              <span className="hidden sm:inline text-slate-400">Student:</span>
              <span className="font-semibold max-w-[120px] truncate text-blue-600 dark:text-blue-400">
                {activeStudent.name.split(' ')[0]}
              </span>
              <span
                className={`text-[10px] px-1.5 py-0.2 rounded ${
                  activeStudent.riskLevel === 'Critical' || activeStudent.attendancePercentage < 75
                    ? 'bg-rose-100 dark:bg-rose-950 text-rose-600 dark:text-rose-400'
                    : 'bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400'
                }`}
              >
                {activeStudent.attendancePercentage}%
              </span>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
            </button>

            {showStudentPicker && (
              <div className="absolute right-0 mt-2 w-72 rounded-xl bg-white dark:bg-slate-800 shadow-xl border border-slate-200 dark:border-slate-700 p-2 z-50">
                <div className="px-2 py-1 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                  Select Active Student Demo
                </div>
                <div className="space-y-1 mt-1 max-h-64 overflow-y-auto">
                  {students.map((st) => (
                    <button
                      key={st.id}
                      onClick={() => {
                        setActiveStudent(st);
                        setShowStudentPicker(false);
                      }}
                      className={`w-full flex items-center justify-between p-2 rounded-lg text-left text-xs transition ${
                        activeStudent.id === st.id
                          ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 font-semibold'
                          : 'hover:bg-slate-100 dark:hover:bg-slate-700/60 text-slate-700 dark:text-slate-300'
                      }`}
                    >
                      <div className="flex items-center gap-2 min-w-0">
                        <img src={st.avatar} alt={st.name} className="w-6 h-6 rounded-full object-cover shrink-0" />
                        <div className="truncate">
                          <p className="truncate font-medium">{st.name}</p>
                          <p className="text-[10px] text-slate-400">{st.rollNo}</p>
                        </div>
                      </div>
                      <div className="text-right shrink-0">
                        <span className="text-[11px] font-mono">{st.overallPercentage}%</span>
                        <span
                          className={`block text-[9px] px-1 rounded ${
                            st.riskLevel === 'Critical' || st.attendancePercentage < 75
                              ? 'text-rose-500 font-bold'
                              : 'text-slate-400'
                          }`}
                        >
                          {st.attendancePercentage < 75 ? 'At Risk' : st.performanceStatus}
                        </span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Right Action Icons */}
          <div className="flex items-center gap-2">
            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
              aria-label="Toggle Theme"
            >
              {theme === 'light' ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4 text-amber-400" />}
            </button>

            {/* Notification Bell */}
            <div className="relative">
              <button
                onClick={() => setShowNotifications(!showNotifications)}
                className="relative p-2 rounded-lg text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
                aria-label="Notifications"
              >
                <Bell className="w-4 h-4" />
                {unreadCount > 0 && (
                  <span className="absolute top-1.5 right-1.5 flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-rose-500"></span>
                  </span>
                )}
              </button>

              {showNotifications && (
                <div className="absolute right-0 mt-2 w-80 rounded-xl bg-white dark:bg-slate-800 shadow-xl border border-slate-200 dark:border-slate-700 p-3 z-50">
                  <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-700">
                    <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
                      System Notifications & Alerts ({unreadCount})
                    </span>
                    <span className="text-[10px] text-blue-600 dark:text-blue-400 font-medium">Real-time</span>
                  </div>
                  <div className="mt-2 space-y-2 max-h-72 overflow-y-auto">
                    {notifications.map((n) => (
                      <div
                        key={n.id}
                        onClick={() => markNotificationRead(n.id)}
                        className={`p-2.5 rounded-lg text-xs cursor-pointer transition flex items-start gap-2.5 ${
                          n.read
                            ? 'bg-slate-50 dark:bg-slate-850 opacity-75'
                            : 'bg-blue-50/70 dark:bg-blue-950/40 border-l-2 border-blue-500'
                        }`}
                      >
                        {n.type === 'warning' ? (
                          <AlertTriangle className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                        ) : (
                          <CheckCircle className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                        )}
                        <div className="flex-1 min-w-0">
                          <p className="font-semibold text-slate-800 dark:text-slate-200">{n.title}</p>
                          <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">{n.message}</p>
                          <p className="text-[9px] text-slate-400 mt-1">{n.time}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* User Profile & Role Selector */}
            <div className="relative">
              <button
                onClick={() => setShowUserMenu(!showUserMenu)}
                className="flex items-center gap-2 pl-2 pr-1.5 py-1 rounded-full bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 transition"
              >
                <img
                  src={currentUser.avatar}
                  alt={currentUser.name}
                  className="w-7 h-7 rounded-full object-cover ring-1 ring-blue-500/50"
                />
                <div className="hidden md:block text-left text-xs pr-1">
                  <div className="font-semibold text-slate-800 dark:text-slate-200 leading-tight">
                    {currentUser.name.split(' ')[0]}
                  </div>
                  <div className="text-[10px] text-slate-400 capitalize">
                    {currentUser.role === 'teacher' ? 'Faculty' : currentUser.role}
                  </div>
                </div>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
              </button>

              {showUserMenu && (
                <div className="absolute right-0 mt-2 w-64 rounded-xl bg-white dark:bg-slate-800 shadow-xl border border-slate-200 dark:border-slate-700 p-2 z-50">
                  <div className="p-2 border-b border-slate-100 dark:border-slate-700">
                    <p className="text-xs font-bold text-slate-800 dark:text-slate-100">{currentUser.name}</p>
                    <p className="text-[11px] text-slate-400">{currentUser.email}</p>
                    <span className="inline-block mt-1 text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300">
                      Role: {currentUser.role}
                    </span>
                  </div>

                  <div className="pt-2">
                    <div className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider px-2 mb-1">
                      Switch Role / Account Demo:
                    </div>
                    {DEMO_USERS.map((user) => (
                      <button
                        key={user.id}
                        onClick={() => {
                          setCurrentUser(user);
                          setShowUserMenu(false);
                          if (user.role === 'teacher' || user.role === 'admin') {
                            setActiveTab('teacher_students');
                          } else {
                            setActiveTab('overview');
                          }
                        }}
                        className={`w-full flex items-center justify-between p-2 rounded-lg text-left text-xs transition ${
                          currentUser.id === user.id
                            ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-300 font-semibold'
                            : 'hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300'
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          <UserCheck className="w-3.5 h-3.5 text-slate-400" />
                          <span className="truncate">{user.name}</span>
                        </div>
                        <span className="text-[10px] text-slate-400 capitalize">{user.role}</span>
                      </button>
                    ))}
                  </div>

                  <div className="mt-2 pt-2 border-t border-slate-100 dark:border-slate-700">
                    <button
                      onClick={() => {
                        setShowUserMenu(false);
                        setIsAuthModalOpen(true);
                      }}
                      className="w-full flex items-center gap-2 px-2 py-1.5 rounded-lg text-xs text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-950/50 font-medium transition"
                    >
                      <LogIn className="w-3.5 h-3.5" />
                      Open Full Login / Registration
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
