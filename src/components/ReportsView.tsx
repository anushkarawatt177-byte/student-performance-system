import React, { useRef } from 'react';
import { useApp } from '../context/AppContext';
import {
  Printer,
  Download,
  FileSpreadsheet,
  GraduationCap,
  Award,
  CalendarCheck,
  BrainCircuit,
  FileText,
  AlertTriangle,
} from 'lucide-react';

export const ReportsView: React.FC = () => {
  const { activeStudent, students, currentUser } = useApp();
  const printRef = useRef<HTMLDivElement>(null);

  // Trigger browser print dialog formatted for print
  const handlePrint = () => {
    window.print();
  };

  // Export full student roster as CSV download
  const handleExportCSV = () => {
    const headers = [
      'Roll Number',
      'Student Name',
      'Course',
      'Semester',
      'CGPA',
      'Overall Marks %',
      'Attendance %',
      'Performance Status',
      'Risk Level',
      'Mentor',
    ];

    const rows = students.map((s) => [
      `"${s.rollNo}"`,
      `"${s.name}"`,
      `"${s.course}"`,
      `"${s.semester}"`,
      s.cgpa,
      s.overallPercentage,
      s.attendancePercentage,
      `"${s.performanceStatus}"`,
      `"${s.riskLevel}"`,
      `"${s.mentorName}"`,
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `EduAnalytics_Student_Roster_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const isAtRisk = activeStudent.riskLevel === 'Critical' || activeStudent.attendancePercentage < 75;

  return (
    <div className="space-y-6">
      {/* Header Bar */}
      <div className="no-print flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200 dark:border-slate-800">
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
            <FileText className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            Official Academic Transcripts & Performance Reports
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
            Generate and export university-grade evaluation transcripts, attendance ledgers, and institutional analytics
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={handleExportCSV}
            className="px-3.5 py-2 rounded-xl text-xs font-semibold bg-emerald-50 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 hover:bg-emerald-100 dark:hover:bg-emerald-900 border border-emerald-200 dark:border-emerald-800 transition flex items-center gap-1.5 shadow-sm"
          >
            <FileSpreadsheet className="w-4 h-4" /> Export Cohort Roster (CSV)
          </button>
          <button
            onClick={handlePrint}
            className="px-4 py-2 rounded-xl text-xs font-semibold bg-blue-600 hover:bg-blue-700 text-white transition flex items-center gap-1.5 shadow-md shadow-blue-500/20"
          >
            <Printer className="w-4 h-4" /> Print / Save PDF Transcript
          </button>
        </div>
      </div>

      {/* Official Printable Academic Transcript Layout */}
      <div
        ref={printRef}
        className="bg-white text-slate-900 rounded-3xl border border-slate-200 shadow-xl p-8 sm:p-10 max-w-4xl mx-auto space-y-6 print:p-0 print:border-none print:shadow-none"
      >
        {/* Institutional Header */}
        <div className="flex items-center justify-between pb-6 border-b-2 border-slate-900/80">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-slate-900 to-blue-900 text-white flex items-center justify-center font-black text-2xl shadow">
              <GraduationCap className="w-10 h-10" />
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl font-black uppercase tracking-tight text-slate-950">
                Institute of Technology & Science
              </h1>
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-600">
                Department of Academic Affairs • Office of the Controller of Examinations
              </p>
              <p className="text-[11px] text-slate-500">
                Accredited Grade &apos;A++&apos; • Autonomous University System
              </p>
            </div>
          </div>

          <div className="text-right">
            <span className="text-[10px] font-mono text-slate-500 uppercase tracking-widest block">
              Official Transcript
            </span>
            <span className="text-xs font-bold font-mono text-slate-900 block mt-0.5">
              DOC-REF #{activeStudent.rollNo}-2026
            </span>
            <span className="text-[10px] text-slate-400 block">
              Date: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}
            </span>
          </div>
        </div>

        {/* Student Dossier Matrix */}
        <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-xs">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Student Name</span>
              <span className="font-bold text-slate-900 text-sm">{activeStudent.name}</span>
            </div>
            <div>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Roll Number</span>
              <span className="font-bold text-slate-900 font-mono text-sm">{activeStudent.rollNo}</span>
            </div>
            <div>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Degree & Major</span>
              <span className="font-medium text-slate-800">{activeStudent.course}</span>
            </div>
            <div>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Academic Semester</span>
              <span className="font-medium text-slate-800">{activeStudent.semester} ({activeStudent.section})</span>
            </div>
          </div>
        </div>

        {/* Cumulative Performance Summary Tiles */}
        <div className="grid grid-cols-4 gap-3 text-center">
          <div className="p-3 rounded-xl border border-slate-200 bg-white">
            <span className="text-[10px] uppercase font-bold text-slate-400">Cumulative GPA</span>
            <div className="text-2xl font-black font-mono text-slate-900 mt-0.5">{activeStudent.cgpa}</div>
          </div>
          <div className="p-3 rounded-xl border border-slate-200 bg-white">
            <span className="text-[10px] uppercase font-bold text-slate-400">Total Marks %</span>
            <div className="text-2xl font-black font-mono text-blue-600 mt-0.5">{activeStudent.overallPercentage}%</div>
          </div>
          <div className="p-3 rounded-xl border border-slate-200 bg-white">
            <span className="text-[10px] uppercase font-bold text-slate-400">Attendance Rate</span>
            <div className={`text-2xl font-black font-mono mt-0.5 ${activeStudent.attendancePercentage < 75 ? 'text-rose-600' : 'text-emerald-600'}`}>
              {activeStudent.attendancePercentage}%
            </div>
          </div>
          <div className="p-3 rounded-xl border border-slate-200 bg-white">
            <span className="text-[10px] uppercase font-bold text-slate-400">Academic Standing</span>
            <div className="text-sm font-bold text-slate-800 mt-1">{activeStudent.performanceStatus}</div>
          </div>
        </div>

        {/* Course Ledger Table */}
        <div>
          <h3 className="font-bold text-xs uppercase tracking-wider text-slate-600 mb-2">
            Course Performance & Attendance Ledger
          </h3>
          <table className="w-full text-left text-xs border border-slate-200 rounded-xl overflow-hidden">
            <thead className="bg-slate-100 text-slate-700 font-bold uppercase text-[10px]">
              <tr>
                <th className="py-2.5 px-3">Code</th>
                <th className="py-2.5 px-3">Course Title</th>
                <th className="py-2.5 px-3 text-center">Credits</th>
                <th className="py-2.5 px-3 text-center">Internal (30)</th>
                <th className="py-2.5 px-3 text-center">External (70)</th>
                <th className="py-2.5 px-3 text-center">Total (100)</th>
                <th className="py-2.5 px-3 text-center">Grade</th>
                <th className="py-2.5 px-3 text-right">Attendance %</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 font-medium">
              {activeStudent.subjects.map((sub) => (
                <tr key={sub.code}>
                  <td className="py-2.5 px-3 font-mono font-bold">{sub.code}</td>
                  <td className="py-2.5 px-3 font-semibold text-slate-900">{sub.name}</td>
                  <td className="py-2.5 px-3 text-center font-mono">{sub.credits}</td>
                  <td className="py-2.5 px-3 text-center font-mono">{sub.internalMarks}</td>
                  <td className="py-2.5 px-3 text-center font-mono">{sub.externalMarks}</td>
                  <td className="py-2.5 px-3 text-center font-mono font-bold text-slate-900">{sub.totalMarks}</td>
                  <td className="py-2.5 px-3 text-center font-bold text-blue-700">{sub.grade}</td>
                  <td className="py-2.5 px-3 text-right font-mono font-bold">
                    <span className={sub.attendancePercentage < 75 ? 'text-rose-600' : 'text-slate-800'}>
                      {sub.attendancePercentage}%
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Semester Progression History */}
        <div>
          <h3 className="font-bold text-xs uppercase tracking-wider text-slate-600 mb-2">
            Historical Progression Record
          </h3>
          <div className="grid grid-cols-6 gap-2 text-center text-xs">
            {activeStudent.semesterHistory.map((h) => (
              <div key={h.semester} className="p-2 rounded-lg bg-slate-50 border border-slate-200">
                <span className="font-bold text-slate-600 block text-[10px]">{h.semester}</span>
                <span className="font-black font-mono text-slate-900 block text-sm mt-0.5">{h.sgpa}</span>
                <span className="text-[10px] text-slate-500 block">{h.percentage}%</span>
              </div>
            ))}
          </div>
        </div>

        {/* AI Analytics Diagnostic & Advisory Summary */}
        <div className="p-4 rounded-2xl bg-indigo-50/70 border border-indigo-200 text-xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="font-bold text-indigo-950 flex items-center gap-1.5 uppercase text-[10px] tracking-wider">
              <BrainCircuit className="w-4 h-4 text-indigo-700" /> AI Diagnostic Advisory & Predictive Evaluation
            </span>
            <span className="font-mono text-[10px] font-bold text-indigo-700">
              Predicted Next SGPA: {activeStudent.aiPrediction.predictedNextSGPA}
            </span>
          </div>
          <p className="text-slate-700 leading-relaxed">
            {activeStudent.aiPrediction.personalizedRecommendations[0]}
          </p>
        </div>

        {/* Official Signatures Section */}
        <div className="pt-8 flex items-center justify-between border-t border-slate-200 text-xs">
          <div className="text-center">
            <div className="h-10 flex items-end justify-center font-serif italic text-slate-500">
              Dr. Rajesh Kulkarni
            </div>
            <div className="w-40 border-t border-slate-400 pt-1 font-semibold text-slate-700 text-[11px]">
              Head of Department
            </div>
          </div>

          <div className="text-center">
            <div className="h-10 flex items-end justify-center font-serif italic text-slate-500">
              Prof. Sunita Menon
            </div>
            <div className="w-40 border-t border-slate-400 pt-1 font-semibold text-slate-700 text-[11px]">
              Academic Counselor
            </div>
          </div>

          <div className="text-center">
            <div className="w-16 h-16 rounded-full border-2 border-slate-300 mx-auto flex items-center justify-center text-[8px] font-bold text-slate-400 uppercase tracking-tighter">
              University Seal
            </div>
            <div className="font-semibold text-slate-700 text-[11px] mt-1">
              Controller of Exams
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
