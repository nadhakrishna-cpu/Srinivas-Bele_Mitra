import React, { useState } from "react";
import { ArrowLeft, CheckCircle2, MessageSquare, Send, Clock, UserCheck } from "lucide-react";
import { SupportedLang } from "../data/adviceCards";
import { TRANSLATIONS } from "../data/translations";
import { ExpertCase, saveExpertReply } from "../services/agentWorkflow";

interface ExpertDeskScreenProps {
  cases: ExpertCase[];
  currentLang: SupportedLang;
  onBackToFarmer: () => void;
  onCaseUpdated: () => void;
}

export const ExpertDeskScreen: React.FC<ExpertDeskScreenProps> = ({
  cases,
  currentLang,
  onBackToFarmer,
  onCaseUpdated,
}) => {
  const [replies, setReplies] = useState<Record<string, string>>({});
  const [successNotice, setSuccessNotice] = useState<string | null>(null);

  const t = TRANSLATIONS[currentLang];

  const handleReplyChange = (caseId: string, text: string) => {
    setReplies((prev) => ({ ...prev, [caseId]: text }));
  };

  const handleSubmitReply = (caseId: string) => {
    const text = replies[caseId]?.trim();
    if (!text) return;

    saveExpertReply(caseId, text);
    setSuccessNotice(`Reply submitted for Case #${cases.find((c) => c.id === caseId)?.caseNumber}! It is now visible on the farmer's screen.`);
    setTimeout(() => setSuccessNotice(null), 4000);
    onCaseUpdated();
  };

  return (
    <div className="w-full max-w-md mx-auto p-4 sm:p-5 bg-[#0D1B2E] text-slate-100 space-y-5 pb-20">
      {/* Top Bar */}
      <div className="flex items-center justify-between pb-3 border-b border-[#1A314E]">
        <button
          onClick={onBackToFarmer}
          className="flex items-center gap-1.5 text-xs font-bold text-sky-400 hover:text-sky-300"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>{t.backToFarmerView}</span>
        </button>
        <span className="text-xs font-bold px-2.5 py-1 rounded-md bg-[#162D4D] text-sky-300 border border-[#20426E]">
          KVK Dakshina Kannada Desk
        </span>
      </div>

      {/* Screen Title */}
      <div>
        <h2 className="text-xl font-bold text-white">
          {t.expertPageTitle}
        </h2>
        <p className="text-xs text-slate-300 mt-1">
          Review escalated farmer crop photos, diagnose symptoms, and send official guidance directly back to their phones.
        </p>
      </div>

      {/* Success Notification Alert */}
      {successNotice && (
        <div className="p-3 bg-[#082A1E] border-2 border-emerald-500 rounded-xl text-xs font-bold text-emerald-200 flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{successNotice}</span>
        </div>
      )}

      {/* Cases List */}
      {cases.length === 0 ? (
        <div className="p-8 text-center bg-[#11233B] border-2 border-dashed border-[#1E3A5F] rounded-2xl space-y-3">
          <div className="w-12 h-12 rounded-full bg-[#183254] text-sky-300 mx-auto flex items-center justify-center">
            <UserCheck className="w-6 h-6" />
          </div>
          <h3 className="text-base font-bold text-white">
            No Escalated Cases Yet
          </h3>
          <p className="text-xs text-slate-400 leading-relaxed max-w-xs mx-auto">
            {t.noCasesYet}
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          <p className="text-xs font-bold text-sky-400 uppercase tracking-wide">
            {cases.length} {cases.length === 1 ? "Case" : "Cases"} In Queue
          </p>

          {cases.map((c) => {
            const hasReply = !!c.expertReply;
            const currentReplyText = replies[c.id] ?? (c.expertReply || "");

            return (
              <div
                key={c.id}
                className="p-4 bg-[#11233B] border border-[#1E3A5F] rounded-2xl space-y-3.5 shadow-md shadow-black/20"
              >
                {/* Case Header */}
                <div className="flex items-center justify-between pb-2 border-b border-[#1A314E]">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-black text-sky-400">
                      #{c.caseNumber}
                    </span>
                    <span className="text-xs font-bold capitalize px-2 py-0.5 rounded bg-[#0A1628] text-slate-200 border border-[#1E3A5F]">
                      {c.crop} Palm
                    </span>
                  </div>
                  <span
                    className={`text-[11px] font-bold px-2 py-0.5 rounded ${
                      hasReply
                        ? "bg-emerald-950 text-emerald-300 border border-emerald-600/70"
                        : "bg-amber-950 text-amber-300 border border-amber-600/70"
                    }`}
                  >
                    {hasReply ? "Replied" : "Awaiting Reply"}
                  </span>
                </div>

                {/* Photos: Original & Follow-up */}
                <div className="flex gap-2.5">
                  <div className="w-1/2">
                    <span className="text-[10px] font-bold text-slate-400 block mb-0.5">
                      Farmer Photo
                    </span>
                    <img
                      src={c.photoDataUrl}
                      alt="Farmer crop upload"
                      className="w-full h-28 object-cover rounded-lg border border-[#254670]"
                    />
                  </div>
                  {c.followUpPhotoUrl ? (
                    <div className="w-1/2">
                      <span className="text-[10px] font-bold text-slate-400 block mb-0.5">
                        Follow-Up (Day 5)
                      </span>
                      <img
                        src={c.followUpPhotoUrl}
                        alt="Follow up photo"
                        className="w-full h-28 object-cover rounded-lg border border-[#254670]"
                      />
                    </div>
                  ) : (
                    <div className="w-1/2 p-2.5 bg-[#0A1628] rounded-lg border border-[#1E3A5F] text-[11px] text-slate-300 flex flex-col justify-center">
                      <span className="font-bold text-slate-400">Severity:</span>
                      <span className="text-sky-300 font-bold">{c.severity}</span>
                      <span className="font-bold text-slate-400 mt-1">Status:</span>
                      <span>{c.followUpStatus || "Direct Expert Request"}</span>
                    </div>
                  )}
                </div>

                {/* AI Preliminary Diagnosis summary */}
                <div className="p-3 bg-[#0A1628] rounded-xl text-xs space-y-1.5 border border-[#1A314E]">
                  <p className="font-bold text-white">
                    AI Analysis: <span className="text-sky-300">{c.yes_no} ({c.disease_name})</span>
                  </p>
                  {c.farmerSpokenNote && (
                    <p className="text-slate-300">
                      <span className="font-semibold text-sky-400">Farmer Voice Note:</span> &ldquo;{c.farmerSpokenNote}&rdquo;
                    </p>
                  )}
                  {c.reasons && c.reasons.length > 0 && (
                    <p className="text-[11px] text-slate-400">
                      Signs: {c.reasons.join(", ")}
                    </p>
                  )}
                </div>

                {/* Expert Reply Box */}
                <div className="space-y-2 pt-1">
                  <label className="block text-xs font-bold text-slate-200 flex items-center justify-between">
                    <span className="flex items-center gap-1.5 text-sky-300">
                      <MessageSquare className="w-3.5 h-3.5 text-sky-400" />
                      <span>Official Agricultural Advice:</span>
                    </span>
                    {c.expertReplyAt && (
                      <span className="text-[10px] text-slate-400 font-normal flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {new Date(c.expertReplyAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                      </span>
                    )}
                  </label>
                  <textarea
                    value={currentReplyText}
                    onChange={(e) => handleReplyChange(c.id, e.target.value)}
                    rows={3}
                    placeholder={t.expertReplyPlaceholder}
                    className="w-full text-xs p-3 bg-[#081220] border-2 border-[#1E3A5F] rounded-xl text-white placeholder-slate-500 focus:border-sky-400 focus:outline-none"
                  />
                  <button
                    onClick={() => handleSubmitReply(c.id)}
                    className="w-full py-2.5 px-3 bg-[#2563EB] text-white rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 hover:bg-[#1D4ED8] transition-colors shadow-sm"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>{hasReply ? "Update Expert Reply" : t.sendReplyButton}</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
