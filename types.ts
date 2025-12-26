
export type Language = 'en' | 'my';

export interface CampaignState {
  step: 1 | 2 | 3;
  masterPrompt: string;
  heroImageBase64: string | null;
  sellingItemBase64: string | null;
  poses: string[];
  generatedImages: string[];
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
  sellingItemLabel: string;
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
