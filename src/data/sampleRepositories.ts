import { Repository, Commit, CommitFeatures } from '../types';

export const SAMPLE_REPOSITORIES: Repository[] = [
  {
    id: 'react-facebook',
    name: 'react',
    owner: 'facebook',
    description: 'The library for web and native user interfaces',
    branches: ['main', 'v19-dev', 'fiber-reconciler-v2', 'feature/compiler-optimizations'],
    totalCommits: 16420,
    stars: 228000,
    forks: 46200,
    createdAt: '2013-05-24',
    language: 'TypeScript',
    healthScore: 88,
    activeContributors: 1540,
    commits: [
      {
        id: 'c101',
        hash: '7a9f4d38e210b48c9021a8f',
        shortHash: '7a9f4d3',
        author: 'Dan Abramov',
        authorEmail: 'dan@facebook.com',
        avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80',
        date: '2026-07-28T14:32:00Z',
        message: 'fix(reconciler): optimize useDeferredValue batching and memory leak in concurrent scheduler',
        branch: 'main',
        filesChanged: 8,
        linesAdded: 342,
        linesDeleted: 128,
        modifiedDirectories: 3,
        labelBug: true,
        labelConflict: false,
        labelBuildFail: false,
        labelTechDebt: false,
        filesList: [
          { path: 'packages/react-reconciler/src/ReactFiberWorkLoop.js', status: 'modified', additions: 180, deletions: 70 },
          { path: 'packages/react-reconciler/src/ReactFiberScheduler.js', status: 'modified', additions: 92, deletions: 38 },
          { path: 'packages/react-dom/src/events/ReactDOMEventListener.js', status: 'modified', additions: 45, deletions: 12 },
          { path: 'packages/react-reconciler/__tests__/useDeferredValue-test.js', status: 'added', additions: 25, deletions: 8 }
        ],
        diff: `diff --git a/packages/react-reconciler/src/ReactFiberWorkLoop.js b/packages/react-reconciler/src/ReactFiberWorkLoop.js
index b8102a..c4912e 100644
--- a/packages/react-reconciler/src/ReactFiberWorkLoop.js
+++ b/packages/react-reconciler/src/ReactFiberWorkLoop.js
@@ -142,6 +142,18 @@ export function renderRootSync(root: FiberRoot, lanes: Lanes) {
   // Perform sync work loop with error boundary recovery
   const prevContext = pushSchedulerContext(root);
+  if (enableTransitionTracing) {
+    startTransitionTracing(root, lanes);
+  }
+  try {
+    workLoopSync();
+  } catch (thrownValue) {
+    handleThrow(root, thrownValue);
+  } finally {
+    popSchedulerContext(prevContext);
+    cleanDeferredPendingLanes(root);
+  }
}`
      },
      {
        id: 'c102',
        hash: 'b3e18f920a11c82f00223ef',
        shortHash: 'b3e18f9',
        author: 'Sophie Alpert',
        authorEmail: 'sophie@meta.com',
        avatarUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&auto=format&fit=crop&q=80',
        date: '2026-07-26T09:15:00Z',
        message: 'refactor(compiler): rewrite auto-memoization AST pass to prevent recursive stack overflow',
        branch: 'feature/compiler-optimizations',
        filesChanged: 14,
        linesAdded: 890,
        linesDeleted: 620,
        modifiedDirectories: 4,
        labelBug: true,
        labelConflict: true,
        labelBuildFail: true,
        labelTechDebt: true,
        filesList: [
          { path: 'compiler/packages/babel-plugin-react-compiler/src/HIR/HIRBuilder.ts', status: 'modified', additions: 410, deletions: 300 },
          { path: 'compiler/packages/babel-plugin-react-compiler/src/Optimization/MemoizationPass.ts', status: 'modified', additions: 320, deletions: 210 },
          { path: 'compiler/packages/babel-plugin-react-compiler/src/Validation/ValidateMemoization.ts', status: 'modified', additions: 160, deletions: 110 }
        ],
        diff: `diff --git a/compiler/packages/babel-plugin-react-compiler/src/Optimization/MemoizationPass.ts b/compiler/packages/babel-plugin-react-compiler/src/Optimization/MemoizationPass.ts
index d81a02..f9911b 100644
--- a/compiler/packages/babel-plugin-react-compiler/src/Optimization/MemoizationPass.ts
+++ b/compiler/packages/babel-plugin-react-compiler/src/Optimization/MemoizationPass.ts
@@ -88,14 +88,28 @@ export function optimizeMemoization(fn: HIRFunction): void {
-  function visitBlock(block: BasicBlock) {
-    for (const instr of block.instructions) {
-      processInstruction(instr);
-    }
-  }
+  const visitedBlocks = new Set<BlockId>();
+  const stack: Array<BasicBlock> = [fn.entry];
+  while (stack.length > 0) {
+    const current = stack.pop()!;
+    if (visitedBlocks.has(current.id)) continue;
+    visitedBlocks.add(current.id);
+    processBlockInstructions(current);
+    for (const pred of current.predecessors) {
+      stack.push(pred);
+    }
+  }`
      },
      {
        id: 'c103',
        hash: '8f2a1100bc871e9923812ab',
        shortHash: '8f2a110',
        author: 'Andrew Clark',
        authorEmail: 'andrew@meta.com',
        avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80',
        date: '2026-07-24T18:40:00Z',
        message: 'docs(readme): update React 19 release documentation and server components guide',
        branch: 'main',
        filesChanged: 2,
        linesAdded: 35,
        linesDeleted: 12,
        modifiedDirectories: 1,
        labelBug: false,
        labelConflict: false,
        labelBuildFail: false,
        labelTechDebt: false,
        filesList: [
          { path: 'README.md', status: 'modified', additions: 20, deletions: 10 },
          { path: 'docs/ServerComponents.md', status: 'modified', additions: 15, deletions: 2 }
        ],
        diff: `diff --git a/README.md b/README.md
index 118a10..881a20 100644
--- a/README.md
+++ b/README.md
@@ -10,4 +10,6 @@
-React is a JavaScript library for building user interfaces.
+React is a JavaScript framework for building performant web & native UIs.
+
+## Features
+- Full Server Actions support
+- Compiler-driven auto-memoization`
      },
      {
        id: 'c104',
        hash: '3d98c12fa8721110a1299ef',
        shortHash: '3d98c12',
        author: 'Sebastian Markbåge',
        authorEmail: 'sebastian@meta.com',
        avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&auto=format&fit=crop&q=80',
        date: '2026-07-20T11:00:00Z',
        message: 'feat(server-actions): support streaming multipart responses in Server Functions payload',
        branch: 'main',
        filesChanged: 6,
        linesAdded: 215,
        linesDeleted: 48,
        modifiedDirectories: 2,
        labelBug: false,
        labelConflict: false,
        labelBuildFail: false,
        labelTechDebt: false,
        filesList: [
          { path: 'packages/react-server/src/ReactFlightServer.js', status: 'modified', additions: 140, deletions: 30 },
          { path: 'packages/react-client/src/ReactFlightClient.js', status: 'modified', additions: 75, deletions: 18 }
        ]
      }
    ]
  },
  {
    id: 'vscode-microsoft',
    name: 'vscode',
    owner: 'microsoft',
    description: 'Visual Studio Code - Code editing. Redefined.',
    branches: ['main', 'release/1.92', 'insiders'],
    totalCommits: 112000,
    stars: 161000,
    forks: 31000,
    createdAt: '2015-09-03',
    language: 'TypeScript',
    healthScore: 92,
    activeContributors: 2100,
    commits: [
      {
        id: 'c201',
        hash: 'e4d8a11bc901a117281ef12',
        shortHash: 'e4d8a11',
        author: 'Benjamin Pasero',
        authorEmail: 'bpasero@microsoft.com',
        avatarUrl: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=100&auto=format&fit=crop&q=80',
        date: '2026-07-27T16:20:00Z',
        message: 'fix(workbench): resolve editor tab deadlock when restoring large workspace layouts',
        branch: 'main',
        filesChanged: 11,
        linesAdded: 480,
        linesDeleted: 210,
        modifiedDirectories: 3,
        labelBug: true,
        labelConflict: false,
        labelBuildFail: false,
        labelTechDebt: true,
        filesList: [
          { path: 'src/vs/workbench/browser/parts/editor/editorGroupView.ts', status: 'modified', additions: 230, deletions: 110 },
          { path: 'src/vs/workbench/services/history/browser/historyService.ts', status: 'modified', additions: 150, deletions: 60 },
          { path: 'src/vs/workbench/services/layout/browser/layoutService.ts', status: 'modified', additions: 100, deletions: 40 }
        ]
      },
      {
        id: 'c202',
        hash: 'f91a0029b311c102a991823',
        shortHash: 'f91a002',
        author: 'Joao Moreno',
        authorEmail: 'joao.moreno@microsoft.com',
        avatarUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&auto=format&fit=crop&q=80',
        date: '2026-07-22T10:05:00Z',
        message: 'feat(scm): add multi-diff inline review gutter preview for Git staged changes',
        branch: 'main',
        filesChanged: 18,
        linesAdded: 1240,
        linesDeleted: 310,
        modifiedDirectories: 5,
        labelBug: false,
        labelConflict: true,
        labelBuildFail: false,
        labelTechDebt: false,
        filesList: [
          { path: 'src/vs/workbench/contrib/scm/browser/scmViewlet.ts', status: 'modified', additions: 520, deletions: 120 },
          { path: 'src/vs/workbench/contrib/scm/common/scmService.ts', status: 'modified', additions: 410, deletions: 90 },
          { path: 'src/vs/editor/contrib/inlineCompletions/browser/inlineCompletionsController.ts', status: 'modified', additions: 310, deletions: 100 }
        ]
      }
    ]
  },
  {
    id: 'linux-torvalds',
    name: 'linux',
    owner: 'torvalds',
    description: 'Linux kernel source tree',
    branches: ['master', 'linux-6.10.y', 'next/master'],
    totalCommits: 1280000,
    stars: 178000,
    forks: 55000,
    createdAt: '2011-09-04',
    language: 'C',
    healthScore: 95,
    activeContributors: 24000,
    commits: [
      {
        id: 'c301',
        hash: 'd190a421e90b12fa09211c4',
        shortHash: 'd190a42',
        author: 'Linus Torvalds',
        authorEmail: 'torvalds@linux-foundation.org',
        avatarUrl: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=100&auto=format&fit=crop&q=80',
        date: '2026-07-29T20:00:00Z',
        message: 'mm/slub: fix lockless freelist corruption under high SMP concurrency',
        branch: 'master',
        filesChanged: 4,
        linesAdded: 112,
        linesDeleted: 45,
        modifiedDirectories: 2,
        labelBug: true,
        labelConflict: false,
        labelBuildFail: false,
        labelTechDebt: false,
        filesList: [
          { path: 'mm/slub.c', status: 'modified', additions: 78, deletions: 30 },
          { path: 'include/linux/slub_def.h', status: 'modified', additions: 34, deletions: 15 }
        ]
      }
    ]
  }
];

// Feature Extraction Helper for Commits
export function extractFeaturesFromCommit(commit: Commit, repo: Repository): CommitFeatures {
  const messageLen = commit.message.length;

  // Sentiment analysis approximation: bug/fix keywords lower sentiment, feat/clean increases
  let sentiment = 0.5;
  const lowerMsg = commit.message.toLowerCase();
  if (lowerMsg.includes('fix') || lowerMsg.includes('bug') || lowerMsg.includes('leak') || lowerMsg.includes('error')) {
    sentiment = 0.2;
  } else if (lowerMsg.includes('feat') || lowerMsg.includes('clean') || lowerMsg.includes('docs')) {
    sentiment = 0.8;
  }

  const cyclomatic = Math.round(5 + (commit.linesAdded + commit.linesDeleted) * 0.08 + commit.filesChanged * 2.5);
  const maintainability = Math.max(15, Math.min(98, Math.round(100 - (cyclomatic * 0.8 + commit.filesChanged * 1.8))));
  const codeChurn = commit.linesAdded + commit.linesDeleted;

  return {
    // Repository Features
    repoAgeDays: Math.round((Date.now() - new Date(repo.createdAt).getTime()) / (1000 * 60 * 60 * 24)),
    repoSizeBytes: repo.totalCommits * 12500,
    totalCommits: repo.totalCommits,
    totalBranches: repo.branches.length,
    activeContributors: repo.activeContributors,
    releaseFrequencyPerMonth: 4.2,

    // Commit Features
    commitSizeTotalLines: codeChurn,
    filesChanged: commit.filesChanged,
    linesAdded: commit.linesAdded,
    linesDeleted: commit.linesDeleted,
    commitIntervalHours: 8.5,
    commitMessageLength: messageLen,
    sentimentScore: sentiment,
    modifiedDirDepth: commit.modifiedDirectories,

    // Code Features
    cyclomaticComplexity: cyclomatic,
    maintainabilityIndex: maintainability,
    codeChurnRatio: codeChurn > 0 ? Number((commit.linesAdded / (codeChurn)).toFixed(2)) : 0.5,
    functionsModifiedCount: Math.round(commit.filesChanged * 2.8),
    classModificationsCount: Math.round(commit.filesChanged * 1.2),
    dependencyChangesCount: lowerMsg.includes('dep') || lowerMsg.includes('package') ? 3 : 0,
    fileOwnershipRatio: 0.72,
    moduleCouplingScore: Math.round(commit.filesChanged * 3.4 + commit.modifiedDirectories * 4),
    cohesionScore: Math.max(20, 100 - commit.filesChanged * 4),

    // Historical Features
    previousBugFrequency: commit.labelBug ? 0.35 : 0.12,
    historicalMergeConflicts: commit.labelConflict ? 0.28 : 0.05,
    previousBuildFailures: commit.labelBuildFail ? 0.22 : 0.02,
    historicalRepoHealth: repo.healthScore,
    developerExperienceMonths: 48,
    recentRepoActivityScore: 84,
    fileModificationHistoryCount: commit.filesChanged * 14
  };
}
