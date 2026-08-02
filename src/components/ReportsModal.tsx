import React from 'react';
import { FileText, X, Download, Printer, CheckCircle, Database } from 'lucide-react';
import { Repository, ModelEvaluation, PredictionResult } from '../types';

interface ReportsModalProps {
  isOpen: boolean;
  onClose: () => void;
  repository: Repository;
  evaluation: ModelEvaluation;
  prediction: PredictionResult;
}

export const ReportsModal: React.FC<ReportsModalProps> = ({
  isOpen,
  onClose,
  repository,
  evaluation,
  prediction
}) => {
  if (!isOpen) return null;

  const handlePrintReport = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-2xl w-full p-6 space-y-5 shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-100">GitSense AI Executive Risk Report</h2>
              <p className="text-xs text-slate-400">Machine learning model validation & commit risk summary</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1 rounded-lg bg-slate-800 text-slate-400 hover:text-white cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Report Preview Body */}
        <div className="space-y-4 text-xs text-slate-300 max-h-96 overflow-y-auto pr-1">
          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-3">
            <div className="flex justify-between border-b border-slate-800 pb-2">
              <span className="font-bold text-slate-100">Repository Target:</span>
              <span className="font-mono text-emerald-400">{repository.owner}/{repository.name}</span>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <span className="text-slate-400 block">Trained Model</span>
                <span className="font-semibold text-slate-200">{evaluation.algorithmName}</span>
              </div>
              <div>
                <span className="text-slate-400 block">Model Accuracy</span>
                <span className="font-semibold text-emerald-400">{(evaluation.accuracy * 100).toFixed(1)}%</span>
              </div>
              <div>
                <span className="text-slate-400 block">F1 Score</span>
                <span className="font-semibold text-teal-400">{(evaluation.f1Score * 100).toFixed(1)}%</span>
              </div>
              <div>
                <span className="text-slate-400 block">ROC AUC</span>
                <span className="font-semibold text-indigo-400">{(evaluation.rocAuc * 100).toFixed(1)}%</span>
              </div>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
            <span className="font-bold text-slate-100 block">Latest Evaluated Commit Risk</span>
            <div className="flex items-center justify-between font-mono">
              <span className="text-slate-400">Commit Hash: {prediction.commitHash}</span>
              <span className="text-amber-400 font-bold">{prediction.riskLevel} ({prediction.overallRiskScore}%)</span>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="pt-3 border-t border-slate-800 flex items-center justify-end gap-3">
          <button
            onClick={handlePrintReport}
            className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold cursor-pointer"
          >
            <Printer className="w-4 h-4" />
            Print / Save PDF
          </button>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs cursor-pointer"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
