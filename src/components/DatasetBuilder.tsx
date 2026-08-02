import React, { useState } from 'react';
import { 
  Database, 
  Download, 
  RefreshCw, 
  Sliders, 
  Table as TableIcon, 
  CheckCircle, 
  Layers, 
  BarChart, 
  SlidersHorizontal,
  FileSpreadsheet
} from 'lucide-react';
import { Repository, ModelConfig, CommitFeatures } from '../types';
import { extractFeaturesFromCommit } from '../data/sampleRepositories';

interface DatasetBuilderProps {
  repository: Repository;
  config: ModelConfig;
  onUpdateConfig: (config: ModelConfig) => void;
}

export const DatasetBuilder: React.FC<DatasetBuilderProps> = ({
  repository,
  config,
  onUpdateConfig
}) => {
  const [selectedTargetLabel, setSelectedTargetLabel] = useState<'bug' | 'conflict' | 'build' | 'techDebt'>('bug');
  const [isBuildingDataset, setIsBuildingDataset] = useState(false);

  const datasetSamples = repository.commits.map((commit, index) => {
    const features = extractFeaturesFromCommit(commit, repository);
    let targetValue = commit.labelBug ? 1 : 0;
    if (selectedTargetLabel === 'conflict') targetValue = commit.labelConflict ? 1 : 0;
    if (selectedTargetLabel === 'build') targetValue = commit.labelBuildFail ? 1 : 0;
    if (selectedTargetLabel === 'techDebt') targetValue = commit.labelTechDebt ? 1 : 0;

    return {
      id: commit.id,
      hash: commit.shortHash,
      message: commit.message,
      author: commit.author,
      targetValue,
      features
    };
  });

  const totalSamples = datasetSamples.length;
  const positiveSamples = datasetSamples.filter((s) => s.targetValue === 1).length;
  const negativeSamples = totalSamples - positiveSamples;

  const handleExportCSV = () => {
    if (datasetSamples.length === 0) return;
    const sampleFeatures = datasetSamples[0].features;
    const featureKeys = Object.keys(sampleFeatures) as (keyof CommitFeatures)[];

    const headers = ['CommitHash', 'Author', ...featureKeys, 'TargetLabel'];
    const rows = datasetSamples.map((s) => {
      const vals = featureKeys.map((k) => s.features[k]);
      return [s.hash, `"${s.author}"`, ...vals, s.targetValue].join(',');
    });

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `gitsense_${repository.name}_ml_dataset.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleRebuildDataset = () => {
    setIsBuildingDataset(true);
    setTimeout(() => {
      setIsBuildingDataset(false);
    }, 800);
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Database className="w-5 h-5 text-emerald-400" />
            <h2 className="text-lg font-bold text-slate-100">Dataset Builder & Feature Extractor</h2>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Transforms raw Git commit logs and code churn into structured tabular feature matrices for ML training.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleRebuildDataset}
            disabled={isBuildingDataset}
            className="flex items-center gap-2 px-3.5 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700 transition-all cursor-pointer"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isBuildingDataset ? 'animate-spin text-emerald-400' : ''}`} />
            Re-Extract Features
          </button>

          <button
            onClick={handleExportCSV}
            className="flex items-center gap-2 px-3.5 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold transition-all cursor-pointer shadow-md"
          >
            <Download className="w-3.5 h-3.5" />
            Export CSV Dataset
          </button>
        </div>
      </div>

      {/* Dataset Controls & Target Label Selection */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Card 1: Target Labeling Selection */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 space-y-3">
          <h3 className="text-xs font-semibold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
            <SlidersHorizontal className="w-3.5 h-3.5 text-emerald-400" />
            ML Target Variable Label
          </h3>

          <div className="space-y-2 text-xs">
            <label className="flex items-center gap-2.5 p-2 rounded bg-slate-950/60 border border-slate-800 cursor-pointer hover:border-slate-700">
              <input
                type="radio"
                name="targetLabel"
                checked={selectedTargetLabel === 'bug'}
                onChange={() => setSelectedTargetLabel('bug')}
                className="text-emerald-500 focus:ring-0"
              />
              <div>
                <div className="font-semibold text-slate-200">Software Defect / Bug Introduced</div>
                <div className="text-[11px] text-slate-400">Classifies commits that led to bug fixes</div>
              </div>
            </label>

            <label className="flex items-center gap-2.5 p-2 rounded bg-slate-950/60 border border-slate-800 cursor-pointer hover:border-slate-700">
              <input
                type="radio"
                name="targetLabel"
                checked={selectedTargetLabel === 'conflict'}
                onChange={() => setSelectedTargetLabel('conflict')}
                className="text-emerald-500 focus:ring-0"
              />
              <div>
                <div className="font-semibold text-slate-200">Merge Conflict Risk</div>
                <div className="text-[11px] text-slate-400">Classifies high-churn multi-file branches</div>
              </div>
            </label>

            <label className="flex items-center gap-2.5 p-2 rounded bg-slate-950/60 border border-slate-800 cursor-pointer hover:border-slate-700">
              <input
                type="radio"
                name="targetLabel"
                checked={selectedTargetLabel === 'build'}
                onChange={() => setSelectedTargetLabel('build')}
                className="text-emerald-500 focus:ring-0"
              />
              <div>
                <div className="font-semibold text-slate-200">Build Failure Likelihood</div>
                <div className="text-[11px] text-slate-400">Dependency & breaking structural changes</div>
              </div>
            </label>
          </div>
        </div>

        {/* Card 2: Train / Test Split & Balancing */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 space-y-3">
          <h3 className="text-xs font-semibold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
            <Sliders className="w-3.5 h-3.5 text-emerald-400" />
            Dataset Split & Preprocessing
          </h3>

          <div className="space-y-3 text-xs">
            <div>
              <div className="flex justify-between text-slate-300 mb-1 font-medium">
                <span>Train / Test Ratio</span>
                <span className="font-mono text-emerald-400">
                  {Math.round((1 - config.testSplitRatio) * 100)}% / {Math.round(config.testSplitRatio * 100)}%
                </span>
              </div>
              <input
                type="range"
                min="0.1"
                max="0.4"
                step="0.05"
                value={config.testSplitRatio}
                onChange={(e) =>
                  onUpdateConfig({ ...config, testSplitRatio: Number(e.target.value) })
                }
                className="w-full accent-emerald-500 cursor-pointer"
              />
            </div>

            <div>
              <label className="block text-slate-300 mb-1 font-medium">Class Balancing Method</label>
              <select
                value={config.balancingStrategy}
                onChange={(e) =>
                  onUpdateConfig({
                    ...config,
                    balancingStrategy: e.target.value as any
                  })
                }
                className="w-full bg-slate-950 border border-slate-800 text-slate-200 rounded p-1.5"
              >
                <option value="None">None (Standard Imbalanced)</option>
                <option value="SMOTE Oversampling">SMOTE Oversampling</option>
                <option value="Random Undersampling">Random Undersampling</option>
              </select>
            </div>
          </div>
        </div>

        {/* Card 3: Class Distribution Metrics */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 space-y-3">
          <h3 className="text-xs font-semibold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
            <Layers className="w-3.5 h-3.5 text-emerald-400" />
            Dataset Class Distribution
          </h3>

          <div className="space-y-3 pt-1 text-xs">
            <div className="flex items-center justify-between">
              <span className="text-slate-400">Total Samples:</span>
              <span className="font-mono font-bold text-slate-100">{totalSamples} Commits</span>
            </div>

            <div>
              <div className="flex justify-between text-[11px] mb-1">
                <span className="text-emerald-400">Negative Class (0 - Safe): {negativeSamples}</span>
                <span className="text-rose-400">Positive Class (1 - High Risk): {positiveSamples}</span>
              </div>
              <div className="w-full h-2.5 bg-slate-950 rounded-full overflow-hidden flex border border-slate-800">
                <div
                  className="bg-emerald-500 h-full"
                  style={{ width: `${(negativeSamples / totalSamples) * 100}%` }}
                />
                <div
                  className="bg-rose-500 h-full"
                  style={{ width: `${(positiveSamples / totalSamples) * 100}%` }}
                />
              </div>
            </div>

            <div className="p-2.5 rounded bg-slate-950/70 border border-slate-800 text-[11px] text-slate-400 leading-relaxed">
              Features Extracted: <span className="text-emerald-400 font-mono font-semibold">28 Features</span> across Repository, Commit, Code Complexity, and Developer Tenure.
            </div>
          </div>
        </div>
      </div>

      {/* Feature Matrix Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-semibold text-slate-200 flex items-center gap-2">
            <TableIcon className="w-4 h-4 text-emerald-400" />
            Extracted Feature Dataset Matrix ({datasetSamples.length} Samples x 28 Features)
          </h3>
          <span className="text-xs text-slate-400 font-mono">Repo: {repository.name}</span>
        </div>

        <div className="overflow-x-auto rounded-lg border border-slate-800 max-h-[420px]">
          <table className="w-full text-left border-collapse text-xs">
            <thead className="bg-slate-950 text-slate-300 uppercase tracking-wider font-mono text-[10px] sticky top-0 border-b border-slate-800">
              <tr>
                <th className="p-3 border-r border-slate-800">Commit</th>
                <th className="p-3 border-r border-slate-800">Target</th>
                <th className="p-3 border-r border-slate-800 text-right">Cyclomatic</th>
                <th className="p-3 border-r border-slate-800 text-right">Maint. Index</th>
                <th className="p-3 border-r border-slate-800 text-right">Code Churn</th>
                <th className="p-3 border-r border-slate-800 text-right">Files</th>
                <th className="p-3 border-r border-slate-800 text-right">Coupling</th>
                <th className="p-3 border-r border-slate-800 text-right">Bug Freq</th>
                <th className="p-3 text-right">Dev Experience</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800 text-slate-300 font-mono text-[11px]">
              {datasetSamples.map((sample) => (
                <tr key={sample.id} className="hover:bg-slate-800/40 transition-colors">
                  <td className="p-3 border-r border-slate-800 font-semibold text-emerald-400">
                    {sample.hash}
                  </td>
                  <td className="p-3 border-r border-slate-800">
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        sample.targetValue === 1
                          ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                          : 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                      }`}
                    >
                      {sample.targetValue === 1 ? 'RISKY (1)' : 'SAFE (0)'}
                    </span>
                  </td>
                  <td className="p-3 border-r border-slate-800 text-right">{sample.features.cyclomaticComplexity}</td>
                  <td className="p-3 border-r border-slate-800 text-right">{sample.features.maintainabilityIndex}</td>
                  <td className="p-3 border-r border-slate-800 text-right">{sample.features.commitSizeTotalLines}</td>
                  <td className="p-3 border-r border-slate-800 text-right">{sample.features.filesChanged}</td>
                  <td className="p-3 border-r border-slate-800 text-right">{sample.features.moduleCouplingScore}</td>
                  <td className="p-3 border-r border-slate-800 text-right">{sample.features.previousBugFrequency}</td>
                  <td className="p-3 text-right">{sample.features.developerExperienceMonths}m</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
