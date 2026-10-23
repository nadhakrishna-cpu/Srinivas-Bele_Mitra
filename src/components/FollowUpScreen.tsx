import React, { useState } from "react";
import { Camera, CheckCircle2, AlertTriangle, ArrowLeft, Send } from "lucide-react";
import { SupportedLang } from "../data/adviceCards";
import { TRANSLATIONS } from "../data/translations";
import { DiagnosisResult, ExpertCase } from "../services/agentWorkflow";

interface FollowUpScreenProps {
  originalResult: DiagnosisResult;
  currentLang: SupportedLang;
  onBack: () => void;
  onRecordFollowUp: (condition: "Better" | "Same" | "Worse", followUpPhotoUrl?: string) => ExpertCase | void;
}

export const FollowUpScreen: React.FC<FollowUpScreenProps> = ({
  originalResult,
  currentLang,
  onBack,
  onRecordFollowUp,
}) => {
  const [followUpPhoto, setFollowUpPhoto] = useState<string | null>(null);
  const [selectedCondition, setSelectedCondition] = useState<"Better" | "Same" | "Worse" | null>(null);
  const [sentToExpert, setSentToExpert] = useState(false);
  const [escalatedCase, setEscalatedCase] = useState<ExpertCase | null>(null);

  const t = TRANSLATIONS[currentLang];

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      setFollowUpPhoto(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleSelectCondition = (condition: "Better" | "Same" | "Worse") => {
    setSelectedCondition(condition);
    const createdCase = onRecordFollowUp(condition, followUpPhoto || undefined);

    if (condition === "Worse") {
      setSentToExpert(true);
      if (createdCase) {
        setEscalatedCase(createdCase);
      }
    }
  };

  return (
    <div className="w-full max-w-md mx-auto p-4 sm:p-5 bg-[#0D1B2E] text-slate-100 space-y-5 pb-16">
      {/* Top Navigation */}
      <div className="flex items-center justify-between pb-3 border-b border-[#1A314E]">
        <button
          onClick={onBack}
          className="flex items-center gap-1.5 text-xs font-bold text-sky-400 hover:text-sky-300"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>{t.backToFarmerView}</span>
        </button>
        <span className="text-xs font-bold text-white bg-[#132742] px-2.5 py-1 rounded-md border border-[#1E3A5F]">
          Follow-Up Assessment
        </span>
      </div>

      {/* Screen Title */}
      <div>
        <h2 className="text-xl font-bold text-white">
          {t.followUpScreenTitle}
        </h2>
        <p className="text-xs text-slate-300 mt-1">
          Comparing recovery for {originalResult.crop} palm diagnosed with &ldquo;{originalResult.disease_name}&rdquo;.
        </p>
      </div>

      {/* Original vs New Photo Comparison Grid */}
      <div className="grid grid-cols-2 gap-3">
        {/* Original photo */}
        <div className="p-2.5 bg-[#11233B] border border-[#1E3A5F] rounded-xl">
          <span className="text-[11px] font-bold text-slate-400 block mb-1">
            Original Photo (Day 0)
          </span>
          <img
            src={originalResult.photoDataUrl}
            alt="Original Plant"
            className="w-full h-32 object-cover rounded-lg border border-[#254670]"
          />
        </div>

        {/* New follow-up photo */}
        <div className="p-2.5 bg-[#11233B] border-2 border-dashed border-sky-400/70 rounded-xl flex flex-col justify-between">
          <span className="text-[11px] font-bold text-sky-300 block mb-1">
            Today&apos;s Photo
          </span>
          {followUpPhoto ? (
            <img
              src={followUpPhoto}
              alt="Follow-up Plant"
              className="w-full h-32 object-cover rounded-lg border border-sky-400"
            />
          ) : (
            <label className="w-full h-32 flex flex-col items-center justify-center cursor-pointer bg-[#0A1628] rounded-lg border border-[#1E3A5F] hover:bg-[#142B49] transition-colors">
              <Camera className="w-6 h-6 text-sky-400 mb-1" />
              <span className="text-xs font-bold text-sky-200 text-center px-1">
                Take / upload new photo
              </span>
              <input
                type="file"
                accept="image/*"
                capture="environment"
                onChange={handlePhotoUpload}
                className="hidden"
              />
            </label>
          )}
        </div>
      </div>

      {/* Condition Selector: Better / Same / Worse */}
      <div className="p-4 bg-[#11233B] border border-[#1E3A5F] rounded-xl space-y-3">
        <label className="block text-sm font-bold text-white">
          {t.howIsPlantCondition}
        </label>

        <div className="grid grid-cols-3 gap-2">
          {/* Better */}
          <button
            onClick={() => handleSelectCondition("Better")}
            className={`py-3 px-2 rounded-xl border-2 text-xs font-bold flex flex-col items-center justify-center transition-all ${
              selectedCondition === "Better"
                ? "bg-emerald-950 text-emerald-200 border-emerald-500 shadow-md shadow-emerald-950/50"
                : "bg-[#0A1628] text-slate-300 border-[#1E3A5F] hover:border-emerald-500"
            }`}
          >
            <CheckCircle2 className="w-5 h-5 mb-1 text-emerald-400" />
            <span>{t.better}</span>
          </button>

          {/* Same */}
          <button
            onClick={() => handleSelectCondition("Same")}
            className={`py-3 px-2 rounded-xl border-2 text-xs font-bold flex flex-col items-center justify-center transition-all ${
              selectedCondition === "Same"
                ? "bg-[#1E3A5F] text-white border-sky-400 shadow-md shadow-blue-950/50"
                : "bg-[#0A1628] text-slate-300 border-[#1E3A5F] hover:border-sky-400"
            }`}
          >
            <span className="text-base font-bold mb-0.5 text-sky-400">≈</span>
            <span>{t.same}</span>
          </button>

          {/* Worse */}
          <button
            onClick={() => handleSelectCondition("Worse")}
            className={`py-3 px-2 rounded-xl border-2 text-xs font-bold flex flex-col items-center justify-center transition-all ${
              selectedCondition === "Worse"
                ? "bg-red-950 text-red-200 border-red-500 shadow-md shadow-red-950/50"
                : "bg-[#0A1628] text-slate-300 border-[#1E3A5F] hover:border-red-400"
            }`}
          >
            <AlertTriangle className="w-5 h-5 mb-1 text-red-400" />
            <span>{t.worse}</span>
          </button>
        </div>
      </div>

      {/* If Worse: Show 'Sent to expert' notice and case confirmation */}
      {sentToExpert && (
        <div className="p-4 bg-[#2A1218] border-2 border-red-500 rounded-xl space-y-3 animate-fade-in">
          <div className="flex items-start gap-2.5">
            <Send className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
            <div>
              <h4 className="text-sm font-bold text-red-200">
                Sent to Expert Desk
              </h4>
              <p className="text-xs text-red-300/90 mt-1 leading-relaxed">
                {t.sentToExpertNotice}
              </p>
              {escalatedCase && (
                <div className="mt-2 text-xs font-bold text-white bg-red-900/60 p-2 rounded-lg border border-red-700">
                  Tracking ID: {escalatedCase.caseNumber}
                </div>
              )}
            </div>
          </div>
          <p className="text-xs text-slate-400 pt-2 border-t border-red-900/60">
            A notification will appear as soon as the agricultural officer replies.
          </p>
        </div>
      )}

      {/* If Better: positive guidance */}
      {selectedCondition === "Better" && (
        <div className="p-4 bg-[#082A1E] border-2 border-emerald-500 rounded-xl">
          <h4 className="text-sm font-bold text-emerald-200">
            Positive Progress!
          </h4>
          <p className="text-xs text-emerald-300/90 mt-1">
            Continue adhering to good garden hygiene, clearing fallen debris, and keeping drainage ditches unclogged.
          </p>
        </div>
      )}

      {/* If Same */}
      {selectedCondition === "Same" && (
        <div className="p-4 bg-[#10223A] border-2 border-[#1E3A5F] rounded-xl">
          <h4 className="text-sm font-bold text-white">
            Condition Maintained
          </h4>
          <p className="text-xs text-slate-300 mt-1">
            Keep monitoring closely over the next 48 hours. If rot accelerates due to rain, escalate to an officer immediately.
          </p>
        </div>
      )}

      {/* Bottom Back Button */}
      <button
        onClick={onBack}
        className="w-full py-3.5 px-4 bg-[#2563EB] hover:bg-[#1D4ED8] text-white rounded-xl font-bold text-sm transition-colors shadow-md shadow-blue-950/50"
      >
        Done / Return to Results
      </button>
    </div>
  );
};
