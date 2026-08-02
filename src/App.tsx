import React, { useState } from 'react';
import { SAMPLE_REPOSITORIES, extractFeaturesFromCommit } from './data/sampleRepositories';
import { 
  Repository, 
  Commit, 
  ActiveTab, 
  ModelConfig, 
  ModelEvaluation as ModelEvalType, 
  PredictionResult 
} from './types';
import { predictCommitRisk, trainAndEvaluateModel } from './services/mlEngine';

import { Navbar } from './components/Navbar';
import { RepositoryScanner } from './components/RepositoryScanner';
import { DatasetBuilder } from './components/DatasetBuilder';
import { ModelTrainer } from './components/ModelTrainer';
import { ModelEvaluation } from './components/ModelEvaluation';
import { CommitAnalyzer } from './components/CommitAnalyzer';
import { AnalyticsDashboard } from './components/AnalyticsDashboard';
import { PredictionHistoryTab } from './components/PredictionHistoryTab';
import { GeminiAdvisorModal } from './components/GeminiAdvisorModal';
import { ReportsModal } from './components/ReportsModal';
import { SettingsModal } from './components/SettingsModal';

export default function App() {
  const [repositories, setRepositories] = useState<Repository[]>(SAMPLE_REPOSITORIES);
  const [selectedRepo, setSelectedRepo] = useState<Repository>(SAMPLE_REPOSITORIES[0]);
  const [activeTab, setActiveTab] = useState<ActiveTab>('scanner');

  // Selected commit for inspection & prediction
  const [selectedCommit, setSelectedCommit] = useState<Commit>(SAMPLE_REPOSITORIES[0].commits[0]);

  // Model Configuration State
  const [modelConfig, setModelConfig] = useState<ModelConfig>({
    algorithm: 'XGBoost',
    family: 'Classification',
    hyperparameters: {
      learningRate: 0.05,
      maxDepth: 6,
      nEstimators: 100,
      subsample: 0.8,
      regularization: 1.0
    },
    testSplitRatio: 0.2,
    crossValidationFolds: 5,
    balancingStrategy: 'SMOTE Oversampling',
    missingValueStrategy: 'Mean Imputation'
  });

  // Model Evaluation State
  const [evaluation, setEvaluation] = useState<ModelEvalType>(() => trainAndEvaluateModel(modelConfig));

  // Current Commit Risk Prediction Result
  const [currentPrediction, setCurrentPrediction] = useState<PredictionResult>(() => {
    const features = extractFeaturesFromCommit(selectedCommit, selectedRepo);
    return predictCommitRisk(features, modelConfig, selectedCommit.message);
  });

  // Prediction History Log
  const [predictionHistory, setPredictionHistory] = useState<PredictionResult[]>([currentPrediction]);

  // Modals state
  const [isGeminiAdvisorOpen, setIsGeminiAdvisorOpen] = useState(false);
  const [isReportsOpen, setIsReportsOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  // Handle Commit Selection & Auto Predict
  const handleSelectCommit = (commit: Commit) => {
    setSelectedCommit(commit);
    const features = extractFeaturesFromCommit(commit, selectedRepo);
    const pred = predictCommitRisk(features, modelConfig, commit.message);
    setCurrentPrediction(pred);
    setPredictionHistory((prev) => [pred, ...prev.slice(0, 49)]);
  };

  // Run Risk Prediction Trigger
  const handleRunRiskPrediction = (commit: Commit) => {
    handleSelectCommit(commit);
    setActiveTab('commit-analyzer');
  };

  // Add Custom Commit
  const handleAddCustomCommit = (newCommit: Commit) => {
    const updatedRepo = {
      ...selectedRepo,
      totalCommits: selectedRepo.totalCommits + 1,
      commits: [newCommit, ...selectedRepo.commits]
    };

    setRepositories((prev) =>
      prev.map((r) => (r.id === selectedRepo.id ? updatedRepo : r))
    );
    setSelectedRepo(updatedRepo);
    handleSelectCommit(newCommit);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans antialiased selection:bg-emerald-500 selection:text-slate-950">
      {/* Top Header & Navigation Bar */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        selectedRepo={selectedRepo}
        setSelectedRepo={(repo) => {
          setSelectedRepo(repo);
          if (repo.commits.length > 0) handleSelectCommit(repo.commits[0]);
        }}
        repositories={repositories}
        onOpenGeminiAdvisor={() => setIsGeminiAdvisorOpen(true)}
        onOpenReports={() => setIsReportsOpen(true)}
        onOpenSettings={() => setIsSettingsOpen(true)}
        isModelTrained={evaluation.isTrained}
        trainedAlgoName={modelConfig.algorithm}
      />

      {/* Main View Container */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {activeTab === 'scanner' && (
          <RepositoryScanner
            repository={selectedRepo}
            selectedCommit={selectedCommit}
            onSelectCommit={handleSelectCommit}
            onAddCustomCommit={handleAddCustomCommit}
            onAnalyzeCommit={handleRunRiskPrediction}
          />
        )}

        {activeTab === 'dataset' && (
          <DatasetBuilder
            repository={selectedRepo}
            config={modelConfig}
            onUpdateConfig={setModelConfig}
          />
        )}

        {activeTab === 'trainer' && (
          <ModelTrainer
            config={modelConfig}
            onUpdateConfig={setModelConfig}
            evaluation={evaluation}
            onUpdateEvaluation={setEvaluation}
          />
        )}

        {activeTab === 'evaluation' && (
          <ModelEvaluation evaluation={evaluation} />
        )}

        {activeTab === 'commit-analyzer' && (
          <CommitAnalyzer
            selectedCommit={selectedCommit}
            prediction={currentPrediction}
            repository={selectedRepo}
            onRunGeminiDeepThink={() => setIsGeminiAdvisorOpen(true)}
          />
        )}

        {activeTab === 'analytics' && (
          <AnalyticsDashboard repository={selectedRepo} />
        )}

        {activeTab === 'history' && (
          <PredictionHistoryTab
            history={predictionHistory}
            onClearHistory={() => setPredictionHistory([])}
          />
        )}
      </main>

      {/* Modals */}
      <GeminiAdvisorModal
        isOpen={isGeminiAdvisorOpen}
        onClose={() => setIsGeminiAdvisorOpen(false)}
        selectedCommit={selectedCommit}
        prediction={currentPrediction}
      />

      <ReportsModal
        isOpen={isReportsOpen}
        onClose={() => setIsReportsOpen(false)}
        repository={selectedRepo}
        evaluation={evaluation}
        prediction={currentPrediction}
      />

      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
      />
    </div>
  );
}
