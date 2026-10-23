import { SupportedLang } from "./adviceCards";

export interface UiTranslations {
  appName: string;
  appTagline: string;
  prototypeBadge: string;
  selectCrop: string;
  areca: string;
  coconut: string;
  paddy: string;
  takePhoto: string;
  speakProblem: string;
  listening: string;
  tapToStopVoice: string;
  voiceRecorded: string;
  voiceNotSupported: string;
  steps: {
    photoCheck: string;
    diseaseCheck: string;
    severityCheck: string;
    weatherCheck: string;
    adviceLookup: string;
    followUp: string;
  };
  whyHeading: string;
  severityHeading: string;
  severityLabels: {
    low: string;
    medium: string;
    high: string;
    none: string;
    uncertain: string;
  };
  whatToDoHeading: string;
  todayLabel: string;
  thisWeekLabel: string;
  safetyTitle: string;
  safetyGloves: string;
  safetyWater: string;
  safetyChildren: string;
  listenButton: string;
  stopListeningButton: string;
  setFollowUpButton: string;
  askExpertButton: string;
  retakeButton: string;
  agentDecisionHeading: string;
  weatherTitle: string;
  offlineSampleTag: string;
  followUpScreenTitle: string;
  followUpPrompt: string;
  takeNewPhoto: string;
  howIsPlantCondition: string;
  better: string;
  same: string;
  worse: string;
  sentToExpertNotice: string;
  expertPageTitle: string;
  expertCasesCount: string;
  expertReplyPlaceholder: string;
  sendReplyButton: string;
  noCasesYet: string;
  backToFarmerView: string;
  switchRoleLabel: string;
  farmerRole: string;
  expertRole: string;
  reminderSaved: string;
}

export const TRANSLATIONS: Record<SupportedLang, UiTranslations> = {
  en: {
    appName: "Bele Mitra",
    appTagline: "AI farm helper for small farmers in Dakshina Kannada",
    prototypeBadge: "Prototype: final app runs the AI on the phone, offline.",
    selectCrop: "1. Select your crop",
    areca: "Areca (ಅಡಿಕೆ)",
    coconut: "Coconut (ತೆಂಗು)",
    paddy: "Paddy (ಭತ್ತ)",
    takePhoto: "Take / upload photo",
    speakProblem: "Speak your problem",
    listening: "Listening... speak now in Kannada, Tulu or English",
    tapToStopVoice: "Tap to finish speaking",
    voiceRecorded: "Voice recorded",
    voiceNotSupported: "Microphone speech not supported in this browser. Please type below.",
    steps: {
      photoCheck: "Photo check",
      diseaseCheck: "Disease check",
      severityCheck: "Severity",
      weatherCheck: "Weather (Mangaluru)",
      adviceLookup: "Expert advice card",
      followUp: "Follow-up reminder",
    },
    whyHeading: "Why:",
    severityHeading: "Severity:",
    severityLabels: {
      low: "Low",
      medium: "Medium",
      high: "High",
      none: "None / Healthy",
      uncertain: "Unclear",
    },
    whatToDoHeading: "What to do:",
    todayLabel: "TODAY",
    thisWeekLabel: "THIS WEEK",
    safetyTitle: "Safety First (Before Any Spray):",
    safetyGloves: "Wear gloves & mask",
    safetyWater: "Keep away from streams & wells",
    safetyChildren: "Keep children & cows away",
    listenButton: "Listen to advice",
    stopListeningButton: "Stop audio",
    setFollowUpButton: "Set follow-up in 5 days",
    askExpertButton: "Ask an expert",
    retakeButton: "Retake photo",
    agentDecisionHeading: "How the agent decided",
    weatherTitle: "Dakshina Kannada Weather Context",
    offlineSampleTag: "Offline sample",
    followUpScreenTitle: "5-Day Follow-Up Check",
    followUpPrompt: "Upload a fresh photo of the same palm/crop to compare changes:",
    takeNewPhoto: "Take fresh follow-up photo",
    howIsPlantCondition: "How is the plant condition now?",
    better: "Better (ಸುಧಾರಿಸಿದೆ)",
    same: "Same (ಮೊದಲಿನಂತಿದೆ)",
    worse: "Worse (ಹೆಚ್ಚಾಗಿದೆ)",
    sentToExpertNotice: "Condition reported worse: Automatically forwarded to KVK Dakshina Kannada agricultural officer for review.",
    expertPageTitle: "Local Agricultural Officer / Expert Desk",
    expertCasesCount: "Farmer cases awaiting advice",
    expertReplyPlaceholder: "Type your official expert advice for this farmer...",
    sendReplyButton: "Send reply to farmer",
    noCasesYet: "No escalated cases yet. When a farmer taps 'Ask an expert' or reports 'Worse', it appears here.",
    backToFarmerView: "Back to Farmer App",
    switchRoleLabel: "Switch view:",
    farmerRole: "Farmer View",
    expertRole: "Expert Desk",
    reminderSaved: "Reminder set! Bele Mitra will prompt you in 5 days.",
  },

  kn: {
    appName: "ಬೆಳೆ ಮಿತ್ರ",
    appTagline: "ದಕ್ಷಿಣ ಕನ್ನಡದ ಸಣ್ಣ ರೈತರಿಗಾಗಿ ಕೃಷಿ ರೋಗ ತಪಾಸಕ",
    prototypeBadge: "ಮಾದರಿ: ಅಂತಿಮ ಆ್ಯಪ್ ಫೋನ್‌ನಲ್ಲೇ ಸಂಪೂರ್ಣ ಆಫ್‌ಲೈನ್‌ನಲ್ಲಿ ಕಾರ್ಯನಿರ್ವಹಿಸುತ್ತದೆ.",
    selectCrop: "೧. ನಿಮ್ಮ ಬೆಳೆಯನ್ನು ಆರಿಸಿ",
    areca: "ಅಡಿಕೆ",
    coconut: "ತೆಂಗು",
    paddy: "ಭತ್ತ",
    takePhoto: "ಫೋಟೋ ತೆಗೆಯಿರಿ / ಅಪ್‌ಲೋಡ್ ಮಾಡಿ",
    speakProblem: "ನಿಮ್ಮ ಸಮಸ್ಯೆಯನ್ನು ಮಾತನಾಡಿ",
    listening: "ಕೇಳಿಸಿಕೊಳ್ಳುತ್ತಿದೆ... ಕನ್ನಡ ಅಥವಾ ತುಳುವಿನಲ್ಲಿ ಮಾತನಾಡಿ",
    tapToStopVoice: "ಮಾತನಾಡುವುದು ಮುಗಿದ ಮೇಲೆ ಇಲ್ಲಿ ಒತ್ತಿ",
    voiceRecorded: "ಧ್ವನಿ ದಾಖಲಾಗಿದೆ",
    voiceNotSupported: "ಈ ಬ್ರೌಸರ್‌ನಲ್ಲಿ ಧ್ವನಿ ಗುರುತಿಸುವಿಕೆ ಲಭ್ಯವಿಲ್ಲ.",
    steps: {
      photoCheck: "ಫೋಟೋ ಸ್ಪಷ್ಟತೆ ಪರಿಶೀಲನೆ",
      diseaseCheck: "ರೋಗ ತಪಾಸಣೆ",
      severityCheck: "ರೋಗದ ತೀವ್ರತೆ",
      weatherCheck: "ಕರಾವಳಿ ಹವಾಮಾನ (ಮಂಗಳೂರು)",
      adviceLookup: "ತಜ್ಞರ ಸಲಹಾ ಕಾರ್ಡ್",
      followUp: "ಫಾಲೋ-ಅಪ್ ಜ್ಞಾಪನೆ",
    },
    whyHeading: "ಕಾರಣಗಳು:",
    severityHeading: "ತೀವ್ರತೆ:",
    severityLabels: {
      low: "ಕಡಿಮೆ",
      medium: "ಮಧ್ಯಮ",
      high: "ಹೆಚ್ಚು",
      none: "ಆರೋಗ್ಯಕರ",
      uncertain: "ಅಸ್ಪಷ್ಟ",
    },
    whatToDoHeading: "ನೀವು ಏನು ಮಾಡಬೇಕು:",
    todayLabel: "ಇಂದು",
    thisWeekLabel: "ಈ ವಾರ",
    safetyTitle: "ಸುರಕ್ಷತಾ ಎಚ್ಚರಿಕೆ (ಔಷಧ ಸಿಂಪಡಣೆ ಮುನ್ನ):",
    safetyGloves: "ಕೈಗವಸು ಮತ್ತು ಮಾಸ್ಕ್ ಧರಿಸಿ",
    safetyWater: "ಬಾವಿ, ಹಳ್ಳದ ನೀರಿನಿಂದ ದೂರವಿಡಿ",
    safetyChildren: "ಮಕ್ಕಳು ಮತ್ತು ದನಕರುಗಳನ್ನು ದೂರವಿಡಿ",
    listenButton: "ಧ್ವನಿಯಲ್ಲಿ ಆಲಿಸಿ",
    stopListeningButton: "ಧ್ವನಿ ನಿಲ್ಲಿಸಿ",
    setFollowUpButton: "೫ ದಿನಗಳ ನಂತರ ಪರಿಶೀಲನೆ ನಿಗದಿಪಡಿಸಿ",
    askExpertButton: "ಕೃಷಿ ತಜ್ಞರನ್ನು ಕೇಳಿ",
    retakeButton: "ಮತ್ತೆ ಫೋಟೋ ತೆಗೆಯಿರಿ",
    agentDecisionHeading: "ಏಜೆಂಟ್ ಹೇಗೆ ನಿರ್ಧಾರ ಕೈಗೊಂಡಿತು",
    weatherTitle: "ದಕ್ಷಿಣ ಕನ್ನಡ ಹವಾಮಾನ ಮುನ್ಸೂಚನೆ",
    offlineSampleTag: "ಆಫ್‌ಲೈನ್ ಮಾದರಿ",
    followUpScreenTitle: "೫ ದಿನಗಳ ನಂತರದ ತಪಾಸಣೆ",
    followUpPrompt: "ಅದೇ ಗಿಡ ಅಥವಾ ಮರದ ಹೊಸ ಫೋಟೋ ತೆಗೆದು ಹೋಲಿಕೆ ಮಾಡಿ:",
    takeNewPhoto: "ಹೊಸ ಫೋಟೋ ತೆಗೆಯಿರಿ",
    howIsPlantCondition: "ಈಗ ಸಸ್ಯದ ಸ್ಥಿತಿ ಹೇಗಿದೆ?",
    better: "ಸುಧಾರಿಸಿದೆ",
    same: "ಮೊದಲಿನಂತಿದೆ",
    worse: "ಹೆಚ್ಚಾಗಿದೆ (ರೋಗ ಉಲ್ಬಣಿಸಿದೆ)",
    sentToExpertNotice: "ರೋಗ ಉಲ್ಬಣಿಸಿದೆ ಎಂದು ಗುರುತಿಸಲಾಗಿದೆ: ಸ್ಥಳೀಯ ಕೆವಿಕೆ ಕೃಷಿ ಅಧಿಕಾರಿಗಳಿಗೆ ತಕ್ಷಣ ಕಳುಹಿಸಲಾಗಿದೆ.",
    expertPageTitle: "ಕೃಷಿ ಅಧಿಕಾರಿ / ತಜ್ಞರ ಪರಿಶೀಲನಾ ಪಟ್ಟಿ",
    expertCasesCount: "ರೈತರ ಕೃಷಿ ಪ್ರಕರಣಗಳು",
    expertReplyPlaceholder: "ಈ ರೈತರಿಗೆ ನಿಮ್ಮ ಅಧಿಕೃತ ಸಲಹೆಯನ್ನು ಇಲ್ಲಿ ಬರೆಯಿರಿ...",
    sendReplyButton: "ರೈತರಿಗೆ ಸಲಹೆ ಕಳುಹಿಸಿ",
    noCasesYet: "ಯಾವುದೇ ಹೊಸ ಪ್ರಕರಣಗಳಿಲ್ಲ. ರೈತರು 'ಕೃಷಿ ತಜ್ಞರನ್ನು ಕೇಳಿ' ಎಂದಾಗ ಇಲ್ಲಿ ಕಾಣಿಸುತ್ತದೆ.",
    backToFarmerView: "ರೈತರ ಮುಖಪುಟಕ್ಕೆ ಮರಳಿ",
    switchRoleLabel: "ವಿಭಾಗ:",
    farmerRole: "ರೈತರ ಆ್ಯಪ್",
    expertRole: "ಕೃಷಿ ಅಧಿಕಾರಿ ವಿಭಾಗ",
    reminderSaved: "ಜ್ಞಾಪನೆ ಉಳಿಸಲಾಗಿದೆ! ೫ ದಿನಗಳ ನಂತರ ಬೆಳೆ ಮಿತ್ರ ನಿಮಗೆ ತಿಳಿಸುತ್ತದೆ.",
  },

  tulu: {
    appName: "ಬೆಳೆ ಮಿತ್ರ",
    appTagline: "ದಕ್ಷಿಣ ಕನ್ನಡದ ಎಲ್ಯ ಬೆಳೆಗಾರರೆಗ್ ಕೃಷಿ ಸಹಾಯಕೆ",
    prototypeBadge: "ಮಾದರಿ: ಅಂತಿಮ ಆ್ಯಪ್ ಫೋನ್‌ನಲ್ಲೇ ಸಂಪೂರ್ಣ ಆಫ್‌ಲೈನ್‌ನಲ್ಲಿ ಕಾರ್ಯನಿರ್ವಹಿಸುತ್ತದೆ.",
    selectCrop: "೧. ಈರೆನ ಬೆಳೆನ್ ಆಜಿಲೆ",
    areca: "ಕಂಗು",
    coconut: "ತಾರಾಯಿ",
    paddy: "ಬಾರ್",
    takePhoto: "ಫೋಟೋ ದೆಪ್ಪಿಲೆ / ಅಪ್‌ಲೋಡ್ ಮಲ್ಪುಲೆ",
    speakProblem: "ಈರೆನ ತೊಂದರೆನ್ ಪನ್ಲೆ",
    listening: "ಕೇನೊಂದುಂಡು... ಪಾತೆರ್ಲೆ",
    tapToStopVoice: "ಪಾತೆರ್ದ್ ಆಯಿ ಬೊಕ್ಕ ಮುಲ್ಪ ಒತ್ತುಲೆ",
    voiceRecorded: "ವಾಯ್ಸ್ ರೆಕಾರ್ಡ್ ಆಂಡ್",
    voiceNotSupported: "ಮೈಕ್ರೋಫೋನ್ ಸೌಲಭ್ಯ ಈ ಬ್ರೌಸರ್‌ಡ್ ಇಜ್ಜಿ.",
    steps: {
      photoCheck: "ಫೋಟೋ ಸರಿಯಿತ್ತೆ ತೂಪುನ",
      diseaseCheck: "ಸೀಕ್ ತಪಾಸಣೆ",
      severityCheck: "ಸೀಕ್‌ದ ಲೆಕ್ಕಾಚಾರ",
      weatherCheck: "ಕುಡ್ಲದ ಹವಾಮಾನ (Mangaluru)",
      adviceLookup: "ತಜ್ಞರೆನ ಸಲಹಾ ಕಾರ್ಡ್",
      followUp: "ದುಂಬುದ ನೆನಪು",
    },
    whyHeading: "ಕಾರಣೊಲು:",
    severityHeading: "ಸೀಕ್‌ದ ತೀವ್ರತೆ:",
    severityLabels: {
      low: "ಕಡಿಮೆ",
      medium: "ಮಧ್ಯಮ",
      high: "ಜಾಸ್ತಿ",
      none: "ಸೌಖ್ಯ ಉಂಡು",
      uncertain: "ಗೊತ್ತಾವಂದಿನ",
    },
    whatToDoHeading: "ಇನಿ ಬೊಕ್ಕ ಈ ವಾರ ದಾದ ಮಲ್ಪೊಡು:",
    todayLabel: "ಇನಿ",
    thisWeekLabel: "ಈ ವಾರ",
    safetyTitle: "ಜಾಗ್ರತೆ ಮಲ್ಪುಲೆ (ಮರ್ದ್ ತಲ್ಪುನ ದುಂಬು):",
    safetyGloves: "ಕೈಗವಸು, ಮೂಗುಗು ಮುಚ್ಚಳ ಪಾಡ್ಲೆ",
    safetyWater: "ತೋಡು, ಬಾವಿದ ನೀರ್‌ಡ್ದ್ ದೂರ ದೀಲೆ",
    safetyChildren: "ಜೋಕುಲು ಬೊಕ್ಕ ಪೆತ್ತಲೆನ್ ದೂರ ದೀಲೆ",
    listenButton: "ಕೇನ್ಲೆ (Listen)",
    stopListeningButton: "ಉಂತಾಲೆ",
    setFollowUpButton: "೫ ದಿನ ಕರಿತ್ ತೂಪುನೆಕ್ ಜ್ಞಾಪನೆ ದೀಲೆ",
    askExpertButton: "ಕೃಷಿ ತಜ್ಞರೆಡ ಕೇನ್ಲೆ",
    retakeButton: "ಕುಡೊರ ಫೋಟೋ ದೆಪ್ಪಿಲೆ",
    agentDecisionHeading: "ಏಜೆಂಟ್ ತೀರ್ಮಾನ ಮಲ್ತಿನ ವಿವರ",
    weatherTitle: "ದಕ್ಷಿಣ ಕನ್ನಡದ ಬರ್ಸದ ಲೆಕ್ಕ",
    offlineSampleTag: "ಆಫ್‌ಲೈನ್ ಸ್ಯಾಂಪಲ್",
    followUpScreenTitle: "೫ ದಿನ ಕರಿತ್ ತಪಾಸಣೆ",
    followUpPrompt: "ಅವೇ ಗಿಡತ್ತ ಪೊಸ ಫೋಟೋ ದೆತ್ತ್‌ದ್ ಹೋಲಿಕೆ ಮಲ್ಪುಲೆ:",
    takeNewPhoto: "ಪೊಸ ಫೋಟೋ ದೆಪ್ಪಿಲೆ",
    howIsPlantCondition: "ಇತ್ತೆ ಗಿಡತ್ತ ಸ್ಥಿತಿ ಎಂಚ ಉಂಡು?",
    better: "ಸುಧಾರಿಸಾಂಡ್",
    same: "ಅಂಚನೆ ಉಂಡು",
    worse: "ಜಾಸ್ತಿ ಆತ್ಂಡ್ (ಉಲ್ಬಣಿಸಾಂಡ್)",
    sentToExpertNotice: "ಸೀಕ್ ಜಾಸ್ತಿ ಆಂಡ್ ಪಂಡ್ದ್ ಕೃಷಿ ಅಧಿಕಾರಿಲೆಗ್ ಕಡಪುಡ್ತ್ಂಡ್.",
    expertPageTitle: "ಕೃಷಿ ತಜ್ಞರೆನ ವಿಭಾಗ (Expert Desk)",
    expertCasesCount: "ಬೆಳೆಗಾರರೆನ ಕೇಸ್‌ಲು",
    expertReplyPlaceholder: "ರೈತೆರೆಗ್ ಸರಿಯಾಯಿನ ಸಲಹೆನ್ ಮುಲ್ಪ ಬರೆಲೆ...",
    sendReplyButton: "ರೈತೆರೆಗ್ ಉತ್ತರ ಕಡಪುಡ್ಲೆ",
    noCasesYet: "ದಾಂತೆ ಕೇಸ್‌ಲು ಇಜ್ಜಿ. ರೈತೆರ್ ಕೇಂಡ ಮುಲ್ಪ ತೋಜುಂಡು.",
    backToFarmerView: "ರೈತೆರೆನ ಆ್ಯಪ್‌ಗ್ ಪಿರ ಪೋಲೆ",
    switchRoleLabel: "ವಿಭಾಗ:",
    farmerRole: "ರೈತರ ಆ್ಯಪ್",
    expertRole: "ತಜ್ಞರ ವಿಭಾಗ",
    reminderSaved: "ಜ್ಞಾಪನೆ ಆತ್ಂಡ್! ೫ ದಿನ ಕರಿತ್ ಬೆಳೆ ಮಿತ್ರ ಈರೆಗ್ ತೆರಿಪಾವು.",
  },
};
