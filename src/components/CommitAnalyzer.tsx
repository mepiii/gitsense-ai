import React from 'react';
import { 
  Search, 
  ShieldAlert, 
  Bug, 
  GitMerge, 
  AlertOctagon, 
  FileCode, 
  HelpCircle, 
  Sparkles, 
  Clock, 
  CheckCircle2, 
  Zap, 
  ArrowUpRight, 
  ArrowDownRight,
  Code2
} from 'lucide-react';
import { Commit, PredictionResult, Repository } from '../types';

interface CommitAnalyzerProps {
  selectedCommit: Commit;
  prediction: PredictionResult;
  repository: Repository;
  onRunGeminiDeepThink: () => void;
}

export const CommitAnalyzer: React.FC<CommitAnalyzerProps> = ({
  selectedCommit,
  prediction,
  repository,
  onRunGeminiDeepThink
}) => {
  const riskColor = 
    prediction.riskLevel === 'High Risk' ? 'text-rose-400 bg-rose-500/15 border-rose-500/30' :
    prediction.riskLevel === 'Medium Risk' ? 'text-amber-400 bg-amber-500/15 border-amber-500/30' :
    prediction.riskLevel === 'Low Risk' ? 'text-teal-400 bg-teal-500/15 border-teal-500/30' :
    'text-emerald-400 bg-emerald-500/15 border-emerald-500/30';

  return (
    <div className="space-y-6">
      {/* Top Banner & Selected Commit Info */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="font-mono text-xs px-2 py-0.5 rounded bg-slate-800 text-emerald-400 border border-slate-700">
              {selectedCommit.shortHash}
            </span>
            <span className={`px-2.5 py-0.5 text-xs font-bold rounded border ${riskColor}`}>
              {prediction.riskLevel.toUpperCase()} ({prediction.overallRiskScore}%)
            </span>
          </div>
          <h2 className="text-base font-bold text-slate-100 mt-2">{selectedCommit.message}</h2>
          <p className="text-xs text-slate-400 mt-1">
            Author: <span className="text-slate-200">{selectedCommit.author}</span> • {selectedCommit.filesChanged} files changed (+{selectedCommit.linesAdded} / -{selectedCommit.linesDeleted})
          </p>
        </div>

        <button
          onClick={onRunGeminiDeepThink}
          className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-gradient-to-r from-purple-600 via-indigo-600 to-emerald-600 hover:from-purple-500 hover:to-emerald-500 text-white font-bold text-xs shadow-lg transition-all cursor-pointer shrink-0"
        >
          <Sparkles className="w-4 h-4 text-amber-300 animate-spin" />
          Ask Gemini 3.1 Pro High-Thinking
        </button>
      </div>

      {/* Main Grid: Overall Risk Gauge & 4 Probabilities */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {/* Card 1: Bug Probability */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
            <span className="flex items-center gap-1.5 font-medium">
              <Bug className="w-4 h-4 text-rose-400" />
              Bug Probability
            </span>
            <span className="font-bold text-rose-400">{prediction.bugProbability}%</span>
          </div>
          <div className="w-full h-2 bg-slate-950 rounded-full overflow-hidden border border-slate-800">
            <div className="bg-rose-500 h-full" style={{ width: `${prediction.bugProbability}%` }} />
          </div>
        </div>

        {/* Card 2: Merge Conflict Probability */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
            <span className="flex items-center gap-1.5 font-medium">
              <GitMerge className="w-4 h-4 text-amber-400" />
              Merge Conflict
            </span>
            <span className="font-bold text-amber-400">{prediction.mergeConflictProbability}%</span>
          </div>
          <div className="w-full h-2 bg-slate-950 rounded-full overflow-hidden border border-slate-800">
            <div className="bg-amber-500 h-full" style={{ width: `${prediction.mergeConflictProbability}%` }} />
          </div>
        </div>

        {/* Card 3: Build Failure */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
            <span className="flex items-center gap-1.5 font-medium">
              <AlertOctagon className="w-4 h-4 text-indigo-400" />
              Build Failure
            </span>
            <span className="font-bold text-indigo-400">{prediction.buildFailureProbability}%</span>
          </div>
          <div className="w-full h-2 bg-slate-950 rounded-full overflow-hidden border border-slate-800">
            <div className="bg-indigo-500 h-full" style={{ width: `${prediction.buildFailureProbability}%` }} />
          </div>
        </div>

        {/* Card 4: Technical Debt */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
            <span className="flex items-center gap-1.5 font-medium">
              <Zap className="w-4 h-4 text-teal-400" />
              Technical Debt Index
            </span>
            <span className="font-bold text-teal-400">{prediction.technicalDebtScore}%</span>
          </div>
          <div className="w-full h-2 bg-slate-950 rounded-full overflow-hidden border border-slate-800">
            <div className="bg-teal-500 h-full" style={{ width: `${prediction.technicalDebtScore}%` }} />
          </div>
        </div>
      </div>

      {/* SHAP & LIME Explainable ML Section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* SHAP Values Waterfall (7 cols) */}
        <div className="lg:col-span-7 bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-4">
          <h3 className="text-xs font-semibold text-slate-300 uppercase tracking-wider flex items-center justify-between">
            <span className="flex items-center gap-1.5">
              <Zap className="w-3.5 h-3.5 text-amber-400" />
              SHAP Value Explanations (Shapley Feature Contributions)
            </span>
            <span className="text-[10px] text-slate-400 font-mono">Base Risk: 35%</span>
          </h3>

          <div className="space-y-2">
            {prediction.shapValues.map((shap, idx) => {
              const isPositive = shap.shapValue > 0;
              return (
                <div key={idx} className="p-2.5 rounded bg-slate-950/60 border border-slate-800 flex items-center justify-between text-xs">
                  <div>
                    <span className="font-semibold text-slate-200">{shap.featureName}</span>
                    <span className="text-[10px] text-slate-500 block">
                      Value: <span className="font-mono text-slate-300">{shap.featureValue}</span> ({shap.category})
                    </span>
                  </div>

                  <div className={`flex items-center gap-1 font-mono font-bold ${isPositive ? 'text-rose-400' : 'text-emerald-400'}`}>
                    {isPositive ? <ArrowUpRight className="w-3.5 h-3.5" /> : <ArrowDownRight className="w-3.5 h-3.5" />}
                    <span>{isPositive ? `+${shap.shapValue}%` : `${shap.shapValue}%`}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* LIME Local Explanations (5 cols) */}
        <div className="lg:col-span-5 bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-4">
          <h3 className="text-xs font-semibold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
            <Code2 className="w-3.5 h-3.5 text-teal-400" />
            LIME Local Rule Weightings
          </h3>

          <div className="space-y-3">
            {prediction.limeExplanations.map((lime, idx) => (
              <div key={idx} className="p-3 rounded-lg bg-slate-950 border border-slate-800 space-y-1 text-xs">
                <div className="flex items-center justify-between font-semibold text-slate-200">
                  <span>{lime.featureName}</span>
                  <span className={lime.weight > 0 ? 'text-rose-400' : 'text-emerald-400'}>
                    {(lime.weight * 100).toFixed(0)}%
                  </span>
                </div>
                <p className="text-[11px] text-slate-400 leading-relaxed">{lime.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Similar Historical Commits Comparison Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-4">
        <h3 className="text-xs font-semibold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
          <Clock className="w-3.5 h-3.5 text-emerald-400" />
          Historically Similar Commits & Outcomes
        </h3>

        <div className="overflow-x-auto rounded-lg border border-slate-800">
          <table className="w-full text-left border-collapse text-xs">
            <thead className="bg-slate-950 text-slate-400 uppercase tracking-wider font-mono text-[10px]">
              <tr>
                <th className="p-3">Commit</th>
                <th className="p-3">Author</th>
                <th className="p-3 text-right">Similarity</th>
                <th className="p-3 text-right">Predicted Risk</th>
                <th className="p-3 text-right">Actual Historical Outcome</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800 text-slate-300 font-mono text-[11px]">
              {prediction.similarCommits.map((sim, i) => (
                <tr key={i} className="hover:bg-slate-800/40">
                  <td className="p-3">
                    <span className="text-emerald-400 font-bold mr-2">{sim.hash}</span>
                    <span className="font-sans text-slate-200">{sim.message}</span>
                  </td>
                  <td className="p-3 text-slate-400">{sim.author}</td>
                  <td className="p-3 text-right font-bold text-slate-200">{sim.similarityScore}%</td>
                  <td className="p-3 text-right text-amber-400 font-bold">{sim.riskScore}%</td>
                  <td className="p-3 text-right">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                      sim.actualOutcome.includes('Clean') ? 'bg-emerald-500/20 text-emerald-400' : 'bg-rose-500/20 text-rose-400'
                    }`}>
                      {sim.actualOutcome}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
