import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";
import { GoogleGenAI, Type } from "@google/genai";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const isProd = process.env.NODE_ENV === "production";
const PORT = Number(process.env.PORT || 3000);

async function startServer() {
  const app = express();
  app.use(express.json({ limit: "25mb" }));

  // Shared Gemini client utility on the server with User-Agent
  const apiKey = process.env.GEMINI_API_KEY;
  const ai = apiKey
    ? new GoogleGenAI({
        apiKey,
        httpOptions: {
          headers: {
            "User-Agent": "aistudio-build",
          },
        },
      })
    : null;

  // Gemini vision plant diagnosis API
  app.post("/api/analyze-plant", async (req, res) => {
    try {
      const { imageBase64, mimeType = "image/jpeg", crop = "areca", spokenText = "" } = req.body;

      if (!imageBase64) {
        return res.status(400).json({ error: "No image provided" });
      }

      if (!ai) {
        return res.status(503).json({
          error: "GEMINI_API_KEY is not configured on the server. Please check environment configuration.",
        });
      }

      // Clean base64 string
      const cleanBase64 = imageBase64.replace(/^data:image\/[a-zA-Z0-9.+-]+;base64,/, "");

      const prompt = `You are a plant pathology expert for small farmers in Dakshina Kannada, Karnataka, India.
The crop is: ${crop}.
${spokenText ? `The farmer spoke this note: "${spokenText}"` : ""}

Inspect the plant photo carefully:
1. photo_ok: boolean. Set to false if the image is too blurry, too dark, out of focus, or taken too far away to see plant tissue clearly. If false, state reason in photo_issue ("blurry", "too dark", or "too far").
2. disease_id: STRICTLY choose one of:
   - "areca_koleroga" (if areca palm fruit rot/koleroga, water soaked spots, rotting nuts)
   - "areca_yellow_leaf" (if areca palm yellow leaf disease, yellowing and drying leaves)
   - "coconut_bud_rot" (if coconut palm bud rot, rotting pale heart leaf)
   - "paddy_blast" (if rice paddy blast, spindle/diamond spots with grey center)
   - "none" (if plant appears clearly healthy or without major disease symptoms)
   - "unsure" (if symptoms are ambiguous, unclear, or outside these common regional crop diseases)
3. yes_no:
   - If disease detected: "Yes, this looks like [Disease Name]" (e.g., "Yes, this looks like Koleroga (Fruit rot)")
   - If healthy: "No clear disease found"
   - If unsure or photo_ok is false: "Not sure. Please retake the photo or ask an expert"
4. reasons: 2 to 4 very short, simple bullet reasons (under 12 words each) based STRICTLY on what is visible in the photo (colour, spots, rot, wetness, lesions).
5. severity: choose one of "Low", "Medium", "High", or "None".

Output JSON strictly matching the schema.`;

      const response = await ai.models.generateContent({
        model: "gemini-3.8-flash",
        contents: {
          parts: [
            {
              inlineData: {
                mimeType,
                data: cleanBase64,
              },
            },
            {
              text: prompt,
            },
          ],
        },
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              photo_ok: {
                type: Type.BOOLEAN,
                description: "True if image clarity is sufficient for diagnosis, false if blurry, dark, or too far.",
              },
              photo_issue: {
                type: Type.STRING,
                description: "Issue description if photo_ok is false, or empty string.",
              },
              disease_id: {
                type: Type.STRING,
                description: "One of: areca_koleroga, areca_yellow_leaf, coconut_bud_rot, paddy_blast, none, unsure",
              },
              yes_no: {
                type: Type.STRING,
                description: "Direct large answer: Yes, this looks like [disease] OR No clear disease found OR Not sure. Please retake the photo or ask an expert",
              },
              disease_name: {
                type: Type.STRING,
                description: "Common disease name in English, e.g. Koleroga (Fruit rot), Yellow Leaf Disease, Bud Rot, Paddy Blast, or Healthy",
              },
              reasons: {
                type: Type.ARRAY,
                items: { type: Type.STRING },
                description: "2 to 4 short visible reasons",
              },
              severity: {
                type: Type.STRING,
                description: "Low, Medium, High, or None",
              },
            },
            required: ["photo_ok", "disease_id", "yes_no", "reasons", "severity"],
          },
        },
      });

      const text = response.text?.trim() || "{}";
      const parsed = JSON.parse(text);

      return res.json({
        success: true,
        result: parsed,
      });
    } catch (err: any) {
      console.error("Gemini diagnosis error:", err);
      return res.status(500).json({
        error: err.message || "Failed to analyze photo with Gemini AI",
      });
    }
  });

  // Open-Meteo weather proxy with automatic offline sample fallback for Mangaluru (lat 12.91, lon 74.86)
  app.get("/api/weather", async (_req, res) => {
    try {
      const url = "https://api.open-meteo.com/v1/forecast?latitude=12.91&longitude=74.86&daily=precipitation_sum,precipitation_probability_max,temperature_2m_max,temperature_2m_min&hourly=relative_humidity_2m&timezone=Asia%2FKolkata&forecast_days=3";
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 4000);

      const response = await fetch(url, { signal: controller.signal });
      clearTimeout(timeoutId);

      if (!response.ok) {
        throw new Error(`Open-Meteo returned status ${response.status}`);
      }

      const data = await response.json();
      return res.json({
        success: true,
        isOfflineSample: false,
        location: "Mangaluru, Dakshina Kannada",
        daily: data.daily,
        hourly: data.hourly,
      });
    } catch (err: any) {
      console.warn("Open-Meteo failed, returning offline sample weather for Mangaluru:", err?.message);
      return res.json({
        success: true,
        isOfflineSample: true,
        location: "Mangaluru, Dakshina Kannada",
        daily: {
          time: ["Today", "Tomorrow", "Day 3"],
          precipitation_sum: [14.2, 22.0, 8.5],
          precipitation_probability_max: [80, 95, 65],
          temperature_2m_max: [30.5, 29.8, 31.0],
          temperature_2m_min: [24.0, 23.5, 24.2],
        },
        sampleSummary: {
          rainForecast: "Moderate to heavy coastal rain expected (80%-95% probability)",
          humidityAverage: "88% high relative humidity (conducive to fungal rot)",
        },
      });
    }
  });

  if (!isProd) {
    const { createServer: createViteServer } = await import("vite");
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, "dist")));
    app.get("*", (_req, res) => {
      res.sendFile(path.resolve(__dirname, "dist", "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Bele Mitra server running on http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error("Failed to start Bele Mitra server:", err);
  process.exit(1);
});
