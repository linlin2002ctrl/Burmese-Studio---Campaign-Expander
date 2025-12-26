import { Translations } from './types';

export const TRANSLATIONS: Record<'en' | 'my', Translations> = {
  en: {
    title: "Burmese Studio",
    step1Title: "Import The DNA",
    step1Desc: "Upload your inputs to ensure product and character consistency.",
    promptLabel: "Master Prompt DNA",
    promptPlaceholder: "Paste the original prompt context here...",
    imageLabel: "Hero Shot (Character Ref)",
    sellingItemLabel: "The Selling Item",
    btnPlan: "Plan Photoshoot",
    
    step2Title: "Pose Tactical Planning",
    step2Desc: "Review the AI-suggested poses based on your item and prompt.",
    btnGenerate: "Execute Campaign (6 Photos)",
    
    step3Title: "The Gallery",
    step3Loading: "Developing 6 high-fidelity campaign photos...",
    btnRestart: "Start New Campaign",
    btnDownloadZip: "Download All (.zip)",
    
    errorNoKey: "API Key Required",
    selectKey: "Select Google API Key",
    
    settingsTitle: "Settings",
    apiKeyLabel: "Gemini API Key",
    apiKeyPlaceholder: "Enter your API Key (starts with AIza...)",
    save: "Save Key",
    cancel: "Cancel",
    orEnterKey: "Or enter key manually",
  },
  my: {
    title: "Burmese Studio",
    step1Title: "အချက်အလက်များ ထည့်သွင်းပါ",
    step1Desc: "ဇာတ်ကောင်နှင့် ကုန်ပစ္စည်း တူညီစေရန် အချက်အလက်များ ထည့်ပါ။",
    promptLabel: "မူရင်း စာသား (Master Prompt)",
    promptPlaceholder: "မူရင်းပုံဖန်တီးရာတွင် အသုံးပြုခဲ့သော prompt ကို ဤနေရာတွင် paste လုပ်ပါ...",
    imageLabel: "ဇာတ်ကောင် ပုံ (Hero Shot)",
    sellingItemLabel: "ရောင်းချမည့် ကုန်ပစ္စည်းပုံ",
    btnPlan: "ရိုက်ကူးရေး စီစဉ်မည်",
    
    step2Title: "ပို့စ်ပုံစံ ရွေးချယ်ခြင်း",
    step2Desc: "ကုန်ပစ္စည်းနှင့် ကိုက်ညီမည့် ပို့စ်များကို ရွေးချယ်ပါ။",
    btnGenerate: "ကမ်ပိန်းပုံများ ထုတ်လုပ်မည် (၆ ပုံ)",
    
    step3Title: "ဓာတ်ပုံပြခန်း",
    step3Loading: "ဓာတ်ပုံ ၆ ပုံ ဖန်တီးနေပါသည်... အနည်းငယ် ပိုကြာနိုင်ပါသည်...",
    btnRestart: "ကမ်ပိန်းအသစ် စတင်မည်",
    btnDownloadZip: "အားလုံးကို ZIP ဖြင့် သိမ်းမည်",
    
    errorNoKey: "API Key လိုအပ်ပါသည်",
    selectKey: "Google API Key ရွေးချယ်ပါ",
    
    settingsTitle: "ဆက်တင်များ",
    apiKeyLabel: "Gemini API Key",
    apiKeyPlaceholder: "API Key ထည့်ပါ (AIza ဖြင့်စသော...)",
    save: "သိမ်းဆည်းမည်",
    cancel: "မလုပ်တော့ပါ",
    orEnterKey: "သို့မဟုတ် API Key ကိုယ်တိုင်ထည့်မည်",
  }
};