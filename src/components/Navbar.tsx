import React from 'react';
import { 
  GitBranch, 
  GitCommit, 
  Database, 
  Cpu, 
  BarChart3, 
  Search, 
  ShieldAlert, 
  History, 
  Sparkles, 
  FileText, 
  Settings, 
  FolderGit2
} from 'lucide-react';
import { ActiveTab, Repository } from '../types';

interface NavbarProps {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  selectedRepo: Repository;
  setSelectedRepo: (repo: Repository) => void;
  repositories: Repository[];
  onOpenGeminiAdvisor: () => void;
  onOpenReports: () => void;
  onOpenSettings: () => void;
  isModelTrained: boolean;
  trainedAlgoName: string;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  selectedRepo,
  setSelectedRepo,
  repositories,
  onOpenGeminiAdvisor,
  onOpenReports,
  onOpenSettings,
  isModelTrained,
  trainedAlgoName
}) => {
  return (
    <header className="sticky top-0 z-40 bg-slate-900 border-b border-slate-800 text-slate-100 shadow-md">
      {/* Top Banner Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        
        {/* Brand & Repo Selector */}
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-emerald-500 via-teal-600 to-cyan-600 flex items-center justify-center text-white shadow-lg shadow-emerald-950/50">
              <FolderGit2 className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-lg tracking-tight bg-gradient-to-r from-slate-100 via-slate-200 to-emerald-400 bg-clip-text text-transparent">
                  GitSense AI
                </span>
                <span className="px-1.5 py-0.5 text-[10px] font-semibold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 rounded">
                  LOCAL ML
                </span>
              </div>
              <p className="text-xs text-slate-400 hidden sm:block">Commit Risk & Repository Predictive Analytics</p>
            </div>
          </div>

          {/* Repo Select Dropdown */}
          <div className="hidden md:flex items-center gap-2 bg-slate-800/90 border border-slate-700/80 rounded-lg px-3 py-1.5 text-xs text-slate-300">
            <GitBranch className="w-3.5 h-3.5 text-emerald-400" />
            <select
              value={selectedRepo.id}
              onChange={(e) => {
                const found = repositories.find((r) => r.id === e.target.value);
                if (found) setSelectedRepo(found);
              }}
              className="bg-transparent font-medium text-slate-200 focus:outline-none cursor-pointer pr-1"
            >
              {repositories.map((repo) => (
                <option key={repo.id} value={repo.id} className="bg-slate-900 text-slate-200">
                  {repo.owner} / {repo.name} ({repo.commits.length} commits)
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Center / Right Quick Controls */}
        <div className="flex items-center gap-2.5">
          {/* Active Model Indicator */}
          <div className="hidden lg:flex items-center gap-2 px-2.5 py-1 rounded-md bg-slate-800/80 border border-slate-700/60 text-xs">
            <div className={`w-2 h-2 rounded-full ${isModelTrained ? 'bg-emerald-400 animate-pulse' : 'bg-amber-400'}`} />
            <span className="text-slate-400">ML Engine:</span>
            <span className="font-semibold text-slate-200">{trainedAlgoName}</span>
          </div>

          {/* Gemini AI High-Thinking Advisor Button */}
          <button
            onClick={onOpenGeminiAdvisor}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-medium text-xs shadow-md transition-all cursor-pointer"
            title="Ask Gemini 3.1 Pro (High Thinking) for Commit Analysis"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            <span className="hidden sm:inline">AI Risk Advisor</span>
          </button>

          {/* Reports Button */}
          <button
            onClick={onOpenReports}
            className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 transition-colors cursor-pointer"
            title="Export Reports & Data"
          >
            <FileText className="w-4 h-4" />
          </button>

          {/* Settings Button */}
          <button
            onClick={onOpenSettings}
            className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 transition-colors cursor-pointer"
            title="Settings & Thresholds"
          >
            <Settings className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Main Tab Navigation Bar */}
      <div className="bg-slate-900/95 border-t border-slate-800/80 px-4 sm:px-6 lg:px-8">
        <nav className="max-w-7xl mx-auto flex items-center gap-1 overflow-x-auto py-2 scrollbar-none text-xs">
          <button
            onClick={() => setActiveTab('scanner')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-lg font-medium transition-all whitespace-nowrap cursor-pointer ${
              activeTab === 'scanner'
                ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
            }`}
          >
            <GitCommit className="w-4 h-4" />
            Repo Scanner
          </button>

          <button
            onClick={() => setActiveTab('dataset')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-lg font-medium transition-all whitespace-nowrap cursor-pointer ${
              activeTab === 'dataset'
                ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
            }`}
          >
            <Database className="w-4 h-4" />
            Dataset Builder
          </button>

          <button
            onClick={() => setActiveTab('trainer')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-lg font-medium transition-all whitespace-nowrap cursor-pointer ${
              activeTab === 'trainer'
                ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
            }`}
          >
            <Cpu className="w-4 h-4" />
            Model Trainer
          </button>

          <button
            onClick={() => setActiveTab('evaluation')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-lg font-medium transition-all whitespace-nowrap cursor-pointer ${
              activeTab === 'evaluation'
                ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
            }`}
          >
            <BarChart3 className="w-4 h-4" />
            Model Evaluation
          </button>

          <button
            onClick={() => setActiveTab('commit-analyzer')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-lg font-medium transition-all whitespace-nowrap cursor-pointer ${
              activeTab === 'commit-analyzer'
                ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
            }`}
          >
            <Search className="w-4 h-4" />
            Commit Risk Analyzer
          </button>

          <button
            onClick={() => setActiveTab('analytics')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-lg font-medium transition-all whitespace-nowrap cursor-pointer ${
              activeTab === 'analytics'
                ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
            }`}
          >
            <ShieldAlert className="w-4 h-4" />
            Analytics Dashboard
          </button>

          <button
            onClick={() => setActiveTab('history')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-lg font-medium transition-all whitespace-nowrap cursor-pointer ${
              activeTab === 'history'
                ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
            }`}
          >
            <History className="w-4 h-4" />
            Prediction History
          </button>
        </nav>
      </div>
    </header>
  );
};
