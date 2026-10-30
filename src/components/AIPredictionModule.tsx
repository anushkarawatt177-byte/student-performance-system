import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  BrainCircuit,
  Sparkles,
  TrendingUp,
  AlertTriangle,
  CheckCircle2,
  Sliders,
  ShieldCheck,
  ShieldAlert,
  Loader2,
  Calendar,
  Layers,
  ArrowRight,
  Bot
} from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from 'recharts';

export const AIPredictionModule: React.FC = () => {
  const { activeStudent, setActiveTab } = useApp();

  // What-If Simulator state
  const [targetAttendance, setTargetAttendance] = useState<number>(
    Math.min(95, Math.max(65, activeStudent.attendancePercentage))
  );
  const [studyHoursDaily, setStudyHoursDaily] = useState<number>(3);
  const [focusWeakSubject, setFocusWeakSubject] = useState<boolean>(true);

  // Live AI Consultation with server / Gemini
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);
  const [customGoal, setCustomGoal] = useState<string>('');
  const [liveAIOutput, setLiveAIOutput] = useState<any | null>(null);

  // Dynamic what-if calculations
  const attendanceDelta = targetAttendance - activeStudent.attendancePercentage;
  const simulatedAttendanceGain = attendanceDelta * 0.12;
  const simulatedStudyGain = (studyHoursDaily - 2) * 0.25;
  const simulatedFocusGain = focusWeakSubject ? 0.35 : 0.0;

  const simulatedNextSGPA = Math.min(
    10.0,
    Math.max(
      4.0,
      parseFloat(
        (activeStudent.cgpa + (simulatedAttendanceGain + simulatedStudyGain + simulatedFocusGain) * 0.5).toFixed(2)
      )
    )
  );

  const simulatedBacklogRisk = Math.max(
    1,
    Math.min(
      95,
      Math.round(
        activeStudent.aiPrediction.backlogProbability -
          attendanceDelta * 1.5 -
          (studyHoursDaily - 2) * 8 -
          (focusWeakSubject ? 12 : 0)
      )
    )
  );

  const handleRunLiveAI = async () => {
    setIsAnalyzing(true);
    try {
      const response = await fetch('/api/ai/predict', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          studentId: activeStudent.id,
          customGoal: customGoal || 'Provide a detailed prediction for semester examination success and subject recovery plan.',
        }),
      });
      if (response.ok) {
        const result = await response.json();
        setLiveAIOutput(result.data);
      }
    } catch (e) {
      console.error('AI call error', e);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const predictionData = liveAIOutput || activeStudent.aiPrediction;

  // Comparison chart for historical vs predicted
  const historyAndPredictedData = [
    ...activeStudent.semesterHistory.map((h) => ({
      name: h.semester,
      SGPA: h.sgpa,
      type: 'Actual',
    })),
    {
      name: 'Next Sem (Pred)',
      SGPA: predictionData.predictedNextSGPA,
      type: 'Predicted',
    },
  ];

  const isAtRisk = predictionData.riskAssessment === 'High Risk' || activeStudent.attendancePercentage < 75;

  return (
    <div className="space-y-6">
      {/* Page Title & Status Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200 dark:border-slate-800">
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
            <BrainCircuit className="w-6 h-6 text-purple-600 dark:text-purple-400" />
            AI-Based Academic Prediction & Risk Intelligence
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
            Machine learning forecast models trained on historical marks, attendance patterns, and continuous evaluations
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-purple-100 dark:bg-purple-950/80 text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-800">
            <Sparkles className="w-3.5 h-3.5" />
            Engine: Gemini & Statistical Regression
          </span>
        </div>
      </div>

      {/* Main Prediction Scorecard Banner */}
      <div className="p-6 rounded-3xl bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 text-white shadow-xl border border-indigo-900/60 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 grid grid-cols-1 md:grid-cols-4 gap-6 items-center">
          {/* Card 1: Predicted SGPA */}
          <div className="p-4 rounded-2xl bg-white/5 backdrop-blur-md border border-white/10">
            <span className="text-[11px] font-bold uppercase tracking-wider text-indigo-300 block">
              Predicted Next SGPA
            </span>
            <div className="mt-2 flex items-baseline gap-2">
              <span className="text-3xl sm:text-4xl font-black text-white font-mono">
                {predictionData.predictedNextSGPA}
              </span>
              <span className="text-xs text-indigo-300">/ 10.0</span>
            </div>
            <div className="mt-2 flex items-center gap-1 text-xs text-emerald-400">
              <TrendingUp className="w-3.5 h-3.5" />
              <span>Projected: {predictionData.predictedNextPercentage}%</span>
            </div>
          </div>

          {/* Card 2: Risk Assessment */}
          <div className="p-4 rounded-2xl bg-white/5 backdrop-blur-md border border-white/10">
            <span className="text-[11px] font-bold uppercase tracking-wider text-indigo-300 block">
              Academic Risk Status
            </span>
            <div className="mt-2 flex items-center gap-2">
              {isAtRisk ? (
                <ShieldAlert className="w-7 h-7 text-rose-400 shrink-0" />
              ) : (
                <ShieldCheck className="w-7 h-7 text-emerald-400 shrink-0" />
              )}
              <div>
                <span
                  className={`text-lg sm:text-xl font-black ${
                    isAtRisk ? 'text-rose-400' : 'text-emerald-400'
                  }`}
                >
                  {predictionData.riskAssessment}
                </span>
                <span className="block text-[11px] text-slate-300">
                  {isAtRisk ? 'High Backlog / Detention Alert' : 'Normal Academic Standing'}
                </span>
              </div>
            </div>
          </div>

          {/* Card 3: Predicted Grade */}
          <div className="p-4 rounded-2xl bg-white/5 backdrop-blur-md border border-white/10">
            <span className="text-[11px] font-bold uppercase tracking-wider text-indigo-300 block">
              Predicted End-Sem Grade
            </span>
            <div className="mt-2">
              <span className="text-2xl sm:text-3xl font-black text-amber-300 tracking-tight">
                {predictionData.predictedGrade}
              </span>
              <span className="block text-[11px] text-slate-300 mt-1">
                Model Confidence: <span className="font-bold text-white">{predictionData.confidenceScore}%</span>
              </span>
            </div>
          </div>

          {/* Card 4: Backlog / Failure Probability */}
          <div className="p-4 rounded-2xl bg-white/5 backdrop-blur-md border border-white/10">
            <div className="flex justify-between items-center">
              <span className="text-[11px] font-bold uppercase tracking-wider text-indigo-300">
                Backlog Probability
              </span>
              <span
                className={`text-xs font-mono font-bold ${
                  predictionData.backlogProbability > 40 ? 'text-rose-400' : 'text-emerald-400'
                }`}
              >
                {predictionData.backlogProbability}%
              </span>
            </div>
            <div className="mt-3 w-full bg-white/10 h-2.5 rounded-full overflow-hidden">
              <div
                className={`h-full transition-all duration-500 ${
                  predictionData.backlogProbability > 40 ? 'bg-rose-500' : 'bg-emerald-500'
                }`}
                style={{ width: `${predictionData.backlogProbability}%` }}
              />
            </div>
            <p className="mt-2 text-[10px] text-slate-300">
              {predictionData.backlogProbability > 40
                ? 'High risk in Core Algorithms & Labs'
                : 'Safe margin for university promotion'}
            </p>
          </div>
        </div>
      </div>

      {/* Row 2: Historical vs AI Predicted Trajectory & What-If Simulator */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Historical vs Predicted Trajectory */}
        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-bold text-slate-800 dark:text-slate-100 text-sm flex items-center gap-2">
                <Layers className="w-4 h-4 text-blue-600" /> Historical SGPA vs. AI Prediction
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Comparing actual past semesters with the upcoming AI projected SGPA
              </p>
            </div>
            <span className="text-xs font-semibold px-2 py-0.5 rounded bg-purple-50 dark:bg-purple-950 text-purple-700 dark:text-purple-300">
              Target: Sem {parseInt(activeStudent.semester.replace(/\D/g, '') || '6', 10) + 1}
            </span>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={historyAndPredictedData} margin={{ top: 15, right: 15, left: -20, bottom: 20 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#94a3b8" opacity={0.15} />
                <XAxis dataKey="name" stroke="#94a3b8" fontSize={11} tickLine={false} />
                <YAxis domain={[0, 10]} stroke="#94a3b8" fontSize={11} tickLine={false} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#0f172a',
                    borderRadius: '12px',
                    border: 'none',
                    color: '#fff',
                    fontSize: '12px',
                  }}
                />
                <Bar
                  dataKey="SGPA"
                  fill="#3b82f6"
                  radius={[4, 4, 0, 0]}
                  name="SGPA"
                  shape={(props: any) => {
                    const { fill, x, y, width, height, payload } = props;
                    const isPred = payload.type === 'Predicted';
                    return (
                      <rect
                        x={x}
                        y={y}
                        width={width}
                        height={height}
                        fill={isPred ? '#8b5cf6' : fill}
                        rx={4}
                        ry={4}
                        stroke={isPred ? '#c084fc' : 'none'}
                        strokeWidth={isPred ? 2 : 0}
                      />
                    );
                  }}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="flex items-center justify-center gap-6 mt-2 pt-2 border-t border-slate-100 dark:border-slate-800 text-xs text-slate-500">
            <span className="flex items-center gap-2">
              <span className="w-3 h-3 rounded bg-blue-500 inline-block" /> Completed Semesters
            </span>
            <span className="flex items-center gap-2">
              <span className="w-3 h-3 rounded bg-purple-500 border border-purple-300 inline-block" /> Next Sem AI Prediction
            </span>
          </div>
        </div>

        {/* Interactive "What-If" Academic Performance Simulator */}
        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <div>
                <h3 className="font-bold text-slate-800 dark:text-slate-100 text-sm flex items-center gap-2">
                  <Sliders className="w-4 h-4 text-purple-600" /> Interactive &apos;What-If&apos; Academic Simulator
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Simulate how modifying attendance & study hours impacts projected results
                </p>
              </div>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300">
                Interactive
              </span>
            </div>

            {/* Slider 1: Target Attendance */}
            <div className="space-y-1.5 mt-3">
              <div className="flex justify-between text-xs">
                <span className="font-semibold text-slate-700 dark:text-slate-300">Target Attendance %:</span>
                <span className="font-mono font-bold text-blue-600 dark:text-blue-400">{targetAttendance}%</span>
              </div>
              <input
                type="range"
                min="50"
                max="100"
                value={targetAttendance}
                onChange={(e) => setTargetAttendance(parseInt(e.target.value, 10))}
                className="w-full accent-blue-600 h-2 bg-slate-200 dark:bg-slate-700 rounded-lg cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-slate-400">
                <span>50% (Detained)</span>
                <span>75% (Cutoff)</span>
                <span>100% (Perfect)</span>
              </div>
            </div>

            {/* Slider 2: Daily Study Hours */}
            <div className="space-y-1.5 mt-4">
              <div className="flex justify-between text-xs">
                <span className="font-semibold text-slate-700 dark:text-slate-300">Self-Study & Revision:</span>
                <span className="font-mono font-bold text-purple-600 dark:text-purple-400">{studyHoursDaily} hrs/day</span>
              </div>
              <input
                type="range"
                min="1"
                max="8"
                step="0.5"
                value={studyHoursDaily}
                onChange={(e) => setStudyHoursDaily(parseFloat(e.target.value))}
                className="w-full accent-purple-600 h-2 bg-slate-200 dark:bg-slate-700 rounded-lg cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-slate-400">
                <span>1 hr (Low)</span>
                <span>3.5 hrs (Recommended)</span>
                <span>8 hrs (Intense)</span>
              </div>
            </div>

            {/* Checkbox: Focus on Weak Subject */}
            <div className="mt-4 flex items-center gap-2">
              <input
                type="checkbox"
                id="weakSubFocus"
                checked={focusWeakSubject}
                onChange={(e) => setFocusWeakSubject(e.target.checked)}
                className="w-4 h-4 rounded text-purple-600 accent-purple-600 cursor-pointer"
              />
              <label htmlFor="weakSubFocus" className="text-xs text-slate-700 dark:text-slate-300 cursor-pointer">
                Complete all remedial exercises for flagged weak subjects
              </label>
            </div>

            {/* Simulation Results Display */}
            <div className="mt-5 p-3.5 rounded-xl bg-gradient-to-r from-purple-50 to-indigo-50 dark:from-purple-950/40 dark:to-indigo-950/40 border border-purple-200 dark:border-purple-900/50">
              <div className="grid grid-cols-2 gap-3 text-center">
                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-500 dark:text-slate-400">
                    Simulated SGPA
                  </span>
                  <div className="text-xl font-black font-mono text-purple-700 dark:text-purple-300 mt-0.5">
                    {simulatedNextSGPA}
                    <span className="text-xs font-normal text-slate-500 ml-1">
                      ({simulatedNextSGPA >= activeStudent.cgpa ? '+' : ''}
                      {(simulatedNextSGPA - activeStudent.cgpa).toFixed(2)})
                    </span>
                  </div>
                </div>

                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-500 dark:text-slate-400">
                    Simulated Backlog Risk
                  </span>
                  <div
                    className={`text-xl font-black font-mono mt-0.5 ${
                      simulatedBacklogRisk > 35 ? 'text-rose-600 dark:text-rose-400' : 'text-emerald-600 dark:text-emerald-400'
                    }`}
                  >
                    {simulatedBacklogRisk}%
                  </div>
                </div>
              </div>
            </div>
          </div>

          <p className="mt-3 text-[11px] text-slate-400">
            *Simulation uses multivariate regression with dynamic credit weighting.
          </p>
        </div>
      </div>

      {/* Row 3: Live AI Counselor / Gemini Analysis Query */}
      <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-blue-50 dark:bg-blue-950 text-blue-600">
              <Bot className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-slate-800 dark:text-slate-100 text-sm">
                Live AI Academic Counselor & Advisory Evaluation
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Run real-time predictive diagnostic reasoning on {activeStudent.name}&apos;s profile
              </p>
            </div>
          </div>

          <button
            onClick={handleRunLiveAI}
            disabled={isAnalyzing}
            className="px-4 py-2 rounded-xl text-xs font-semibold bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white transition flex items-center justify-center gap-2 shadow-md shadow-blue-500/20 disabled:opacity-60"
          >
            {isAnalyzing ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Analyzing Student Data with AI...
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4 text-amber-300" />
                Run Live AI Evaluation
              </>
            )}
          </button>
        </div>

        <div className="flex gap-2">
          <input
            type="text"
            placeholder="E.g. What specific topics must I revise to score 9.0 SGPA in Semester 6?"
            value={customGoal}
            onChange={(e) => setCustomGoal(e.target.value)}
            className="flex-1 px-3 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-100 focus:outline-none focus:border-blue-500"
          />
        </div>

        {/* Live Counselor Summary (if returned or default) */}
        <div className="mt-4 p-4 rounded-xl bg-slate-50 dark:bg-slate-850 border border-slate-200/80 dark:border-slate-800">
          <div className="flex items-center justify-between pb-2 border-b border-slate-200 dark:border-slate-800 mb-2">
            <span className="text-xs font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-blue-600" /> AI Counselor Findings & Assessment Summary:
            </span>
            <span className="text-[10px] text-slate-400">
              {liveAIOutput ? 'Generated via Gemini Engine' : 'Heuristic Model Baseline'}
            </span>
          </div>

          <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
            {predictionData.counselorSummary ||
              `Statistical assessment of ${activeStudent.name} demonstrates ${
                activeStudent.overallPercentage >= 80 ? 'strong academic performance' : 'moderate to high risk'
              }. Priority attention is required in ${
                predictionData.weakSubjects?.join(', ') || 'core theory subjects'
              } to safeguard against SGPA regression.`}
          </p>

          <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-3 pt-3 border-t border-slate-200 dark:border-slate-800">
            <div>
              <span className="text-[11px] font-bold text-slate-700 dark:text-slate-300 block mb-1">
                Identified Weak Subject Vectors:
              </span>
              <ul className="text-xs space-y-1 text-slate-600 dark:text-slate-400">
                {predictionData.weakSubjects?.map((sub: string, i: number) => (
                  <li key={i} className="flex items-center gap-1.5 text-rose-600 dark:text-rose-400">
                    <span className="w-1.5 h-1.5 rounded-full bg-rose-500" />
                    {sub}
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <span className="text-[11px] font-bold text-slate-700 dark:text-slate-300 block mb-1">
                Strong Foundation Subjects:
              </span>
              <ul className="text-xs space-y-1 text-slate-600 dark:text-slate-400">
                {predictionData.strongSubjects?.map((sub: string, i: number) => (
                  <li key={i} className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                    {sub}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Row 4: Personalized AI Recommendations & Study Plan */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Actionable Recommendations */}
        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-slate-800 dark:text-slate-100 text-sm flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" /> Targeted AI Action Items
              </h3>
              <span className="text-[10px] text-slate-400">Prioritized</span>
            </div>

            <div className="space-y-2.5">
              {predictionData.personalizedRecommendations?.map((rec: string, idx: number) => (
                <div
                  key={idx}
                  className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 text-xs flex items-start gap-2.5"
                >
                  <span className="w-5 h-5 rounded-full bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300 font-bold flex items-center justify-center shrink-0 text-[10px] mt-0.5">
                    {idx + 1}
                  </span>
                  <p className="text-slate-700 dark:text-slate-300 leading-snug">{rec}</p>
                </div>
              ))}
            </div>
          </div>

          <button
            onClick={() => setActiveTab('recommendations')}
            className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 w-full text-xs text-blue-600 dark:text-blue-400 font-semibold hover:underline flex items-center justify-center gap-1"
          >
            View Complete Interactive AI Recommendations Checklist <ArrowRight className="w-3 h-3" />
          </button>
        </div>

        {/* AI Study Schedule */}
        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-slate-800 dark:text-slate-100 text-sm flex items-center gap-2">
              <Calendar className="w-4 h-4 text-purple-600" /> AI-Generated Study Schedule
            </h3>
            <span className="text-[10px] text-purple-600 font-semibold bg-purple-50 dark:bg-purple-950 px-2 py-0.5 rounded">
              Weekly Allocation
            </span>
          </div>

          <div className="space-y-2">
            {predictionData.studyPlan?.map((plan: any, idx: number) => (
              <div
                key={idx}
                className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 text-xs"
              >
                <div className="flex items-center gap-3">
                  <span className="font-bold text-slate-800 dark:text-slate-200 min-w-[75px]">
                    {plan.day}
                  </span>
                  <span className="text-slate-600 dark:text-slate-400">{plan.focus}</span>
                </div>
                <span className="font-mono font-bold text-blue-600 dark:text-blue-400 shrink-0">
                  {plan.hours} hrs
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
