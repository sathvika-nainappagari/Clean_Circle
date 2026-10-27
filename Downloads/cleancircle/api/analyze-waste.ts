import { GoogleGenAI } from "@google/genai";

export default async function handler(req: any, res: any) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { imageBase64, mimeType, description, location } = req.body || {};

    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
      return res.status(500).json({
        error: "GEMINI_API_KEY is not configured.",
      });
    }

    if (!imageBase64 || typeof imageBase64 !== "string") {
      return res.status(400).json({
        error: "Please provide an image.",
      });
    }

    let imageData: string;
    let imageMimeType = mimeType || "image/jpeg";

    if (/^https?:\/\//i.test(imageBase64)) {
      // Download images supplied as URLs.
      const imageResponse = await fetch(imageBase64);

      if (!imageResponse.ok) {
        throw new Error(
          `Could not download image. HTTP status: ${imageResponse.status}`
        );
      }

      const contentType = imageResponse.headers.get("content-type") || "";
      imageMimeType = contentType.split(";")[0] || imageMimeType;

      if (!imageMimeType.startsWith("image/")) {
        throw new Error("The supplied URL did not return an image.");
      }

      const imageBuffer = Buffer.from(await imageResponse.arrayBuffer());
      imageData = imageBuffer.toString("base64");
    } else {
      // Handle Base64 strings and data URLs.
      imageData = imageBase64;

      if (imageData.startsWith("data:")) {
        const commaIndex = imageData.indexOf(",");

        if (commaIndex === -1) {
          throw new Error("Invalid image data URL.");
        }

        const metadata = imageData.substring(5, commaIndex);
        imageMimeType = metadata.split(";")[0] || imageMimeType;
        imageData = imageData.substring(commaIndex + 1);
      }

      imageData = imageData.replace(/\s/g, "");
    }

    const ai = new GoogleGenAI({ apiKey });

    const prompt = `
You are CleanCircle, an AI waste identification assistant.

Analyze the supplied image carefully. Identify only what is visually supported.

Choose an appropriate category:
- Plastic Waste & Packaging
- Mixed Municipal Dump
- Organic / Food Waste
- Construction & Demolition Debris
- Hazardous / E-Waste
- Drainage Clog Waste
- Minor Litter
- No Issue Detected
- Unable to confidently identify

Location: ${location || "Not provided"}
User description: ${description || "Not provided"}

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

Describe visible waste, its approximate amount, potential risks, and cleanup action.
If the scene is clean, use category "No Issue Detected", severity "None",
and isCleanOrNoIssue true.
Only use "Unable to confidently identify" when the image genuinely does
not provide enough visual evidence.
Do not invent details that cannot be seen.
`;

    const response = await ai.models.generateContent({
      model: "gemini-3.8-flash",
      contents: [
        {
          role: "user",
          parts: [
            {
              inlineData: {
                data: imageData,
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
