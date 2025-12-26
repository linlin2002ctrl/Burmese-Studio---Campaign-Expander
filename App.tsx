
import React, { useState, useEffect } from 'react';
import { CampaignState, Language } from './types';
import { TRANSLATIONS } from './constants';
import { suggestPoses, generateCampaignImage } from './services/geminiService';
import { Step1Import } from './components/Step1Import';
import { Step2Plan } from './components/Step2Plan';
import { Step3Gallery } from './components/Step3Gallery';
import { SettingsModal } from './components/SettingsModal';

const initialState: CampaignState = {
  step: 1,
  masterPrompt: '',
  heroImageBase64: null,
  sellingItemBase64: null,
  poses: [],
  generatedImages: [],
  isGenerating: false,
  isAnalyzing: false,
};

const DEFAULT_PROXY = 'https://sg-gateway.burmese-studio.ai/v1beta';

const App: React.FC = () => {
  const [lang, setLang] = useState<Language>('en');
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const [state, setState] = useState<CampaignState>(initialState);
  
  // Settings / Key Management
  const [showSettings, setShowSettings] = useState(false);
  const [apiKey, setApiKey] = useState('');
  
  // Proxy Settings
  const [useProxy, setUseProxy] = useState(false);
  const [proxyUrl, setProxyUrl] = useState(DEFAULT_PROXY);

  // Initialize theme
  useEffect(() => {
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      setTheme('dark');
    }
  }, []);

  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  // Initialize Settings from LocalStorage
  useEffect(() => {
    const storedKey = localStorage.getItem('gemini_api_key');
    if (storedKey) setApiKey(storedKey);

    const storedUseProxy = localStorage.getItem('use_proxy');
    if (storedUseProxy) setUseProxy(storedUseProxy === 'true');

    const storedProxyUrl = localStorage.getItem('proxy_url');
    if (storedProxyUrl) setProxyUrl(storedProxyUrl);
  }, []);

  const updateState = (updates: Partial<CampaignState>) => {
    setState(prev => ({ ...prev, ...updates }));
  };

  const toggleLang = () => setLang(prev => prev === 'en' ? 'my' : 'en');
  const toggleTheme = () => setTheme(prev => prev === 'light' ? 'dark' : 'light');

  const handleSaveSettings = (key: string, newUseProxy: boolean, newProxyUrl: string) => {
    setApiKey(key);
    localStorage.setItem('gemini_api_key', key);
    
    setUseProxy(newUseProxy);
    localStorage.setItem('use_proxy', String(newUseProxy));

    setProxyUrl(newProxyUrl);
    localStorage.setItem('proxy_url', newProxyUrl);

    setShowSettings(false);
  };

  // --- Logic Flows ---

  const handleAnalyzePrompt = async () => {
    if (!state.masterPrompt) return;
    
    updateState({ isAnalyzing: true });
    
    try {
      const suggestedPoses = await suggestPoses(
        apiKey, 
        state.masterPrompt, 
        useProxy ? proxyUrl : undefined
      );
      updateState({ 
        poses: suggestedPoses,
        step: 2,
        isAnalyzing: false
      });
    } catch (e) {
      console.error(e);
      // If error is due to missing key, maybe show settings?
      if (!apiKey && !window.aistudio) setShowSettings(true);
      updateState({ isAnalyzing: false });
    }
  };

  const handleGenerateCampaign = async () => {
    if (!state.heroImageBase64 || !state.sellingItemBase64) return;
    
    updateState({ 
      step: 3, 
      isGenerating: true, 
      generatedImages: [] // Reset images
    });

    // Parallel execution for speed
    const promises = state.poses.map(async (pose, index) => {
      try {
        const result = await generateCampaignImage(
            apiKey,
            state.heroImageBase64!,
            state.sellingItemBase64!,
            state.masterPrompt,
            pose,
            useProxy ? proxyUrl : undefined
        );
        return result;
      } catch (err) {
        console.error(`Failed to generate image ${index}`, err);
        return null;
      }
    });

    const rawResults = await Promise.all(promises);
    const validResults = rawResults.filter(Boolean) as string[];
    
    updateState({
      isGenerating: false,
      generatedImages: validResults
    });
  };

  const handleRestart = () => {
    setState(initialState);
  };

  return (
    <div className="min-h-screen flex flex-col items-center p-4 sm:p-6 lg:p-8 transition-colors duration-200">
      
      {/* Settings Modal */}
      <SettingsModal 
        isOpen={showSettings} 
        onClose={() => setShowSettings(false)} 
        onSave={handleSaveSettings}
        currentKey={apiKey}
        currentUseProxy={useProxy}
        currentProxyUrl={proxyUrl}
        lang={lang}
      />

      {/* Header */}
      <header className="w-full max-w-2xl flex items-center justify-between mb-8 z-20">
        <div className="flex items-center gap-2">
           <div className="w-8 h-8 bg-brand-600 rounded-lg flex items-center justify-center shadow-lg shadow-brand-500/30">
             <span className="text-white font-bold text-lg">B</span>
           </div>
           <h1 className="text-xl font-bold tracking-tight dark:text-white hidden sm:block">
             {TRANSLATIONS[lang].title}
           </h1>
        </div>
        
        <div className="flex items-center gap-2 bg-white dark:bg-slate-800 p-1 rounded-full border border-slate-200 dark:border-slate-700 shadow-sm">
          <button 
            onClick={toggleTheme}
            className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors text-slate-600 dark:text-slate-400"
            title="Toggle Theme"
          >
            {theme === 'light' ? (
               <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
               </svg>
            ) : (
               <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
               </svg>
            )}
          </button>
          
          <button 
            onClick={toggleLang}
            className="px-3 py-1 rounded-full text-xs font-bold hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors text-slate-700 dark:text-slate-200"
            title="Toggle Language"
          >
            {lang === 'en' ? 'MY' : 'EN'}
          </button>
          
          <div className="w-px h-4 bg-slate-200 dark:bg-slate-700 mx-1"></div>

          <button
            onClick={() => setShowSettings(true)}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-full hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors 
              ${apiKey || (typeof window !== 'undefined' && window.aistudio) ? 'text-brand-600 dark:text-brand-400' : 'text-slate-500'}`}
            title="Settings"
          >
             <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
             </svg>
             <span className="text-xs font-medium">Settings</span>
          </button>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="w-full max-w-2xl flex-1 relative z-10">
          {state.step === 1 && (
            <Step1Import 
              state={state} 
              updateState={updateState} 
              lang={lang} 
              onNext={handleAnalyzePrompt} 
            />
          )}
          
          {state.step === 2 && (
            <Step2Plan 
              state={state} 
              updateState={updateState} 
              lang={lang} 
              onNext={handleGenerateCampaign}
              onBack={() => updateState({ step: 1 })}
            />
          )}
          
          {state.step === 3 && (
            <Step3Gallery 
              state={state} 
              lang={lang} 
              onRestart={handleRestart} 
            />
          )}
      </main>

    </div>
  );
};

export default App;
