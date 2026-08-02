export type RiskLevel = 'Safe' | 'Low Risk' | 'Medium Risk' | 'High Risk';

export type ModelAlgorithm = 
  | 'Logistic Regression'
  | 'Decision Tree'
  | 'Random Forest'
  | 'Gradient Boosting'
  | 'XGBoost'
  | 'LightGBM'
  | 'CatBoost'
  | 'Support Vector Machine'
  | 'Multi-Layer Perceptron'
  | 'LSTM Sequence Model'
  | 'Transformer Encoder'
  | 'Graph Neural Network'
  | 'Isolation Forest';

export type ModelFamily = 'Classification' | 'Deep Learning' | 'Graph Learning' | 'Anomaly Detection';

export interface FileChange {
  path: string;
  status: 'added' | 'modified' | 'deleted' | 'renamed';
  additions: number;
  deletions: number;
}

export interface Commit {
  id: string;
  hash: string;
  shortHash: string;
  author: string;
  authorEmail: string;
  avatarUrl?: string;
  date: string;
  message: string;
  branch: string;
  filesChanged: number;
  linesAdded: number;
  linesDeleted: number;
  modifiedDirectories: number;
  filesList: FileChange[];
  diff?: string;
  labelBug?: boolean;
  labelConflict?: boolean;
  labelBuildFail?: boolean;
  labelTechDebt?: boolean;
}

export interface CommitFeatures {
  // Repository Features
  repoAgeDays: number;
  repoSizeBytes: number;
  totalCommits: number;
  totalBranches: number;
  activeContributors: number;
  releaseFrequencyPerMonth: number;

  // Commit Features
  commitSizeTotalLines: number;
  filesChanged: number;
  linesAdded: number;
  linesDeleted: number;
  commitIntervalHours: number;
  commitMessageLength: number;
  sentimentScore: number;
  modifiedDirDepth: number;

  // Code Features
  cyclomaticComplexity: number;
  maintainabilityIndex: number;
  codeChurnRatio: number;
  functionsModifiedCount: number;
  classModificationsCount: number;
  dependencyChangesCount: number;
  fileOwnershipRatio: number;
  moduleCouplingScore: number;
  cohesionScore: number;

  // Historical Features
  previousBugFrequency: number;
  historicalMergeConflicts: number;
  previousBuildFailures: number;
  historicalRepoHealth: number;
  developerExperienceMonths: number;
  recentRepoActivityScore: number;
  fileModificationHistoryCount: number;
}

export interface SHAPValue {
  featureName: string;
  featureValue: number;
  shapValue: number; // positive increases risk, negative decreases risk
  category: 'Repository' | 'Commit' | 'Code' | 'Historical';
}

export interface LIMEPredictionWeight {
  featureName: string;
  weight: number;
  description: string;
}

export interface SimilarCommit {
  hash: string;
  message: string;
  author: string;
  similarityScore: number; // 0 to 100
  actualOutcome: 'Defect Bug Introduced' | 'Merge Conflict' | 'Build Failure' | 'Clean & Merged';
  riskScore: number;
}

export interface FileRiskPrediction {
  filePath: string;
  riskScore: number; // 0 - 100
  likelihoodToModifyNext: number; // 0 - 100
  churn: number;
}

export interface PredictionResult {
  commitHash: string;
  overallRiskScore: number; // 0 - 100
  riskLevel: RiskLevel;
  bugProbability: number;
  mergeConflictProbability: number;
  buildFailureProbability: number;
  technicalDebtScore: number;
  maintainabilityScore: number; // 1 - 100
  confidenceScore: number; // 0 - 100
  shapValues: SHAPValue[];
  limeExplanations: LIMEPredictionWeight[];
  similarCommits: SimilarCommit[];
  fileRiskPredictions: FileRiskPrediction[];
  aiThinkingExplanation?: string;
  timestamp: string;
}

export interface ModelConfig {
  algorithm: ModelAlgorithm;
  family: ModelFamily;
  hyperparameters: {
    learningRate: number;
    maxDepth: number;
    nEstimators: number;
    subsample: number;
    regularization: number;
  };
  testSplitRatio: number; // e.g. 0.2
  crossValidationFolds: number; // e.g. 5
  balancingStrategy: 'None' | 'SMOTE Oversampling' | 'Random Undersampling';
  missingValueStrategy: 'Mean Imputation' | 'Median Imputation' | 'Zero Fill';
}

export interface ModelEvaluation {
  accuracy: number;
  precision: number;
  recall: number;
  f1Score: number;
  rocAuc: number;
  confusionMatrix: {
    truePositive: number;
    falsePositive: number;
    trueNegative: number;
    falseNegative: number;
  };
  featureImportances: {
    featureName: string;
    importance: number;
    category: 'Repository' | 'Commit' | 'Code' | 'Historical';
  }[];
  trainingHistory: {
    epoch: number;
    trainLoss: number;
    valLoss: number;
    trainAcc: number;
    valAcc: number;
  }[];
  rocCurvePoints: { fpr: number; tpr: number }[];
  isTrained: boolean;
  trainedDate?: string;
  algorithmName: string;
}

export interface Repository {
  id: string;
  name: string;
  owner: string;
  description: string;
  branches: string[];
  totalCommits: number;
  stars: number;
  forks: number;
  createdAt: string;
  language: string;
  healthScore: number;
  activeContributors: number;
  commits: Commit[];
}

export type ActiveTab = 
  | 'scanner' 
  | 'dataset' 
  | 'trainer' 
  | 'evaluation' 
  | 'commit-analyzer' 
  | 'analytics' 
  | 'history';
