import { GoogleGenAI } from "@google/genai";
import type { VercelRequest, VercelResponse } from "@vercel/node";

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY || "",
});

export default async function handler(
  req: VercelRequest,
  res: VercelResponse
) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { imageBase64, mimeType, description, location } = req.body || {};

    if (!process.env.GEMINI_API_KEY) {
      return res.status(500).json({
        error: "Gemini API key is not configured on the server.",
      });
    }

    if (!imageBase64 || typeof imageBase64 !== "string") {
      return res.status(400).json({
        error: "Please provide an image to analyze.",
      });
    }

    let imageData = imageBase64;
    let imageMimeType = mimeType || "image/jpeg";

    if (imageData.startsWith("data:")) {
      const commaIndex = imageData.indexOf(",");
      if (commaIndex !== -1) {
        const metadata = imageData.substring(5, commaIndex);
        imageMimeType = metadata.split(";")[0] || imageMimeType;
        imageData = imageData.substring(commaIndex + 1);
      }
    }

    const prompt = `
You are CleanCircle, an AI waste identification assistant for India.

Carefully inspect the supplied image. Identify only what is visually supported.

Classify the scene as:
- Plastic Waste & Packaging
- Mixed Municipal Dump
- Organic / Food Waste
- Construction & Demolition Debris
- Hazardous / E-Waste
- Drainage Clog Waste
- Minor Litter
- No Issue Detected
- Unable to confidently identify

If visible waste exists, describe its type, approximate quantity, severity, risks, and recommended cleanup action.
If the scene is clean, report no issue.
Only use "Unable to confidently identify" if the image is genuinely too unclear to assess.

Location: ${location || "Neighborhood area"}
User description: ${description || "None provided"}

Return valid JSON with exactly these fields:
{
  "category": "string",
  "severity": "None, Low, Moderate, High, or Critical",
  "estimatedVolume": "string",
  "wasteComposition": ["string"],
  "drainageRisk": "string",
  "pestRisk": "string",
  "recommendedAction": "string",
  "responsibleAdvice": "string",
  "ecoPointsReward": 25,
  "isCleanOrNoIssue": false,
  "visualEvidenceSummary": "string"
}

For waste, use severity Low, Moderate, High, or Critical as appropriate.
For a clean scene, use severity None and ecoPointsReward 15.
For a genuinely unclear image, use severity Low and ecoPointsReward 10.
`;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: [
        {
          role: "user",
          parts: [
            {
              inlineData: {
                data: imageData.replace(/\s/g, ""),
                mimeType: imageMimeType,
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

    const resultText = response.text;

    if (!resultText) {
      throw new Error("Gemini returned an empty response.");
    }

    const analysis = JSON.parse(resultText);

    return res.status(200).json({
      success: true,
      analysis,
      source: "gemini-ai",
    });
  } catch (error) {
    console.error("Waste analysis failed:", error);

    return res.status(500).json({
      error: "Waste analysis failed. Please try again.",
    });
  }
}
