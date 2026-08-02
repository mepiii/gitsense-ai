import React, { useState } from 'react';
import { 
  GitBranch, 
  GitCommit, 
  Users, 
  Star, 
  FileCode2, 
  Plus, 
  Search, 
  AlertTriangle, 
  CheckCircle2, 
  FileText,
  Clock,
  Sparkles,
  ChevronRight,
  Code2
} from 'lucide-react';
import { Repository, Commit } from '../types';

interface RepositoryScannerProps {
  repository: Repository;
  selectedCommit: Commit;
  onSelectCommit: (commit: Commit) => void;
  onAddCustomCommit: (newCommit: Commit) => void;
  onAnalyzeCommit: (commit: Commit) => void;
}

export const RepositoryScanner: React.FC<RepositoryScannerProps> = ({
  repository,
  selectedCommit,
  onSelectCommit,
  onAddCustomCommit,
  onAnalyzeCommit
}) => {
  const [activeBranch, setActiveBranch] = useState(repository.branches[0] || 'main');
  const [searchQuery, setSearchQuery] = useState('');
  const [showAddCustomModal, setShowAddCustomModal] = useState(false);

  // Custom Commit Form state
  const [customMsg, setCustomMsg] = useState('refactor(auth): rewrite JWT validation pipeline and session cache');
  const [customAuthor, setCustomAuthor] = useState('Lead Engineer');
  const [customFilesCount, setCustomFilesCount] = useState(12);
  const [customAdditions, setCustomAdditions] = useState(420);
  const [customDeletions, setCustomDeletions] = useState(180);
  const [customDiff, setCustomDiff] = useState(`diff --git a/src/auth/jwtService.ts b/src/auth/jwtService.ts
index a109e2..c8921f 100644
--- a/src/auth/jwtService.ts
+++ b/src/auth/jwtService.ts
@@ -24,8 +24,18 @@ export function verifyToken(token: string) {
+  if (isRevokedInCache(token)) {
+    throw new SecurityError("Token revoked");
+  }
+  return jwt.verify(token, process.env.SECRET_KEY, { algorithms: ["RS256"] });
+}`);

  const filteredCommits = repository.commits.filter(
    (c) =>
      c.message.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.author.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.shortHash.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleCreateCommit = (e: React.FormEvent) => {
    e.preventDefault();
    const newHash = Math.random().toString(16).substring(2, 10) + Math.random().toString(16).substring(2, 10);
    const newCommit: Commit = {
      id: `custom-${Date.now()}`,
      hash: newHash,
      shortHash: newHash.substring(0, 7),
      author: customAuthor,
      authorEmail: 'dev@company.com',
      date: new Date().toISOString(),
      message: customMsg,
      branch: activeBranch,
      filesChanged: Number(customFilesCount),
      linesAdded: Number(customAdditions),
      linesDeleted: Number(customDeletions),
      modifiedDirectories: 3,
      filesList: [
        { path: 'src/auth/jwtService.ts', status: 'modified', additions: customAdditions, deletions: customDeletions },
        { path: 'src/auth/sessionCache.ts', status: 'added', additions: 150, deletions: 0 }
      ],
      diff: customDiff
    };

    onAddCustomCommit(newCommit);
    onSelectCommit(newCommit);
    setShowAddCustomModal(false);
  };

  return (
    <div className="space-y-6">
      {/* Repository Hero Overview Card */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-800">
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-xl font-bold text-slate-100">
                {repository.owner} / <span className="text-emerald-400">{repository.name}</span>
              </h1>
              <span className="px-2 py-0.5 text-xs font-semibold rounded bg-slate-800 text-slate-300 border border-slate-700">
                {repository.language}
              </span>
            </div>
            <p className="text-sm text-slate-400 mt-1">{repository.description}</p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setShowAddCustomModal(true)}
              className="flex items-center gap-2 px-3.5 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold transition-all cursor-pointer shadow-md"
            >
              <Plus className="w-4 h-4" />
              Analyze Custom Commit
            </button>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-6">
          <div className="bg-slate-950/60 p-3.5 rounded-lg border border-slate-800/80">
            <div className="flex items-center justify-between text-slate-400 text-xs mb-1">
              <span>Total Commits</span>
              <GitCommit className="w-4 h-4 text-emerald-400" />
            </div>
            <div className="text-lg font-bold text-slate-100">{repository.totalCommits.toLocaleString()}</div>
          </div>

          <div className="bg-slate-950/60 p-3.5 rounded-lg border border-slate-800/80">
            <div className="flex items-center justify-between text-slate-400 text-xs mb-1">
              <span>Health Score</span>
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            </div>
            <div className="text-lg font-bold text-emerald-400">{repository.healthScore}/100</div>
          </div>

          <div className="bg-slate-950/60 p-3.5 rounded-lg border border-slate-800/80">
            <div className="flex items-center justify-between text-slate-400 text-xs mb-1">
              <span>Contributors</span>
              <Users className="w-4 h-4 text-teal-400" />
            </div>
            <div className="text-lg font-bold text-slate-100">{repository.activeContributors}</div>
          </div>

          <div className="bg-slate-950/60 p-3.5 rounded-lg border border-slate-800/80">
            <div className="flex items-center justify-between text-slate-400 text-xs mb-1">
              <span>Branches</span>
              <GitBranch className="w-4 h-4 text-cyan-400" />
            </div>
            <div className="text-lg font-bold text-slate-100">{repository.branches.length}</div>
          </div>
        </div>
      </div>

      {/* Main Split View: Commit List vs Commit Detail Inspector */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Commit History Feed (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
            <div className="flex items-center justify-between gap-2 mb-3">
              <h2 className="text-sm font-semibold text-slate-200 flex items-center gap-2">
                <GitCommit className="w-4 h-4 text-emerald-400" />
                Commit History
              </h2>

              {/* Branch Selector */}
              <select
                value={activeBranch}
                onChange={(e) => setActiveBranch(e.target.value)}
                className="bg-slate-800 border border-slate-700 text-slate-200 text-xs rounded px-2 py-1 focus:outline-none"
              >
                {repository.branches.map((b) => (
                  <option key={b} value={b}>
                    {b}
                  </option>
                ))}
              </select>
            </div>

            {/* Search Input */}
            <div className="relative mb-3">
              <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-slate-500" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search commit, hash, or author..."
                className="w-full bg-slate-950 border border-slate-800 rounded-lg pl-8 pr-3 py-1.5 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-emerald-500"
              />
            </div>

            {/* Commits List */}
            <div className="space-y-2 max-h-[520px] overflow-y-auto pr-1">
              {filteredCommits.map((commit) => {
                const isSelected = selectedCommit.id === commit.id;
                return (
                  <div
                    key={commit.id}
                    onClick={() => onSelectCommit(commit)}
                    className={`p-3 rounded-lg border text-left cursor-pointer transition-all ${
                      isSelected
                        ? 'bg-emerald-950/30 border-emerald-500/50 shadow-sm'
                        : 'bg-slate-950/40 border-slate-800 hover:border-slate-700 hover:bg-slate-800/40'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <p className="text-xs font-medium text-slate-200 line-clamp-2">{commit.message}</p>
                      <ChevronRight className={`w-4 h-4 shrink-0 mt-0.5 ${isSelected ? 'text-emerald-400' : 'text-slate-600'}`} />
                    </div>

                    <div className="flex items-center justify-between text-[11px] text-slate-400 mt-2">
                      <div className="flex items-center gap-1.5">
                        <span className="font-mono text-emerald-400/90">{commit.shortHash}</span>
                        <span>•</span>
                        <span>{commit.author}</span>
                      </div>

                      <div className="flex items-center gap-1">
                        <span className="text-emerald-400 font-semibold">+{commit.linesAdded}</span>
                        <span className="text-rose-400 font-semibold">-{commit.linesDeleted}</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right Column: Selected Commit Inspector (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-5">
            {/* Selected Commit Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-800">
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-mono text-sm px-2 py-0.5 rounded bg-slate-800 text-emerald-400 border border-slate-700">
                    {selectedCommit.shortHash}
                  </span>
                  <span className="text-xs text-slate-400 flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {new Date(selectedCommit.date).toLocaleDateString()}
                  </span>
                </div>
                <h3 className="text-base font-semibold text-slate-100 mt-2">{selectedCommit.message}</h3>
                <p className="text-xs text-slate-400 mt-0.5">Author: <span className="text-slate-200">{selectedCommit.author}</span> ({selectedCommit.authorEmail})</p>
              </div>

              <button
                onClick={() => onAnalyzeCommit(selectedCommit)}
                className="flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs shadow-md transition-all cursor-pointer shrink-0"
              >
                <Sparkles className="w-4 h-4" />
                Run Risk Prediction
              </button>
            </div>

            {/* Commit Metrics Bar */}
            <div className="grid grid-cols-3 gap-3">
              <div className="bg-slate-950/60 p-3 rounded-lg border border-slate-800 text-center">
                <span className="text-xs text-slate-400">Files Changed</span>
                <p className="text-sm font-bold text-slate-200 mt-0.5">{selectedCommit.filesChanged}</p>
              </div>

              <div className="bg-slate-950/60 p-3 rounded-lg border border-slate-800 text-center">
                <span className="text-xs text-slate-400">Lines Added</span>
                <p className="text-sm font-bold text-emerald-400 mt-0.5">+{selectedCommit.linesAdded}</p>
              </div>

              <div className="bg-slate-950/60 p-3 rounded-lg border border-slate-800 text-center">
                <span className="text-xs text-slate-400">Lines Deleted</span>
                <p className="text-sm font-bold text-rose-400 mt-0.5">-{selectedCommit.linesDeleted}</p>
              </div>
            </div>

            {/* Files List */}
            <div>
              <h4 className="text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                <FileCode2 className="w-3.5 h-3.5 text-slate-400" />
                Modified Files ({selectedCommit.filesList.length})
              </h4>
              <div className="space-y-1.5 max-h-40 overflow-y-auto">
                {selectedCommit.filesList.map((file, i) => (
                  <div key={i} className="flex items-center justify-between text-xs p-2 rounded bg-slate-950/50 border border-slate-800/80 font-mono text-slate-300">
                    <span className="truncate max-w-[280px]">{file.path}</span>
                    <div className="flex items-center gap-2 text-[11px]">
                      <span className="text-emerald-400">+{file.additions}</span>
                      <span className="text-rose-400">-{file.deletions}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Code Diff Preview */}
            <div>
              <h4 className="text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                <Code2 className="w-3.5 h-3.5 text-slate-400" />
                Commit Diff Preview
              </h4>
              <div className="bg-slate-950 rounded-lg p-3 border border-slate-800 font-mono text-[11px] text-slate-300 overflow-x-auto max-h-60 leading-relaxed">
                <pre>{selectedCommit.diff || '// No diff preview available for this commit.'}</pre>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modal: Add Custom Commit for ML Analysis */}
      {showAddCustomModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 max-w-xl w-full space-y-4 shadow-2xl">
            <h3 className="text-base font-bold text-slate-100 flex items-center gap-2">
              <Plus className="w-5 h-5 text-emerald-400" />
              Analyze Custom Commit
            </h3>
            <p className="text-xs text-slate-400">
              Input custom commit messages, line changes, and code diff to generate real-time machine learning risk predictions.
            </p>

            <form onSubmit={handleCreateCommit} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-300 mb-1 font-medium">Commit Message</label>
                <input
                  type="text"
                  value={customMsg}
                  onChange={(e) => setCustomMsg(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded p-2 text-slate-200 focus:outline-none focus:border-emerald-500"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 mb-1 font-medium">Author</label>
                  <input
                    type="text"
                    value={customAuthor}
                    onChange={(e) => setCustomAuthor(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded p-2 text-slate-200 focus:outline-none focus:border-emerald-500"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 mb-1 font-medium">Files Changed</label>
                  <input
                    type="number"
                    value={customFilesCount}
                    onChange={(e) => setCustomFilesCount(Number(e.target.value))}
                    className="w-full bg-slate-950 border border-slate-800 rounded p-2 text-slate-200 focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 mb-1 font-medium">Lines Added (+)</label>
                  <input
                    type="number"
                    value={customAdditions}
                    onChange={(e) => setCustomAdditions(Number(e.target.value))}
                    className="w-full bg-slate-950 border border-slate-800 rounded p-2 text-slate-200 focus:outline-none focus:border-emerald-500"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 mb-1 font-medium">Lines Deleted (-)</label>
                  <input
                    type="number"
                    value={customDeletions}
                    onChange={(e) => setCustomDeletions(Number(e.target.value))}
                    className="w-full bg-slate-950 border border-slate-800 rounded p-2 text-slate-200 focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-300 mb-1 font-medium">Git Diff / Patch Snippet</label>
                <textarea
                  rows={4}
                  value={customDiff}
                  onChange={(e) => setCustomDiff(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded p-2 font-mono text-[11px] text-slate-200 focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddCustomModal(false)}
                  className="px-4 py-2 rounded bg-slate-800 text-slate-300 hover:bg-slate-700 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded bg-emerald-500 text-slate-950 font-bold hover:bg-emerald-400 transition-colors"
                >
                  Submit & Analyze
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
