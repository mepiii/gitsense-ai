import React from 'react';
import { History, Search, GitCommit, Clock, Trash2 } from 'lucide-react';
import { PredictionResult } from '../types';

interface PredictionHistoryTabProps {
  history: PredictionResult[];
  onClearHistory: () => void;
}

export const PredictionHistoryTab: React.FC<PredictionHistoryTabProps> = ({
  history,
  onClearHistory
}) => {
  return (
    <div className="space-y-6">
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2">
            <History className="w-5 h-5 text-emerald-400" />
            <h2 className="text-lg font-bold text-slate-100">Commit Prediction Audit History</h2>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Historical log of all commits analyzed by local ML models.
          </p>
        </div>

        {history.length > 0 && (
          <button
            onClick={onClearHistory}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-rose-950/40 text-slate-300 hover:text-rose-400 border border-slate-700 text-xs transition-colors cursor-pointer"
          >
            <Trash2 className="w-3.5 h-3.5" />
            Clear Log
          </button>
        )}
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-3">
        {history.length === 0 ? (
          <div className="text-center py-12 text-slate-500 text-xs">
            No commit predictions recorded yet. Run risk prediction on any commit in Repo Scanner or Commit Analyzer.
          </div>
        ) : (
          <div className="overflow-x-auto rounded-lg border border-slate-800">
            <table className="w-full text-left border-collapse text-xs">
              <thead className="bg-slate-950 text-slate-400 uppercase tracking-wider font-mono text-[10px]">
                <tr>
                  <th className="p-3">Timestamp</th>
                  <th className="p-3">Commit Hash / Message</th>
                  <th className="p-3 text-right">Overall Risk Score</th>
                  <th className="p-3 text-right">Bug Prob</th>
                  <th className="p-3 text-right">Conflict Prob</th>
                  <th className="p-3 text-right">Tech Debt Score</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800 text-slate-300 font-mono text-[11px]">
                {history.map((item, idx) => (
                  <tr key={idx} className="hover:bg-slate-800/40">
                    <td className="p-3 text-slate-400 text-[10px]">
                      {new Date(item.timestamp).toLocaleTimeString()}
                    </td>
                    <td className="p-3 font-sans font-medium text-slate-200">
                      {item.commitHash}
                    </td>
                    <td className="p-3 text-right font-bold">
                      <span
                        className={`px-2 py-0.5 rounded ${
                          item.overallRiskScore > 70
                            ? 'bg-rose-500/20 text-rose-400'
                            : item.overallRiskScore > 40
                            ? 'bg-amber-500/20 text-amber-400'
                            : 'bg-emerald-500/20 text-emerald-400'
                        }`}
                      >
                        {item.overallRiskScore}% ({item.riskLevel})
                      </span>
                    </td>
                    <td className="p-3 text-right text-rose-400 font-bold">{item.bugProbability}%</td>
                    <td className="p-3 text-right text-amber-400 font-bold">{item.mergeConflictProbability}%</td>
                    <td className="p-3 text-right text-teal-400 font-bold">{item.technicalDebtScore}%</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
