import React from 'react';
import { useApp } from '../context/AppContext';
import {
  GitCompare,
  Award,
  AlertTriangle,
  UserPlus,
  ArrowRight,
} from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend,
} from 'recharts';

export const StudentComparison: React.FC = () => {
  const { students, comparisonIds, toggleComparisonId, setActiveStudent, setActiveTab } = useApp();

  const comparedStudents = students.filter((s) => comparisonIds.includes(s.id));

  // Prepare chart data for compared students across common subject codes (e.g. CS601, CS602, CS603)
  const commonCodes = ['CS601', 'CS602', 'CS603', 'CS604', 'CS605'];
  const chartData = commonCodes.map((code) => {
    const entry: Record<string, any> = { code };
    comparedStudents.forEach((st) => {
      const match = st.subjects.find((sub) => sub.code === code);
      entry[st.name.split(' ')[0]] = match ? match.totalMarks : 0;
    });
    return entry;
  });

  const barColors = ['#3b82f6', '#8b5cf6', '#10b981', '#f59e0b'];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200 dark:border-slate-800">
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
            <GitCompare className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
            Multi-Student Academic Performance Comparison
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
            Side-by-side benchmarking of subject marks, attendance rates, and predictive risk indicators
          </p>
        </div>

        <button
          onClick={() => setActiveTab('teacher_students')}
          className="px-3.5 py-1.5 rounded-xl text-xs font-semibold bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-300 transition flex items-center gap-1.5"
        >
          <UserPlus className="w-3.5 h-3.5" /> Modify Selection in Roster
        </button>
      </div>

      {/* Select active comparison pills */}
      <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-wrap items-center gap-2">
        <span className="text-xs font-bold text-slate-500 dark:text-slate-400 mr-2">
          Toggle Students to Compare (Up to 3):
        </span>
        {students.map((st) => {
          const isSelected = comparisonIds.includes(st.id);
          return (
            <button
              key={st.id}
              onClick={() => toggleComparisonId(st.id)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium transition ${
                isSelected
                  ? 'bg-indigo-600 text-white shadow-sm font-semibold'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
              }`}
            >
              <img src={st.avatar} alt={st.name} className="w-4 h-4 rounded-full object-cover" />
              <span>{st.name}</span>
              <span className="text-[10px] opacity-75 font-mono">({st.overallPercentage}%)</span>
            </button>
          );
        })}
      </div>

      {comparedStudents.length < 2 ? (
        <div className="p-12 text-center bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800">
          <GitCompare className="w-12 h-12 text-slate-300 dark:text-slate-600 mx-auto mb-3" />
          <h4 className="text-base font-bold text-slate-800 dark:text-slate-200">
            Please select at least 2 students to generate the comparison
          </h4>
          <p className="text-xs text-slate-500 max-w-md mx-auto mt-1">
            Choose from the student pills above or use the checkboxes in the Student Management Roster.
          </p>
        </div>
      ) : (
        <>
          {/* Comparative Subject Bar Chart */}
          <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
            <h3 className="font-bold text-slate-800 dark:text-slate-100 text-sm mb-4">
              Subject Score Comparison (Total Marks out of 100)
            </h3>

            <div className="h-72 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData} margin={{ top: 15, right: 15, left: -15, bottom: 20 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#94a3b8" opacity={0.15} />
                  <XAxis dataKey="code" stroke="#94a3b8" fontSize={11} tickLine={false} />
                  <YAxis domain={[0, 100]} stroke="#94a3b8" fontSize={11} tickLine={false} />
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
                  {comparedStudents.map((st, idx) => (
                    <Bar
                      key={st.id}
                      dataKey={st.name.split(' ')[0]}
                      fill={barColors[idx % barColors.length]}
                      radius={[4, 4, 0, 0]}
                    />
                  ))}
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Side-by-Side Comparison Metrics Table */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {comparedStudents.map((st, idx) => {
              const isAtRisk = st.riskLevel === 'Critical' || st.attendancePercentage < 75;

              return (
                <div
                  key={st.id}
                  className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between"
                >
                  <div>
                    {/* Header profile */}
                    <div className="flex items-center gap-3 pb-3 border-b border-slate-100 dark:border-slate-800">
                      <img
                        src={st.avatar}
                        alt={st.name}
                        className="w-12 h-12 rounded-xl object-cover ring-2 ring-indigo-500/30"
                      />
                      <div className="min-w-0 flex-1">
                        <h4 className="font-bold text-sm text-slate-900 dark:text-white truncate">
                          {st.name}
                        </h4>
                        <p className="text-[11px] text-slate-400 font-mono truncate">{st.rollNo}</p>
                        <span
                          className={`inline-block text-[9px] font-bold px-1.5 py-0.2 rounded mt-0.5 ${
                            isAtRisk
                              ? 'bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-300'
                              : 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300'
                          }`}
                        >
                          {st.performanceStatus} ({st.riskLevel} Risk)
                        </span>
                      </div>
                    </div>

                    {/* Key Metrics */}
                    <div className="grid grid-cols-2 gap-2 mt-4 text-center">
                      <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700">
                        <span className="text-[10px] text-slate-400 block uppercase font-bold">CGPA</span>
                        <span className="text-xl font-black font-mono text-slate-900 dark:text-white">
                          {st.cgpa}
                        </span>
                      </div>
                      <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700">
                        <span className="text-[10px] text-slate-400 block uppercase font-bold">Attendance</span>
                        <span
                          className={`text-xl font-black font-mono ${
                            st.attendancePercentage < 75 ? 'text-rose-600' : 'text-emerald-600'
                          }`}
                        >
                          {st.attendancePercentage}%
                        </span>
                      </div>
                    </div>

                    {/* Strengths & Weaknesses breakdown */}
                    <div className="mt-4 space-y-2 text-xs">
                      <div>
                        <span className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                          Key Strengths:
                        </span>
                        <p className="text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 p-2 rounded-lg text-[11px]">
                          {st.aiPrediction.strongSubjects?.join(', ') || 'Consistent academic delivery'}
                        </p>
                      </div>

                      <div>
                        <span className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                          Remedial Attention:
                        </span>
                        <p className="text-rose-700 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/40 p-2 rounded-lg text-[11px]">
                          {st.aiPrediction.weakSubjects?.join(', ') || 'No critical weaknesses'}
                        </p>
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => {
                      setActiveStudent(st);
                      setActiveTab('overview');
                    }}
                    className="mt-5 w-full py-2 rounded-xl text-xs font-semibold bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 hover:bg-indigo-100 transition flex items-center justify-center gap-1.5"
                  >
                    Examine Student Profile <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
};
