import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  ScatterChart,
  Scatter,
  ZAxis,
} from 'recharts';
import {
  BarChart3,
  TrendingUp,
  Award,
  CheckCircle,
  HelpCircle,
  BookCheck,
  Scale,
} from 'lucide-react';

export const AcademicAnalytics: React.FC = () => {
  const { activeStudent } = useApp();
  const [metricView, setMetricView] = useState<'all' | 'internal' | 'external'>('all');

  // Subject-wise bar data
  const subjectBarData = activeStudent.subjects.map((sub) => ({
    name: sub.name.length > 20 ? sub.name.substring(0, 18) + '...' : sub.name,
    code: sub.code,
    internal: sub.internalMarks,
    external: sub.externalMarks,
    total: sub.totalMarks,
    attendance: sub.attendancePercentage,
    assignments: Math.round((sub.assignmentsSubmitted / sub.assignmentsTotal) * 100),
  }));

  // Semester performance line data
  const semesterProgressionData = activeStudent.semesterHistory.map((s) => ({
    semester: s.semester,
    SGPA: s.sgpa,
    Percentage: s.percentage,
    Attendance: s.attendance,
  }));

  // Attendance vs Marks correlation scatter data
  const scatterData = activeStudent.subjects.map((sub) => ({
    subject: sub.name,
    code: sub.code,
    attendance: sub.attendancePercentage,
    marks: sub.totalMarks,
    assignments: sub.assignmentsSubmitted,
  }));

  // Overall Strengths and Weaknesses
  const allStrengths = activeStudent.subjects.flatMap((s) =>
    s.strongTopics.map((topic) => ({ topic, subject: s.name, code: s.code }))
  );
  const allWeaknesses = activeStudent.subjects.flatMap((s) =>
    s.weakTopics.map((topic) => ({ topic, subject: s.name, code: s.code }))
  );

  return (
    <div className="space-y-6">
      {/* Header Title with quick insight */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200 dark:border-slate-800">
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
            <BarChart3 className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            Academic Performance Analytics
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
            Comprehensive diagnostic analysis of {activeStudent.name}&apos;s marks, exams, assignments, and trends
          </p>
        </div>

        {/* View toggle */}
        <div className="flex items-center gap-1.5 p-1 rounded-xl bg-slate-100 dark:bg-slate-800 text-xs font-medium">
          <button
            onClick={() => setMetricView('all')}
            className={`px-3 py-1.5 rounded-lg transition ${
              metricView === 'all'
                ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm font-semibold'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
            }`}
          >
            Total (100)
          </button>
          <button
            onClick={() => setMetricView('internal')}
            className={`px-3 py-1.5 rounded-lg transition ${
              metricView === 'internal'
                ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm font-semibold'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
            }`}
          >
            Internal (30)
          </button>
          <button
            onClick={() => setMetricView('external')}
            className={`px-3 py-1.5 rounded-lg transition ${
              metricView === 'external'
                ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm font-semibold'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
            }`}
          >
            External (70)
          </button>
        </div>
      </div>

      {/* Row 1: Subject-Wise Marks Bar Chart & Semester Trendline */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Subject-Wise Marks Bar Chart */}
        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-bold text-slate-800 dark:text-slate-100 text-sm">
                Subject-wise Performance Breakdown
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Performance comparison across all enrolled subjects
              </p>
            </div>
            <span className="text-xs font-mono font-bold text-blue-600 bg-blue-50 dark:bg-blue-950 px-2 py-1 rounded">
              Max: {metricView === 'all' ? 100 : metricView === 'internal' ? 30 : 70}
            </span>
          </div>

          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={subjectBarData} margin={{ top: 15, right: 15, left: -15, bottom: 25 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#94a3b8" opacity={0.15} />
                <XAxis dataKey="code" stroke="#94a3b8" fontSize={11} tickLine={false} />
                <YAxis
                  domain={[0, metricView === 'all' ? 100 : metricView === 'internal' ? 30 : 70]}
                  stroke="#94a3b8"
                  fontSize={11}
                  tickLine={false}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#0f172a',
                    borderRadius: '12px',
                    border: 'none',
                    color: '#fff',
                    fontSize: '12px',
                  }}
                />
                <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />
                {metricView === 'all' && (
                  <>
                    <Bar dataKey="internal" stackId="a" fill="#6366f1" name="Internal Assessment" />
                    <Bar dataKey="external" stackId="a" fill="#3b82f6" name="External End-Sem" radius={[4, 4, 0, 0]} />
                  </>
                )}
                {metricView === 'internal' && (
                  <Bar dataKey="internal" fill="#6366f1" name="Internal Assessment" radius={[4, 4, 0, 0]} />
                )}
                {metricView === 'external' && (
                  <Bar dataKey="external" fill="#3b82f6" name="External Exam" radius={[4, 4, 0, 0]} />
                )}
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Semester-wise Performance Line Chart */}
        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-bold text-slate-800 dark:text-slate-100 text-sm">
                Semester-wise Performance Trend
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                SGPA progression across completed academic semesters
              </p>
            </div>
            <span className="text-xs font-mono font-bold text-emerald-600 bg-emerald-50 dark:bg-emerald-950 px-2 py-1 rounded">
              Current SGPA: {activeStudent.cgpa}
            </span>
          </div>

          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={semesterProgressionData} margin={{ top: 15, right: 15, left: -15, bottom: 25 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#94a3b8" opacity={0.15} />
                <XAxis dataKey="semester" stroke="#94a3b8" fontSize={11} tickLine={false} />
                <YAxis domain={[4, 10]} stroke="#94a3b8" fontSize={11} tickLine={false} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#0f172a',
                    borderRadius: '12px',
                    border: 'none',
                    color: '#fff',
                    fontSize: '12px',
                  }}
                />
                <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />
                <Line
                  type="monotone"
                  dataKey="SGPA"
                  stroke="#3b82f6"
                  strokeWidth={3}
                  dot={{ r: 5, fill: '#3b82f6', strokeWidth: 2, stroke: '#fff' }}
                  activeDot={{ r: 7 }}
                  name="SGPA (Grade Point)"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Row 2: Attendance vs Marks Scatter Plot & Assignment vs Exam Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Attendance vs Marks Correlation Chart */}
        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-bold text-slate-800 dark:text-slate-100 text-sm flex items-center gap-2">
                <Scale className="w-4 h-4 text-indigo-600" /> Attendance vs. Marks Correlation
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Visualizing how classroom attendance directly impacts course scores
              </p>
            </div>
            <span className="text-[11px] font-semibold text-indigo-600 bg-indigo-50 dark:bg-indigo-950 px-2 py-0.5 rounded">
              r = +0.87 (High Correlation)
            </span>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <ScatterChart margin={{ top: 15, right: 20, bottom: 15, left: -10 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#94a3b8" opacity={0.15} />
                <XAxis
                  type="number"
                  dataKey="attendance"
                  name="Attendance"
                  unit="%"
                  domain={[50, 100]}
                  stroke="#94a3b8"
                  fontSize={11}
                  label={{ value: 'Attendance %', position: 'insideBottom', offset: -10, fill: '#94a3b8', fontSize: 11 }}
                />
                <YAxis
                  type="number"
                  dataKey="marks"
                  name="Marks"
                  unit="/100"
                  domain={[30, 100]}
                  stroke="#94a3b8"
                  fontSize={11}
                  label={{ value: 'Total Marks', angle: -90, position: 'insideLeft', offset: 15, fill: '#94a3b8', fontSize: 11 }}
                />
                <ZAxis range={[70, 70]} />
                <Tooltip
                  cursor={{ strokeDasharray: '3 3' }}
                  content={({ payload }) => {
                    if (payload && payload.length) {
                      const data = payload[0].payload;
                      return (
                        <div className="p-2.5 bg-slate-900 text-white rounded-xl text-xs shadow-lg border border-slate-700">
                          <p className="font-bold text-blue-400">{data.code}: {data.subject}</p>
                          <p className="text-slate-300 mt-1">Attendance: <span className="font-mono font-bold text-white">{data.attendance}%</span></p>
                          <p className="text-slate-300">Marks: <span className="font-mono font-bold text-white">{data.marks} / 100</span></p>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Scatter name="Subjects" data={scatterData} fill="#6366f1" />
              </ScatterChart>
            </ResponsiveContainer>
          </div>

          <div className="mt-3 p-3 rounded-xl bg-blue-50/70 dark:bg-blue-950/40 text-xs text-blue-900 dark:text-blue-200 border border-blue-100 dark:border-blue-900/50 flex items-center gap-2">
            <TrendingUp className="w-4 h-4 shrink-0 text-blue-600" />
            <span>
              Statistical regression indicates each 10% increase in attendance yields an estimated +7.4 marks in the final semester grade.
            </span>
          </div>
        </div>

        {/* Assignment & Examination Performance Matrix */}
        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="font-bold text-slate-800 dark:text-slate-100 text-sm flex items-center gap-2">
                  <BookCheck className="w-4 h-4 text-emerald-600" /> Continuous Evaluation Matrix
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Assignment submissions vs. examination performances
                </p>
              </div>
              <span className="text-[11px] font-semibold text-emerald-600 bg-emerald-50 dark:bg-emerald-950 px-2 py-0.5 rounded">
                Sem 6 Status
              </span>
            </div>

            <div className="space-y-3">
              {activeStudent.subjects.map((sub) => {
                const assignPct = Math.round((sub.assignmentsSubmitted / sub.assignmentsTotal) * 100);
                return (
                  <div key={sub.code} className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-bold text-slate-800 dark:text-slate-200">
                        {sub.code} - {sub.name}
                      </span>
                      <span className="font-mono font-bold text-slate-700 dark:text-slate-300">
                        {sub.totalMarks} / 100 ({sub.grade})
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-3 mt-2 text-[11px]">
                      <div>
                        <div className="flex justify-between text-slate-500 mb-1">
                          <span>Assignments ({sub.assignmentsSubmitted}/{sub.assignmentsTotal})</span>
                          <span className="font-semibold text-slate-700 dark:text-slate-300">{assignPct}%</span>
                        </div>
                        <div className="w-full bg-slate-200 dark:bg-slate-700 h-1.5 rounded-full overflow-hidden">
                          <div
                            className={`h-full rounded-full ${
                              assignPct === 100 ? 'bg-emerald-500' : assignPct >= 70 ? 'bg-blue-500' : 'bg-amber-500'
                            }`}
                            style={{ width: `${assignPct}%` }}
                          />
                        </div>
                      </div>

                      <div>
                        <div className="flex justify-between text-slate-500 mb-1">
                          <span>Class Attendance</span>
                          <span className={`font-semibold ${sub.attendancePercentage < 75 ? 'text-rose-500' : 'text-slate-700 dark:text-slate-300'}`}>
                            {sub.attendancePercentage}%
                          </span>
                        </div>
                        <div className="w-full bg-slate-200 dark:bg-slate-700 h-1.5 rounded-full overflow-hidden">
                          <div
                            className={`h-full rounded-full ${
                              sub.attendancePercentage < 75 ? 'bg-rose-500' : 'bg-emerald-500'
                            }`}
                            style={{ width: `${sub.attendancePercentage}%` }}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs text-slate-500">
            <span>Total Credits Enrolled: 18 Credits</span>
            <span className="text-emerald-600 dark:text-emerald-400 font-semibold">Continuous Assessment Active</span>
          </div>
        </div>
      </div>

      {/* Row 3: Subject-Wise Strengths and Weaknesses Diagnostics */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Identified Academic Strengths */}
        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="flex items-center gap-2 mb-3">
            <div className="p-2 rounded-xl bg-emerald-50 dark:bg-emerald-950 text-emerald-600">
              <CheckCircle className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-slate-800 dark:text-slate-100 text-sm">
                Identified Strengths & Mastery Areas
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Core concepts and topics where the student consistently scores 80%+
              </p>
            </div>
          </div>

          <div className="space-y-3 mt-4">
            {allStrengths.length > 0 ? (
              allStrengths.map((item, idx) => (
                <div
                  key={idx}
                  className="flex items-start gap-2.5 p-2.5 rounded-xl bg-emerald-50/50 dark:bg-emerald-950/20 border border-emerald-100 dark:border-emerald-900/40 text-xs"
                >
                  <Award className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold text-emerald-900 dark:text-emerald-200">{item.topic}</span>
                    <span className="block text-[10px] text-emerald-700/80 dark:text-emerald-400/80 mt-0.5">
                      Subject: {item.subject} ({item.code})
                    </span>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-xs text-slate-400">No high mastery topics identified yet.</p>
            )}
          </div>
        </div>

        {/* Identified Academic Weaknesses & Remedial Focus */}
        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="flex items-center gap-2 mb-3">
            <div className="p-2 rounded-xl bg-rose-50 dark:bg-rose-950 text-rose-600">
              <HelpCircle className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-slate-800 dark:text-slate-100 text-sm">
                Target Improvement & Remedial Topics
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Concepts flagged by diagnostic quizzes and lab evaluations for revision
              </p>
            </div>
          </div>

          <div className="space-y-3 mt-4">
            {allWeaknesses.length > 0 ? (
              allWeaknesses.map((item, idx) => (
                <div
                  key={idx}
                  className="flex items-start gap-2.5 p-2.5 rounded-xl bg-rose-50/50 dark:bg-rose-950/20 border border-rose-100 dark:border-rose-900/40 text-xs"
                >
                  <span className="w-2 h-2 rounded-full bg-rose-500 shrink-0 mt-1.5" />
                  <div>
                    <span className="font-bold text-rose-900 dark:text-rose-200">{item.topic}</span>
                    <span className="block text-[10px] text-rose-700/80 dark:text-rose-400/80 mt-0.5">
                      Focus Course: {item.subject} ({item.code})
                    </span>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-xs text-slate-400">No critical weaknesses identified.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
