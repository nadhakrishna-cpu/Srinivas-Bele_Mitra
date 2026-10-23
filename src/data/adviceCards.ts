export type SupportedLang = "en" | "kn" | "tulu";

export interface AdviceItem {
  disease_id: string;
  crop_type: "areca" | "coconut" | "paddy";
  disease_name: {
    en: string;
    kn: string;
    tulu: string;
  };
  signs: {
    en: string;
    kn: string;
    tulu: string;
  };
  today: {
    en: string;
    kn: string;
    tulu: string;
  };
  this_week: {
    en: string;
    kn: string;
    tulu: string;
  };
  mandatory_warning: {
    en: string;
    kn: string;
    tulu: string;
  };
  safety_required: boolean;
}

export const ADVICE_CARDS: Record<string, AdviceItem> = {
  areca_koleroga: {
    disease_id: "areca_koleroga",
    crop_type: "areca",
    disease_name: {
      en: "Areca Koleroga (Fruit Rot / Mahali)",
      kn: "ಅಡಿಕೆ ಕೊಳೆರೋಗ (ಮಹಾಲಿ)",
      tulu: "ಕಂಗು ಕೊಳೆರೋಗ (ಮಹಾಲಿ)",
    },
    signs: {
      en: "Nuts rot and fall, wet dark patches, white fungal growth in rain.",
      kn: "ಅಡಿಕೆ ಕಾಯಿಗಳು ಕೊಳೆತು ಉದುರುತ್ತವೆ, ನೀರಿನಂತೆ ಕಪ್ಪು ಕಲೆಗಳು ಕಾಣಿಸುತ್ತವೆ, ಮಳೆಯಲ್ಲಿ ಬಿಳಿ ಶಿಲೀಂಧ್ರ ಬೆಳೆಯುತ್ತದೆ.",
      tulu: "ಕಾಯಿಲು ಕೊಳೆದ್ ಬೂರುಂಡು, ಕಪ್ಪು ಕಲೆ ತೋಜುಂಡು, ಬರ್ಸಡ್ ಬೊಲ್ದು ಬಲೆ ಬರ್ಪುಂಡು.",
    },
    today: {
      en: "Collect and destroy fallen and rotten nuts away from the garden, keep the drainage clear.",
      kn: "ತೋಟದಿಂದ ಉದುರಿದ ಮತ್ತು ಕೊಳೆತ ಅಡಿಕೆಗಳನ್ನು ದೂರ ಸಂಗ್ರಹಿಸಿ ನಾಶಪಡಿಸಿ, ಕಾಲುವೆಗಳಲ್ಲಿ ನೀರು ನಿಲ್ಲದಂತೆ ನೀರಾವರಿ ಚರಂಡಿಯನ್ನು ಸ್ವಚ್ಛವಾಗಿಡಿ.",
      tulu: "ತೋಟಡ್ದ್ ಬೂರಿನ ಕೊಳೆತ ಕಾಯಿಲೆನ್ ಒಟ್ಟೆ ಮಲ್ತ್ ದೂರು ಪಾಡ್ಲೆ, ತೋಡುಡು ನೀರ್ ಒರಿಪಂದೆ ಸರಿ ಮಲ್ಪುಲೆ.",
    },
    this_week: {
      en: "Ask the local agriculture officer or KVK about the protective spray and the right dose before and during heavy rain.",
      kn: "ಭಾರೀ ಮಳೆ ಬರುವ ಮೊದಲು ಮತ್ತು ಮಳೆಯ ಸಮಯದಲ್ಲಿ ರಕ್ಷಣಾತ್ಮಕ ಸಿಂಪಡಣೆ ಮತ್ತು ಸರಿಯಾದ ಪ್ರಮಾಣದ ಬಗ್ಗೆ ಸ್ಥಳೀಯ ಕೃಷಿ ಅಧಿಕಾರಿ ಅಥವಾ ಕೆವಿಕೆಯನ್ನು (KVK) ಕೇಳಿ.",
      tulu: "ಮಲ್ಲ ಬರ್ಸ ಬರ್ಪಿನ ದುಂಬು ಮರ್ದ್ ತಲ್ಪುನ ಬಗೆಟ್ ಕೃಷಿ ಅಧಿಕಾರಿ ಇಜ್ಜಾಂಡ ಕೆವಿಕೆಗ್ (KVK) ಕೇನ್ಲೆ.",
    },
    mandatory_warning: {
      en: "Confirm with your local agriculture officer or KVK before spraying.",
      kn: "ಯಾವುದೇ ಔಷಧ ಸಿಂಪಡಿಸುವ ಮೊದಲು ನಿಮ್ಮ ಸ್ಥಳೀಯ ಕೃಷಿ ಅಧಿಕಾರಿ ಅಥವಾ ಕೆವಿಕೆಯನ್ನು ಖಚಿತಪಡಿಸಿಕೊಳ್ಳಿ.",
      tulu: "ಮರ್ದ್ ತಲ್ಪುನ ದುಂಬು ಊರುದ ಕೃಷಿ ಅಧಿಕಾರಿ ಇಜ್ಜಾಂಡ ಕೆವಿಕೆಡ್ ಕೇನ್ದ್ ಖಚಿತ ಮಲ್ಪುಲೆ.",
    },
    safety_required: true,
  },

  areca_yellow_leaf: {
    disease_id: "areca_yellow_leaf",
    crop_type: "areca",
    disease_name: {
      en: "Areca Yellow Leaf Disease",
      kn: "ಅಡಿಕೆ ಹಳದಿ ಎಲೆ ರೋಗ",
      tulu: "ಕಂಗು ಮಂಜಲ್ ಇರೆ ಸೀಕ್",
    },
    signs: {
      en: "Leaves turn yellow and dry.",
      kn: "ಗರಿಗಳು ಹಳದಿ ಬಣ್ಣಕ್ಕೆ ತಿರುಗಿ ಒಣಗುತ್ತವೆ.",
      tulu: "ಇರೆಲು ಮಂಜಲ್ ಆದ್ ನುಂಗುಂಡು.",
    },
    today: {
      en: "Mark the affected palms.",
      kn: "ರೋಗಲಕ್ಷಣವಿರುವ ಅಡಿಕೆ ಮರಗಳನ್ನು ಗುರುತು ಹಾಕಿಡಿ.",
      tulu: "ಸೀಕ್ ತೋಜಿದ್ ಬತ್ತಿನ ಕಂಗುಲೆಗ್ ಗುರುತು ಪಾಡ್ಲೆ.",
    },
    this_week: {
      en: "Contact the KVK or horticulture officer for a visit.",
      kn: "ತೋಟದ ಭೇಟಿ ಮತ್ತು ಪರಿಶೀಲನೆಗಾಗಿ ಕೆವಿಕೆ (KVK) ಅಥವಾ ತೋಟಗಾರಿಕಾ ಅಧಿಕಾರಿಯನ್ನು ಸಂಪರ್ಕಿಸಿ.",
      tulu: "ತೋಟ ತೂಯೆರೆ ಕೆವಿಕೆ (KVK) ಇಜ್ಜಾಂಡ ತೋಟಗಾರಿಕೆ ಅಧಿಕಾರಿಲೆಗ್ ತೆರಿಪಾಲೆ.",
    },
    mandatory_warning: {
      en: "Confirm with your local agriculture officer or KVK before spraying.",
      kn: "ಯಾವುದೇ ಕ್ರಮ ಕೈಗೊಳ್ಳುವ ಮುನ್ನ ಸ್ಥಳೀಯ ಕೃಷಿ ಅಥವಾ ತೋಟಗಾರಿಕಾ ಅಧಿಕಾರಿಯನ್ನು ಖಚಿತಪಡಿಸಿಕೊಳ್ಳಿ.",
      tulu: "ಮರ್ದ್ ತಲ್ಪುನ ದುಂಬು ಊರುದ ಕೃಷಿ ಅಧಿಕಾರಿ ಇಜ್ಜಾಂಡ ಕೆವಿಕೆಡ್ ಕೇನ್ಲೆ.",
    },
    safety_required: false,
  },

  coconut_bud_rot: {
    disease_id: "coconut_bud_rot",
    crop_type: "coconut",
    disease_name: {
      en: "Coconut Bud Rot",
      kn: "ತೆಂಗಿನ ಸುಳಿ ಕೊಳೆರೋಗ",
      tulu: "ತಾರಾಯಿ ಸುಳಿ ಕೊಳೆ ಸೀಕ್",
    },
    signs: {
      en: "The youngest leaf turns pale and rots with bad smell.",
      kn: "ತೆಂಗಿನ ಮರದ ಕಿರಿಯ ಸುಳಿ ಗರಿಯು ಬಣ್ಣಗೆಟ್ಟು ದುರ್ವಾಸನೆಯಿಂದ ಕೊಳೆಯುತ್ತದೆ.",
      tulu: "ಎಲ್ಯ ಸುಳಿ ಇರೆ ಬೊಲ್ದು ಆದ್ ನಾರ್ದ್ ಕೊಳೆಪುಂಡು.",
    },
    today: {
      en: "Tell the agriculture officer quickly, do not wait.",
      kn: "ವಿಳಂಬ ಮಾಡದೆ ತಕ್ಷಣವೇ ಕೃಷಿ ಅಧಿಕಾರಿಗೆ ಮಾಹಿತಿ ನೀಡಿ, ಕಾಯಬೇಡಿ.",
      tulu: "ತಡ ಮಲ್ಪಂದೆ ಬೇಗನೆ ಕೃಷಿ ಅಧಿಕಾರಿಗ್ ತೆರಿಪಾಲೆ, ಕಾತೊಂತ್ ಕುಲ್ಲೊಡ್ಚಿ.",
    },
    this_week: {
      en: "Follow the officer's advice for treatment.",
      kn: "ಉಪಚಾರ ಮತ್ತು ರಕ್ಷಣಾ ಕ್ರಮಗಳಿಗಾಗಿ ಅಧಿಕಾರಿಯ ಮಾರ್ಗದರ್ಶನವನ್ನು ತಪ್ಪದೇ ಪಾಲಿಸಿ.",
      tulu: "ಅಧಿಕಾರಿ ಪಂಡಿಲೆಕ್ಕ ಮರ್ದ್ ಬೊಕ್ಕ ಆರೈಕೆ ಮಲ್ಪುಲೆ.",
    },
    mandatory_warning: {
      en: "Confirm with your local agriculture officer or KVK before spraying.",
      kn: "ಯಾವುದೇ ಔಷಧ ಸಿಂಪಡಿಸುವ ಮೊದಲು ನಿಮ್ಮ ಸ್ಥಳೀಯ ಕೃಷಿ ಅಧಿಕಾರಿ ಅಥವಾ ಕೆವಿಕೆಯನ್ನು ಖಚಿತಪಡಿಸಿಕೊಳ್ಳಿ.",
      tulu: "ಮರ್ದ್ ತಲ್ಪುನ ದುಂಬು ಊರುದ ಕೃಷಿ ಅಧಿಕಾರಿ ಇಜ್ಜಾಂಡ ಕೆವಿಕೆಡ್ ಕೇನ್ಲೆ.",
    },
    safety_required: true,
  },

  paddy_blast: {
    disease_id: "paddy_blast",
    crop_type: "paddy",
    disease_name: {
      en: "Paddy Leaf Blast",
      kn: "ಭತ್ತದ ಬೆಂಕಿ ರೋಗ (ಬ್ಲಾಸ್ಟ್)",
      tulu: "ಬಾರ್‌ದ ತೂಟೆ ಸೀಕ್ (ಬ್ಲಾಸ್ಟ್)",
    },
    signs: {
      en: "Diamond-shaped spots with grey centres on leaves.",
      kn: "ಎಲೆಗಳ ಮೇಲೆ ಬೂದು ಬಣ್ಣದ ಮಧ್ಯಭಾಗವಿರುವ ವಜ್ರಾಕಾರದ ಕಲೆಗಳು ಕಂಡುಬರುತ್ತವೆ.",
      tulu: "ಇರೆತ ಮಿತ್ತ್ ಬೂದು ಬಣ್ಣದ ನಡು ಇತ್ತಿನ ವಜ್ರದ ಲೆಕ್ಕದ ಕಲೆ ತೋಜುಂಡು.",
    },
    today: {
      en: "Avoid too much nitrogen fertiliser, drain extra water.",
      kn: "ಹೆಚ್ಚಿನ ಸಾರಜನಕ (ಯೂರಿಯಾ) ಗೊಬ್ಬರ ಹಾಕುವುದನ್ನು ತಪ್ಪಿಸಿ, ಗದ್ದೆಯಲ್ಲಿ ನಿಂತಿರುವ ಹೆಚ್ಚುವರಿ ನೀರನ್ನು ಹೊರಹಾಕಿ.",
      tulu: "ಜಾಸ್ತಿ ಯೂರಿಯಾ ಗೊಬ್ಬರ ಪಾಡೊಡ್ಚಿ, ಗದ್ದೆಡ್ ಜಾಸ್ತಿ ಉಂತಿನ ನೀರ್ ಪಿದಯಿ ಬುಡ್ಲೆ.",
    },
    this_week: {
      en: "Ask the agriculture officer for the correct fungicide and dose.",
      kn: "ಸೂಕ್ತ ಶಿಲೀಂಧ್ರನಾಶಕ ಮತ್ತು ಪ್ರಮಾಣಕ್ಕಾಗಿ ಕೃಷಿ ಅಧಿಕಾರಿಯನ್ನು ಕೇಳಿ ತಿಳಿದುಕೊಳ್ಳಿ.",
      tulu: "ಸರಿಯಾಯಿನ ಮರ್ದ್ ಬೊಕ್ಕ ಅಳತೆದ ಬಗೆಟ್ ಕೃಷಿ ಅಧಿಕಾರಿನ್ ಕೇನ್ಲೆ.",
    },
    mandatory_warning: {
      en: "Confirm with your local agriculture officer or KVK before spraying.",
      kn: "ಯಾವುದೇ ಔಷಧ ಸಿಂಪಡಿಸುವ ಮೊದಲು ನಿಮ್ಮ ಸ್ಥಳೀಯ ಕೃಷಿ ಅಧಿಕಾರಿ ಅಥವಾ ಕೆವಿಕೆಯನ್ನು ಖಚಿತಪಡಿಸಿಕೊಳ್ಳಿ.",
      tulu: "ಮರ್ದ್ ತಲ್ಪುನ ದುಂಬು ಊರುದ ಕೃಷಿ ಅಧಿಕಾರಿ ಇಜ್ಜಾಂಡ ಕೆವಿಕೆಡ್ ಕೇನ್ಲೆ.",
    },
    safety_required: true,
  },
};
