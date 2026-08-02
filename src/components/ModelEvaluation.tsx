import React from 'react';
import { 
  BarChart3, 
  CheckCircle, 
  ShieldAlert, 
  TrendingUp, 
  Award, 
  HelpCircle,
  FileCheck2,
  LineChart as LineChartIcon
} from 'lucide-react';
import { 
  ResponsiveContainer, 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  Tooltip, 
  BarChart, 
  Bar, 
  Cell, 
  CartesianGrid 
} from 'recharts';
import { ModelEvaluation as EvaluationType } from '../types';

interface ModelEvaluationProps {
  evaluation: EvaluationType;
}

export const ModelEvaluation: React.FC<ModelEvaluationProps> = ({ evaluation }) => {
  const confusion = evaluation.confusionMatrix;

  return (
    <div className="space-y-6">
      {/* Overview Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-emerald-400" />
            <h2 className="text-lg font-bold text-slate-100">Model Evaluation & Metrics</h2>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Performance validation results for model <span className="text-emerald-400 font-semibold">{evaluation.algorithmName}</span> on out-of-fold test datasets.
          </p>
        </div>

        <div className="px-3.5 py-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-xs font-mono text-emerald-400 font-semibold">
          Status: {evaluation.isTrained ? 'Trained & Validated' : 'Not Trained'}
        </div>
      </div>

      {/* Top Metric Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-4">
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
          <span className="text-xs text-slate-400">Accuracy</span>
          <div className="text-xl font-bold text-emerald-400 mt-1">
            {(evaluation.accuracy * 100).toFixed(1)}%
          </div>
          <span className="text-[10px] text-slate-500">Overall Correct</span>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
          <span className="text-xs text-slate-400">Precision</span>
          <div className="text-xl font-bold text-teal-400 mt-1">
            {(evaluation.precision * 100).toFixed(1)}%
          </div>
          <span className="text-[10px] text-slate-500">True Risk Precision</span>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
          <span className="text-xs text-slate-400">Recall</span>
          <div className="text-xl font-bold text-cyan-400 mt-1">
            {(evaluation.recall * 100).toFixed(1)}%
          </div>
          <span className="text-[10px] text-slate-500">Sensitivity / Catch Rate</span>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
          <span className="text-xs text-slate-400">F1 Score</span>
          <div className="text-xl font-bold text-indigo-400 mt-1">
            {(evaluation.f1Score * 100).toFixed(1)}%
          </div>
          <span className="text-[10px] text-slate-500">Harmonic Mean</span>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
          <span className="text-xs text-slate-400">ROC AUC</span>
          <div className="text-xl font-bold text-purple-400 mt-1">
            {(evaluation.rocAuc * 100).toFixed(1)}%
          </div>
          <span className="text-[10px] text-slate-500">Area Under Curve</span>
        </div>
      </div>

      {/* Grid: Confusion Matrix & ROC Curve */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Confusion Matrix (5 cols) */}
        <div className="lg:col-span-5 bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-4">
          <h3 className="text-xs font-semibold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
            <Award className="w-3.5 h-3.5 text-emerald-400" />
            Confusion Matrix
          </h3>

          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-3 text-center text-xs">
              <div className="p-4 rounded-lg bg-emerald-950/40 border border-emerald-500/30">
                <span className="text-[10px] text-slate-400 block mb-1">TRUE POSITIVE (TP)</span>
                <span className="text-xl font-bold text-emerald-400">{confusion.truePositive}</span>
                <span className="text-[10px] text-slate-400 block mt-1">Correctly Flagged Risky</span>
              </div>

              <div className="p-4 rounded-lg bg-rose-950/40 border border-rose-500/30">
                <span className="text-[10px] text-slate-400 block mb-1">FALSE POSITIVE (FP)</span>
                <span className="text-xl font-bold text-rose-400">{confusion.falsePositive}</span>
                <span className="text-[10px] text-slate-400 block mt-1">False Alarm</span>
              </div>

              <div className="p-4 rounded-lg bg-amber-950/40 border border-amber-500/30">
                <span className="text-[10px] text-slate-400 block mb-1">FALSE NEGATIVE (FN)</span>
                <span className="text-xl font-bold text-amber-400">{confusion.falseNegative}</span>
                <span className="text-[10px] text-slate-400 block mt-1">Missed Risky Commit</span>
              </div>

              <div className="p-4 rounded-lg bg-slate-950 border border-slate-800">
                <span className="text-[10px] text-slate-400 block mb-1">TRUE NEGATIVE (TN)</span>
                <span className="text-xl font-bold text-slate-200">{confusion.trueNegative}</span>
                <span className="text-[10px] text-slate-400 block mt-1">Correctly Flagged Safe</span>
              </div>
            </div>
          </div>
        </div>

        {/* ROC Curve Chart (7 cols) */}
        <div className="lg:col-span-7 bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-4">
          <h3 className="text-xs font-semibold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
            <LineChartIcon className="w-3.5 h-3.5 text-emerald-400" />
            Receiver Operating Characteristic (ROC Curve)
          </h3>

          <div className="h-56 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={evaluation.rocCurvePoints}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                <XAxis dataKey="fpr" stroke="#94a3b8" fontSize={10} name="False Positive Rate" />
                <YAxis stroke="#94a3b8" fontSize={10} name="True Positive Rate" />
                <Tooltip
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px', fontSize: '11px' }}
                />
                <Line type="monotone" dataKey="tpr" stroke="#10b981" strokeWidth={2.5} dot={{ r: 3 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Feature Importance Bar Chart */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-4">
        <h3 className="text-xs font-semibold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
          <TrendingUp className="w-3.5 h-3.5 text-emerald-400" />
          Global Feature Importance Ranking
        </h3>

        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart layout="vertical" data={evaluation.featureImportances} margin={{ left: 140 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
              <XAxis type="number" stroke="#94a3b8" fontSize={10} />
              <YAxis dataKey="featureName" type="category" stroke="#94a3b8" fontSize={11} width={130} />
              <Tooltip
                contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px', fontSize: '11px' }}
              />
              <Bar dataKey="importance" fill="#10b981" radius={[0, 4, 4, 0]}>
                {evaluation.featureImportances.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={
                      index === 0
                        ? '#10b981'
                        : index === 1
                        ? '#14b8a6'
                        : index === 2
                        ? '#06b6d4'
                        : '#6366f1'
                    }
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};
