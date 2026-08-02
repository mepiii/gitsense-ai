import React from 'react';
import { 
  ShieldAlert, 
  TrendingUp, 
  Activity, 
  Users, 
  FileCode2, 
  CheckCircle2, 
  AlertTriangle,
  Flame
} from 'lucide-react';
import { 
  ResponsiveContainer, 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  Tooltip, 
  CartesianGrid, 
  BarChart, 
  Bar 
} from 'recharts';
import { Repository } from '../types';

interface AnalyticsDashboardProps {
  repository: Repository;
}

export const AnalyticsDashboard: React.FC<AnalyticsDashboardProps> = ({ repository }) => {
  // Generate timeline data from commits
  const timelineData = repository.commits.map((c, i) => ({
    date: new Date(c.date).toLocaleDateString([], { month: 'short', day: 'numeric' }),
    hash: c.shortHash,
    riskScore: Math.round(20 + Math.sin(i * 1.5) * 30 + (c.linesAdded + c.linesDeleted) * 0.08),
    codeChurn: c.linesAdded + c.linesDeleted,
    filesChanged: c.filesChanged
  }));

  const fileHeatmap = [
    { file: 'src/ReactFiberWorkLoop.js', churn: 1850, risk: 88, bugCount: 14 },
    { file: 'src/ReactFiberScheduler.js', churn: 1420, risk: 82, bugCount: 9 },
    { file: 'compiler/MemoizationPass.ts', churn: 1100, risk: 78, bugCount: 7 },
    { file: 'src/events/ReactDOMEventListener.js', churn: 680, risk: 42, bugCount: 3 },
    { file: 'README.md', churn: 95, risk: 8, bugCount: 0 }
  ];

  const contributorRiskProfiles = [
    { author: 'Dan Abramov', commits: 42, avgRisk: 34, bugRate: '4.2%' },
    { author: 'Sophie Alpert', commits: 28, avgRisk: 62, bugRate: '12.5%' },
    { author: 'Andrew Clark', commits: 35, avgRisk: 22, bugRate: '1.8%' },
    { author: 'Sebastian Markbåge', commits: 31, avgRisk: 48, bugRate: '7.1%' }
  ];

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <ShieldAlert className="w-5 h-5 text-emerald-400" />
            <h2 className="text-lg font-bold text-slate-100">Repository Predictive Analytics Dashboard</h2>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Aggregated repository health, historical commit risk timeline, and file churn vulnerability heatmaps.
          </p>
        </div>

        <div className="flex items-center gap-4 bg-slate-950/80 px-4 py-2 rounded-lg border border-slate-800">
          <div>
            <span className="text-[10px] text-slate-400 block uppercase">Repo Health Index</span>
            <span className="text-xl font-bold text-emerald-400">{repository.healthScore}/100</span>
          </div>
        </div>
      </div>

      {/* Grid: Risk Trend Timeline & Code Churn */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Risk Score Timeline (7 cols) */}
        <div className="lg:col-span-7 bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-4">
          <h3 className="text-xs font-semibold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
            <TrendingUp className="w-3.5 h-3.5 text-emerald-400" />
            Historical Commit Risk Score Timeline
          </h3>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={timelineData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                <XAxis dataKey="date" stroke="#94a3b8" fontSize={11} />
                <YAxis stroke="#94a3b8" fontSize={11} domain={[0, 100]} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px', fontSize: '11px' }}
                />
                <Line type="monotone" dataKey="riskScore" stroke="#10b981" strokeWidth={2.5} dot={{ r: 4 }} name="Risk Score (%)" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Code Churn vs Risk (5 cols) */}
        <div className="lg:col-span-5 bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-4">
          <h3 className="text-xs font-semibold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
            <Activity className="w-3.5 h-3.5 text-teal-400" />
            Code Churn Volume per Commit
          </h3>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={timelineData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                <XAxis dataKey="hash" stroke="#94a3b8" fontSize={10} />
                <YAxis stroke="#94a3b8" fontSize={11} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px', fontSize: '11px' }}
                />
                <Bar dataKey="codeChurn" fill="#14b8a6" radius={[4, 4, 0, 0]} name="Lines Changed" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Grid: File Vulnerability Heatmap & Contributor Profiles */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* File Risk Heatmap (7 cols) */}
        <div className="lg:col-span-7 bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-4">
          <h3 className="text-xs font-semibold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
            <Flame className="w-3.5 h-3.5 text-rose-400" />
            File Modification Vulnerability & Churn Heatmap
          </h3>

          <div className="space-y-2">
            {fileHeatmap.map((file, idx) => (
              <div key={idx} className="p-3 rounded-lg bg-slate-950 border border-slate-800 flex items-center justify-between text-xs">
                <div>
                  <span className="font-mono text-slate-200 font-semibold">{file.file}</span>
                  <span className="text-[10px] text-slate-500 block">
                    Code Churn: <span className="text-slate-300 font-mono">{file.churn} lines</span> • Bugs Introduced: {file.bugCount}
                  </span>
                </div>

                <div className="flex items-center gap-3">
                  <span
                    className={`px-2.5 py-1 rounded text-xs font-bold font-mono ${
                      file.risk > 70
                        ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                        : file.risk > 40
                        ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                        : 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                    }`}
                  >
                    Risk: {file.risk}%
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Contributor Profiles (5 cols) */}
        <div className="lg:col-span-5 bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-4">
          <h3 className="text-xs font-semibold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
            <Users className="w-3.5 h-3.5 text-indigo-400" />
            Contributor Activity & Risk Profile
          </h3>

          <div className="space-y-2">
            {contributorRiskProfiles.map((contrib, idx) => (
              <div key={idx} className="p-3 rounded-lg bg-slate-950 border border-slate-800 flex items-center justify-between text-xs">
                <div>
                  <span className="font-semibold text-slate-200">{contrib.author}</span>
                  <span className="text-[10px] text-slate-500 block">Commits: {contrib.commits}</span>
                </div>

                <div className="text-right">
                  <span className="text-slate-300 font-mono block font-bold">Avg Risk: {contrib.avgRisk}%</span>
                  <span className="text-[10px] text-slate-500">Bug Rate: {contrib.bugRate}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
