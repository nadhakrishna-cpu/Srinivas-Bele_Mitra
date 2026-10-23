import React, { useState } from "react";
import {
  Volume2,
  VolumeX,
  Calendar,
  UserCheck,
  ChevronDown,
  ChevronUp,
  AlertTriangle,
  RotateCcw,
  Shield,
  Droplets,
  Users,
  CheckCircle2,
  CloudSun,
  Flame,
  Activity,
  HeartPulse,
} from "lucide-react";
import { SupportedLang } from "../data/adviceCards";
import { TRANSLATIONS } from "../data/translations";
import { DiagnosisResult, ExpertCase } from "../services/agentWorkflow";

interface ResultScreenProps {
  result: DiagnosisResult;
  currentLang: SupportedLang;
  onSetFollowUp: () => void;
  onAskExpert: () => void;
  onRetake: () => void;
  expertCase?: ExpertCase;
  isEscalatedToExpert?: boolean;
  followUpReminderDate?: string;
}

export const ResultScreen: React.FC<ResultScreenProps> = ({
  result,
  currentLang,
  onSetFollowUp,
  onAskExpert,
  onRetake,
  expertCase,
  isEscalatedToExpert,
  followUpReminderDate,
}) => {
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [audioNotice, setAudioNotice] = useState<string | null>(null);
  const [showAgentDecisions, setShowAgentDecisions] = useState(false);

  const t = TRANSLATIONS[currentLang];
  const advice = result.adviceCard;

  // Localized advice text
  const localizedDiseaseName = advice
    ? advice.disease_name[currentLang] || advice.disease_name.en
    : result.disease_name;

  const localizedToday = advice
    ? advice.today[currentLang] || advice.today.en
    : "Inspect crops regularly and maintain good garden drainage.";

  const localizedThisWeek = advice
    ? advice.this_week[currentLang] || advice.this_week.en
    : "Consult local horticulture or KVK officer if you notice any unusual wilting or yellowing.";

  const localizedWarning = advice
    ? advice.mandatory_warning[currentLang] || advice.mandatory_warning.en
    : "Confirm with your local agriculture officer or KVK before spraying.";

  // Audio Speech Synthesis Handler
  const handleToggleSpeech = () => {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) {
      setAudioNotice("Voice audio playback is not supported in this browser.");
      setTimeout(() => setAudioNotice(null), 4000);
      return;
    }

    if (isPlayingAudio) {
      window.speechSynthesis.cancel();
      setIsPlayingAudio(false);
      setAudioNotice(null);
      return;
    }

    // Cancel ongoing speech
    window.speechSynthesis.cancel();

    // Prepare clear spoken text for the farmer
    const spokenContent = `${result.yes_no}. ${localizedDiseaseName}. ${t.whyHeading}: ${result.reasons.join(". ")}. ${t.whatToDoHeading}. ${t.todayLabel}: ${localizedToday}. ${t.thisWeekLabel}: ${localizedThisWeek}. ${localizedWarning}`;

    const utterance = new SpeechSynthesisUtterance(spokenContent);
    utterance.lang = currentLang === "kn" || currentLang === "tulu" ? "kn-IN" : "en-IN";
    utterance.rate = 0.95;
    utterance.pitch = 1.0;

    utterance.onend = () => {
      setIsPlayingAudio(false);
    };

    utterance.onerror = () => {
      setIsPlayingAudio(false);
    };

    window.speechSynthesis.speak(utterance);
    setIsPlayingAudio(true);
  };

  const isHealthy = result.disease_id === "none";
  const isUnsure = result.disease_id === "unsure" || !result.photo_ok;

  return (
    <div className="w-full max-w-md mx-auto p-4 sm:p-5 bg-[#0D1B2E] text-slate-100 space-y-5 pb-16">
      {/* 1. Large YES or NO Answer Banner */}
      <div
        className={`p-4 rounded-xl border-2 transition-all ${
          isHealthy
            ? "bg-[#06281D] border-emerald-500 text-white"
            : isUnsure
            ? "bg-[#28180E] border-amber-500 text-white"
            : "bg-[#11233D] border-[#2563EB] text-white"
        }`}
      >
        <div className="flex items-start justify-between gap-3">
          <div>
            <span
              className={`text-xs font-bold uppercase tracking-wider block ${
                isHealthy
                  ? "text-emerald-300"
                  : isUnsure
                  ? "text-amber-300"
                  : "text-sky-300"
              }`}
            >
              Diagnosis Result
            </span>
            <h2 className="text-2xl font-black mt-1 leading-tight text-white">
              {result.yes_no}
            </h2>
            {localizedDiseaseName && !isHealthy && !isUnsure && (
              <p className="text-sm font-semibold mt-1 text-slate-200">
                {localizedDiseaseName}
              </p>
            )}
          </div>
          {/* Quick Retake Photo Button */}
          <button
            onClick={onRetake}
            className="p-2 rounded-lg border border-[#254670] bg-[#0A1626] text-slate-300 hover:text-white hover:bg-[#162D4D] text-xs font-semibold shrink-0 flex items-center gap-1 transition-colors"
            title="Retake photo"
          >
            <RotateCcw className="w-4 h-4" />
            <span className="hidden xs:inline">Retake</span>
          </button>
        </div>
      </div>

      {/* 2. Photo thumbnail with crop details & spoken note */}
      <div className="p-3 bg-[#11233B] border border-[#1E3A5F] rounded-xl flex gap-3 items-center">
        <img
          src={result.photoDataUrl}
          alt="Farmer's Crop"
          className="w-16 h-16 rounded-lg object-cover border border-[#254670] shrink-0"
        />
        <div className="text-xs space-y-0.5 overflow-hidden">
          <p className="font-bold text-white">
            Crop: <span className="capitalize">{result.crop} Palm</span>
          </p>
          {result.spokenText && (
            <p className="text-slate-300 line-clamp-2">
              <span className="font-semibold text-sky-300">Voice Note:</span> &ldquo;{result.spokenText}&rdquo;
            </p>
          )}
          <p className="text-[11px] text-slate-400">
            Dakshina Kannada Region • {result.createdAt}
          </p>
        </div>
      </div>

      {/* 3. Why: 2 to 4 short reasons based on photo + weather */}
      <div className="p-4 bg-[#11233B] border border-[#1E3A5F] rounded-xl">
        <h3 className="text-base font-bold text-white flex items-center gap-2">
          <span>{t.whyHeading}</span>
        </h3>
        <ul className="mt-2.5 space-y-2">
          {result.reasons.map((reason, idx) => (
            <li key={idx} className="flex items-start gap-2.5 text-sm text-slate-200">
              <span className="w-1.5 h-1.5 rounded-full bg-sky-400 mt-2 shrink-0" />
              <span>{reason}</span>
            </li>
          ))}
          {/* Weather integration in why */}
          {result.weather && (
            <li className="flex items-start gap-2.5 text-sm text-slate-200 bg-[#091526] p-2.5 rounded-lg border border-[#1A314E]">
              <CloudSun className="w-4 h-4 text-sky-400 shrink-0 mt-0.5" />
              <div>
                <span className="font-semibold text-sky-300">Weather condition: </span>
                <span>{result.weather.rainSummary}</span>
                {result.weather.isOfflineSample && (
                  <span className="ml-1 text-[10px] bg-[#162D4D] text-slate-300 px-1.5 py-0.2 rounded font-medium border border-[#23426A]">
                    {t.offlineSampleTag}
                  </span>
                )}
              </div>
            </li>
          )}
        </ul>
      </div>

      {/* 4. Severity as 3 icons: Low, Medium, High */}
      <div className="p-4 bg-[#11233B] border border-[#1E3A5F] rounded-xl">
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2.5">
          {t.severityHeading}
        </h3>
        <div className="grid grid-cols-3 gap-2">
          {/* Low */}
          <div
            className={`p-3 rounded-lg border-2 flex flex-col items-center justify-center text-center transition-all ${
              result.severity === "Low"
                ? "bg-emerald-950/80 text-emerald-200 border-emerald-500 shadow-sm"
                : "bg-[#091526] text-slate-400 border-[#1A314E] opacity-50"
            }`}
          >
            <Activity className="w-6 h-6 mb-1 text-emerald-400" />
            <span className="text-xs font-bold">{t.severityLabels.low}</span>
          </div>

          {/* Medium */}
          <div
            className={`p-3 rounded-lg border-2 flex flex-col items-center justify-center text-center transition-all ${
              result.severity === "Medium"
                ? "bg-amber-950/80 text-amber-200 border-amber-500 shadow-sm"
                : "bg-[#091526] text-slate-400 border-[#1A314E] opacity-50"
            }`}
          >
            <HeartPulse className="w-6 h-6 mb-1 text-amber-400" />
            <span className="text-xs font-bold">{t.severityLabels.medium}</span>
          </div>

          {/* High */}
          <div
            className={`p-3 rounded-lg border-2 flex flex-col items-center justify-center text-center transition-all ${
              result.severity === "High"
                ? "bg-red-950/80 text-red-200 border-red-500 shadow-sm"
                : "bg-[#091526] text-slate-400 border-[#1A314E] opacity-50"
            }`}
          >
            <Flame className="w-6 h-6 mb-1 text-red-400" />
            <span className="text-xs font-bold">{t.severityLabels.high}</span>
          </div>
        </div>
      </div>

      {/* 5. What to do: TODAY and THIS WEEK (From advice cards only) */}
      <div className="p-4 bg-[#11233B] border-2 border-[#1E3A5F] rounded-xl space-y-4">
        <h3 className="text-lg font-bold text-white pb-2 border-b border-[#1A314E]">
          {t.whatToDoHeading}
        </h3>

        {/* TODAY */}
        <div className="p-3 bg-[#0A1628] border-l-4 border-sky-400 rounded-r-lg">
          <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-sky-400 mb-1">
            <span className="inline-block w-2 h-2 rounded-full bg-sky-400" />
            <span>{t.todayLabel}</span>
          </div>
          <p className="text-sm font-semibold text-slate-100 leading-relaxed">
            {localizedToday}
          </p>
        </div>

        {/* THIS WEEK */}
        <div className="p-3 bg-[#0A1628] border-l-4 border-slate-500 rounded-r-lg">
          <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">
            <span className="inline-block w-2 h-2 rounded-full bg-slate-500" />
            <span>{t.thisWeekLabel}</span>
          </div>
          <p className="text-sm font-semibold text-slate-100 leading-relaxed">
            {localizedThisWeek}
          </p>
        </div>

        {/* Mandatory Warning: Never state chemical dose */}
        <div className="p-3 bg-[#261510] border border-amber-600/80 rounded-lg text-xs font-bold text-amber-200 flex items-start gap-2">
          <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
          <span>{localizedWarning}</span>
        </div>
      </div>

      {/* 6. Safety strip with icons (Gloves, keep away from water, keep children away) */}
      <div className="p-3.5 bg-[#0A1628] border border-[#1A314E] rounded-xl">
        <p className="text-xs font-bold text-slate-300 uppercase tracking-wide mb-2 flex items-center gap-1.5">
          <Shield className="w-3.5 h-3.5 text-sky-400" />
          <span>{t.safetyTitle}</span>
        </p>
        <div className="grid grid-cols-3 gap-2 text-center text-xs">
          <div className="p-2 bg-[#10223A] rounded-lg border border-[#1E3A5F] flex flex-col items-center">
            <Shield className="w-5 h-5 text-sky-400 mb-1" />
            <span className="font-semibold text-slate-200 leading-tight">
              {t.safetyGloves}
            </span>
          </div>
          <div className="p-2 bg-[#10223A] rounded-lg border border-[#1E3A5F] flex flex-col items-center">
            <Droplets className="w-5 h-5 text-sky-400 mb-1" />
            <span className="font-semibold text-slate-200 leading-tight">
              {t.safetyWater}
            </span>
          </div>
          <div className="p-2 bg-[#10223A] rounded-lg border border-[#1E3A5F] flex flex-col items-center">
            <Users className="w-5 h-5 text-sky-400 mb-1" />
            <span className="font-semibold text-slate-200 leading-tight">
              {t.safetyChildren}
            </span>
          </div>
        </div>
      </div>

      {/* 7. Listen Button (Reads aloud) */}
      <div>
        <button
          onClick={handleToggleSpeech}
          className={`w-full py-3.5 px-4 rounded-xl border-2 font-bold text-base flex items-center justify-center gap-2.5 transition-colors ${
            isPlayingAudio
              ? "bg-red-950/80 text-red-200 border-red-500 animate-pulse"
              : "bg-[#142844] text-white border-[#2563EB] hover:bg-[#1C365C]"
          }`}
        >
          {isPlayingAudio ? (
            <>
              <VolumeX className="w-5 h-5" />
              <span>{t.stopListeningButton}</span>
            </>
          ) : (
            <>
              <Volume2 className="w-5 h-5 text-sky-300" />
              <span>{t.listenButton}</span>
            </>
          )}
        </button>
        {audioNotice && (
          <p className="mt-1.5 text-xs text-center font-medium text-amber-300 bg-[#261510] p-1.5 rounded border border-amber-600/80">
            {audioNotice}
          </p>
        )}
      </div>

      {/* 8. Action Buttons: Set follow-up in 5 days & Ask an expert */}
      <div className="space-y-2.5">
        <button
          onClick={onSetFollowUp}
          className="w-full py-3.5 px-4 bg-[#2563EB] text-white rounded-xl border border-blue-400 font-bold text-base flex items-center justify-center gap-2 hover:bg-[#1D4ED8] transition-colors shadow-md shadow-blue-950/50"
        >
          <Calendar className="w-5 h-5" />
          <span>{t.setFollowUpButton}</span>
        </button>

        {followUpReminderDate && (
          <div className="p-2.5 bg-[#0A1628] border border-emerald-600/70 rounded-lg text-xs font-semibold text-emerald-300 flex items-center justify-between">
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>Reminder scheduled: {followUpReminderDate}</span>
            </span>
          </div>
        )}

        <button
          onClick={onAskExpert}
          className={`w-full py-3 px-4 rounded-xl border font-bold text-base flex items-center justify-center gap-2 transition-colors ${
            isEscalatedToExpert || expertCase
              ? "bg-[#0A1628] text-slate-400 border-[#1A314E]"
              : "bg-[#11233B] text-slate-200 border-[#1E3A5F] hover:border-sky-400"
          }`}
        >
          <UserCheck className="w-5 h-5 text-sky-400" />
          <span>
            {isEscalatedToExpert || expertCase
              ? "Case Sent to Expert Desk"
              : t.askExpertButton}
          </span>
        </button>
      </div>

      {/* 9. Expert Official Reply Display (if replied) */}
      {expertCase && expertCase.expertReply && (
        <div className="p-4 bg-[#06281D] border-2 border-emerald-500 rounded-xl space-y-1.5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-300">
              Official KVK Expert Reply
            </span>
            <span className="text-[11px] text-emerald-400">
              Case #{expertCase.caseNumber}
            </span>
          </div>
          <p className="text-sm font-bold text-white whitespace-pre-line leading-relaxed">
            &ldquo;{expertCase.expertReply}&rdquo;
          </p>
        </div>
      )}

      {/* 10. How the agent decided panel (Collapsible) */}
      <div className="border border-[#1E3A5F] rounded-xl overflow-hidden bg-[#11233B]">
        <button
          onClick={() => setShowAgentDecisions(!showAgentDecisions)}
          className="w-full p-3.5 bg-[#0C1A2D] hover:bg-[#12243C] flex items-center justify-between text-left text-xs font-bold text-sky-300 transition-colors"
        >
          <span>{t.agentDecisionHeading}</span>
          {showAgentDecisions ? (
            <ChevronUp className="w-4 h-4 text-slate-400" />
          ) : (
            <ChevronDown className="w-4 h-4 text-slate-400" />
          )}
        </button>

        {showAgentDecisions && (
          <div className="p-3 text-xs space-y-2.5 border-t border-[#1E3A5F] bg-[#0E1F36]">
            <div className="space-y-1.5">
              {result.decisions.map((dec, idx) => (
                <div
                  key={idx}
                  className="p-2.5 bg-[#091526] rounded-lg border border-[#1A314E] flex items-start justify-between"
                >
                  <div>
                    <span className="font-bold text-white block">
                      Tool {idx + 1}: {dec.tool}
                    </span>
                    <span className="text-slate-300 block mt-0.5">
                      {dec.outputSummary}
                    </span>
                  </div>
                  <span className="text-[10px] font-bold text-sky-300 bg-[#142B49] px-2 py-0.5 rounded border border-[#1E3A5F]">
                    OK
                  </span>
                </div>
              ))}
            </div>

            <div className="pt-2 border-t border-[#1A314E] text-[11px] text-slate-400">
              <p>
                <strong>Open-Meteo Weather:</strong> Mangaluru station (lat 12.91, lon 74.86).
              </p>
              <p>
                <strong>Advice source:</strong> Local ADVICE_CARDS repository only.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
