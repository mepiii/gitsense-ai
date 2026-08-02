import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, ThinkingLevel } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json({ limit: "10mb" }));

// Server-side Gemini AI Client helper
const getGeminiClient = () => {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error("GEMINI_API_KEY is not configured in server environment.");
  }
  return new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        "User-Agent": "aistudio-build",
      },
    },
  });
};

// API Health
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", app: "GitSense AI", timestamp: new Date().toISOString() });
});

// High-Thinking Gemini Analysis (using gemini-3.1-pro-preview with ThinkingLevel.HIGH)
app.post("/api/gemini/think-risk", async (req, res) => {
  try {
    const { commitMessage, codeDiff, metrics, predictedRisk } = req.body;
    const ai = getGeminiClient();

    const prompt = `
You are an expert Principal Software Engineer and Machine Learning Safety Analyst for GitSense AI.
Analyze the following Git commit details and explain the predicted software engineering risks, potential root causes, architectural debt, and recommended refactoring/mitigation steps.

Commit Message: ${commitMessage || "N/A"}
Predicted Risk Level: ${predictedRisk?.riskLevel || "Medium Risk"} (${predictedRisk?.overallRiskScore || 50}% Overall Risk)
Metrics:
- Bug Probability: ${predictedRisk?.bugProbability || 0}%
- Merge Conflict Probability: ${predictedRisk?.mergeConflictProbability || 0}%
- Build Failure Probability: ${predictedRisk?.buildFailureProbability || 0}%
- Technical Debt Index: ${predictedRisk?.technicalDebtScore || 0}%
- Cyclomatic Complexity: ${metrics?.cyclomaticComplexity || "N/A"}
- Maintainability Index: ${metrics?.maintainabilityIndex || "N/A"}
- Code Churn: +${metrics?.linesAdded || 0} / -${metrics?.linesDeleted || 0} in ${metrics?.filesChanged || 0} files

Code Diff / Context:
\`\`\`
${codeDiff || "No diff provided."}
\`\`\`

Provide a thorough, highly technical, actionable breakdown:
1. Architectural Risk & Vulnerability Analysis
2. Root Causes for High Risk Flags
3. Specific Code Quality & Test Coverage Recommendations
4. Step-by-Step Mitigation & Refactoring Guide
`;

    const response = await ai.models.generateContent({
      model: "gemini-3.1-pro-preview",
      contents: prompt,
      config: {
        thinkingConfig: {
          thinkingLevel: ThinkingLevel.HIGH,
        },
      },
    });

    res.json({
      success: true,
      analysis: response.text,
      modelUsed: "gemini-3.1-pro-preview (Thinking HIGH)",
    });
  } catch (error: any) {
    console.error("Error in /api/gemini/think-risk:", error);
    res.status(500).json({
      success: false,
      error: error?.message || "Failed to generate high-thinking risk analysis.",
    });
  }
});

// Fast Gemini Intelligence Assistant (using gemini-3.6-flash)
app.post("/api/gemini/analyze", async (req, res) => {
  try {
    const { prompt, context } = req.body;
    const ai = getGeminiClient();

    const systemInstruction = `You are GitSense AI Assistant, a software engineering machine learning model interpreter. You give concise, precise, technical answers about Git commit risk prediction, feature engineering, SHAP values, and repository health.`;

    const response = await ai.models.generateContent({
      model: "gemini-3.6-flash",
      contents: `Context: ${JSON.stringify(context || {})}\n\nUser Question: ${prompt}`,
      config: {
        systemInstruction,
      },
    });

    res.json({
      success: true,
      response: response.text,
    });
  } catch (error: any) {
    console.error("Error in /api/gemini/analyze:", error);
    res.status(500).json({
      success: false,
      error: error?.message || "Failed to analyze with Gemini.",
    });
  }
});

// Search Grounding API for Security Advisories & Library Risk (gemini-3.5-flash with googleSearch tool)
app.post("/api/gemini/search-advisories", async (req, res) => {
  try {
    const { libraryOrTopic } = req.body;
    const ai = getGeminiClient();

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: `Find recent software security advisories, vulnerability alerts, or major breaking change patterns related to: ${libraryOrTopic}`,
      config: {
        tools: [{ googleSearch: {} }],
      },
    });

    const groundingChunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];

    res.json({
      success: true,
      summary: response.text,
      groundingSources: groundingChunks,
    });
  } catch (error: any) {
    console.error("Error in /api/gemini/search-advisories:", error);
    res.status(500).json({
      success: false,
      error: error?.message || "Search grounding failed.",
    });
  }
});

async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`GitSense AI Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
