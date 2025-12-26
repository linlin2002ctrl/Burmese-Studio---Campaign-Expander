
import React, { useState, useEffect } from 'react';
import { CampaignState, Language, TabId } from './types';
import { TRANSLATIONS } from './constants';
import { suggestPoses, generateCampaignImage } from './services/geminiService';
import { Step1Import } from './components/Step1Import';
import { Step2Plan } from './components/Step2Plan';
import { Step3Gallery } from './components/Step3Gallery';
import { SettingsView } from './components/SettingsModal'; 

const initialState: CampaignState = {
  step: 1,
  masterPrompt: '',
  heroImageBase64: null,
  sellingItemBase64: null,
  poses: [],
  generatedImages: [],
  isGenerating: false,
  isAnalyzing: false,
  error: null,
};

const DEFAULT_PROXY = 'https://sg-gateway.burmese-studio.ai/v1beta';

// --- Components ---

const ErrorBanner: React.FC<{ message: string | null; onDismiss: () => void }> = ({ message, onDismiss }) => {
  if (!message) return null;
  return (
    <div className="fixed top-6 left-1/2 -translate-x-1/2 z-[100] w-[90%] max-w-md animate-slide-up">
      <div className="bg-red-500/10 backdrop-blur-md border border-red-500/20 rounded-2xl p-4 flex items-center gap-3 shadow-glow ring-1 ring-red-500/30">
        <svg className="w-5 h-5 text-red-500 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
        </svg>
        <p className="flex-1 text-sm font-medium text-red-200">{message}</p>
        <button onClick={onDismiss} className="text-red-300 hover:text-white transition-colors">
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
    </div>
  );
};

// Icons with filled/outline states
const Icons = {
  studio: (active: boolean) => active ? 
    <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 14H9v-2h2v2zm0-4H9V7h2v5z"/></svg> :
    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>,
  plan: (active: boolean) => active ?
    <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor"><path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-7 14h-2v-4h2v4zm4 0h-2v-4h2v4zm-4-6h-2V7h2v4zm4 0h-2V7h2v4z"/></svg> :
    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>,
  gallery: (active: boolean) => active ?
    <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor"><path d="M20 2H4c-1.1 0-2 .9-2 2v16c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm-9 14H7v-4h4v4zm0-6H7V6h4v4zm6 6h-4v-4h4v4zm0-6h-4V6h4v4z"/></svg> :
    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" /></svg>,
  settings: (active: boolean) => active ?
    <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor"><path d="M19.14 12.94c.04-.3.06-.61.06-.94 0-.32-.02-.64-.07-.94l2.03-1.58c.18-.14.23-.41.12-.61l-1.92-3.32c-.12-.22-.37-.29-.59-.22l-2.39.96c-.5-.38-1.03-.7-1.62-.94l-.36-2.54c-.04-.24-.24-.41-.48-.41h-3.84c-.24 0-.43.17-.47.41l-.36 2.54c-.59.24-1.13.57-1.62.94l-2.39-.96c-.22-.08-.47 0-.59.22L2.74 8.87c-.12.21-.08.47.12.61l2.03 1.58c-.05.3-.09.63-.09.94s.02.64.07.94l-2.03 1.58c-.18.14-.23.41-.12.61l1.92 3.32c.12.22.37.29.59.22l2.39-.96c.5.38 1.03.7 1.62.94l.36 2.54c.05.24.24.41.48.41h3.84c.24 0 .44-.17.47-.41l.36-2.54c.59-.24 1.13-.56 1.62-.94l2.39.96c.22.08.47 0 .59.22l1.92-3.32c.12-.22.07-.47-.12-.61l-2.01-1.58zM12 15.6c-1.98 0-3.6-1.62-3.6-3.6s1.62-3.6 3.6-3.6 3.6 1.62 3.6 3.6-1.62 3.6-3.6 3.6z"/></svg> :
    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /></svg>
};

const App: React.FC = () => {
  const [lang, setLang] = useState<Language>(() => (localStorage.getItem('app_lang') as Language) || 'en');
  const [theme, setTheme] = useState<'light' | 'dark'>(() => (localStorage.getItem('app_theme') as 'light' | 'dark') || 
    (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'));

  const [state, setState] = useState<CampaignState>(initialState);
  const [activeTab, setActiveTab] = useState<TabId>('studio');
  
  const [apiKey, setApiKey] = useState('');
  const [useProxy, setUseProxy] = useState(false);
  const [proxyUrl, setProxyUrl] = useState(DEFAULT_PROXY);

  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark');
  }, [theme]);

  useEffect(() => {
    document.documentElement.lang = lang;
    localStorage.setItem('app_lang', lang);
  }, [lang]);

  useEffect(() => {
    const storedKey = localStorage.getItem('gemini_api_key');
    if (storedKey) setApiKey(storedKey);
    setUseProxy(localStorage.getItem('use_proxy') === 'true');
    const storedProxy = localStorage.getItem('proxy_url');
    if (storedProxy) setProxyUrl(storedProxy);
  }, []);

  const updateState = (updates: Partial<CampaignState>) => {
    setState(prev => ({ ...prev, ...updates }));
  };

  const handleSaveSettings = (key: string, newUseProxy: boolean, newProxyUrl: string) => {
    setApiKey(key);
    localStorage.setItem('gemini_api_key', key);
    setUseProxy(newUseProxy);
    localStorage.setItem('use_proxy', String(newUseProxy));
    setProxyUrl(newProxyUrl);
    localStorage.setItem('proxy_url', newProxyUrl);
    updateState({ error: null });
  };

  const handleAnalyzePrompt = async () => {
    if (!state.masterPrompt) return;
    updateState({ isAnalyzing: true, error: null });
    try {
      const suggestedPoses = await suggestPoses(apiKey, state.masterPrompt, useProxy ? proxyUrl : undefined);
      updateState({ poses: suggestedPoses, isAnalyzing: false });
      setActiveTab('plan');
    } catch (e: any) {
      updateState({ isAnalyzing: false, error: e.message || "Failed to analyze prompt." });
      if (e.message?.includes("API Key")) setTimeout(() => setActiveTab('settings'), 2000);
    }
  };

  const handleGenerateCampaign = async () => {
    if (!state.heroImageBase64 || !state.sellingItemBase64) return;
    updateState({ isGenerating: true, generatedImages: [], error: null });
    setActiveTab('gallery');

    const errors: string[] = [];
    const promises = state.poses.map(async (pose) => {
      try {
        return await generateCampaignImage(apiKey, state.heroImageBase64!, state.sellingItemBase64!, state.masterPrompt, pose, useProxy ? proxyUrl : undefined);
      } catch (err: any) {
        errors.push(err.message || "Unknown error");
        return null;
      }
    });

    const rawResults = await Promise.all(promises);
    const validResults = rawResults.filter(Boolean) as string[];

    let finalError = null;
    if (validResults.length === 0 && errors.length > 0) finalError = errors[0];
    else if (errors.length > 0) finalError = `Partial success: ${errors.length} images failed.`;

    updateState({ isGenerating: false, generatedImages: validResults, error: finalError });
  };

  const t = TRANSLATIONS[lang];
  const tabs: TabId[] = ['studio', 'plan', 'gallery', 'settings'];

  return (
    // Wide-Responsive Layout: Grid [Sidebar (Auto) | Content (1fr)]
    <div className="min-h-screen w-full flex flex-col md:grid md:grid-cols-[auto_1fr] bg-[#F2F2F7] dark:bg-[#121212] font-sans">
      
      {/* Error Banner */}
      <ErrorBanner message={state.error} onDismiss={() => updateState({ error: null })} />

      {/* Desktop Sidebar Rail */}
      <nav className="hidden md:flex flex-col items-center sticky top-0 h-screen w-28 py-8 border-r border-black/5 dark:border-white/5 bg-white/50 dark:bg-mono-900/50 backdrop-blur-xl z-40">
        <div className="w-8 h-8 rounded-full bg-accent mb-12 shadow-glow"></div>
        
        <div className="flex flex-col gap-8 w-full px-4">
           {tabs.map((tab) => {
             const isActive = activeTab === tab;
             return (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`flex flex-col items-center justify-center p-3 rounded-2xl transition-all duration-300 group
                  ${isActive ? 'bg-white dark:bg-mono-800 text-accent shadow-soft scale-100' : 'text-mono-400 hover:text-mono-900 dark:hover:text-white hover:bg-white/40 dark:hover:bg-white/5'}`}
              >
                <div className={`transition-transform duration-200 ${isActive ? 'scale-110' : 'group-hover:scale-110'}`}>
                   {Icons[tab](isActive)}
                </div>
                <span className={`text-[10px] font-bold mt-2 transition-colors ${isActive ? 'text-mono-900 dark:text-white' : 'text-mono-400'}`}>
                  {t[`nav${tab.charAt(0).toUpperCase() + tab.slice(1)}` as keyof typeof t]}
                </span>
              </button>
             );
           })}
        </div>
      </nav>

      {/* Main Content Area - Wide Canvas */}
      <main className="flex-1 w-full max-w-[1600px] mx-auto px-6 py-8 md:p-12 pb-32 md:pb-12 flex flex-col min-h-screen overflow-x-hidden">
          
          <div className="mb-10 flex items-center justify-between">
              <div className="flex items-center gap-4">
                 <div className="md:hidden w-3 h-3 rounded-full bg-accent shadow-glow"></div>
                 <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-mono-900 dark:text-white">Burmese Studio</h1>
              </div>
          </div>

          <div className="w-full h-full flex-1 transition-all duration-500 ease-out">
            {activeTab === 'studio' && (
              <Step1Import state={state} updateState={updateState} lang={lang} onNext={handleAnalyzePrompt} />
            )}
            
            {activeTab === 'plan' && (
              <Step2Plan state={state} updateState={updateState} lang={lang} onNext={handleGenerateCampaign} onBack={() => setActiveTab('studio')} />
            )}
            
            {activeTab === 'gallery' && (
              <Step3Gallery state={state} lang={lang} onRestart={() => { setState(initialState); setActiveTab('studio'); }} />
            )}
            
            {activeTab === 'settings' && (
              <SettingsView 
                onSave={handleSaveSettings}
                currentKey={apiKey}
                currentUseProxy={useProxy}
                currentProxyUrl={proxyUrl}
                lang={lang}
                theme={theme}
                onThemeChange={(t) => { setTheme(t); localStorage.setItem('app_theme', t); }}
                onLangChange={(l) => { setLang(l); }}
              />
            )}
          </div>
      </main>

      {/* Mobile Bottom Tab Bar */}
      <div className="md:hidden fixed bottom-0 left-0 w-full glass-nav pb-safe z-50">
         <div className="flex justify-around items-end h-16 pb-2">
            {tabs.map((tab) => {
               const isActive = activeTab === tab;
               return (
               <button
                 key={tab}
                 onClick={() => setActiveTab(tab)}
                 className="flex flex-col items-center justify-center w-full h-full active:scale-95 transition-transform duration-200"
               >
                 <div className={`transition-colors duration-200 ${isActive ? 'text-accent' : 'text-mono-400 dark:text-mono-500'}`}>
                    {Icons[tab](isActive)}
                 </div>
                 <span className={`text-[10px] font-medium mt-1 transition-colors ${isActive ? 'text-accent' : 'text-mono-400'}`}>
                   {t[`nav${tab.charAt(0).toUpperCase() + tab.slice(1)}` as keyof typeof t]}
                 </span>
               </button>
               );
            })}
         </div>
      </div>

    </div>
  );
};

export default App;
