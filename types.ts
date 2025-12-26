
export type Language = 'en' | 'my';

export type TabId = 'studio' | 'plan' | 'gallery' | 'settings';

export interface CampaignState {
  step: 1 | 2 | 3; // Deprecated conceptually, but kept for logic if needed
  masterPrompt: string;
  heroImageBase64: string | null;
  sellingItemBase64: string | null;
  poses: string[];
  generatedImages: string[];
  isGenerating: boolean;
  isAnalyzing: boolean;
  error: string | null; // Added field for error handling
}

export interface Translations {
  title: string;
  
  // Navigation
  navStudio: string;
  navPlan: string;
  navGallery: string;
  navSettings: string;

  // Studio
  step1Title: string;
  step1Desc: string;
  promptLabel: string;
  promptPlaceholder: string;
  imageLabel: string;
  sellingItemLabel: string;
  btnPlan: string;
  
  // Plan
  step2Title: string;
  step2Desc: string;
  btnGenerate: string;
  
  // Gallery
  step3Title: string;
  step3Loading: string;
  btnRestart: string;
  btnDownloadZip: string;
  
  errorNoKey: string;
  selectKey: string;
  
  // Settings
  settingsTitle: string;
  appearanceTitle: string;
  appearanceLight: string;
  appearanceDark: string;
  languageTitle: string;
  languageEn: string;
  languageMy: string;
  
  editApiTitle: string;
  getKey: string;
  apiKeyLabel: string;
  apiKeyPlaceholder: string;
  apiKeyHelper: string;
  
  networkTitle: string;
  proxyServerLabel: string;
  proxyServerDesc: string;
  proxyUrlLabel: string;
  proxyHelper: string;
  
  statusTitle: string;
  statusConnected: string;
  statusStandard: string;
  
  save: string;
  cancel: string;
  orEnterKey: string;
}