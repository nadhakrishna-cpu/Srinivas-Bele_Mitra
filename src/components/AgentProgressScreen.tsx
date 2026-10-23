import React from "react";
import { Check, Loader2, AlertCircle, Camera, Stethoscope, Gauge, CloudRain, BookOpen, Clock } from "lucide-react";
import { SupportedLang } from "../data/adviceCards";
import { TRANSLATIONS } from "../data/translations";

export type StepState = "pending" | "running" | "completed" | "failed";

export interface AgentStepStatus {
  id: "photoCheck" | "diseaseCheck" | "severityCheck" | "weatherCheck" | "adviceLookup" | "followUp";
  name: string;
  state: StepState;
  detail?: string;
}

interface AgentProgressScreenProps {
  steps: AgentStepStatus[];
  currentLang: SupportedLang;
  thumbnailUrl?: string;
  onRetakePhoto?: () => void;
  hasPhotoIssue?: boolean;
  photoIssueMessage?: string;
}

export const AgentProgressScreen: React.FC<AgentProgressScreenProps> = ({
  steps,
  currentLang,
  thumbnailUrl,
  onRetakePhoto,
  hasPhotoIssue,
  photoIssueMessage,
}) => {
  const t = TRANSLATIONS[currentLang];

  const getStepIcon = (id: string) => {
    switch (id) {
      case "photoCheck":
        return <Camera className="w-5 h-5 text-sky-400" />;
      case "diseaseCheck":
        return <Stethoscope className="w-5 h-5 text-sky-400" />;
      case "severityCheck":
        return <Gauge className="w-5 h-5 text-sky-400" />;
      case "weatherCheck":
        return <CloudRain className="w-5 h-5 text-sky-400" />;
      case "adviceLookup":
        return <BookOpen className="w-5 h-5 text-sky-400" />;
      case "followUp":
        return <Clock className="w-5 h-5 text-sky-400" />;
      default:
        return null;
    }
  };

  return (
    <div className="w-full max-w-md mx-auto p-4 sm:p-5 bg-[#0D1B2E] text-slate-100 min-h-[520px] flex flex-col justify-between">
      <div>
        {/* Header */}
        <div className="text-center pb-4 border-b border-[#1A314E]">
          <p className="text-xs font-bold text-sky-400 uppercase tracking-wider">
            Bele Mitra Agent
          </p>
          <h2 className="text-xl font-bold text-white mt-0.5">
            Analyzing Crop Health...
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Running 6 local diagnosis tools for Dakshina Kannada
          </p>
        </div>

        {/* Plant Thumbnail Preview */}
        {thumbnailUrl && (
          <div className="my-4 flex items-center gap-3 p-3 bg-[#11233B] border border-[#1E3A5F] rounded-xl">
            <img
              src={thumbnailUrl}
              alt="Analyzing plant"
              className="w-14 h-14 object-cover rounded-lg border border-[#254670] shrink-0"
            />
            <div className="overflow-hidden">
              <span className="text-xs font-bold text-white block">
                Inspecting Sample
              </span>
              <span className="text-[11px] text-slate-300 truncate block mt-0.5">
                Evaluating leaves, nuts & stems with Gemini Vision
              </span>
            </div>
          </div>
        )}

        {/* Step List with Ticks */}
        <div className="mt-4 space-y-2.5">
          {steps.map((step, index) => {
            const isCompleted = step.state === "completed";
            const isRunning = step.state === "running";
            const isFailed = step.state === "failed";

            return (
              <div
                key={step.id}
                className={`flex items-start justify-between p-3 rounded-xl border-2 transition-colors ${
                  isRunning
                    ? "bg-[#142B49] border-sky-400 shadow-md shadow-sky-950/40"
                    : isCompleted
                    ? "bg-[#10223A] border-[#1E3A5F]"
                    : isFailed
                    ? "bg-[#2A1218] border-red-500"
                    : "bg-[#091526] border-[#142740] opacity-50"
                }`}
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 border ${
                      isCompleted
                        ? "bg-[#0B1E36] text-white border-sky-500"
                        : isRunning
                        ? "bg-[#1A3760] text-sky-300 border-sky-400"
                        : isFailed
                        ? "bg-red-900/60 text-red-200 border-red-500"
                        : "bg-[#0B1728] text-slate-500 border-[#1B3150]"
                    }`}
                  >
                    {getStepIcon(step.id)}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-slate-400">
                        0{index + 1}
                      </span>
                      <span className="text-sm font-bold text-white">
                        {step.name}
                      </span>
                    </div>
                    {step.detail && (
                      <p className="text-xs text-slate-300 mt-0.5">
                        {step.detail}
                      </p>
                    )}
                  </div>
                </div>

                {/* Status indicator / Tick */}
                <div className="shrink-0 mt-1">
                  {isCompleted && (
                    <div className="w-6 h-6 rounded-full bg-emerald-600 text-white flex items-center justify-center shadow-sm">
                      <Check className="w-4 h-4 stroke-[3]" />
                    </div>
                  )}
                  {isRunning && (
                    <div className="w-6 h-6 flex items-center justify-center text-sky-400">
                      <Loader2 className="w-5 h-5 animate-spin" />
                    </div>
                  )}
                  {isFailed && (
                    <div className="w-6 h-6 rounded-full bg-red-600 text-white flex items-center justify-center">
                      <AlertCircle className="w-4 h-4" />
                    </div>
                  )}
                  {step.state === "pending" && (
                    <div className="w-5 h-5 rounded-full border border-slate-600" />
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Photo issue halt prompt if photo is blurry/dark/far */}
        {hasPhotoIssue && (
          <div className="mt-5 p-4 bg-[#261510] border-2 border-amber-600/80 rounded-xl">
            <div className="flex items-start gap-2.5">
              <AlertCircle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
              <div>
                <h4 className="text-sm font-bold text-amber-200">
                  Photo Check Failed
                </h4>
                <p className="text-xs text-amber-300/90 mt-1">
                  {photoIssueMessage || "The photo is blurry, too dark, or taken from too far away. The agent cannot make an accurate diagnosis."}
                </p>
                {onRetakePhoto && (
                  <button
                    onClick={onRetakePhoto}
                    className="mt-3 w-full py-2.5 px-4 bg-[#2563EB] hover:bg-[#1D4ED8] text-white rounded-lg font-bold text-xs transition-colors"
                  >
                    {t.retakeButton}
                  </button>
                )}
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="mt-6 pt-3 text-center border-t border-[#162B46]">
        <p className="text-[11px] text-slate-400">
          Bele Mitra Multi-Tool Agent Pipeline • Open-Meteo & Gemini
        </p>
      </div>
    </div>
  );
};
