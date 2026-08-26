import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

// Helper to safely prepare image data for Gemini inlineData
async function resolveImageForGemini(
  input: string,
  fallbackMime: string = "image/jpeg"
): Promise<{ data: string; mimeType: string } | null> {
  if (!input || typeof input !== "string") return null;

  // Case 1: Remote HTTP/HTTPS URL (e.g., Unsplash preset images)
  if (input.startsWith("http://") || input.startsWith("https://")) {
    try {
      const resp = await fetch(input, {
        headers: {
          "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
        },
      });
      if (!resp.ok) {
        console.warn(`Failed to fetch image URL: status ${resp.status}`);
        return null;
      }
      const arrayBuffer = await resp.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);
      const headerMime = resp.headers.get("content-type");
      const mimeType = headerMime ? headerMime.split(";")[0].trim() : fallbackMime;
      return {
        data: buffer.toString("base64"),
        mimeType: mimeType || fallbackMime,
      };
    } catch (err) {
      console.warn("Failed to fetch image URL for Gemini analysis:", err);
      return null;
    }
  }

  // Case 2: Data URI (e.g. data:image/png;base64,...)
  let mimeType = fallbackMime;
  if (input.startsWith("data:")) {
    const commaIdx = input.indexOf(",");
    if (commaIdx !== -1) {
      const meta = input.substring(5, commaIdx);
      const mime = meta.split(";")[0].trim();
      if (mime) mimeType = mime;
      const base64Data = input.substring(commaIdx + 1).replace(/\s+/g, "");
      return {
        data: base64Data,
        mimeType,
      };
    }
  }

  // Case 3: Raw base64 string
  const clean = input.replace(/\s+/g, "");
  return {
    data: clean,
    mimeType: fallbackMime,
  };
}

let aiClient: GoogleGenAI | null = null;
function getAI(): GoogleGenAI | null {
  if (!aiClient && process.env.GEMINI_API_KEY) {
    aiClient = new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY,
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build",
        },
      },
    });
  }
  return aiClient;
}

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json({ limit: "25mb" }));

  // API Endpoints
  app.get("/api/health", (_req, res) => {
    res.json({
      status: "ok",
      app: "CleanCircle",
      location: "Chittoor, Andhra Pradesh",
      aiAvailable: Boolean(process.env.GEMINI_API_KEY),
    });
  });

  // AI Waste Analysis Endpoint
  app.post("/api/analyze-waste", async (req, res) => {
    try {
      const { imageBase64, mimeType, description, location } = req.body;
      const ai = getAI();

      if (ai && imageBase64) {
        try {
          const imagePart = await resolveImageForGemini(imageBase64, mimeType || "image/jpeg");
          
          if (imagePart && imagePart.data) {
            const prompt = `You are CleanCircle AI Vision Inspector, an expert civic waste and cleanliness diagnostics system for municipal and neighborhood environments.

EVALUATION DIRECTIVES:
1. Examine the image carefully. Identify what is physically visible in the image pixels. Do NOT rely on filenames or external assumptions.
2. If the image shows visible garbage, trash, litter, plastic waste, organic waste, debris, dump piles, or choked drainage:
   - Identify the actual waste type/category (e.g., "Plastic Waste & Packaging", "Mixed Municipal Dump", "Organic / Food Waste", "Construction & Demolition Debris", "Hazardous / E-Waste", "Drainage Clog Waste", "Minor Litter").
   - Determine severity:
     * "Low" (a few solitary wrappers, cups, or stray bottles)
     * "Moderate" (clustered bags, bin overflow, or medium dump pile)
     * "High" (large roadside dump heap, bulk waste piles, spread trash)
     * "Critical" (burning waste, toxic/chemical hazard, or severely choked major storm drain)
   - "isCleanOrNoIssue": false
   - "estimatedVolume": Practical estimate (e.g. "1-3 scattered items", "Small bag / bucket volume", "1-2 sacks", "Large open dump heap")
   - "wasteComposition": Array containing items visibly seen in the image (e.g. ["plastic bottles", "polythene bags", "snack wrappers"])
   - "drainageRisk": Specific risk if drain/gutter/canal is visible near waste, otherwise "No visible drainage hazard in view"
   - "pestRisk": Specific risk if decaying food, stagnant water, or pests visible, otherwise "Low"
   - "recommendedAction": Practical instructions for municipal sanitation route or community collection
   - "responsibleAdvice": Relevant waste segregation or civic habit tip
   - "visualEvidenceSummary": Clear sentence describing what visual waste was detected
   - "ecoPointsReward": number (25 to 40 based on severity)
3. If the image shows a clean, orderly street, building, corridor, park, pathway, or natural environment with NO visible garbage, dumping, or waste hazard:
   - "category": "No Issue Detected"
   - "severity": "None"
   - "isCleanOrNoIssue": true
   - "estimatedVolume": "None (Clean Area)"
   - "wasteComposition": []
   - "drainageRisk": "None - No drain blockage visible"
   - "pestRisk": "None - Clean environment"
   - "recommendedAction": "No cleanup required. The area is visibly clean and well-maintained."
   - "responsibleAdvice": "Maintain neighborhood cleanliness through daily segregation."
   - "visualEvidenceSummary": "The image shows a clean, orderly area with no visible waste accumulation."
   - "ecoPointsReward": 15
4. If the image is too blurry, dark, or ambiguous to determine whether waste exists:
   - "category": "Unable to confidently identify"
   - "severity": "Low"
   - "isCleanOrNoIssue": false
   - "estimatedVolume": "Uncertain"
   - "wasteComposition": []
   - "drainageRisk": "Unable to determine from image"
   - "pestRisk": "Unable to determine from image"
   - "recommendedAction": "Unable to confidently identify waste from this photo. Please upload a clear, well-lit photograph closer to the subject."
   - "responsibleAdvice": "Clear, focused photos ensure sanitation teams accurately locate civic hotspots."
   - "visualEvidenceSummary": "Image quality or lighting is insufficient to identify scene contents."
   - "ecoPointsReward": 10

Location context provided by user: ${location || "Neighborhood area"}
User note: ${description || "None provided"}

Respond strictly with valid JSON conforming to this schema:
{
  "category": string,
  "severity": "None" | "Low" | "Moderate" | "High" | "Critical",
  "estimatedVolume": string,
  "wasteComposition": string[],
  "drainageRisk": string,
  "pestRisk": string,
  "recommendedAction": string,
  "responsibleAdvice": string,
  "ecoPointsReward": number,
  "isCleanOrNoIssue": boolean,
  "visualEvidenceSummary": string
}`;

            let textResult: string | undefined;
            try {
              const response = await ai.models.generateContent({
                model: "gemini-3.1-flash-lite",
                contents: [
                  {
                    role: "user",
                    parts: [
                      {
                        inlineData: {
                          data: imagePart.data,
                          mimeType: imagePart.mimeType,
                        },
                      },
                      { text: prompt },
                    ],
                  },
                ],
                config: {
                  responseMimeType: "application/json",
                },
              });
              textResult = response.text;
            } catch (liteErr) {
              console.warn("gemini-3.1-flash-lite call failed, trying fallback:", liteErr);
              const fallbackResponse = await ai.models.generateContent({
                model: "gemini-3.7-flash",
                contents: [
                  {
                    role: "user",
                    parts: [
                      {
                        inlineData: {
                          data: imagePart.data,
                          mimeType: imagePart.mimeType,
                        },
                      },
                      { text: prompt },
                    ],
                  },
                ],
                config: {
                  responseMimeType: "application/json",
                },
              });
              textResult = fallbackResponse.text;
            }

            if (textResult) {
              const parsed = JSON.parse(textResult);
              return res.json({ success: true, analysis: parsed, source: "gemini-ai" });
            }
          }
        } catch (geminiErr) {
          console.warn("Gemini vision analysis failed:", geminiErr);
        }
      }

      // Offline / network fallback: return clear notice rather than guessing
      return res.json({
        success: true,
        analysis: {
          category: "Unable to confidently identify",
          severity: "Low",
          estimatedVolume: "Uncertain",
          wasteComposition: [],
          drainageRisk: "Unable to determine (Offline mode)",
          pestRisk: "Unable to determine (Offline mode)",
          recommendedAction: "AI Vision analysis could not connect. Please check network connectivity and try again.",
          responsibleAdvice: "Clear photos help sanitation teams prioritize collection.",
          ecoPointsReward: 10,
          isCleanOrNoIssue: false,
          visualEvidenceSummary: "Analysis could not be completed via AI service.",
        },
        source: "offline-fallback",
      });
    } catch (err: any) {
      console.error("AI waste analysis error:", err);
      return res.status(500).json({ error: "Failed to analyze waste image" });
    }
  });

  // AI Smart Disposal Advice / Query Endpoint
  app.post("/api/disposal-advice", async (req, res) => {
    try {
      const { query } = req.body;
      const ai = getAI();

      if (ai && query) {
        try {
          const response = await ai.models.generateContent({
            model: "gemini-3.7-flash",
            contents: `You are an expert civic waste auditor for India (Chittoor, AP context). 
Explain how to properly dispose of or recycle this item: "${query}".
Return valid JSON with keys:
{
  "item": "${query}",
  "category": "Wet Waste" | "Dry Recyclable" | "E-Waste" | "Sanitary / Hazardous" | "Bulky / Yard",
  "binColor": "Green (Wet)" | "Blue (Dry)" | "Red (Hazardous)" | "Special Drop-off",
  "steps": ["Step 1", "Step 2", "Step 3"],
  "commonMistake": "What people usually do wrong",
  "environmentalImpact": "Why correct disposal protects groundwater and drainage"
}`,
            config: {
              responseMimeType: "application/json",
            },
          });
          const text = response.text;
          if (text) {
            return res.json({ success: true, guide: JSON.parse(text) });
          }
        } catch (e) {
          console.warn("AI disposal advice error:", e);
        }
      }

      // Fallback smart guide
      res.json({
        success: true,
        guide: {
          item: query || "Household Waste",
          category: "Dry Recyclable",
          binColor: "Blue (Dry)",
          steps: [
            "Clean and rinse to remove food residue or grease",
            "Flatten plastic bottles or cartons to save storage space",
            "Store in a dry bag and hand over to the doorstep municipal dry-waste collector",
          ],
          commonMistake: "Mixing wet vegetable peels with dry plastic, making the recyclables dirty and non-recyclable.",
          environmentalImpact: "Proper dry segregation keeps plastic out of stormwater drains and minimizes landfill dumping.",
        },
      });
    } catch (error: any) {
      res.status(500).json({ error: "Could not generate disposal guide" });
    }
  });

  // Vite development middleware
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (_req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`CleanCircle server active on http://0.0.0.0:${PORT}`);
  });
}

startServer();
