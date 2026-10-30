import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  CalendarCheck,
  AlertTriangle,
  CheckCircle2,
  Clock,
  Calculator,
  Calendar,
  FileCheck2,
  FileUp,
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

export const AttendanceManagement: React.FC = () => {
  const { activeStudent } = useApp();
  const [selectedSubjectCode, setSelectedSubjectCode] = useState<string>('all');
  const [medicalFormOpen, setMedicalFormOpen] = useState(false);
  const [medicalSubmitted, setMedicalSubmitted] = useState(false);

  // Subject attendance statistics
  const totalClassesConducted = activeStudent.subjects.reduce((sum, s) => sum + s.attendanceTotal, 0);
  const totalClassesAttended = activeStudent.subjects.reduce((sum, s) => sum + s.attendanceAttended, 0);
  const totalClassesMissed = totalClassesConducted - totalClassesAttended;
  const overallAttPercentage = activeStudent.attendancePercentage;

  // Monthly visualization data
  const monthlyData = activeStudent.monthlyAttendance.map((m) => ({
    month: m.month,
    Attended: m.attended,
    Missed: m.total - m.attended,
    Percentage: m.percentage,
  }));

  // Attendance recovery calculator logic:
  // Formula: (attended + x) / (total + x) >= 0.75
  // attended + x >= 0.75*total + 0.75*x
  // 0.25*x >= 0.75*total - attended
  // x >= (0.75*total - attended) / 0.25
  const calculateClassesNeeded = (attended: number, total: number, targetPct = 75) => {
    const current = (attended / total) * 100;
    if (current >= targetPct) return 0;
    const target = targetPct / 100;
    const needed = Math.ceil((target * total - attended) / (1 - target));
    return needed > 0 ? needed : 0;
  };

  const classesNeededFor75 = calculateClassesNeeded(totalClassesAttended, totalClassesConducted, 75);
  const classesNeededFor85 = calculateClassesNeeded(totalClassesAttended, totalClassesConducted, 85);

  const filteredSubjects =
    selectedSubjectCode === 'all'
      ? activeStudent.subjects
      : activeStudent.subjects.filter((s) => s.code === selectedSubjectCode);

  return (
    <div className="space-y-6">
      {/* Title Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200 dark:border-slate-800">
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
            <CalendarCheck className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
            Attendance Management & Statutory Eligibility
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
            Official classroom attendance tracking, semester examination threshold monitoring, and recovery planning
          </p>
        </div>

        <button
          onClick={() => setMedicalFormOpen(true)}
          className="px-3.5 py-2 rounded-xl text-xs font-semibold bg-blue-50 dark:bg-blue-950 text-blue-700 dark:text-blue-300 hover:bg-blue-100 dark:hover:bg-blue-900 border border-blue-200 dark:border-blue-800 transition flex items-center gap-1.5"
        >
          <FileUp className="w-3.5 h-3.5" /> Submit Medical / Duty Leave
        </button>
      </div>

      {/* Critical Warning if Below 75% */}
      {overallAttPercentage < 75 && (
        <div className="p-4 rounded-2xl bg-rose-50 dark:bg-rose-950/60 border border-rose-300 dark:border-rose-800 text-rose-900 dark:text-rose-200 flex items-start gap-3.5 shadow-sm">
          <div className="p-2 rounded-xl bg-rose-600 text-white shrink-0 mt-0.5">
            <AlertTriangle className="w-5 h-5" />
          </div>
          <div className="flex-1">
            <h4 className="font-bold text-sm">
              Statutory Examination Debarment Alert: {overallAttPercentage}% (Requirement: 75.0%)
            </h4>
            <p className="text-xs text-rose-700 dark:text-rose-300 mt-0.5 leading-relaxed">
              As per University Ordinance Regulation 14.2, students with attendance below 75% are not eligible to receive the Semester Examination Hall Ticket. You must attend at least{' '}
              <strong className="underline font-black">{classesNeededFor75} consecutive lectures</strong> across your courses to regain eligibility.
            </p>
          </div>
        </div>
      )}

      {/* 4 Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Overall Percentage */}
        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Attendance Status</span>
          <div className="mt-2 flex items-baseline justify-between">
            <span
              className={`text-3xl font-black font-mono ${
                overallAttPercentage < 75 ? 'text-rose-600 dark:text-rose-400' : 'text-emerald-600 dark:text-emerald-400'
              }`}
            >
              {overallAttPercentage}%
            </span>
            <span
              className={`text-xs font-bold px-2 py-0.5 rounded-full ${
                overallAttPercentage >= 75
                  ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300'
                  : 'bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-300'
              }`}
            >
              {overallAttPercentage >= 75 ? 'Qualified' : 'Detention Alert'}
            </span>
          </div>
          <div className="mt-3 w-full bg-slate-100 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full ${overallAttPercentage < 75 ? 'bg-rose-500' : 'bg-emerald-500'}`}
              style={{ width: `${Math.min(100, overallAttPercentage)}%` }}
            />
          </div>
        </div>

        {/* Total Conducted */}
        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Classes Conducted</span>
          <div className="mt-2 text-3xl font-black font-mono text-slate-900 dark:text-white">
            {totalClassesConducted}
          </div>
          <p className="mt-2 text-xs text-slate-400">Total hours scheduled across 5 subjects</p>
        </div>

        {/* Classes Attended */}
        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Attended Classes</span>
          <div className="mt-2 text-3xl font-black font-mono text-emerald-600 dark:text-emerald-400">
            {totalClassesAttended}
          </div>
          <p className="mt-2 text-xs text-slate-400">Valid attended lectures & labs</p>
        </div>

        {/* Classes Missed */}
        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Missed Classes</span>
          <div className="mt-2 text-3xl font-black font-mono text-rose-500">
            {totalClassesMissed}
          </div>
          <p className="mt-2 text-xs text-slate-400">Unattended sessions recorded</p>
        </div>
      </div>

      {/* Row 2: Monthly Attendance Trend & Attendance Recovery Calculator */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Monthly Attendance Chart */}
        <div className="lg:col-span-2 p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-bold text-slate-800 dark:text-slate-100 text-sm flex items-center gap-2">
                <Calendar className="w-4 h-4 text-blue-600" /> Monthly Attendance Trajectory (Jul - Dec)
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Attended vs Missed lecture breakdown per academic month
              </p>
            </div>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={monthlyData} margin={{ top: 15, right: 15, left: -20, bottom: 20 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#94a3b8" opacity={0.15} />
                <XAxis dataKey="month" stroke="#94a3b8" fontSize={11} tickLine={false} />
                <YAxis stroke="#94a3b8" fontSize={11} tickLine={false} />
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
                <Bar dataKey="Attended" stackId="a" fill="#10b981" radius={[0, 0, 0, 0]} name="Lectures Attended" />
                <Bar dataKey="Missed" stackId="a" fill="#f43f5e" radius={[4, 4, 0, 0]} name="Lectures Missed" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Real-Time Attendance Recovery Calculator */}
        <div className="p-5 rounded-2xl bg-gradient-to-br from-indigo-950 via-slate-900 to-blue-950 text-white border border-indigo-900 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <div className="p-2 rounded-xl bg-blue-500/20 text-blue-300">
                <Calculator className="w-4 h-4" />
              </div>
              <div>
                <h3 className="font-bold text-white text-sm">Attendance Recovery Tool</h3>
                <p className="text-[11px] text-indigo-300">Target threshold calculation</p>
              </div>
            </div>

            <div className="space-y-3 mt-4">
              <div className="p-3 rounded-xl bg-white/5 border border-white/10">
                <span className="text-[11px] text-indigo-200 block">Classes to reach 75% Cutoff:</span>
                <div className="text-2xl font-black font-mono text-emerald-400 mt-1">
                  {classesNeededFor75 === 0 ? (
                    <span className="text-emerald-300 flex items-center gap-1 text-sm font-sans">
                      <CheckCircle2 className="w-4 h-4" /> Already Met (Eligible)
                    </span>
                  ) : (
                    <span>+{classesNeededFor75} Lectures Needed</span>
                  )}
                </div>
                <p className="text-[10px] text-slate-300 mt-1">
                  Attend consecutive lectures without absent days
                </p>
              </div>

              <div className="p-3 rounded-xl bg-white/5 border border-white/10">
                <span className="text-[11px] text-indigo-200 block">Classes to reach 85% Honors:</span>
                <div className="text-2xl font-black font-mono text-blue-300 mt-1">
                  {classesNeededFor85 === 0 ? (
                    <span className="text-emerald-300 flex items-center gap-1 text-sm font-sans">
                      <CheckCircle2 className="w-4 h-4" /> Honors Attained
                    </span>
                  ) : (
                    <span>+{classesNeededFor85} Lectures Needed</span>
                  )}
                </div>
                <p className="text-[10px] text-slate-300 mt-1">
                  Qualifies for 5 bonus internal marks criteria
                </p>
              </div>
            </div>
          </div>

          <div className="mt-4 p-2.5 rounded-lg bg-white/10 text-[11px] text-indigo-200 flex items-center gap-2">
            <Clock className="w-3.5 h-3.5 shrink-0 text-amber-300" />
            <span>Attendance updated every morning at 08:30 AM via biometric RFID logs.</span>
          </div>
        </div>
      </div>

      {/* Row 3: Subject-Wise Detailed Attendance Breakdown Table */}
      <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
          <div>
            <h3 className="font-bold text-slate-800 dark:text-slate-100 text-sm">
              Subject-wise Detailed Attendance Ledger
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Classes attended, missed, and eligibility status for every subject
            </p>
          </div>

          {/* Subject Filter */}
          <select
            value={selectedSubjectCode}
            onChange={(e) => setSelectedSubjectCode(e.target.value)}
            className="px-3 py-1.5 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 focus:outline-none"
          >
            <option value="all">All Subjects ({activeStudent.subjects.length})</option>
            {activeStudent.subjects.map((s) => (
              <option key={s.code} value={s.code}>
                {s.code} - {s.name}
              </option>
            ))}
          </select>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-400 font-semibold uppercase text-[10px] tracking-wider">
                <th className="py-3 px-3">Subject</th>
                <th className="py-3 px-3 text-center">Conducted</th>
                <th className="py-3 px-3 text-center">Attended</th>
                <th className="py-3 px-3 text-center">Missed</th>
                <th className="py-3 px-3">Attendance %</th>
                <th className="py-3 px-3 text-center">Cutoff Status</th>
                <th className="py-3 px-3 text-right">Recovery Required</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
              {filteredSubjects.map((sub) => {
                const subNeeded = calculateClassesNeeded(sub.attendanceAttended, sub.attendanceTotal, 75);
                const isSubLow = sub.attendancePercentage < 75;

                return (
                  <tr key={sub.code} className="hover:bg-slate-50/60 dark:hover:bg-slate-800/40 transition">
                    <td className="py-3.5 px-3">
                      <div className="font-bold text-slate-800 dark:text-slate-200">{sub.name}</div>
                      <div className="text-[10px] text-slate-400">{sub.code} • {sub.credits} Credits</div>
                    </td>
                    <td className="py-3.5 px-3 text-center font-mono font-semibold text-slate-700 dark:text-slate-300">
                      {sub.attendanceTotal}
                    </td>
                    <td className="py-3.5 px-3 text-center font-mono font-bold text-emerald-600 dark:text-emerald-400">
                      {sub.attendanceAttended}
                    </td>
                    <td className="py-3.5 px-3 text-center font-mono font-bold text-rose-500">
                      {sub.attendanceTotal - sub.attendanceAttended}
                    </td>
                    <td className="py-3.5 px-3 min-w-[140px]">
                      <div className="flex items-center justify-between text-xs mb-1 font-mono font-bold">
                        <span className={isSubLow ? 'text-rose-600' : 'text-slate-800 dark:text-slate-200'}>
                          {sub.attendancePercentage}%
                        </span>
                      </div>
                      <div className="w-full bg-slate-100 dark:bg-slate-800 h-1.5 rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full ${isSubLow ? 'bg-rose-500' : 'bg-emerald-500'}`}
                          style={{ width: `${sub.attendancePercentage}%` }}
                        />
                      </div>
                    </td>
                    <td className="py-3.5 px-3 text-center">
                      <span
                        className={`inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full ${
                          isSubLow
                            ? 'bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-300'
                            : 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300'
                        }`}
                      >
                        {isSubLow ? (
                          <>
                            <AlertTriangle className="w-3 h-3" /> Debarred
                          </>
                        ) : (
                          <>
                            <CheckCircle2 className="w-3 h-3" /> Eligible
                          </>
                        )}
                      </span>
                    </td>
                    <td className="py-3.5 px-3 text-right font-mono">
                      {subNeeded > 0 ? (
                        <span className="text-rose-600 dark:text-rose-400 font-bold">
                          +{subNeeded} Classes
                        </span>
                      ) : (
                        <span className="text-emerald-600 dark:text-emerald-400 font-medium">Safe Margin</span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Medical Leave Application Modal */}
      {medicalFormOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xl p-6 space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
              <h3 className="font-bold text-slate-900 dark:text-white text-base flex items-center gap-2">
                <FileCheck2 className="w-5 h-5 text-blue-600" /> Medical / Condonation Application
              </h3>
              <button
                onClick={() => {
                  setMedicalFormOpen(false);
                  setMedicalSubmitted(false);
                }}
                className="text-slate-400 hover:text-slate-600 text-lg leading-none"
              >
                &times;
              </button>
            </div>

            {medicalSubmitted ? (
              <div className="text-center py-6 space-y-3">
                <div className="w-12 h-12 bg-emerald-100 dark:bg-emerald-950 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
                <h4 className="font-bold text-slate-800 dark:text-slate-100 text-sm">
                  Medical Leave Request Forwarded
                </h4>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Application forwarded to Head of Department ({activeStudent.mentorName}) for attendance condonation review.
                </p>
                <button
                  onClick={() => {
                    setMedicalFormOpen(false);
                    setMedicalSubmitted(false);
                  }}
                  className="mt-2 px-4 py-2 rounded-xl text-xs font-semibold bg-blue-600 text-white"
                >
                  Done
                </button>
              </div>
            ) : (
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  setMedicalSubmitted(true);
                }}
                className="space-y-3 text-xs"
              >
                <div>
                  <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                    Student Information
                  </label>
                  <input
                    type="text"
                    disabled
                    value={`${activeStudent.name} (${activeStudent.rollNo}) - ${activeStudent.course}`}
                    className="w-full px-3 py-2 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                      From Date
                    </label>
                    <input
                      type="date"
                      required
                      defaultValue="2026-10-18"
                      className="w-full px-3 py-2 rounded-lg bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-700"
                    />
                  </div>
                  <div>
                    <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                      To Date
                    </label>
                    <input
                      type="date"
                      required
                      defaultValue="2026-10-22"
                      className="w-full px-3 py-2 rounded-lg bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-700"
                    />
                  </div>
                </div>

                <div>
                  <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                    Reason for Absence
                  </label>
                  <select className="w-full px-3 py-2 rounded-lg bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-700">
                    <option>Medical Illness / Hospitalization</option>
                    <option>University Technical Event / Hackathon on Duty</option>
                    <option>Sports / Cultural Representation</option>
                    <option>Family Emergency</option>
                  </select>
                </div>

                <div>
                  <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                    Attach Doctor&apos;s Prescription / Certificate
                  </label>
                  <div className="border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-xl p-4 text-center cursor-pointer hover:border-blue-500 transition">
                    <FileUp className="w-6 h-6 text-slate-400 mx-auto mb-1" />
                    <span className="text-slate-600 dark:text-slate-400 text-[11px] block">
                      Click to upload medical certificate (PDF/JPG)
                    </span>
                  </div>
                </div>

                <div className="flex justify-end gap-2 pt-2 border-t border-slate-100 dark:border-slate-800">
                  <button
                    type="button"
                    onClick={() => setMedicalFormOpen(false)}
                    className="px-3 py-2 rounded-lg text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold transition"
                  >
                    Submit Application
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
