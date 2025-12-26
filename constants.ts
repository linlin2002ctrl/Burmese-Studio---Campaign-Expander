
import { Translations } from './types';

export const TRANSLATIONS: Record<'en' | 'my', Translations> = {
  en: {
    title: "Burmese Studio",
    
    navStudio: "Studio",
    navPlan: "Plan",
    navGallery: "Gallery",
    navSettings: "Settings",

    step1Title: "Design Studio",
    step1Desc: "Define the DNA of your campaign.",
    promptLabel: "Master Prompt",
    promptPlaceholder: "Describe the scene, mood, and style...",
    imageLabel: "Hero Reference",
    sellingItemLabel: "Product",
    btnPlan: "Analyze & Plan Strategy",
    
    step2Title: "Strategy",
    step2Desc: "AI-suggested poses based on your creative direction.",
    btnGenerate: "Develop Campaign (6 Photos)",
    
    step3Title: "Gallery",
    step3Loading: "Developing high-fidelity negatives...",
    btnRestart: "New Campaign",
    btnDownloadZip: "Export All",
    
    errorNoKey: "Studio Locked",
    selectKey: "Insert Key",
    
    settingsTitle: "Configuration",
    appearanceTitle: "Appearance",
    appearanceLight: "Light",
    appearanceDark: "Dark",
    languageTitle: "Language",
    languageEn: "English",
    languageMy: "Myanmar",
    
    editApiTitle: "Access Key",
    getKey: "Get Key",
    apiKeyLabel: "Gemini API Key",
    apiKeyPlaceholder: "AIza...",
    apiKeyHelper: "Keys are stored locally on your device.",
    
    networkTitle: "Network",
    proxyServerLabel: "SG Gateway",
    proxyServerDesc: "Low latency routing for Myanmar",
    proxyUrlLabel: "Endpoint",
    proxyHelper: "Bypass regional restrictions securely.",
    
    statusTitle: "Status",
    statusConnected: "Rerouted (SG)",
    statusStandard: "Direct",
    
    save: "Save Config",
    cancel: "Revert",
    orEnterKey: "Manual Entry",
  },
  my: {
    title: "Burmese Studio",
    
    navStudio: "စတူဒီယို",
    navPlan: "စီစဉ်ရန်",
    navGallery: "ပြခန်း",
    navSettings: "ဆက်တင်",

    step1Title: "ဒီဇိုင်း စတူဒီယို",
    step1Desc: "ကမ်ပိန်းအတွက် အချက်အလက်များ သတ်မှတ်ပါ။",
    promptLabel: "Master Prompt",
    promptPlaceholder: "ပုံစံ၊ စတိုင်နှင့် အငွေ့အသက်ကို ဖော်ပြပါ...",
    imageLabel: "ဇာတ်ကောင်",
    sellingItemLabel: "ကုန်ပစ္စည်း",
    btnPlan: "သုံးသပ်၍ စီစဉ်မည်",
    
    step2Title: "ဗျူဟာ",
    step2Desc: "AI မှ အကြံပြုထားသော ပို့စ်ပုံစံများ။",
    btnGenerate: "ပုံ ၆ ပုံ ထုတ်လုပ်မည်",
    
    step3Title: "ပြခန်း",
    step3Loading: "ပုံများကို ဖန်တီးနေပါသည်...",
    btnRestart: "အသစ်ပြန်စမည်",
    btnDownloadZip: "သိမ်းဆည်းမည်",
    
    errorNoKey: "သော့ လိုအပ်သည်",
    selectKey: "သော့ ရွေးပါ",
    
    settingsTitle: "ဆက်တင်များ",
    appearanceTitle: "အသွင်အပြင်",
    appearanceLight: "အလင်း",
    appearanceDark: "အမှောင်",
    languageTitle: "ဘာသာစကား",
    languageEn: "အင်္ဂလိပ်",
    languageMy: "မြန်မာ",

    editApiTitle: "API Key",
    getKey: "Key ရယူပါ",
    apiKeyLabel: "Gemini API Key",
    apiKeyPlaceholder: "AIza...",
    apiKeyHelper: "သင့်ဖုန်းထဲတွင်သာ သိမ်းဆည်းပါသည်။",
    
    networkTitle: "ကွန်ရက်",
    proxyServerLabel: "SG Gateway",
    proxyServerDesc: "မြန်မာနိုင်ငံအတွက် အထူးလိုင်း",
    proxyUrlLabel: "Endpoint",
    proxyHelper: "VPN မလိုဘဲ အသုံးပြုနိုင်ရန်။",
    
    statusTitle: "အခြေအနေ",
    statusConnected: "Rerouted (SG)",
    statusStandard: "Direct",
    
    save: "သိမ်းဆည်းမည်",
    cancel: "မလုပ်တော့ပါ",
    orEnterKey: "ကိုယ်တိုင်ထည့်မည်",
  }
};