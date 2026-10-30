import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { DEMO_USERS } from '../data/mockStudents';
import {
  GraduationCap,
  Sparkles,
  Lock,
  Mail,
  User,
  ShieldCheck,
  CheckCircle2,
  ArrowRight,
  UserCheck,
} from 'lucide-react';

export const AuthModal: React.FC = () => {
  const { isAuthModalOpen, setIsAuthModalOpen, setCurrentUser, setActiveTab } = useApp();

  const [activeTabMode, setActiveTabMode] = useState<'student' | 'teacher'>('student');
  const [authView, setAuthView] = useState<'login' | 'register' | 'forgot'>('login');

  // Form states
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [rollNo, setRollNo] = useState('');
  const [forgotSubmitted, setForgotSubmitted] = useState(false);
  const [registerSuccess, setRegisterSuccess] = useState(false);

  if (!isAuthModalOpen) return null;

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Match demo user or create a user session
    const matched = DEMO_USERS.find(
      (u) =>
        u.role === (activeTabMode === 'student' ? 'student' : 'teacher') ||
        (activeTabMode === 'teacher' && u.role === 'admin')
    );
    if (matched) {
      setCurrentUser(matched);
      setIsAuthModalOpen(false);
      setActiveTab(activeTabMode === 'student' ? 'overview' : 'teacher_students');
    }
  };

  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setRegisterSuccess(true);
    setTimeout(() => {
      // Auto login as registered student
      setCurrentUser({
        id: `user-${Date.now()}`,
        name: name || 'New Enrolled Student',
        email: email || 'student@college.edu',
        role: activeTabMode,
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
        studentId: 'std-001',
      });
      setIsAuthModalOpen(false);
      setRegisterSuccess(false);
      setAuthView('login');
      setActiveTab('overview');
    }, 1200);
  };

  const handleForgotSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setForgotSubmitted(true);
  };

  const handleSelectDemoUser = (user: typeof DEMO_USERS[0]) => {
    setCurrentUser(user);
    setIsAuthModalOpen(false);
    setActiveTab(user.role === 'student' ? 'overview' : 'teacher_students');
  };

  return (
    <div className="fixed inset-0 bg-slate-950/70 backdrop-blur-md z-50 flex items-center justify-center p-4">
      <div className="w-full max-w-lg bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl p-6 sm:p-8 relative overflow-hidden">
        {/* Close button */}
        <button
          onClick={() => {
            setIsAuthModalOpen(false);
            setAuthView('login');
            setForgotSubmitted(false);
          }}
          className="absolute top-5 right-5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 text-xl font-bold leading-none p-1"
        >
          &times;
        </button>

        {/* Brand header */}
        <div className="flex items-center gap-3 mb-5">
          <div className="h-10 w-10 rounded-xl bg-gradient-to-tr from-indigo-700 via-blue-600 to-purple-600 flex items-center justify-center text-white shadow-md">
            <GraduationCap className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-extrabold text-slate-900 dark:text-white text-base">
              EduAnalytics AI Portal
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Intelligent Student Performance Analytics System
            </p>
          </div>
        </div>

        {/* Role Switcher Tabs */}
        <div className="grid grid-cols-2 p-1 rounded-xl bg-slate-100 dark:bg-slate-800 mb-5">
          <button
            onClick={() => setActiveTabMode('student')}
            className={`py-2 rounded-lg text-xs font-bold transition flex items-center justify-center gap-1.5 ${
              activeTabMode === 'student'
                ? 'bg-white dark:bg-slate-700 text-blue-600 dark:text-blue-400 shadow-sm'
                : 'text-slate-600 dark:text-slate-400'
            }`}
          >
            <User className="w-3.5 h-3.5" /> Student Login
          </button>
          <button
            onClick={() => setActiveTabMode('teacher')}
            className={`py-2 rounded-lg text-xs font-bold transition flex items-center justify-center gap-1.5 ${
              activeTabMode === 'teacher'
                ? 'bg-white dark:bg-slate-700 text-blue-600 dark:text-blue-400 shadow-sm'
                : 'text-slate-600 dark:text-slate-400'
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5" /> Teacher / Admin
          </button>
        </div>

        {/* One-Click Quick Demo Sign-Ins */}
        <div className="mb-5 p-3 rounded-2xl bg-blue-50/70 dark:bg-blue-950/40 border border-blue-200/60 dark:border-blue-900/60">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] uppercase font-bold text-blue-700 dark:text-blue-300 tracking-wider flex items-center gap-1">
              <Sparkles className="w-3 h-3" /> Quick Demo One-Click Access
            </span>
            <span className="text-[10px] text-blue-600 dark:text-blue-400 font-medium">Instant Test</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {DEMO_USERS.filter((u) => (activeTabMode === 'student' ? u.role === 'student' : u.role !== 'student')).map(
              (user) => (
                <button
                  key={user.id}
                  type="button"
                  onClick={() => handleSelectDemoUser(user)}
                  className="flex items-center gap-2 p-2 rounded-xl bg-white dark:bg-slate-800 hover:bg-blue-100/50 dark:hover:bg-slate-700/60 border border-slate-200 dark:border-slate-700 text-left transition shadow-xs group"
                >
                  <img src={user.avatar} alt={user.name} className="w-6 h-6 rounded-full object-cover shrink-0" />
                  <div className="min-w-0 flex-1">
                    <p className="text-[11px] font-bold text-slate-800 dark:text-slate-100 truncate">
                      {user.name}
                    </p>
                    <p className="text-[9px] text-slate-400 truncate">{user.email}</p>
                  </div>
                  <UserCheck className="w-3.5 h-3.5 text-blue-500 opacity-0 group-hover:opacity-100 transition" />
                </button>
              )
            )}
          </div>
        </div>

        {/* View 1: Standard Login Form */}
        {authView === 'login' && (
          <form onSubmit={handleLoginSubmit} className="space-y-3.5 text-xs">
            <div>
              <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                {activeTabMode === 'student' ? 'Student University Email or Roll No' : 'Faculty / Administrator Email'}
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  required
                  placeholder={activeTabMode === 'student' ? 'aarav.sharma@college.edu' : 'rajesh.kulkarni@college.edu'}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-100 focus:outline-none focus:border-blue-500"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="font-semibold text-slate-700 dark:text-slate-300">Password</label>
                <button
                  type="button"
                  onClick={() => setAuthView('forgot')}
                  className="text-blue-600 dark:text-blue-400 hover:underline text-[11px]"
                >
                  Forgot Password?
                </button>
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-100 focus:outline-none focus:border-blue-500"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-2.5 rounded-xl font-bold text-xs bg-blue-600 hover:bg-blue-700 text-white transition shadow-md shadow-blue-500/20 flex items-center justify-center gap-1.5"
            >
              Sign In to {activeTabMode === 'student' ? 'Student Portal' : 'Faculty Dashboard'} <ArrowRight className="w-3.5 h-3.5" />
            </button>

            <div className="text-center pt-2 border-t border-slate-100 dark:border-slate-800 text-[11px] text-slate-500">
              Don&apos;t have an enrolled account?{' '}
              <button
                type="button"
                onClick={() => setAuthView('register')}
                className="font-bold text-blue-600 dark:text-blue-400 hover:underline"
              >
                Register Here
              </button>
            </div>
          </form>
        )}

        {/* View 2: Registration Form */}
        {authView === 'register' && (
          <form onSubmit={handleRegisterSubmit} className="space-y-3 text-xs">
            {registerSuccess ? (
              <div className="py-6 text-center space-y-2">
                <CheckCircle2 className="w-10 h-10 text-emerald-500 mx-auto" />
                <h4 className="font-bold text-slate-900 dark:text-white text-sm">Account Created Successfully!</h4>
                <p className="text-slate-500 text-[11px]">Signing you into your dashboard...</p>
              </div>
            ) : (
              <>
                <div>
                  <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                    Full Legal Name
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="E.g. Siddharth Joshi"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-100"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                      Roll Number
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="CS-2022-205"
                      value={rollNo}
                      onChange={(e) => setRollNo(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-mono"
                    />
                  </div>
                  <div>
                    <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                      University Email
                    </label>
                    <input
                      type="email"
                      required
                      placeholder="siddharth@college.edu"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700"
                    />
                  </div>
                </div>

                <div>
                  <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                    Create Password
                  </label>
                  <input
                    type="password"
                    required
                    placeholder="At least 6 characters"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-2.5 rounded-xl font-bold text-xs bg-blue-600 hover:bg-blue-700 text-white transition shadow mt-2"
                >
                  Complete Registration
                </button>

                <div className="text-center pt-2 text-[11px] text-slate-500">
                  Already registered?{' '}
                  <button
                    type="button"
                    onClick={() => setAuthView('login')}
                    className="font-bold text-blue-600 dark:text-blue-400 hover:underline"
                  >
                    Back to Login
                  </button>
                </div>
              </>
            )}
          </form>
        )}

        {/* View 3: Forgot Password */}
        {authView === 'forgot' && (
          <form onSubmit={handleForgotSubmit} className="space-y-3.5 text-xs">
            {forgotSubmitted ? (
              <div className="py-6 text-center space-y-2">
                <CheckCircle2 className="w-10 h-10 text-emerald-500 mx-auto" />
                <h4 className="font-bold text-slate-900 dark:text-white text-sm">Reset Link Sent</h4>
                <p className="text-slate-500 text-[11px] max-w-xs mx-auto">
                  A verification link and one-time password have been dispatched to your institutional email.
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setAuthView('login');
                    setForgotSubmitted(false);
                  }}
                  className="mt-3 px-4 py-2 rounded-xl bg-blue-600 text-white font-semibold"
                >
                  Return to Sign In
                </button>
              </div>
            ) : (
              <>
                <p className="text-slate-500 text-xs">
                  Enter your registered college email address to receive password reset instructions.
                </p>
                <div>
                  <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                    Registered Email Address
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="name@college.edu"
                    className="w-full px-3 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-2.5 rounded-xl font-bold text-xs bg-blue-600 hover:bg-blue-700 text-white transition shadow"
                >
                  Send Reset Link
                </button>

                <div className="text-center pt-2 text-[11px] text-slate-500">
                  Remember password?{' '}
                  <button
                    type="button"
                    onClick={() => setAuthView('login')}
                    className="font-bold text-blue-600 dark:text-blue-400 hover:underline"
                  >
                    Sign In
                  </button>
                </div>
              </>
            )}
          </form>
        )}
      </div>
    </div>
  );
};
