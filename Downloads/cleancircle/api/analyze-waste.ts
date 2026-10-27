import { GoogleGenAI } from "@google/genai";

export default async function handler(req: any, res: any) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { imageBase64, mimeType, description, location } = req.body || {};

    if (!process.env.GEMINI_API_KEY) {
      return res.status(500).json({
        error: "GEMINI_API_KEY is not configured.",
      });
    }

    if (!imageBase64 || typeof imageBase64 !== "string") {
      return res.status(400).json({
        error: "Please provide an image.",
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

    const ai = new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY,
    });

    const prompt = `
You are CleanCircle, an AI waste identification assistant.

Analyze the supplied image carefully. Identify only what is visually supported.

Classify the scene as one of:
- Plastic Waste & Packaging
- Mixed Municipal Dump
- Organic / Food Waste
- Construction & Demolition Debris
- Hazardous / E-Waste
- Drainage Clog Waste
- Minor Litter
- No Issue Detected
- Unable to confidently identify

Consider the user's description and location:
Location: ${location || "Not provided"}
Description: ${description || "Not provided"}

Return valid JSON with these exact fields:
{
  "category": "string",
  "severity": "None, Low, Moderate, High, or Critical",
  "estimatedVolume": "string",
  "wasteComposition": ["string"],
  "drainageRisk": "string",
  "pestRisk": "string",
  "recommendedAction": "string",
  "responsibleAdvice": "string",
  "ecoPointsReward": 10,
  "isCleanOrNoIssue": false,
  "visualEvidenceSummary": "string"
}

If the image clearly shows waste, describe its type, amount, risks, and cleanup action.
If the scene is clean, use category "No Issue Detected", severity "None", and isCleanOrNoIssue true.
If the image is genuinely unclear, explain why in visualEvidenceSummary.
Do not label an image unclear merely because the waste is small.
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

    if (!response.text) {
      throw new Error("Gemini returned an empty response.");
    }

    const analysis = JSON.parse(response.text);

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
