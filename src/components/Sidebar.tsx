import React from 'react';
import { useApp } from '../context/AppContext';
import {
  LayoutDashboard,
  BarChart3,
  BrainCircuit,
  CalendarCheck,
  Lightbulb,
  Users,
  GitCompare,
  FileText,
  AlertTriangle,
  GraduationCap,
  Sparkles,
  ChevronRight,
} from 'lucide-react';

interface SidebarProps {
  mobileOpen: boolean;
  setMobileOpen: (open: boolean) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ mobileOpen, setMobileOpen }) => {
  const { activeTab, setActiveTab, currentUser, activeStudent } = useApp();

  const isTeacherOrAdmin = currentUser.role === 'teacher' || currentUser.role === 'admin';

  const navItems = [
    {
      id: 'overview',
      label: 'Student Dashboard',
      description: 'Profile & overall standing',
      icon: LayoutDashboard,
      badge: null,
      studentOnly: false,
    },
    {
      id: 'analytics',
      label: 'Academic Analytics',
      description: 'Marks, trends & diagnostics',
      icon: BarChart3,
      badge: null,
      studentOnly: false,
    },
    {
      id: 'prediction',
      label: 'AI Prediction Module',
      description: 'Future forecasting & risk radar',
      icon: BrainCircuit,
      badge: 'AI Powered',
      studentOnly: false,
    },
    {
      id: 'attendance',
      label: 'Attendance Tracker',
      description: 'Subject metrics & eligibility',
      icon: CalendarCheck,
      badge: activeStudent.attendancePercentage < 75 ? 'Low Alert' : null,
      badgeColor: 'rose',
      studentOnly: false,
    },
    {
      id: 'recommendations',
      label: 'AI Recommendations',
      description: 'Personalized study schedule',
      icon: Lightbulb,
      badge: null,
      studentOnly: false,
    },
    // Faculty / Admin Section
    {
      id: 'teacher_students',
      label: 'Student Management',
      description: 'Directory, CRUD & marks entry',
      icon: Users,
      badge: 'Faculty',
      badgeColor: 'blue',
      teacherOnly: true,
    },
    {
      id: 'comparison',
      label: 'Student Comparison',
      description: 'Multi-student side-by-side',
      icon: GitCompare,
      badge: null,
      teacherOnly: true,
    },
    // Reports
    {
      id: 'reports',
      label: 'Official Reports',
      description: 'Transcripts & CSV export',
      icon: FileText,
      badge: null,
      studentOnly: false,
    },
  ];

  return (
    <>
      {/* Mobile backdrop overlay */}
      {mobileOpen && (
        <div
          onClick={() => setMobileOpen(false)}
          className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-30 lg:hidden"
        />
      )}

      <aside
        className={`fixed lg:sticky top-16 z-30 flex flex-col justify-between w-64 h-[calc(100vh-4rem)] bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 transition-all duration-300 ease-in-out shrink-0 overflow-y-auto ${
          mobileOpen ? 'left-0' : '-left-64 lg:left-0'
        }`}
      >
        <div className="p-4 space-y-6">
          {/* Active Mode Notice */}
          <div className="p-3 rounded-xl bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-slate-800/80 dark:to-indigo-950/40 border border-blue-100 dark:border-blue-900/40">
            <div className="flex items-center justify-between">
              <span className="text-[10px] uppercase font-bold tracking-wider text-blue-700 dark:text-blue-400 flex items-center gap-1">
                <Sparkles className="w-3 h-3" />
                Active View
              </span>
              <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded bg-blue-200/60 dark:bg-blue-800/60 text-blue-800 dark:text-blue-200 uppercase">
                {currentUser.role}
              </span>
            </div>
            <p className="text-xs font-semibold text-slate-800 dark:text-slate-200 mt-1 truncate">
              {isTeacherOrAdmin ? currentUser.name : activeStudent.name}
            </p>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate">
              {isTeacherOrAdmin ? (currentUser.department || 'Faculty') : `${activeStudent.rollNo} • ${activeStudent.semester}`}
            </p>
          </div>

          {/* Navigation Links */}
          <nav className="space-y-1">
            <div className="px-3 pb-1 text-[11px] font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
              Academic Navigation
            </div>

            {navItems
              .filter((item) => {
                if (item.teacherOnly && !isTeacherOrAdmin) return false;
                return true;
              })
              .map((item) => {
                const Icon = item.icon;
                const isActive = activeTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => {
                      setActiveTab(item.id);
                      setMobileOpen(false);
                    }}
                    className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-left text-xs font-medium transition-all group ${
                      isActive
                        ? 'bg-blue-600 text-white shadow-md shadow-blue-600/20 font-semibold'
                        : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800/70 hover:text-slate-900 dark:hover:text-slate-200'
                    }`}
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <Icon
                        className={`w-4 h-4 shrink-0 transition-transform group-hover:scale-110 ${
                          isActive ? 'text-white' : 'text-slate-400 dark:text-slate-500 group-hover:text-blue-600'
                        }`}
                      />
                      <div className="truncate">
                        <div className="truncate">{item.label}</div>
                      </div>
                    </div>

                    <div className="flex items-center gap-1 shrink-0">
                      {item.badge && (
                        <span
                          className={`text-[9px] px-1.5 py-0.5 rounded font-bold uppercase tracking-wider ${
                            isActive
                              ? 'bg-white/20 text-white'
                              : item.badgeColor === 'rose'
                              ? 'bg-rose-100 dark:bg-rose-950 text-rose-600 dark:text-rose-400 animate-pulse'
                              : 'bg-indigo-100 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400'
                          }`}
                        >
                          {item.badge}
                        </span>
                      )}
                      <ChevronRight
                        className={`w-3.5 h-3.5 transition-transform ${
                          isActive ? 'opacity-100 translate-x-0.5' : 'opacity-0 group-hover:opacity-100'
                        }`}
                      />
                    </div>
                  </button>
                );
              })}
          </nav>
        </div>

        {/* Quick summary widget for selected student */}
        <div className="p-4 border-t border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-900/50">
          <div className="flex items-center gap-2 mb-2">
            <GraduationCap className="w-4 h-4 text-blue-600 dark:text-blue-400" />
            <span className="text-xs font-bold text-slate-800 dark:text-slate-200">Current Standing</span>
          </div>
          <div className="grid grid-cols-2 gap-2 text-center">
            <div className="p-2 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
              <span className="text-[10px] text-slate-400 block font-medium">CGPA</span>
              <span className="text-sm font-bold text-slate-800 dark:text-slate-100 font-mono">
                {activeStudent.cgpa}
              </span>
            </div>
            <div className="p-2 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
              <span className="text-[10px] text-slate-400 block font-medium">Attendance</span>
              <span
                className={`text-sm font-bold font-mono ${
                  activeStudent.attendancePercentage < 75
                    ? 'text-rose-600 dark:text-rose-400'
                    : 'text-emerald-600 dark:text-emerald-400'
                }`}
              >
                {activeStudent.attendancePercentage}%
              </span>
            </div>
          </div>
          {activeStudent.attendancePercentage < 75 && (
            <div className="mt-2 flex items-center gap-1.5 p-1.5 rounded-md bg-rose-50 dark:bg-rose-950/50 border border-rose-200 dark:border-rose-900 text-rose-700 dark:text-rose-300 text-[10px]">
              <AlertTriangle className="w-3.5 h-3.5 shrink-0 text-rose-500" />
              <span>Below 75% exam cutoff requirement!</span>
            </div>
          )}
        </div>
      </aside>
    </>
  );
};
