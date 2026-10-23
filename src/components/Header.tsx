import React from "react";
import { SupportedLang } from "../data/adviceCards";
import { TRANSLATIONS } from "../data/translations";
import { ShieldCheck, UserCheck, Stethoscope } from "lucide-react";

interface HeaderProps {
  currentLang: SupportedLang;
  onLanguageChange: (lang: SupportedLang) => void;
  activeTab: "farmer" | "expert";
  onTabChange: (tab: "farmer" | "expert") => void;
  pendingExpertCount: number;
}

export const Header: React.FC<HeaderProps> = ({
  currentLang,
  onLanguageChange,
  activeTab,
  onTabChange,
  pendingExpertCount,
}) => {
  const t = TRANSLATIONS[currentLang];

  return (
    <header className="bg-[#091426] text-slate-100 border-b border-[#1A314E] sticky top-0 z-40">
      {/* Top Prototype Offline Notice Strip */}
      <div className="bg-[#050C17] px-3 py-1.5 text-center text-xs text-slate-400 font-medium tracking-wide flex items-center justify-center gap-1.5 border-b border-[#122338]">
        <ShieldCheck className="w-3.5 h-3.5 text-sky-400 shrink-0" />
        <span>{t.prototypeBadge}</span>
      </div>

      <div className="px-4 py-3">
        <div className="flex items-center justify-between gap-2">
          {/* App Branding */}
          <div>
            <div className="flex items-baseline gap-2">
              <h1 className="text-xl font-extrabold tracking-tight text-white flex items-center gap-1.5">
                Bele Mitra
              </h1>
              <span className="text-xs font-semibold px-2 py-0.5 rounded bg-[#162D4D] text-sky-300 border border-[#20426E]">
                ಬೆಳೆ ಮಿತ್ರ
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5 font-medium">
              {t.appTagline}
            </p>
          </div>

          {/* Language Switch: English / ಕನ್ನಡ / ತುಳು */}
          <div className="flex items-center bg-[#060D19] p-1 rounded-lg border border-[#1E3757]">
            <button
              onClick={() => onLanguageChange("en")}
              className={`px-2.5 py-1 text-xs font-bold rounded transition-colors ${
                currentLang === "en"
                  ? "bg-[#2563EB] text-white shadow-sm"
                  : "text-slate-400 hover:text-white"
              }`}
              title="English"
            >
              EN
            </button>
            <button
              onClick={() => onLanguageChange("kn")}
              className={`px-2.5 py-1 text-xs font-bold rounded transition-colors ${
                currentLang === "kn"
                  ? "bg-[#2563EB] text-white shadow-sm"
                  : "text-slate-400 hover:text-white"
              }`}
              title="ಕನ್ನಡ (Kannada)"
            >
              ಕನ್ನಡ
            </button>
            <button
              onClick={() => onLanguageChange("tulu")}
              className={`px-2.5 py-1 text-xs font-bold rounded transition-colors ${
                currentLang === "tulu"
                  ? "bg-[#2563EB] text-white shadow-sm"
                  : "text-slate-400 hover:text-white"
              }`}
              title="ತುಳು (Tulu)"
            >
              ತುಳು
            </button>
          </div>
        </div>

        {/* View Tabs Bar: Farmer vs Expert Desk */}
        <div className="mt-3 pt-2.5 border-t border-[#162B46] flex items-center justify-end text-xs">
          <div className="flex items-center gap-1 bg-[#060D19] p-1 rounded-lg border border-[#1E3757]">
            <button
              onClick={() => onTabChange("farmer")}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-bold transition-colors ${
                activeTab === "farmer"
                  ? "bg-[#1E3A5F] text-white shadow-sm"
                  : "text-slate-400 hover:text-slate-200"
              }`}
            >
              <UserCheck className="w-3.5 h-3.5 text-sky-400" />
              <span>{t.farmerRole}</span>
            </button>
            <button
              onClick={() => onTabChange("expert")}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-bold transition-colors relative ${
                activeTab === "expert"
                  ? "bg-[#1E3A5F] text-white shadow-sm"
                  : "text-slate-400 hover:text-slate-200"
              }`}
            >
              <Stethoscope className="w-3.5 h-3.5 text-sky-400" />
              <span>{t.expertRole}</span>
              {pendingExpertCount > 0 && (
                <span className="ml-1 bg-red-600 text-white px-1.5 py-0.2 rounded-full text-[10px] font-bold animate-pulse">
                  {pendingExpertCount}
                </span>
              )}
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
