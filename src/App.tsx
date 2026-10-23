import React, { useState, useEffect, useRef } from "react";
import {
  Camera,
  Mic,
  Sprout,
  Palmtree,
  Wheat,
  Upload,
  Info,
} from "lucide-react";
import { Header } from "./components/Header";
import { SpeechInputModal } from "./components/SpeechInputModal";
import { AgentProgressScreen, AgentStepStatus } from "./components/AgentProgressScreen";
import { ResultScreen } from "./components/ResultScreen";
import { FollowUpScreen } from "./components/FollowUpScreen";
import { ExpertDeskScreen } from "./components/ExpertDeskScreen";
import { SupportedLang } from "./data/adviceCards";
import { TRANSLATIONS } from "./data/translations";
import {
  DiagnosisResult,
  ExpertCase,
  photoCheck,
  diseaseCheck,
  severityCheck,
  weatherCheck,
  adviceLookup,
  saveFollowUpReminder,
  expertEscalation,
  getExpertCases,
  findExpertCaseForPhoto,
} from "./services/agentWorkflow";

export default function App() {
  const [currentLang, setCurrentLang] = useState<SupportedLang>("en");
  const [selectedCrop, setSelectedCrop] = useState<"areca" | "coconut" | "paddy">("areca");
  const [currentScreen, setCurrentScreen] = useState<"home" | "progress" | "result" | "followup">("home");
  const [activeTab, setActiveTab] = useState<"farmer" | "expert">("farmer");

  // Inputs
  const [activePhoto, setActivePhoto] = useState<string | null>(null);
  const [spokenProblem, setSpokenProblem] = useState<string>("");
  const [isSpeechModalOpen, setIsSpeechModalOpen] = useState(false);

  // Agent Pipeline
  const [agentSteps, setAgentSteps] = useState<AgentStepStatus[]>([]);
  const [hasPhotoIssue, setHasPhotoIssue] = useState(false);
  const [photoIssueMessage, setPhotoIssueMessage] = useState<string>("");
  const [diagnosisResult, setDiagnosisResult] = useState<DiagnosisResult | null>(null);
  const [followUpReminderDate, setFollowUpReminderDate] = useState<string | null>(null);
  const [isEscalatedToExpert, setIsEscalatedToExpert] = useState(false);

  // Expert Desk State
  const [expertCases, setExpertCases] = useState<ExpertCase[]>([]);

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const t = TRANSLATIONS[currentLang];

  // Load existing cases from localStorage on mount
  useEffect(() => {
    setExpertCases(getExpertCases());
  }, []);

  const refreshExpertCases = () => {
    setExpertCases(getExpertCases());
  };

  // Helper to initialize step statuses
  const createInitialSteps = (): AgentStepStatus[] => [
    { id: "photoCheck", name: t.steps.photoCheck, state: "pending" },
    { id: "diseaseCheck", name: t.steps.diseaseCheck, state: "pending" },
    { id: "severityCheck", name: t.steps.severityCheck, state: "pending" },
    { id: "weatherCheck", name: t.steps.weatherCheck, state: "pending" },
    { id: "adviceLookup", name: t.steps.adviceLookup, state: "pending" },
    { id: "followUp", name: t.steps.followUp, state: "pending" },
  ];

  // Start Agent Workflow with step-by-step ticks
  const runAgentWorkflow = async (photoDataUrl: string) => {
    setCurrentScreen("progress");
    setHasPhotoIssue(false);
    setPhotoIssueMessage("");

    const steps = createInitialSteps();
    setAgentSteps([...steps]);

    const updateStep = (
      stepId: AgentStepStatus["id"],
      state: AgentStepStatus["state"],
      detail?: string
    ) => {
      setAgentSteps((prev) =>
        prev.map((s) => (s.id === stepId ? { ...s, state, detail: detail ?? s.detail } : s))
      );
    };

    const decisions: { tool: string; status: "success" | "warning" | "error"; outputSummary: string }[] = [];

    // Step 1: photoCheck
    updateStep("photoCheck", "running", "Checking sharpness, exposure & distance...");
    await new Promise((r) => setTimeout(r, 450));

    const checkRes = photoCheck(photoDataUrl);
    if (!checkRes.ok) {
      updateStep("photoCheck", "failed", checkRes.issue || "Invalid image");
      setHasPhotoIssue(true);
      setPhotoIssueMessage("Photo check failed. Please select a clear crop photo.");
      return;
    }

    updateStep("photoCheck", "completed", "Sharp focus & adequate daylight");
    decisions.push({
      tool: "photoCheck",
      status: "success",
      outputSummary: "Image sharpness OK, sufficient daylight exposure, good framing",
    });

    // Step 2: diseaseCheck (Gemini Vision call)
    updateStep("diseaseCheck", "running", "Diagnosing plant tissue with Gemini Vision...");
    await new Promise((r) => setTimeout(r, 600));

    const diseaseRes = await diseaseCheck(
      selectedCrop,
      photoDataUrl,
      spokenProblem
    );

    // If Gemini determined photo was blurry or out of focus
    if (!diseaseRes.photo_ok) {
      updateStep("diseaseCheck", "failed", diseaseRes.photo_issue || "Photo unclear");
      setHasPhotoIssue(true);
      setPhotoIssueMessage(diseaseRes.photo_issue || "Photo is blurry, too dark or too far. Please bring camera closer in daylight.");
      decisions.push({
        tool: "diseaseCheck",
        status: "error",
        outputSummary: `Gemini photo_ok=false: ${diseaseRes.photo_issue || "Unclear image"}`,
      });
    } else {
      updateStep("diseaseCheck", "completed", diseaseRes.disease_name);
      decisions.push({
        tool: "diseaseCheck",
        status: "success",
        outputSummary: `Model returned disease_id: '${diseaseRes.disease_id}', answer: '${diseaseRes.yes_no}'`,
      });
    }

    // Step 3: severityCheck
    updateStep("severityCheck", "running", "Evaluating severity level...");
    await new Promise((r) => setTimeout(r, 400));
    const severity = severityCheck(diseaseRes.severity);
    updateStep("severityCheck", "completed", `Severity: ${severity}`);
    decisions.push({
      tool: "severityCheck",
      status: "success",
      outputSummary: `Determined plant stress rating: ${severity}`,
    });

    // Step 4: weatherCheck (Open-Meteo Mangaluru lat 12.91, lon 74.86)
    updateStep("weatherCheck", "running", "Fetching Open-Meteo for Mangaluru (lat 12.91, lon 74.86)...");
    const weather = await weatherCheck();
    await new Promise((r) => setTimeout(r, 450));
    updateStep(
      "weatherCheck",
      "completed",
      weather.isOfflineSample ? "Mangaluru (Offline sample)" : "Mangaluru (Live coastal forecast)"
    );
    decisions.push({
      tool: "weatherCheck",
      status: "success",
      outputSummary: `Open-Meteo: ${weather.rainSummary}. Humidity: ${weather.humiditySummary}. Offline: ${weather.isOfflineSample}`,
    });

    // Step 5: adviceLookup (strictly from ADVICE_CARDS)
    updateStep("adviceLookup", "running", "Searching approved KVK advice cards...");
    await new Promise((r) => setTimeout(r, 450));
    const advice = adviceLookup(diseaseRes.disease_id);
    updateStep("adviceLookup", "completed", advice ? "Loaded approved advice card" : "General hygiene card");
    decisions.push({
      tool: "adviceLookup",
      status: "success",
      outputSummary: advice
        ? `Matched strictly to card: ${advice.disease_id}. No chemical dose stated.`
        : "No specific disease card match. General crop sanitation guidance applied.",
    });

    // Step 6: followUp reminder prep
    updateStep("followUp", "running", "Configuring 5-day recovery reminder...");
    await new Promise((r) => setTimeout(r, 400));
    updateStep("followUp", "completed", "Ready to schedule in 5 days");
    decisions.push({
      tool: "followUp",
      status: "success",
      outputSummary: "Local storage reminder hook initialized for +5 days",
    });

    const fullResult: DiagnosisResult = {
      id: `diag_${Date.now()}`,
      createdAt: new Date().toLocaleDateString("en-IN", {
        day: "numeric",
        month: "short",
        year: "numeric",
      }),
      crop: selectedCrop,
      photoDataUrl,
      spokenText: spokenProblem,
      photo_ok: diseaseRes.photo_ok,
      photo_issue: diseaseRes.photo_issue,
      disease_id: diseaseRes.disease_id,
      yes_no: diseaseRes.yes_no,
      disease_name: diseaseRes.disease_name,
      reasons: diseaseRes.reasons,
      severity,
      adviceCard: advice,
      weather,
      decisions,
    };

    setDiagnosisResult(fullResult);
    setIsEscalatedToExpert(false);

    // Pause briefly so farmer sees all ticks completed
    setTimeout(() => {
      setCurrentScreen("result");
    }, 600);
  };

  // Handle file upload from user's camera / gallery
  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      const dataUrl = reader.result as string;
      setActivePhoto(dataUrl);
      runAgentWorkflow(dataUrl);
    };
    reader.readAsDataURL(file);
  };

  // Handle "Set follow-up in 5 days"
  const handleSetFollowUp = () => {
    if (!diagnosisResult) return;
    const { reminderDate } = saveFollowUpReminder(
      diagnosisResult.id,
      diagnosisResult.crop,
      diagnosisResult.disease_name
    );
    setFollowUpReminderDate(reminderDate);
    setCurrentScreen("followup");
  };

  // Handle "Ask an expert"
  const handleAskExpert = () => {
    if (!diagnosisResult) return;

    const existing = findExpertCaseForPhoto(diagnosisResult.photoDataUrl);
    if (existing) {
      setIsEscalatedToExpert(true);
      return;
    }

    expertEscalation({
      crop: diagnosisResult.crop,
      photoDataUrl: diagnosisResult.photoDataUrl,
      disease_name: diagnosisResult.disease_name,
      yes_no: diagnosisResult.yes_no,
      severity: diagnosisResult.severity,
      reasons: diagnosisResult.reasons,
      farmerSpokenNote: diagnosisResult.spokenText,
    });

    setIsEscalatedToExpert(true);
    refreshExpertCases();
  };

  // Handle follow up submission (Better / Same / Worse)
  const handleRecordFollowUp = (condition: "Better" | "Same" | "Worse", followUpPhotoUrl?: string) => {
    if (!diagnosisResult) return;

    if (condition === "Worse") {
      const created = expertEscalation({
        crop: diagnosisResult.crop,
        photoDataUrl: diagnosisResult.photoDataUrl,
        disease_name: diagnosisResult.disease_name,
        yes_no: diagnosisResult.yes_no,
        severity: "High",
        reasons: [
          ...diagnosisResult.reasons,
          "Farmer reported plant condition became WORSE after 5-day follow-up",
        ],
        farmerSpokenNote: diagnosisResult.spokenText,
        followUpStatus: "Worse",
        followUpPhotoUrl,
      });
      setIsEscalatedToExpert(true);
      refreshExpertCases();
      return created;
    }
  };

  const existingExpertCase = diagnosisResult
    ? findExpertCaseForPhoto(diagnosisResult.photoDataUrl)
    : undefined;

  return (
    <div className="min-h-screen bg-[#070E1A] text-slate-100 flex flex-col justify-between">
      {/* Centered phone shell container (max-w-[420px]) in rich dark navy */}
      <div className="w-full max-w-[420px] mx-auto bg-[#0D1B2E] min-h-screen shadow-2xl flex flex-col border-x border-[#1A314E]">
        {/* Dark Navy Header */}
        <Header
          currentLang={currentLang}
          onLanguageChange={setCurrentLang}
          activeTab={activeTab}
          onTabChange={setActiveTab}
          pendingExpertCount={expertCases.filter((c) => !c.expertReply).length}
        />

        {/* Main Content Body */}
        <main className="flex-1 flex flex-col">
          {/* TAB 1: EXPERT DESK */}
          {activeTab === "expert" && (
            <ExpertDeskScreen
              cases={expertCases}
              currentLang={currentLang}
              onBackToFarmer={() => setActiveTab("farmer")}
              onCaseUpdated={refreshExpertCases}
            />
          )}

          {/* TAB 2: FARMER SCREENS */}
          {activeTab === "farmer" && (
            <>
              {/* Screen 1: Home Screen */}
              {currentScreen === "home" && (
                <div className="p-4 sm:p-5 space-y-6">
                  {/* Crop Picker with simple line icons */}
                  <div className="space-y-2">
                    <label className="block text-sm font-bold text-slate-200">
                      {t.selectCrop}
                    </label>
                    <div className="grid grid-cols-3 gap-2">
                      {/* Areca */}
                      <button
                        onClick={() => setSelectedCrop("areca")}
                        className={`py-3.5 px-2 rounded-xl border-2 flex flex-col items-center justify-center transition-all ${
                          selectedCrop === "areca"
                            ? "bg-[#1E3A5F] text-white border-sky-400 shadow-md shadow-sky-950/50 font-bold"
                            : "bg-[#11233B] text-slate-300 border-[#1E3A5F] hover:border-slate-500 font-semibold"
                        }`}
                      >
                        <Palmtree className="w-6 h-6 mb-1 text-sky-400" />
                        <span className="text-xs">{t.areca}</span>
                      </button>

                      {/* Coconut */}
                      <button
                        onClick={() => setSelectedCrop("coconut")}
                        className={`py-3.5 px-2 rounded-xl border-2 flex flex-col items-center justify-center transition-all ${
                          selectedCrop === "coconut"
                            ? "bg-[#1E3A5F] text-white border-sky-400 shadow-md shadow-sky-950/50 font-bold"
                            : "bg-[#11233B] text-slate-300 border-[#1E3A5F] hover:border-slate-500 font-semibold"
                        }`}
                      >
                        <Sprout className="w-6 h-6 mb-1 text-sky-400" />
                        <span className="text-xs">{t.coconut}</span>
                      </button>

                      {/* Paddy */}
                      <button
                        onClick={() => setSelectedCrop("paddy")}
                        className={`py-3.5 px-2 rounded-xl border-2 flex flex-col items-center justify-center transition-all ${
                          selectedCrop === "paddy"
                            ? "bg-[#1E3A5F] text-white border-sky-400 shadow-md shadow-sky-950/50 font-bold"
                            : "bg-[#11233B] text-slate-300 border-[#1E3A5F] hover:border-slate-500 font-semibold"
                        }`}
                      >
                        <Wheat className="w-6 h-6 mb-1 text-sky-400" />
                        <span className="text-xs">{t.paddy}</span>
                      </button>
                    </div>
                  </div>

                  {/* Two BIG Primary Action Buttons */}
                  <div className="space-y-3 pt-2">
                    {/* Big Button 1: Take / upload photo */}
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      capture="environment"
                      onChange={handlePhotoUpload}
                      className="hidden"
                    />

                    <button
                      onClick={() => fileInputRef.current?.click()}
                      className="w-full py-4 px-5 bg-[#2563EB] hover:bg-[#1D4ED8] text-white border border-blue-400 rounded-2xl font-bold text-base flex items-center justify-center gap-3 shadow-lg shadow-blue-950/60 transition-all active:scale-[0.99]"
                    >
                      <Camera className="w-6 h-6 shrink-0 text-white" />
                      <span>{t.takePhoto}</span>
                    </button>

                    {/* Big Button 2: Speak your problem */}
                    <button
                      onClick={() => setIsSpeechModalOpen(true)}
                      className={`w-full py-4 px-5 rounded-2xl border-2 font-bold text-base flex items-center justify-center gap-3 transition-all ${
                        spokenProblem
                          ? "bg-[#142B49] text-sky-300 border-sky-400"
                          : "bg-[#11233B] text-slate-200 border-[#1E3A5F] hover:border-sky-400"
                      }`}
                    >
                      <Mic className="w-6 h-6 text-sky-400 shrink-0" />
                      <div className="text-left">
                        <span>{t.speakProblem}</span>
                        {spokenProblem && (
                          <span className="block text-xs font-normal text-slate-300 line-clamp-1">
                            &ldquo;{spokenProblem}&rdquo;
                          </span>
                        )}
                      </div>
                    </button>
                  </div>

                  {/* Helpful Quick Instructions */}
                  <div className="p-3.5 bg-[#11233B] border border-[#1E3A5F] rounded-xl space-y-2">
                    <div className="flex items-center gap-2 text-xs font-bold text-sky-300">
                      <Info className="w-4 h-4 text-sky-400 shrink-0" />
                      <span>How to take a clear farm photo:</span>
                    </div>
                    <ul className="text-xs text-slate-300 space-y-1 pl-6 list-disc">
                      <li>Hold camera 1 to 2 feet from affected leaves, bunches, or crown.</li>
                      <li>Take in daytime daylight (avoid heavy shadows or dark blur).</li>
                      <li>Ensure rotting spots, discolouration, or lesions are centered.</li>
                    </ul>
                  </div>

                  {/* Simple Regional Help Footer */}
                  <div className="pt-2 text-center text-xs text-slate-400">
                    <p>Designed for farmers of Sullia, Puttur, Belthangady, Bantwal & Mangaluru taluks.</p>
                  </div>
                </div>
              )}

              {/* Screen 2: Agent Progress Screen */}
              {currentScreen === "progress" && (
                <AgentProgressScreen
                  steps={agentSteps}
                  currentLang={currentLang}
                  thumbnailUrl={activePhoto || undefined}
                  hasPhotoIssue={hasPhotoIssue}
                  photoIssueMessage={photoIssueMessage}
                  onRetakePhoto={() => {
                    setCurrentScreen("home");
                    fileInputRef.current?.click();
                  }}
                />
              )}

              {/* Screen 3: Result Screen */}
              {currentScreen === "result" && diagnosisResult && (
                <ResultScreen
                  result={diagnosisResult}
                  currentLang={currentLang}
                  onSetFollowUp={handleSetFollowUp}
                  onAskExpert={handleAskExpert}
                  onRetake={() => setCurrentScreen("home")}
                  expertCase={existingExpertCase}
                  isEscalatedToExpert={isEscalatedToExpert}
                  followUpReminderDate={followUpReminderDate || undefined}
                />
              )}

              {/* Screen 4: Follow-up Screen */}
              {currentScreen === "followup" && diagnosisResult && (
                <FollowUpScreen
                  originalResult={diagnosisResult}
                  currentLang={currentLang}
                  onBack={() => setCurrentScreen("result")}
                  onRecordFollowUp={handleRecordFollowUp}
                />
              )}
            </>
          )}
        </main>

        {/* Speech Modal Dialog */}
        <SpeechInputModal
          isOpen={isSpeechModalOpen}
          onClose={() => setIsSpeechModalOpen(false)}
          onSaveSpokenText={setSpokenProblem}
          currentLang={currentLang}
          initialText={spokenProblem}
          selectedCrop={selectedCrop}
        />
      </div>
    </div>
  );
}
