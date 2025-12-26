export type Language = 'en' | 'my';

export interface CampaignState {
  step: 1 | 2 | 3;
  masterPrompt: string;
  heroImageBase64: string | null;
  sellingItemBase64: string | null; // New field for product reference
  poses: string[];
  generatedImages: string[]; // Array of Base64 strings
  isGenerating: boolean;
  isAnalyzing: boolean;
}

export interface Translations {
  title: string;
  step1Title: string;
  step1Desc: string;
  promptLabel: string;
  promptPlaceholder: string;
  imageLabel: string;
  sellingItemLabel: string; // New label
  btnPlan: string;
  
  step2Title: string;
  step2Desc: string;
  btnGenerate: string;
  
  step3Title: string;
  step3Loading: string;
  btnRestart: string;
  btnDownloadZip: string;
  
  errorNoKey: string;
  selectKey: string;
  
  // Settings
  settingsTitle: string;
  apiKeyLabel: string;
  apiKeyPlaceholder: string;
  save: string;
  cancel: string;
  orEnterKey: string;
}