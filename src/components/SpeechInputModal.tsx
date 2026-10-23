import React, { useState, useEffect, useRef } from "react";
import { Mic, MicOff, Check, X, Volume2 } from "lucide-react";
import { SupportedLang } from "../data/adviceCards";
import { TRANSLATIONS } from "../data/translations";

interface SpeechInputModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSaveSpokenText: (text: string) => void;
  currentLang: SupportedLang;
  initialText?: string;
  selectedCrop: string;
}

export const SpeechInputModal: React.FC<SpeechInputModalProps> = ({
  isOpen,
  onClose,
  onSaveSpokenText,
  currentLang,
  initialText = "",
  selectedCrop,
}) => {
  const [isRecording, setIsRecording] = useState(false);
  const [transcript, setTranscript] = useState(initialText);
  const [speechSupported, setSpeechSupported] = useState(true);
  const [statusMessage, setStatusMessage] = useState<string>("");
  const recognitionRef = useRef<any>(null);

  const t = TRANSLATIONS[currentLang];

  // Quick farmer problem suggestions for Dakshina Kannada crops
  const suggestionsByCrop: Record<string, { en: string; kn: string; tulu: string }[]> = {
    areca: [
      {
        en: "Nuts are rotting and dropping heavily after rain.",
        kn: "ಮಳೆಯ ನಂತರ ಅಡಿಕೆ ಕಾಯಿಗಳು ಕೊಳೆತು ಉದುರುತ್ತಿವೆ.",
        tulu: "ಬರ್ಸ ಬತ್ತಿ ಬೊಕ್ಕ ಕಾಯಿಲು ಕೊಳೆದ್ ಬೂರುಂಡು.",
      },
      {
        en: "Leaves are turning pale yellow and dry from tips.",
        kn: "ಅಡಿಕೆ ಮರದ ಗರಿಗಳು ಹಳದಿಯಾಗಿ ತುದಿಯಿಂದ ಒಣಗುತ್ತಿವೆ.",
        tulu: "ಇರೆಲು ಮಂಜಲ್ ಆದ್ ಒಣಗುಂಡು.",
      },
    ],
    coconut: [
      {
        en: "The young central heart leaf is rotting with foul smell.",
        kn: "ತೆಂಗಿನ ಮರದ ಸುಳಿ ಕೊಳೆತು ವಾಸನೆ ಬರುತ್ತಿದೆ.",
        tulu: "ತಾರಾಯಿದ ಸುಳಿ ಕೊಳೆದ್ ನಾರುಂಡು.",
      },
      {
        en: "Palm crown looks withered after water logging.",
        kn: "ಬುಡದಲ್ಲಿ ನೀರು ನಿಂತು ತೆಂಗಿನ ಮರ ಸೊರಗಿದೆ.",
        tulu: "ಬುಡೊಡು ನೀರ್ ಉಂತುದು ಮರ ಸೊರಗಿಲೆಕ್ಕ ಆತ್ಂಡ್.",
      },
    ],
    paddy: [
      {
        en: "Spindle-shaped brown spots on paddy leaves with grey centers.",
        kn: "ಭತ್ತದ ಎಲೆಗಳ ಮೇಲೆ ಬೂದು ಮಧ್ಯಭಾಗವಿರುವ ಮಚ್ಚೆಗಳು ಬಂದಿವೆ.",
        tulu: "ಬಾರ್‌ದ ಇರೆತ ಮಿತ್ತ್ ಚುಕ್ಕೆ ಬತ್ತ್ಂಡ್.",
      },
      {
        en: "Excess urea applied and leaves showing burn patches.",
        kn: "ಗದ್ದೆಗೆ ರಸಗೊಬ್ಬರ ಹೆಚ್ಚಾಗಿ ಎಲೆಗಳಲ್ಲಿ ರೋಗ ಕಂಡುಬಂದಿದೆ.",
        tulu: "ಗೊಬ್ಬರ ಜಾಸ್ತಿ ಆದ್ ಇರೆಡ್ ರೋಗ ತೋಜುಂಡು.",
      },
    ],
  };

  useEffect(() => {
    if (!isOpen) return;

    const SpeechRec =
      (window as any).SpeechRecognition ||
      (window as any).webkitSpeechRecognition;

    if (!SpeechRec) {
      setSpeechSupported(false);
      setStatusMessage(t.voiceNotSupported);
      return;
    }

    try {
      const recognition = new SpeechRec();
      recognition.continuous = true;
      recognition.interimResults = true;
      // Kannada for kn & tulu, or en-IN for English
      recognition.lang = currentLang === "kn" || currentLang === "tulu" ? "kn-IN" : "en-IN";

      recognition.onstart = () => {
        setIsRecording(true);
        setStatusMessage(t.listening);
      };

      recognition.onresult = (event: any) => {
        let currentText = "";
        for (let i = 0; i < event.results.length; i++) {
          currentText += event.results[i][0].transcript + " ";
        }
        setTranscript(currentText.trim());
      };

      recognition.onerror = (event: any) => {
        console.warn("Speech recognition notice:", event.error);
        setIsRecording(false);
        if (event.error === "not-allowed") {
          setStatusMessage("Microphone permission denied. Please type your problem.");
        } else {
          setStatusMessage("Voice input stopped. You can edit text below.");
        }
      };

      recognition.onend = () => {
        setIsRecording(false);
      };

      recognitionRef.current = recognition;
    } catch (e) {
      setSpeechSupported(false);
    }

    return () => {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.abort();
        } catch {
          // ignore
        }
      }
    };
  }, [isOpen, currentLang]);

  const toggleRecording = () => {
    if (!speechSupported || !recognitionRef.current) return;

    if (isRecording) {
      try {
        recognitionRef.current.stop();
      } catch (e) {
        // ignore
      }
      setIsRecording(false);
      setStatusMessage("Voice recorded.");
    } else {
      try {
        recognitionRef.current.start();
        setIsRecording(true);
      } catch (e) {
        console.error("Could not start recognition", e);
      }
    }
  };

  const handleApplySuggestion = (text: string) => {
    setTranscript((prev) => (prev ? `${prev} ${text}` : text));
  };

  const handleConfirm = () => {
    onSaveSpokenText(transcript.trim());
    onClose();
  };

  if (!isOpen) return null;

  const currentSuggestions = suggestionsByCrop[selectedCrop] || suggestionsByCrop.areca;

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/80 backdrop-blur-sm p-0 sm:p-4">
      <div className="w-full max-w-md bg-[#0D1B2E] border-t-2 sm:border-2 border-[#1E3A5F] rounded-t-2xl sm:rounded-2xl shadow-2xl p-5 max-h-[90vh] overflow-y-auto text-slate-100">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-[#1E3A5F]">
          <div className="flex items-center gap-2">
            <Volume2 className="w-5 h-5 text-sky-400" />
            <h2 className="text-lg font-bold text-white">
              {t.speakProblem}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-md text-slate-400 hover:text-white hover:bg-[#162D4D]"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Big Mic Action Area */}
        <div className="py-6 flex flex-col items-center justify-center text-center">
          <button
            onClick={toggleRecording}
            className={`w-24 h-24 rounded-full flex items-center justify-center border-4 transition-all ${
              isRecording
                ? "bg-red-700 text-white border-red-500 animate-pulse scale-105 shadow-lg shadow-red-900/50"
                : "bg-[#142844] text-sky-400 border-[#2563EB] hover:bg-[#1E3B64]"
            }`}
            aria-label="Toggle Microphone"
          >
            {isRecording ? (
              <MicOff className="w-10 h-10 text-white" />
            ) : (
              <Mic className="w-10 h-10 text-sky-300" />
            )}
          </button>

          <p className="mt-4 text-sm font-bold text-white">
            {isRecording ? t.listening : "Tap mic to speak"}
          </p>
          <p className="text-xs text-slate-400 mt-1">
            {isRecording ? t.tapToStopVoice : "Kannada, Tulu, or English"}
          </p>
          {statusMessage && (
            <p className="text-xs font-semibold text-sky-300 mt-2 bg-[#12243C] px-3 py-1 rounded border border-[#1E3A5F]">
              {statusMessage}
            </p>
          )}
        </div>

        {/* Text Area for confirmation / manual edit */}
        <div className="mt-2">
          <label className="block text-xs font-bold text-slate-300 mb-1">
            Recorded problem description:
          </label>
          <textarea
            value={transcript}
            onChange={(e) => setTranscript(e.target.value)}
            rows={3}
            placeholder="e.g. Koleroga rot symptoms, fallen nuts, yellowing fronds..."
            className="w-full text-base p-3 bg-[#081220] border-2 border-[#1E3A5F] rounded-lg text-white placeholder-slate-500 focus:border-sky-400 focus:outline-none"
          />
        </div>

        {/* Quick regional phrases */}
        <div className="mt-3">
          <p className="text-xs font-semibold text-slate-400 mb-1.5">
            Or tap common local farmer symptoms:
          </p>
          <div className="space-y-1.5">
            {currentSuggestions.map((sug, idx) => {
              const textToShow =
                currentLang === "kn"
                  ? sug.kn
                  : currentLang === "tulu"
                  ? sug.tulu
                  : sug.en;
              return (
                <button
                  key={idx}
                  onClick={() => handleApplySuggestion(textToShow)}
                  className="w-full text-left text-xs bg-[#091526] hover:bg-[#132742] border border-[#1E3757] text-slate-200 p-2.5 rounded-lg flex items-center justify-between transition-colors"
                >
                  <span className="line-clamp-1">{textToShow}</span>
                  <span className="text-sky-400 font-bold ml-1 text-sm">+</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="mt-5 pt-3 border-t border-[#1E3A5F] flex gap-2">
          <button
            onClick={onClose}
            className="flex-1 py-3 px-4 border border-[#1E3A5F] rounded-xl text-sm font-bold text-slate-300 hover:bg-[#12243C]"
          >
            Cancel
          </button>
          <button
            onClick={handleConfirm}
            className="flex-1 py-3 px-4 bg-[#2563EB] text-white rounded-xl text-sm font-bold flex items-center justify-center gap-1.5 hover:bg-[#1D4ED8] transition-colors"
          >
            <Check className="w-4 h-4" />
            <span>Save & Apply</span>
          </button>
        </div>
      </div>
    </div>
  );
};
