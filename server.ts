import express from "express";
import path from "path";
import dotenv from "dotenv";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// Initialize Gemini SDK with lazy-loading and recovery check
let aiClient: GoogleGenAI | null = null;
function getGeminiClient(): GoogleGenAI | null {
  if (!aiClient) {
    const key = process.env.GEMINI_API_KEY;
    if (!key || key === "MY_GEMINI_API_KEY") {
      console.warn("GEMINI_API_KEY environment variable is not configured correctly. Relying on high-quality templates.");
      return null;
    }
    try {
      aiClient = new GoogleGenAI({
        apiKey: key,
        httpOptions: {
          headers: {
            'User-Agent': 'aistudio-build',
          }
        }
      });
    } catch (e) {
      console.error("Failed to initialize GoogleGenAI client:", e);
      return null;
    }
  }
  return aiClient;
}

// ---------------------- API ROUTES ----------------------

// API health endpoint
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

// AI Assist: Improve Profile Overview
app.post("/api/gemini/improve-overview", async (req, res) => {
  try {
    const { companyName, registrationNumber, bbbeeLevel, currentOverview, industry } = req.body;
    const ai = getGeminiClient();

    if (!ai) {
      // High-quality local generator template fallback
      const enhancedFallback = `Established with a vision for industrial excellence, ${companyName || "Our enterprise"} premium services represent South African capability at its finest. Registered under CIPC with company registration ${registrationNumber || "2024/000000/07"} and operating as a proud Level ${bbbeeLevel || "1"} B-BBEE contributor, we focus on delivering state-of-the-art ${industry || "solutions"} matching strict National Treasury requirements. We ensure high compliance and premium craftsmanship across municipal, state, and corporate partnerships with reliable, efficient service.`;
      return res.json({ success: true, text: enhancedFallback, isFallback: true });
    }

    const prompt = `You are a professional South African procurement consultant and copywriter.
Improve this draft company overview for a company bid portfolio / capability statement. The audience is South African Government Tender Evaluators (National Treasury, CSD, eTenders) and corporate procurement officers.

Company Name: ${companyName || 'Acme SME'}
CIPC Reg No: ${registrationNumber || 'Not provided'}
B-BBEE level: Level ${bbbeeLevel || '1'}
Industry Focus: ${industry || 'SME sector'}
Draft Overview text: "${currentOverview || 'We provide excellent services and high quality products.'}"

Respond ONLY with the polished, structured, highly professional overview text. Do not write conversational greetings, intro titles, or meta descriptions. Do not surround with quotes. Keep it accurate, impactful, and under 200 words. Align with South African procurement terminology.`;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
    });

    const text = response.text?.trim() || "";
    res.json({ success: true, text });
  } catch (err: any) {
    console.error("improve-overview error:", err);
    res.status(500).json({ success: false, error: err.message });
  }
});

// AI Assist: Draft Core Competencies (JSON list)
app.post("/api/gemini/generate-competencies", async (req, res) => {
  try {
    const { companyName, industry, coreServices } = req.body;
    const ai = getGeminiClient();

    if (!ai) {
      // Local fallback suggestions
      return res.json({
        success: true,
        isFallback: true,
        competencies: [
          `Comprehensive service execution in the ${industry || "general services"} domain`,
          `Strict compliance with CIPC, CSD, and South African national standards`,
          "Dedicated local community employment and structured skill transfer programs",
          "Advanced quality assurance, administrative soundness, and on-time delivery metric tracking"
        ]
      });
    }

    const prompt = `You are an expert SA government tender bid writer. 
Generate exactly 4 descriptive, professional bulletins of Core Competencies or Key Capabilities based on:
Company: ${companyName || "the organization"}
Sector: ${industry || "General contracting"}
Current listed services: ${coreServices || "general works"}

Each competency bullet must highlight technical prowess, South African regulatory compliance (CIPC, eTender criteria), and quality control.
Respond in JSON format with an array of strings under the key "competencies". Return ONLY raw JSON, no markdown fences.`;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
      }
    });

    try {
      const text = response.text?.trim() || "{}";
      const cleaned = text.startsWith("```") ? text.replace(/```json|```/g, "").trim() : text;
      const parsed = JSON.parse(cleaned);
      res.json({ success: true, competencies: parsed.competencies || parsed });
    } catch (parseError) {
      res.json({ success: true, competencies: [
        `Highly specialized execution in ${industry || "the commercial sector"} across South Africa.`,
        `Fully compliant procurement pathways, maximizing scorecards for corporate and municipal tenders.`,
        `Strict adherence to local quality regulations, CSD provisions, and SANS standards.`,
        `Robust operational management and project reporting with full transparency.`
      ] });
    }
  } catch (err: any) {
    console.error("generate-competencies error:", err);
    res.status(500).json({ success: false, error: err.message });
  }
});

// AI Assist: Suggest Tender Winning Strategy Review
app.post("/api/gemini/review-tender", async (req, res) => {
  try {
    const { companyName, bbbeeLevel, cidbGrade, industry } = req.body;
    const ai = getGeminiClient();

    if (!ai) {
      return res.json({
        success: true,
        isFallback: true,
        review: `### SA Tender Readiness Review
1. **B-BBEE Scorecard Leverage**: Being a Level ${bbbeeLevel || "1"} contributor gives you the highest procurement recognition. State this prominently on the first page.
2. **eTender Portal Compliance**: Ensure CSD status is active and verified. Include active MAAA registration number in bold.
3. **Capacity Proof**: Highlight previous successful works with local municipalities or blue-chip enterprises.
4. **Locality Advantage**: Emphasize localized employment, skills development, and regional suppliers.`
      });
    }

    const prompt = `You are a senior officer of the South African National Treasury tender board who retired to advise private companies.
Review this company and provide exactly 3-4 professional, actionable tips to make their Capability Statement turn heads in municipal and state tenders.

Company details:
- Name: ${companyName || "the enterprise"}
- Industry: ${industry || "general services"}
- B-BBEE Level: Level ${bbbeeLevel || "1"}
- CIDB Grade: ${cidbGrade || "Not provided/Not applicable"}

Write your review in clean Markdown format with short bullet items. Be encouraging but highly specific to South African laws (Procurement Policy Framework Act, B-BBEE Codes, CSD/CIDB requirements). Keep total text under 180 words.`;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
    });

    res.json({ success: true, review: response.text || "" });
  } catch (err: any) {
    console.error("review-tender error:", err);
    res.status(500).json({ success: false, error: err.message });
  }
});

// ---------------------- FRONTEND / VITE MIDDLEWARE ----------------------

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
    console.log(`CapabilityPro SA custom server listening on port ${PORT}`);
  });
}

startServer();
