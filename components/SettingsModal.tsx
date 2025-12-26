
import React, { useState, useEffect } from 'react';
import { TRANSLATIONS } from '../constants';
import { Language } from '../types';

declare global {
  interface AIStudio {
    hasSelectedApiKey: () => Promise<boolean>;
    openSelectKey: () => Promise<void>;
  }
  interface Window {
    aistudio?: AIStudio;
  }
}

interface Props {
  onSave: (key: string, useProxy: boolean, proxyUrl: string) => void;
  currentKey: string;
  currentUseProxy: boolean;
  currentProxyUrl: string;
  lang: Language;
  theme: 'light' | 'dark';
  onLangChange: (lang: Language) => void;
  onThemeChange: (theme: 'light' | 'dark') => void;
}

export const SettingsView: React.FC<Props> = ({ 
  onSave, currentKey, currentUseProxy, currentProxyUrl, lang, theme, onLangChange, onThemeChange
}) => {
  const [key, setKey] = useState(currentKey);
  const [useProxy, setUseProxy] = useState(currentUseProxy);
  const [proxyUrl, setProxyUrl] = useState(currentProxyUrl);
  const [isSaved, setIsSaved] = useState(false);
  const t = TRANSLATIONS[lang];

  useEffect(() => {
    setKey(currentKey);
    setUseProxy(currentUseProxy);
    setProxyUrl(currentProxyUrl);
  }, [currentKey, currentUseProxy, currentProxyUrl]);

  const handleSave = () => {
    onSave(key, useProxy, proxyUrl);
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2000);
  };

  return (
    <div className="animate-fade-in space-y-8 pt-2 pb-12">
      <div className="px-1">
         <h2 className="text-3xl md:text-5xl font-bold dark:text-white tracking-tight">{t.settingsTitle}</h2>
         <p className="text-mono-400 dark:text-mono-300 font-medium text-lg mt-2">Customize your studio experience.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">

          {/* User Preferences: Language & Theme */}
          <div className="bg-white dark:bg-mono-800 rounded-[2rem] p-8 shadow-soft space-y-8 border border-transparent dark:border-mono-700/50 flex flex-col justify-center">
             {/* Language */}
             <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                   <div className="w-12 h-12 rounded-full bg-mono-100 dark:bg-mono-700 flex items-center justify-center text-mono-900 dark:text-white">
                      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129" /></svg>
                   </div>
                   <h3 className="font-bold text-lg dark:text-white">{t.languageTitle}</h3>
                </div>
                <div className="flex bg-mono-100 dark:bg-mono-900 rounded-xl p-1.5">
                   <button 
                     onClick={() => onLangChange('en')}
                     className={`px-4 py-2 text-sm font-bold rounded-lg transition-all active:scale-95 ${lang === 'en' ? 'bg-white dark:bg-mono-700 text-black dark:text-white shadow-sm' : 'text-mono-400'}`}
                   >
                     {t.languageEn}
                   </button>
                   <button 
                     onClick={() => onLangChange('my')}
                     className={`px-4 py-2 text-sm font-bold rounded-lg transition-all active:scale-95 ${lang === 'my' ? 'bg-white dark:bg-mono-700 text-black dark:text-white shadow-sm' : 'text-mono-400'}`}
                   >
                     {t.languageMy}
                   </button>
                </div>
             </div>

             <div className="w-full h-px bg-mono-100 dark:bg-mono-700"></div>

             {/* Theme */}
             <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                   <div className="w-12 h-12 rounded-full bg-mono-100 dark:bg-mono-700 flex items-center justify-center text-mono-900 dark:text-white">
                      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" /></svg>
                   </div>
                   <h3 className="font-bold text-lg dark:text-white">{t.appearanceTitle}</h3>
                </div>
                <div className="flex bg-mono-100 dark:bg-mono-900 rounded-xl p-1.5">
                   <button 
                     onClick={() => onThemeChange('light')}
                     className={`px-4 py-2 text-sm font-bold rounded-lg transition-all active:scale-95 ${theme === 'light' ? 'bg-white dark:bg-mono-700 text-black dark:text-white shadow-sm' : 'text-mono-400'}`}
                   >
                     {t.appearanceLight}
                   </button>
                   <button 
                     onClick={() => onThemeChange('dark')}
                     className={`px-4 py-2 text-sm font-bold rounded-lg transition-all active:scale-95 ${theme === 'dark' ? 'bg-white dark:bg-mono-700 text-black dark:text-white shadow-sm' : 'text-mono-400'}`}
                   >
                     {t.appearanceDark}
                   </button>
                </div>
             </div>
          </div>
          
          <div className="space-y-6 flex flex-col">
              {/* Card: API Key */}
              <div className="bg-white dark:bg-mono-800 rounded-[2rem] p-8 shadow-soft space-y-6 border border-transparent dark:border-mono-700/50 flex-1">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-full bg-mono-100 dark:bg-mono-700 flex items-center justify-center text-mono-900 dark:text-white">
                          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" /></svg>
                      </div>
                      <h3 className="font-bold text-lg dark:text-white">{t.editApiTitle}</h3>
                    </div>
                    {window.aistudio ? (
                        <button onClick={() => window.aistudio?.openSelectKey()} className="text-xs font-bold text-accent hover:text-accent-hover bg-accent/10 px-4 py-2 rounded-full transition-colors active:scale-95">{t.selectKey}</button>
                    ) : (
                        <button onClick={() => window.open('https://aistudio.google.com/app/apikey', '_blank')} className="text-xs font-bold text-accent hover:text-accent-hover bg-accent/10 px-4 py-2 rounded-full transition-colors active:scale-95">{t.getKey}</button>
                    )}
                </div>

                <div className="space-y-2">
                    <input
                      type="password"
                      value={key}
                      onChange={(e) => setKey(e.target.value)}
                      placeholder={t.apiKeyPlaceholder}
                      className="w-full bg-mono-100 dark:bg-mono-900/50 rounded-2xl p-5 text-mono-900 dark:text-white font-mono text-sm border-none focus:ring-2 focus:ring-accent/50 transition-all placeholder:text-mono-400 dark:placeholder:text-mono-600"
                    />
                    <p className="text-xs text-mono-400 pl-2">{t.apiKeyHelper}</p>
                </div>
              </div>

              {/* Card: Proxy */}
              <div className="bg-white dark:bg-mono-800 rounded-[2rem] p-8 shadow-soft space-y-6 border border-transparent dark:border-mono-700/50">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-full bg-mono-100 dark:bg-mono-700 flex items-center justify-center text-mono-900 dark:text-white">
                          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" /></svg>
                        </div>
                        <div>
                            <h3 className="font-bold text-lg dark:text-white">{t.networkTitle}</h3>
                        </div>
                    </div>
                    {/* Switch */}
                    <button 
                        onClick={() => setUseProxy(!useProxy)}
                        className={`w-14 h-8 rounded-full transition-colors relative active:scale-95 ${useProxy ? 'bg-accent' : 'bg-mono-200 dark:bg-mono-700'}`}
                      >
                        <div className={`w-7 h-7 bg-white rounded-full shadow-sm absolute top-0.5 transition-transform duration-200 ${useProxy ? 'left-[26px]' : 'left-0.5'}`}></div>
                    </button>
                </div>

                <div className={`transition-all duration-300 ease-in-out overflow-hidden ${useProxy ? 'max-h-40 opacity-100' : 'max-h-0 opacity-0'}`}>
                    <div className="space-y-2">
                      <div className="flex justify-between items-baseline">
                          <label className="text-xs font-bold text-mono-500 uppercase tracking-wider">{t.proxyUrlLabel}</label>
                          <span className="text-[10px] text-accent bg-accent/10 px-2 py-0.5 rounded-full">{t.statusConnected}</span>
                      </div>
                      <input
                        type="text"
                        value={proxyUrl}
                        onChange={(e) => setProxyUrl(e.target.value)}
                        className="w-full bg-mono-100 dark:bg-mono-900/50 rounded-2xl p-5 text-mono-900 dark:text-white font-mono text-xs border-none focus:ring-2 focus:ring-accent/50 transition-all placeholder:text-mono-400 dark:placeholder:text-mono-600"
                      />
                    </div>
                </div>
              </div>
          </div>
          
      </div>

      <div className="flex justify-end pt-4">
          <button 
            onClick={handleSave}
            className={`w-full lg:w-auto px-12 py-5 rounded-2xl font-bold text-lg shadow-float active:scale-95 transition-all
              ${isSaved 
                ? 'bg-green-500 text-white' 
                : 'bg-mono-900 dark:bg-white text-white dark:text-black hover:opacity-90 hover:-translate-y-1'
              }`}
          >
            {isSaved ? 'Configuration Saved' : t.save}
          </button>
      </div>
    </div>
  );
};
