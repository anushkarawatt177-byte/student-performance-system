import React from 'react';
import { useApp } from '../context/AppContext';
import {
  TrendingUp,
  Clock,
  BookOpen,
  Award,
  AlertTriangle,
  CheckCircle2,
  Calendar,
  Sparkles,
  Phone,
  Mail,
  User,
  ArrowRight,
  ShieldAlert,
} from 'lucide-react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  BarChart,
  Bar,
  CartesianGrid,
} from 'recharts';

export const StudentDashboard: React.FC = () => {
  const { activeStudent, setActiveTab } = useApp();

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Excellent':
        return {
          bg: 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/60 dark:text-emerald-300 dark:border-emerald-800',
          dot: 'bg-emerald-500',
        };
      case 'Good':
        return {
          bg: 'bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950/60 dark:text-blue-300 dark:border-blue-800',
          dot: 'bg-blue-500',
        };
      case 'Average':
        return {
          bg: 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/60 dark:text-amber-300 dark:border-amber-800',
          dot: 'bg-amber-500',
        };
      case 'Needs Improvement':
      default:
        return {
          bg: 'bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-950/60 dark:text-rose-300 dark:border-rose-800',
          dot: 'bg-rose-500 animate-ping',
        };
    }
  };

  const statusStyle = getStatusBadge(activeStudent.performanceStatus);
  const totalSubjectsCount = activeStudent.subjects.length;
  const avgMarksCalc = (
    activeStudent.subjects.reduce((sum, s) => sum + s.totalMarks, 0) / totalSubjectsCount
  ).toFixed(1);

  // Chart data formatting
  const subjectChartData = activeStudent.subjects.map((s) => ({
    name: s.code,
    fullName: s.name,
    Internal: s.internalMarks,
    External: s.externalMarks,
    Total: s.totalMarks,
  }));

  const semesterChartData = activeStudent.semesterHistory.map((h) => ({
    semester: h.semester,
    SGPA: h.sgpa,
    Percentage: h.percentage,
    Attendance: h.attendance,
  }));

  return (
    <div className="space-y-6">
      {/* Critical Alert Banner if attendance < 75% or risk is High/Critical */}
      {(activeStudent.attendancePercentage < 75 || activeStudent.riskLevel === 'Critical') && (
        <div className="p-4 rounded-2xl bg-gradient-to-r from-rose-500/15 via-rose-500/10 to-amber-500/10 border border-rose-300 dark:border-rose-800 text-rose-800 dark:text-rose-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-sm">
          <div className="flex items-start gap-3">
            <div className="p-2.5 rounded-xl bg-rose-500 text-white shrink-0 shadow">
              <ShieldAlert className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-bold text-sm text-rose-900 dark:text-rose-100 flex items-center gap-2">
                Academic Early Warning Notice
                <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-rose-100 dark:bg-rose-900 text-rose-700 dark:text-rose-200">
                  {activeStudent.riskLevel} Risk
                </span>
              </h4>
              <p className="text-xs text-rose-700 dark:text-rose-300 mt-0.5">
                Current attendance ({activeStudent.attendancePercentage}%) is below the mandatory 75% examination threshold. Immediate attendance recovery is required.
              </p>
            </div>
          </div>
          <button
            onClick={() => setActiveTab('prediction')}
            className="shrink-0 px-4 py-2 rounded-xl text-xs font-semibold bg-rose-600 hover:bg-rose-700 text-white transition flex items-center gap-1.5 shadow-sm"
          >
            Review AI Action Plan <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Hero Profile Card */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-slate-900 via-indigo-950 to-blue-950 text-white p-6 shadow-xl border border-slate-800">
        <div className="absolute top-0 right-0 -mt-10 -mr-10 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 right-1/4 -mb-10 w-48 h-48 bg-purple-500/10 rounded-full blur-2xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="flex items-center gap-4 sm:gap-5">
            <div className="relative">
              <img
                src={activeStudent.avatar}
                alt={activeStudent.name}
                className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl object-cover ring-4 ring-white/20 shadow-lg"
              />
              <span className="absolute bottom-0 right-0 transform translate-x-1 translate-y-1 p-1 bg-white dark:bg-slate-900 rounded-full shadow">
                <span className={`block w-3.5 h-3.5 rounded-full ${statusStyle.dot}`} />
              </span>
            </div>

            <div className="space-y-1">
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-black tracking-tight">{activeStudent.name}</h1>
                <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-white/10 backdrop-blur-md text-blue-200 border border-white/10">
                  {activeStudent.rollNo}
                </span>
                <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold border ${statusStyle.bg}`}>
                  {activeStudent.performanceStatus}
                </span>
              </div>
              <p className="text-xs sm:text-sm text-slate-300 font-medium">
                {activeStudent.course} • {activeStudent.semester} ({activeStudent.section})
              </p>
              <div className="flex flex-wrap items-center gap-3 pt-1 text-xs text-slate-400">
                <span className="flex items-center gap-1">
                  <User className="w-3.5 h-3.5 text-blue-400" /> Mentor: {activeStudent.mentorName}
                </span>
                <span className="hidden sm:flex items-center gap-1">
                  <Mail className="w-3.5 h-3.5 text-blue-400" /> {activeStudent.email}
                </span>
                <span className="hidden md:flex items-center gap-1">
                  <Phone className="w-3.5 h-3.5 text-blue-400" /> {activeStudent.phone}
                </span>
              </div>
            </div>
          </div>

          <div className="flex flex-row md:flex-col items-center md:items-end justify-between w-full md:w-auto pt-4 md:pt-0 border-t md:border-t-0 border-white/10 gap-3">
            <div className="text-left md:text-right">
              <span className="text-[11px] text-slate-400 uppercase tracking-wider block font-medium">Cumulative Grade (CGPA)</span>
              <div className="text-2xl sm:text-3xl font-black text-white font-mono tracking-tight flex items-baseline md:justify-end gap-1">
                {activeStudent.cgpa}
                <span className="text-xs text-blue-300 font-normal">/ 10.0</span>
              </div>
            </div>
            <button
              onClick={() => setActiveTab('reports')}
              className="px-3.5 py-1.5 rounded-xl text-xs font-medium bg-white/10 hover:bg-white/20 backdrop-blur-md text-white border border-white/15 transition flex items-center gap-1.5"
            >
              <Award className="w-3.5 h-3.5 text-amber-300" /> Download Transcript
            </button>
          </div>
        </div>
      </div>

      {/* 4 Main KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Overall Academic Percentage */}
        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm transition hover:shadow-md">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              Overall Academic %
            </span>
            <div className="p-2 rounded-xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline justify-between">
            <div className="text-2xl font-black text-slate-900 dark:text-white font-mono">
              {activeStudent.overallPercentage}%
            </div>
            <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 flex items-center gap-0.5">
              Grade {activeStudent.aiPrediction.predictedGrade.split(' ')[0]}
            </span>
          </div>
          <div className="mt-3 w-full bg-slate-100 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
            <div
              className="bg-blue-600 h-full rounded-full transition-all duration-500"
              style={{ width: `${activeStudent.overallPercentage}%` }}
            />
          </div>
          <p className="mt-2 text-[11px] text-slate-500 dark:text-slate-400">
            Based on all course internal and semester scores
          </p>
        </div>

        {/* Attendance Percentage */}
        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm transition hover:shadow-md">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              Overall Attendance
            </span>
            <div
              className={`p-2 rounded-xl ${
                activeStudent.attendancePercentage < 75
                  ? 'bg-rose-50 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400'
                  : 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400'
              }`}
            >
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline justify-between">
            <div
              className={`text-2xl font-black font-mono ${
                activeStudent.attendancePercentage < 75
                  ? 'text-rose-600 dark:text-rose-400'
                  : 'text-slate-900 dark:text-white'
              }`}
            >
              {activeStudent.attendancePercentage}%
            </div>
            <span
              className={`text-xs font-bold px-2 py-0.5 rounded-full ${
                activeStudent.attendancePercentage < 75
                  ? 'bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-300'
                  : 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300'
              }`}
            >
              {activeStudent.attendancePercentage >= 75 ? 'Eligible' : 'Detention Risk'}
            </span>
          </div>
          <div className="mt-3 w-full bg-slate-100 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-500 ${
                activeStudent.attendancePercentage < 75 ? 'bg-rose-500' : 'bg-emerald-500'
              }`}
              style={{ width: `${Math.min(100, activeStudent.attendancePercentage)}%` }}
            />
          </div>
          <p className="mt-2 text-[11px] text-slate-500 dark:text-slate-400">
            Cutoff required: 75% for semester examinations
          </p>
        </div>

        {/* Total Subjects & Average Marks */}
        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm transition hover:shadow-md">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              Enrolled Subjects
            </span>
            <div className="p-2 rounded-xl bg-purple-50 dark:bg-purple-950/60 text-purple-600 dark:text-purple-400">
              <BookOpen className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline justify-between">
            <div className="text-2xl font-black text-slate-900 dark:text-white font-mono">
              {totalSubjectsCount}{' '}
              <span className="text-xs text-slate-400 font-sans font-medium">Courses</span>
            </div>
            <span className="text-xs font-bold text-purple-600 dark:text-purple-400 font-mono">
              Avg: {avgMarksCalc} / 100
            </span>
          </div>
          <div className="mt-3 flex items-center gap-1.5">
            {activeStudent.subjects.map((sub) => (
              <span
                key={sub.code}
                title={`${sub.name}: ${sub.totalMarks}/100`}
                className={`flex-1 h-2 rounded-full ${
                  sub.totalMarks >= 85
                    ? 'bg-emerald-500'
                    : sub.totalMarks >= 70
                    ? 'bg-blue-500'
                    : sub.totalMarks >= 55
                    ? 'bg-amber-500'
                    : 'bg-rose-500'
                }`}
              />
            ))}
          </div>
          <p className="mt-2 text-[11px] text-slate-500 dark:text-slate-400">
            {activeStudent.subjects.filter((s) => s.totalMarks >= 80).length} Distinctions achieved
          </p>
        </div>

        {/* Academic Performance Status */}
        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm transition hover:shadow-md">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              Performance Status
            </span>
            <div className="p-2 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400">
              <Award className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline justify-between">
            <div className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <span className={`w-2.5 h-2.5 rounded-full ${statusStyle.dot}`} />
              {activeStudent.performanceStatus}
            </div>
          </div>
          <div className="mt-3">
            <span
              className={`inline-block text-[11px] font-semibold px-2.5 py-1 rounded-lg border ${statusStyle.bg}`}
            >
              Risk Assessment: {activeStudent.riskLevel}
            </span>
          </div>
          <p className="mt-2 text-[11px] text-slate-500 dark:text-slate-400">
            {activeStudent.riskLevel === 'Low'
              ? 'On track for Honors placement'
              : 'Requires academic counseling intervention'}
          </p>
        </div>
      </div>

      {/* Main Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Semester-wise Progression Chart */}
        <div className="lg:col-span-2 p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-bold text-slate-800 dark:text-slate-100 text-sm flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-blue-600" /> Semester-wise SGPA & Attendance Trajectory
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Academic progress over successive academic semesters
              </p>
            </div>
            <button
              onClick={() => setActiveTab('analytics')}
              className="text-xs text-blue-600 dark:text-blue-400 font-semibold hover:underline flex items-center gap-1"
            >
              Full Analytics <ArrowRight className="w-3 h-3" />
            </button>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={semesterChartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorSGPA" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.0} />
                  </linearGradient>
                  <linearGradient id="colorAtt" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#94a3b8" opacity={0.15} />
                <XAxis dataKey="semester" stroke="#94a3b8" fontSize={11} tickLine={false} />
                <YAxis yAxisId="left" domain={[0, 10]} stroke="#3b82f6" fontSize={11} tickLine={false} />
                <YAxis yAxisId="right" orientation="right" domain={[0, 100]} stroke="#10b981" fontSize={11} tickLine={false} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#1e293b',
                    borderRadius: '12px',
                    border: 'none',
                    color: '#fff',
                    fontSize: '12px',
                  }}
                />
                <Area
                  yAxisId="left"
                  type="monotone"
                  dataKey="SGPA"
                  stroke="#3b82f6"
                  strokeWidth={3}
                  fillOpacity={1}
                  fill="url(#colorSGPA)"
                  name="SGPA (out of 10)"
                />
                <Area
                  yAxisId="right"
                  type="monotone"
                  dataKey="Attendance"
                  stroke="#10b981"
                  strokeWidth={2}
                  strokeDasharray="4 4"
                  fillOpacity={1}
                  fill="url(#colorAtt)"
                  name="Attendance %"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          <div className="flex items-center justify-center gap-6 mt-3 pt-3 border-t border-slate-100 dark:border-slate-800 text-xs text-slate-500">
            <span className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-blue-600 inline-block" /> SGPA (Grade Point)
            </span>
            <span className="flex items-center gap-2">
              <span className="w-3 h-1 bg-emerald-500 inline-block" /> Attendance (%)
            </span>
          </div>
        </div>

        {/* AI Quick Insight & Next Semester Prediction card */}
        <div className="p-5 rounded-2xl bg-gradient-to-br from-indigo-900 via-blue-900 to-slate-900 text-white border border-indigo-800/50 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-indigo-500/30 text-indigo-200 border border-indigo-400/20 flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-amber-300" /> AI Predictive Forecast
              </span>
              <span className="text-xs text-indigo-200 font-mono">
                {activeStudent.aiPrediction.confidenceScore}% Confidence
              </span>
            </div>

            <h4 className="text-base font-bold text-white tracking-tight">
              Next Semester Projection: {activeStudent.aiPrediction.predictedNextSGPA} SGPA
            </h4>
            <p className="text-xs text-indigo-200 mt-1">
              Projected Score: <span className="font-bold text-white">{activeStudent.aiPrediction.predictedNextPercentage}%</span> ({activeStudent.aiPrediction.predictedGrade})
            </p>

            <div className="mt-4 p-3 rounded-xl bg-white/10 backdrop-blur-md border border-white/10 space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="text-indigo-200">Backlog Risk Probability:</span>
                <span
                  className={`font-mono font-bold ${
                    activeStudent.aiPrediction.backlogProbability > 50 ? 'text-rose-300' : 'text-emerald-300'
                  }`}
                >
                  {activeStudent.aiPrediction.backlogProbability}%
                </span>
              </div>
              <div className="w-full bg-white/10 h-1.5 rounded-full overflow-hidden">
                <div
                  className={`h-full ${
                    activeStudent.aiPrediction.backlogProbability > 50 ? 'bg-rose-400' : 'bg-emerald-400'
                  }`}
                  style={{ width: `${activeStudent.aiPrediction.backlogProbability}%` }}
                />
              </div>
            </div>

            <div className="mt-4 space-y-2">
              <span className="text-xs font-semibold text-indigo-200 block">AI Recommended Priority:</span>
              <div className="p-2.5 rounded-lg bg-black/20 text-xs text-slate-200 leading-relaxed border border-white/5">
                {activeStudent.aiPrediction.personalizedRecommendations[0]}
              </div>
            </div>
          </div>

          <button
            onClick={() => setActiveTab('prediction')}
            className="mt-5 w-full py-2.5 rounded-xl text-xs font-semibold bg-white text-blue-900 hover:bg-blue-50 transition shadow font-medium flex items-center justify-center gap-1.5"
          >
            Open Complete AI Prediction Module <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Subject Performance Overview & Recent Activities Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Subject-Wise Current Marks Breakdown */}
        <div className="lg:col-span-2 p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-bold text-slate-800 dark:text-slate-100 text-sm flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-purple-600" /> Current Semester Subject Scores
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Internal assessments (out of 30) vs External exams (out of 70)
              </p>
            </div>
            <button
              onClick={() => setActiveTab('analytics')}
              className="text-xs text-blue-600 dark:text-blue-400 font-semibold hover:underline"
            >
              View Detailed Analytics
            </button>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={subjectChartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#94a3b8" opacity={0.15} />
                <XAxis dataKey="name" stroke="#94a3b8" fontSize={11} tickLine={false} />
                <YAxis domain={[0, 100]} stroke="#94a3b8" fontSize={11} tickLine={false} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#1e293b',
                    borderRadius: '12px',
                    border: 'none',
                    color: '#fff',
                    fontSize: '12px',
                  }}
                />
                <Bar dataKey="Internal" stackId="a" fill="#818cf8" radius={[0, 0, 0, 0]} name="Internal Marks" />
                <Bar dataKey="External" stackId="a" fill="#3b82f6" radius={[4, 4, 0, 0]} name="External Marks" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Quick Subject Legend & List */}
          <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-2 pt-3 border-t border-slate-100 dark:border-slate-800">
            {activeStudent.subjects.map((sub) => (
              <div
                key={sub.code}
                className="flex items-center justify-between p-2 rounded-lg bg-slate-50 dark:bg-slate-800/50 text-xs"
              >
                <div className="truncate pr-2">
                  <span className="font-bold text-slate-800 dark:text-slate-200">{sub.code}:</span>{' '}
                  <span className="text-slate-600 dark:text-slate-400 truncate">{sub.name}</span>
                </div>
                <div className="text-right shrink-0">
                  <span className="font-bold font-mono text-slate-900 dark:text-slate-100">{sub.totalMarks}/100</span>
                  <span
                    className={`ml-1 text-[10px] font-bold px-1 rounded ${
                      sub.totalMarks >= 80 ? 'text-emerald-600' : sub.totalMarks < 60 ? 'text-rose-600' : 'text-blue-600'
                    }`}
                  >
                    ({sub.grade})
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Academic Activities Feed */}
        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-slate-800 dark:text-slate-100 text-sm flex items-center gap-2">
                <Calendar className="w-4 h-4 text-emerald-600" /> Recent Activities
              </h3>
              <span className="text-[10px] text-slate-400">Live Log</span>
            </div>

            <div className="space-y-3">
              {activeStudent.activities.map((act) => (
                <div
                  key={act.id}
                  className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 flex items-start gap-3"
                >
                  <div
                    className={`p-2 rounded-lg shrink-0 mt-0.5 ${
                      act.type === 'alert'
                        ? 'bg-rose-100 text-rose-600 dark:bg-rose-950 dark:text-rose-300'
                        : act.type === 'exam'
                        ? 'bg-blue-100 text-blue-600 dark:bg-blue-950 dark:text-blue-300'
                        : act.type === 'ai_insight'
                        ? 'bg-purple-100 text-purple-600 dark:bg-purple-950 dark:text-purple-300'
                        : 'bg-emerald-100 text-emerald-600 dark:bg-emerald-950 dark:text-emerald-300'
                    }`}
                  >
                    {act.type === 'alert' ? (
                      <AlertTriangle className="w-3.5 h-3.5" />
                    ) : act.type === 'ai_insight' ? (
                      <Sparkles className="w-3.5 h-3.5" />
                    ) : (
                      <CheckCircle2 className="w-3.5 h-3.5" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-1">
                      <p className="font-bold text-xs text-slate-800 dark:text-slate-200 truncate">{act.title}</p>
                      {act.statusBadge && (
                        <span className="text-[9px] font-semibold px-1.5 py-0.2 rounded bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-200">
                          {act.statusBadge}
                        </span>
                      )}
                    </div>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 leading-snug">
                      {act.description}
                    </p>
                    <span className="text-[10px] text-slate-400 mt-1 block">{act.date}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs text-slate-500">
            <span>Faculty Advisor: {activeStudent.mentorName}</span>
            <button
              onClick={() => setActiveTab('attendance')}
              className="text-blue-600 dark:text-blue-400 font-semibold hover:underline"
            >
              Attendance Records
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
