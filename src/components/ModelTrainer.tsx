import React, { useState } from 'react';
import { 
  Cpu, 
  Play, 
  Settings2, 
  CheckCircle, 
  Layers, 
  Activity, 
  BarChart2, 
  Sparkles, 
  Zap,
  TrendingUp
} from 'lucide-react';
import { ModelConfig, ModelAlgorithm, ModelEvaluation } from '../types';
import { trainAndEvaluateModel } from '../services/mlEngine';

interface ModelTrainerProps {
  config: ModelConfig;
  onUpdateConfig: (config: ModelConfig) => void;
  evaluation: ModelEvaluation;
  onUpdateEvaluation: (evaluation: ModelEvaluation) => void;
}

export const ModelTrainer: React.FC<ModelTrainerProps> = ({
  config,
  onUpdateConfig,
  evaluation,
  onUpdateEvaluation
}) => {
  const [isTraining, setIsTraining] = useState(false);
  const [trainingProgress, setTrainingProgress] = useState(0);
  const [currentEpoch, setCurrentEpoch] = useState(0);
  const [liveLoss, setLiveLoss] = useState(0.68);

  const algorithmCategories: {
    family: 'Classification' | 'Deep Learning' | 'Graph Learning' | 'Anomaly Detection';
    algorithms: ModelAlgorithm[];
  }[] = [
    {
      family: 'Classification',
      algorithms: [
        'XGBoost',
        'LightGBM',
        'CatBoost',
        'Random Forest',
        'Gradient Boosting',
        'Logistic Regression',
        'Decision Tree',
        'Support Vector Machine'
      ]
    },
    {
      family: 'Deep Learning',
      algorithms: ['Multi-Layer Perceptron', 'LSTM Sequence Model', 'Transformer Encoder']
    },
    {
      family: 'Graph Learning',
      algorithms: ['Graph Neural Network']
    },
    {
      family: 'Anomaly Detection',
      algorithms: ['Isolation Forest']
    }
  ];

  const handleStartTraining = () => {
    setIsTraining(true);
    setTrainingProgress(0);
    setCurrentEpoch(0);
    setLiveLoss(0.68);

    const totalEpochs = config.hyperparameters.nEstimators || 50;
    let step = 0;

    const interval = setInterval(() => {
      step++;
      const progressPercent = Math.min(100, Math.round((step / 20) * 100));
      const epochVal = Math.round((step / 20) * totalEpochs);
      const lossVal = Number((0.68 * Math.exp(-step * 0.18) + 0.05).toFixed(4));

      setTrainingProgress(progressPercent);
      setCurrentEpoch(epochVal);
      setLiveLoss(lossVal);

      if (step >= 20) {
        clearInterval(interval);
        setIsTraining(false);
        const evalResult = trainAndEvaluateModel(config);
        onUpdateEvaluation(evalResult);
      }
    }, 120);
  };

  return (
    <div className="space-y-6">
      {/* Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Cpu className="w-5 h-5 text-emerald-400" />
            <h2 className="text-lg font-bold text-slate-100">Local Machine Learning Model Trainer</h2>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Train tree-based ensembles, neural networks, or graph models locally on extracted commit features.
          </p>
        </div>

        <button
          onClick={handleStartTraining}
          disabled={isTraining}
          className="flex items-center gap-2 px-5 py-2.5 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs shadow-lg transition-all cursor-pointer disabled:opacity-50"
        >
          {isTraining ? (
            <>
              <Activity className="w-4 h-4 animate-spin text-slate-950" />
              <span>Training Epoch {currentEpoch}...</span>
            </>
          ) : (
            <>
              <Play className="w-4 h-4 fill-slate-950" />
              <span>Start Model Training</span>
            </>
          )}
        </button>
      </div>

      {/* Main Grid: Algorithm Picker vs Hyperparameter Controls */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Model Selection (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-4">
            <h3 className="text-xs font-semibold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
              <Layers className="w-3.5 h-3.5 text-emerald-400" />
              Select Machine Learning Model Architecture
            </h3>

            <div className="space-y-4">
              {algorithmCategories.map((cat) => (
                <div key={cat.family} className="space-y-2">
                  <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                    {cat.family}
                  </span>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                    {cat.algorithms.map((algo) => {
                      const isSelected = config.algorithm === algo;
                      return (
                        <button
                          key={algo}
                          type="button"
                          onClick={() =>
                            onUpdateConfig({
                              ...config,
                              algorithm: algo,
                              family: cat.family
                            })
                          }
                          className={`p-2.5 rounded-lg border text-left cursor-pointer transition-all ${
                            isSelected
                              ? 'bg-emerald-950/40 border-emerald-500 text-emerald-300 shadow-sm'
                              : 'bg-slate-950/50 border-slate-800 text-slate-300 hover:border-slate-700 hover:bg-slate-800/40'
                          }`}
                        >
                          <div className="text-xs font-bold">{algo}</div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Hyperparameter Controls (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-4">
            <h3 className="text-xs font-semibold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
              <Settings2 className="w-3.5 h-3.5 text-emerald-400" />
              Hyperparameter Configuration
            </h3>

            <div className="space-y-3 text-xs">
              <div>
                <div className="flex justify-between text-slate-300 mb-1">
                  <span>Learning Rate (eta)</span>
                  <span className="font-mono text-emerald-400">{config.hyperparameters.learningRate}</span>
                </div>
                <input
                  type="range"
                  min="0.005"
                  max="0.2"
                  step="0.005"
                  value={config.hyperparameters.learningRate}
                  onChange={(e) =>
                    onUpdateConfig({
                      ...config,
                      hyperparameters: { ...config.hyperparameters, learningRate: Number(e.target.value) }
                    })
                  }
                  className="w-full accent-emerald-500 cursor-pointer"
                />
              </div>

              <div>
                <div className="flex justify-between text-slate-300 mb-1">
                  <span>Number of Estimators / Epochs</span>
                  <span className="font-mono text-emerald-400">{config.hyperparameters.nEstimators}</span>
                </div>
                <input
                  type="range"
                  min="10"
                  max="300"
                  step="10"
                  value={config.hyperparameters.nEstimators}
                  onChange={(e) =>
                    onUpdateConfig({
                      ...config,
                      hyperparameters: { ...config.hyperparameters, nEstimators: Number(e.target.value) }
                    })
                  }
                  className="w-full accent-emerald-500 cursor-pointer"
                />
              </div>

              <div>
                <div className="flex justify-between text-slate-300 mb-1">
                  <span>Max Tree Depth / Layers</span>
                  <span className="font-mono text-emerald-400">{config.hyperparameters.maxDepth}</span>
                </div>
                <input
                  type="range"
                  min="2"
                  max="16"
                  step="1"
                  value={config.hyperparameters.maxDepth}
                  onChange={(e) =>
                    onUpdateConfig({
                      ...config,
                      hyperparameters: { ...config.hyperparameters, maxDepth: Number(e.target.value) }
                    })
                  }
                  className="w-full accent-emerald-500 cursor-pointer"
                />
              </div>

              <div>
                <label className="block text-slate-300 mb-1 font-medium">K-Fold Cross Validation</label>
                <select
                  value={config.crossValidationFolds}
                  onChange={(e) =>
                    onUpdateConfig({ ...config, crossValidationFolds: Number(e.target.value) })
                  }
                  className="w-full bg-slate-950 border border-slate-800 text-slate-200 rounded p-2 focus:outline-none"
                >
                  <option value={3}>3-Fold Stratified CV</option>
                  <option value={5}>5-Fold Stratified CV (Recommended)</option>
                  <option value={10}>10-Fold Stratified CV</option>
                </select>
              </div>
            </div>
          </div>

          {/* Live Training Execution Card */}
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                <Zap className="w-3.5 h-3.5 text-amber-400" />
                Training Execution Status
              </span>
              <span className="text-xs font-mono text-slate-400">
                {isTraining ? 'TRAINING IN PROGRESS' : evaluation.isTrained ? 'MODEL READY' : 'IDLE'}
              </span>
            </div>

            {isTraining ? (
              <div className="space-y-2 pt-1">
                <div className="flex justify-between text-xs font-mono">
                  <span className="text-slate-400">Progress: {trainingProgress}%</span>
                  <span className="text-emerald-400">Loss: {liveLoss}</span>
                </div>
                <div className="w-full h-2.5 bg-slate-950 rounded-full overflow-hidden border border-slate-800">
                  <div
                    className="bg-gradient-to-r from-emerald-500 to-teal-400 h-full transition-all duration-150"
                    style={{ width: `${trainingProgress}%` }}
                  />
                </div>
              </div>
            ) : evaluation.isTrained ? (
              <div className="p-3 rounded-lg bg-emerald-950/30 border border-emerald-500/30 text-xs text-emerald-300 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-emerald-400" />
                  <span>
                    Model <strong className="text-white">{evaluation.algorithmName}</strong> trained successfully!
                  </span>
                </div>
                <span className="font-mono font-bold text-white">{(evaluation.accuracy * 100).toFixed(1)}% Acc</span>
              </div>
            ) : (
              <div className="text-xs text-slate-400 p-3 bg-slate-950 rounded border border-slate-800">
                Click "Start Model Training" to fit the selected model on your extracted Git dataset.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
