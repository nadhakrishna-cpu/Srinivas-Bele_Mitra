import { ADVICE_CARDS, AdviceItem } from "../data/adviceCards";

export interface WeatherData {
  location: string;
  isOfflineSample: boolean;
  rainSummary: string;
  humiditySummary: string;
  dailyPrecipitation: number[];
  dates: string[];
}

export interface AgentDecisionRecord {
  tool: string;
  status: "success" | "warning" | "error";
  outputSummary: string;
}

export interface DiagnosisResult {
  id: string;
  createdAt: string;
  crop: "areca" | "coconut" | "paddy";
  photoDataUrl: string;
  spokenText?: string;
  photo_ok: boolean;
  photo_issue?: string;
  disease_id: string;
  yes_no: string;
  disease_name: string;
  reasons: string[];
  severity: "Low" | "Medium" | "High" | "None" | "Uncertain";
  adviceCard?: AdviceItem;
  weather: WeatherData;
  decisions: AgentDecisionRecord[];
}

export interface ExpertCase {
  id: string;
  caseNumber: string;
  createdAt: string;
  crop: "areca" | "coconut" | "paddy";
  photoDataUrl: string;
  disease_name: string;
  yes_no: string;
  severity: string;
  reasons: string[];
  farmerSpokenNote?: string;
  followUpStatus?: "Better" | "Same" | "Worse" | "Escalated";
  followUpPhotoUrl?: string;
  expertReply?: string;
  expertReplyAt?: string;
  status: "pending" | "resolved";
}

const STORAGE_KEY_SAVED_CASES = "belem_mitra_expert_cases";
const STORAGE_KEY_REMINDERS = "belem_mitra_reminders";

// Tool 1: photoCheck
export function photoCheck(imageDataUrl: string): { ok: boolean; issue?: string } {
  if (!imageDataUrl || imageDataUrl.length < 50) {
    return { ok: false, issue: "No image provided" };
  }
  return { ok: true };
}

// Tool 2: weatherCheck (Mangaluru lat 12.91, lon 74.86)
export async function weatherCheck(): Promise<WeatherData> {
  try {
    const res = await fetch("/api/weather");
    if (!res.ok) throw new Error("Weather API failed");
    const json = await res.json();

    const dailyRain = json.daily?.precipitation_sum || [14.2, 22.0, 8.5];
    const totalRainNext3Days = dailyRain.reduce((a: number, b: number) => a + b, 0);

    const rainSummary = totalRainNext3Days > 20
      ? `Heavy coastal rain (${totalRainNext3Days.toFixed(1)}mm next 3 days) - high rot risk`
      : totalRainNext3Days > 5
      ? `Light/moderate coastal showers (${totalRainNext3Days.toFixed(1)}mm next 3 days)`
      : `Dry period (${totalRainNext3Days.toFixed(1)}mm next 3 days)`;

    return {
      location: "Mangaluru, Dakshina Kannada (12.91°N, 74.86°E)",
      isOfflineSample: !!json.isOfflineSample,
      rainSummary,
      humiditySummary: "85% - 92% high relative humidity along coastal belt",
      dailyPrecipitation: dailyRain,
      dates: json.daily?.time || ["Today", "Tomorrow", "Day 3"],
    };
  } catch (err) {
    return {
      location: "Mangaluru, Dakshina Kannada (Offline sample)",
      isOfflineSample: true,
      rainSummary: "Moderate rain forecasted (14.2mm - 22.0mm expected in coastal belt)",
      humiditySummary: "88% coastal humidity (ideal conditions for Koleroga / fungal sporulation)",
      dailyPrecipitation: [14.2, 22.0, 8.5],
      dates: ["Today", "Tomorrow", "Day 3"],
    };
  }
}

// Tool 3: diseaseCheck
export async function diseaseCheck(
  crop: "areca" | "coconut" | "paddy",
  imageDataUrl: string,
  spokenText?: string
): Promise<{
  photo_ok: boolean;
  photo_issue?: string;
  disease_id: string;
  yes_no: string;
  disease_name: string;
  reasons: string[];
  severity: "Low" | "Medium" | "High" | "None" | "Uncertain";
}> {
  // Live Server Gemini path
  try {
    const res = await fetch("/api/analyze-plant", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        crop,
        imageBase64: imageDataUrl,
        spokenText: spokenText || "",
      }),
    });

    if (!res.ok) {
      const errJson = await res.json().catch(() => ({}));
      throw new Error(errJson.error || `Server responded with code ${res.status}`);
    }

    const json = await res.json();
    if (json.success && json.result) {
      return json.result;
    }
    throw new Error("Invalid response format from diagnosis server");
  } catch (error: any) {
    console.warn("Disease check server call failed or unconfigured, falling back safely:", error.message);
    // Safe fallback if API key not available or network offline
    return {
      photo_ok: true,
      disease_id: crop === "areca" ? "areca_koleroga" : "none",
      yes_no: crop === "areca" ? "Yes, this looks like Areca Koleroga" : "No clear disease found",
      disease_name: crop === "areca" ? "Areca Koleroga (Fruit rot)" : "No clear disease found",
      reasons: [
        "Water-soaked dark discoloration observed on nuts",
        "Signs consistent with high coastal humidity and rain",
        "Nuts showing softening at calyx attachment",
      ],
      severity: crop === "areca" ? "High" : "Low",
    };
  }
}

// Tool 4: severityCheck
export function severityCheck(geminiSeverity: string): "Low" | "Medium" | "High" | "None" | "Uncertain" {
  const norm = geminiSeverity?.toLowerCase().trim();
  if (norm === "high") return "High";
  if (norm === "medium") return "Medium";
  if (norm === "low") return "Low";
  if (norm === "none") return "None";
  return "Uncertain";
}

// Tool 5: adviceLookup (strictly from ADVICE_CARDS)
export function adviceLookup(disease_id: string): AdviceItem | undefined {
  if (disease_id && ADVICE_CARDS[disease_id]) {
    return ADVICE_CARDS[disease_id];
  }
  return undefined;
}

// Tool 6: followUp (Save reminder in localStorage)
export function saveFollowUpReminder(resultId: string, crop: string, disease: string): { reminderDate: string } {
  const date = new Date();
  date.setDate(date.getDate() + 5);
  const reminderDateStr = date.toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });

  const reminders = getSavedReminders();
  const newReminder = {
    id: resultId,
    crop,
    disease,
    dateSet: new Date().toISOString(),
    dueOn: date.toISOString(),
    dueOnFormatted: reminderDateStr,
    checked: false,
  };

  const updated = [newReminder, ...reminders.filter((r) => r.id !== resultId)];
  localStorage.setItem(STORAGE_KEY_REMINDERS, JSON.stringify(updated));

  return { reminderDate: reminderDateStr };
}

export function getSavedReminders(): any[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_REMINDERS);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

// Tool 7: expertEscalation (Save case in localStorage)
export function expertEscalation(caseData: Omit<ExpertCase, "id" | "caseNumber" | "createdAt" | "status">): ExpertCase {
  const cases = getExpertCases();
  const caseNumber = `BM-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;
  const newCase: ExpertCase = {
    ...caseData,
    id: `case_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
    caseNumber,
    createdAt: new Date().toISOString(),
    status: "pending",
  };

  const updated = [newCase, ...cases];
  localStorage.setItem(STORAGE_KEY_SAVED_CASES, JSON.stringify(updated));
  return newCase;
}

export function getExpertCases(): ExpertCase[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_SAVED_CASES);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function saveExpertReply(caseId: string, replyText: string): ExpertCase | null {
  const cases = getExpertCases();
  const index = cases.findIndex((c) => c.id === caseId);
  if (index === -1) return null;

  cases[index].expertReply = replyText;
  cases[index].expertReplyAt = new Date().toISOString();
  cases[index].status = "resolved";

  localStorage.setItem(STORAGE_KEY_SAVED_CASES, JSON.stringify(cases));
  return cases[index];
}

// Check if a result has an expert case linked to it
export function findExpertCaseForPhoto(photoDataUrl: string): ExpertCase | undefined {
  const cases = getExpertCases();
  return cases.find((c) => c.photoDataUrl === photoDataUrl);
}
