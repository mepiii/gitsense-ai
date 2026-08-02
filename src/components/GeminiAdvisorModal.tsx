import React, { useState } from 'react';
import { Sparkles, X, Brain, CheckCircle2, AlertTriangle, ShieldCheck, RefreshCw } from 'lucide-react';
import { Commit, PredictionResult } from '../types';

interface GeminiAdvisorModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedCommit: Commit;
  prediction: PredictionResult;
}

export const GeminiAdvisorModal: React.FC<GeminiAdvisorModalProps> = ({
  isOpen,
  onClose,
  selectedCommit,
  prediction
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [aiAnalysis, setAiAnalysis] = useState<string | null>(null);
  const [modelName, setModelName] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleGenerateThinkingAnalysis = async () => {
    setIsLoading(true);
    setErrorMessage(null);
    try {
      const res = await fetch('/api/gemini/think-risk', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          commitMessage: selectedCommit.message,
          codeDiff: selectedCommit.diff,
          metrics: {
            cyclomaticComplexity: prediction.shapValues.find((s) => s.featureName.includes('Cyclomatic'))?.featureValue,
            maintainabilityIndex: prediction.maintainabilityScore,
            linesAdded: selectedCommit.linesAdded,
            linesDeleted: selectedCommit.linesDeleted,
            filesChanged: selectedCommit.filesChanged
          },
          predictedRisk: {
            riskLevel: prediction.riskLevel,
            overallRiskScore: prediction.overallRiskScore,
            bugProbability: prediction.bugProbability,
            mergeConflictProbability: prediction.mergeConflictProbability,
            buildFailureProbability: prediction.buildFailureProbability,
            technicalDebtScore: prediction.technicalDebtScore
          }
        })
      });

      const data = await res.json();
      if (data.success) {
        setAiAnalysis(data.analysis);
        setModelName(data.modelUsed);
      } else {
        setErrorMessage(data.error || 'Failed to generate Gemini analysis.');
      }
    } catch (err: any) {
      setErrorMessage(err?.message || 'Network error while contacting backend server.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-3xl w-full p-6 space-y-5 shadow-2xl overflow-hidden max-h-[90vh] flex flex-col">
        {/* Modal Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-purple-600 to-indigo-600 flex items-center justify-center text-white shadow-md">
              <Brain className="w-5 h-5 text-amber-300" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-100 flex items-center gap-2">
                Gemini 3.1 Pro High-Thinking AI Risk Advisor
              </h2>
              <p className="text-xs text-slate-400">Deep architectural reasoning & step-by-step risk mitigation</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg bg-slate-800 text-slate-400 hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Selected Commit Context Bar */}
        <div className="p-3 rounded-xl bg-slate-950 border border-slate-800/80 text-xs flex items-center justify-between shrink-0">
          <div>
            <span className="font-mono text-emerald-400 font-bold mr-2">{selectedCommit.shortHash}</span>
            <span className="text-slate-200 font-medium">{selectedCommit.message}</span>
          </div>
          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-500/20 text-amber-400 border border-amber-500/30">
            Risk: {prediction.overallRiskScore}%
          </span>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto space-y-4 pr-1">
          {!aiAnalysis && !isLoading && !errorMessage && (
            <div className="text-center py-10 space-y-4">
              <Sparkles className="w-10 h-10 text-indigo-400 mx-auto animate-pulse" />
              <div className="max-w-md mx-auto space-y-1">
                <h3 className="text-sm font-bold text-slate-200">Run Deep AI High-Thinking Analysis</h3>
                <p className="text-xs text-slate-400">
                  Calls <span className="text-purple-400 font-mono">gemini-3.1-pro-preview</span> with <span className="text-emerald-400 font-mono">ThinkingLevel.HIGH</span> to perform deep architectural analysis and generate step-by-step refactoring guidance.
                </p>
              </div>

              <button
                onClick={handleGenerateThinkingAnalysis}
                className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 via-indigo-600 to-emerald-600 hover:from-purple-500 hover:to-emerald-500 text-white font-bold text-xs shadow-lg transition-all cursor-pointer"
              >
                Generate Thinking Analysis
              </button>
            </div>
          )}

          {isLoading && (
            <div className="text-center py-12 space-y-3">
              <RefreshCw className="w-8 h-8 text-emerald-400 mx-auto animate-spin" />
              <p className="text-xs font-semibold text-slate-200">Gemini 3.1 Pro is reasoning over code diff and ML risk factors...</p>
              <p className="text-[11px] text-slate-400">ThinkingLevel: HIGH (Extended Chain of Thought)</p>
            </div>
          )}

          {errorMessage && (
            <div className="p-4 rounded-xl bg-rose-950/40 border border-rose-500/30 text-rose-300 text-xs space-y-1">
              <div className="font-bold flex items-center gap-1.5">
                <AlertTriangle className="w-4 h-4 text-rose-400" />
                Analysis Failed
              </div>
              <p>{errorMessage}</p>
            </div>
          )}

          {aiAnalysis && (
            <div className="space-y-4">
              <div className="flex items-center justify-between text-xs text-slate-400">
                <span className="flex items-center gap-1 text-emerald-400 font-medium">
                  <ShieldCheck className="w-4 h-4" />
                  Analysis Generated
                </span>
                <span className="font-mono text-[10px] text-purple-300">{modelName}</span>
              </div>

              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 font-sans text-xs text-slate-200 leading-relaxed whitespace-pre-wrap">
                {aiAnalysis}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="pt-3 border-t border-slate-800 flex items-center justify-between text-xs shrink-0">
          <span className="text-slate-500">Powered by Google Gemini 3.1 Pro via Express API</span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg bg-slate-800 text-slate-300 hover:bg-slate-700 transition-colors cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
