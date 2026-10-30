/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Navbar } from './components/Navbar';
import { Sidebar } from './components/Sidebar';
import { StudentDashboard } from './components/StudentDashboard';
import { AcademicAnalytics } from './components/AcademicAnalytics';
import { AIPredictionModule } from './components/AIPredictionModule';
import { AttendanceManagement } from './components/AttendanceManagement';
import { AIRecommendations } from './components/AIRecommendations';
import { TeacherAdminDashboard } from './components/TeacherAdminDashboard';
import { StudentComparison } from './components/StudentComparison';
import { ReportsView } from './components/ReportsView';
import { AuthModal } from './components/AuthModal';
import { Menu, Sparkles, GraduationCap, ShieldCheck } from 'lucide-react';

const MainLayout: React.FC = () => {
  const { activeTab, currentUser } = useApp();
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col transition-colors duration-200">
      {/* Top Navbar */}
      <Navbar />

      {/* Mobile Top Bar with Navigation Menu Toggle */}
      <div className="lg:hidden flex items-center justify-between px-4 py-2.5 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800">
        <button
          onClick={() => setMobileSidebarOpen(true)}
          className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 text-xs font-semibold"
        >
          <Menu className="w-4 h-4 text-blue-600" />
          <span>Dashboard Menu</span>
        </button>

        <span className="text-xs font-medium text-slate-500 capitalize">
          View: <strong className="text-blue-600 dark:text-blue-400">{activeTab.replace('_', ' ')}</strong>
        </span>
      </div>

      {/* Main Content Layout */}
      <div className="flex-1 flex max-w-7xl w-full mx-auto">
        {/* Sidebar */}
        <Sidebar mobileOpen={mobileSidebarOpen} setMobileOpen={setMobileSidebarOpen} />

        {/* Dynamic Main View */}
        <main className="flex-1 min-w-0 p-4 sm:p-6 lg:p-8 overflow-x-hidden">
          {activeTab === 'overview' && <StudentDashboard />}
          {activeTab === 'analytics' && <AcademicAnalytics />}
          {activeTab === 'prediction' && <AIPredictionModule />}
          {activeTab === 'attendance' && <AttendanceManagement />}
          {activeTab === 'recommendations' && <AIRecommendations />}
          {activeTab === 'teacher_students' && <TeacherAdminDashboard />}
          {activeTab === 'comparison' && <StudentComparison />}
          {activeTab === 'reports' && <ReportsView />}
        </main>
      </div>

      {/* Professional Educational Footer */}
      <footer className="no-print border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 py-6 text-xs text-slate-500 dark:text-slate-400 mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="h-6 w-6 rounded-lg bg-blue-600 text-white flex items-center justify-center">
              <GraduationCap className="w-3.5 h-3.5" />
            </div>
            <span className="font-bold text-slate-800 dark:text-slate-200">
              Intelligent Student Performance Analytics System
            </span>
          </div>

          <div className="flex items-center gap-4 text-[11px]">
            <span className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400">
              <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block animate-pulse" /> AI Engine Online
            </span>
            <span>•</span>
            <span className="flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-blue-500" /> Role-Based Access Control
            </span>
            <span>•</span>
            <span>Autonomous College Accreditation Compliance</span>
          </div>
        </div>
      </footer>

      {/* Authentication and Registration Modal */}
      <AuthModal />
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <MainLayout />
    </AppProvider>
  );
}
