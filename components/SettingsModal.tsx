
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
  isOpen: boolean;
  onClose: () => void;
  onSave: (key: string, useProxy: boolean, proxyUrl: string) => void;
  currentKey: string;
  currentUseProxy: boolean;
  currentProxyUrl: string;
  lang: Language;
}

export const SettingsModal: React.FC<Props> = ({ 
  isOpen, 
  onClose, 
  onSave, 
  currentKey, 
  currentUseProxy,
  currentProxyUrl,
  lang 
}) => {
  const [key, setKey] = useState(currentKey);
  const [useProxy, setUseProxy] = useState(currentUseProxy);
  const [proxyUrl, setProxyUrl] = useState(currentProxyUrl);
  const t = TRANSLATIONS[lang];

  // Sync internal state if prop changes
  useEffect(() => {
    setKey(currentKey);
    setUseProxy(currentUseProxy);
    setProxyUrl(currentProxyUrl);
  }, [currentKey, currentUseProxy, currentProxyUrl, isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/70 backdrop-blur-sm p-4 animate-fade-in">
      <div className="bg-[#121212] rounded-[30px] p-6 w-full max-w-md shadow-2xl border border-white/5 transform transition-all text-white font-sans max-h-[90vh] overflow-y-auto">
        
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-2 text-white">
            <svg className="w-6 h-6 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            <h2 className="text-xl font-bold font-myanmar">{t.settingsTitle}</h2>
          </div>
          <button 
            onClick={onClose} 
            className="text-white hover:text-gray-300"
          >
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="space-y-8">
          
          {/* Section 1: API Key */}
          <div className="space-y-4">
             <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <svg className="w-5 h-5 text-[#FF3B7F]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
                  </svg>
                  <h3 className="text-[#FF3B7F] font-bold font-myanmar">{t.editApiTitle}</h3>
                </div>
                <button 
                  onClick={() => window.open('https://aistudio.google.com/app/apikey', '_blank')}
                  className="bg-[#2A2A2A] hover:bg-[#333] text-gray-400 text-xs px-3 py-1.5 rounded-full flex items-center gap-1 transition-colors"
                >
                  <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  {t.getKey}
                </button>
             </div>

             <div className="space-y-2">
               <label className="block text-white font-medium font-myanmar">{t.apiKeyLabel}</label>
               <div className="relative">
                 <input
                   type="password"
                   value={key}
                   onChange={(e) => setKey(e.target.value)}
                   placeholder={t.apiKeyPlaceholder}
                   className="w-full bg-[#2A2A2A] border border-[#333] rounded-xl p-4 pr-10 text-white placeholder-gray-500 focus:outline-none focus:border-[#FF3B7F] transition-colors font-mono"
                 />
                 <div className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-500">
                   <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                   </svg>
                 </div>
               </div>
               <p className="text-xs text-gray-500 font-myanmar mt-2">{t.apiKeyHelper}</p>
             </div>
          </div>

          {/* Section 2: Network Settings */}
          <div className="space-y-4">
             <div className="flex items-center gap-3">
               <svg className="w-5 h-5 text-[#FF3B7F]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
               </svg>
               <h3 className="text-[#FF3B7F] font-bold font-myanmar">{t.networkTitle}</h3>
             </div>

             {/* Toggle Card */}
             <div className="bg-[#1A2F25] border border-[#2D4A3E] rounded-xl p-4 flex items-center justify-between">
                <div>
                   <div className="text-white font-bold font-myanmar mb-1">{t.proxyServerLabel}</div>
                   <div className="text-gray-400 text-xs">{t.proxyServerDesc}</div>
                </div>
                <button 
                  onClick={() => setUseProxy(!useProxy)}
                  className={`w-12 h-7 rounded-full transition-colors relative ${useProxy ? 'bg-[#22C55E]' : 'bg-gray-600'}`}
                >
                   <div className={`w-5 h-5 bg-white rounded-full absolute top-1 transition-transform ${useProxy ? 'left-[26px]' : 'left-1'}`}></div>
                </button>
             </div>

             {/* Proxy URL Input */}
             <div className="space-y-2">
                <label className="block text-white font-bold font-myanmar">{t.proxyUrlLabel}</label>
                <input
                   type="text"
                   value={proxyUrl}
                   onChange={(e) => setProxyUrl(e.target.value)}
                   disabled={!useProxy}
                   className={`w-full bg-[#2A2A2A] border border-[#333] rounded-xl p-4 text-white placeholder-gray-500 focus:outline-none focus:border-[#22C55E] transition-colors font-sans ${!useProxy ? 'opacity-50 cursor-not-allowed' : ''}`}
                />
             </div>

             {/* Helper Box */}
             <div className="border border-[#333] rounded-xl p-4">
               <p className="text-gray-400 text-sm font-myanmar leading-relaxed">
                 {t.proxyHelper}
               </p>
             </div>
          </div>
          
          {/* Status Indicator */}
          <div className="pt-2 border-t border-[#333] flex items-center justify-between">
             <span className="text-white font-bold font-myanmar">{t.statusTitle}</span>
             {useProxy ? (
               <div className="flex items-center gap-2 bg-[#1A2F25] px-3 py-1.5 rounded-full border border-[#2D4A3E]">
                  <svg className="w-4 h-4 text-[#22C55E]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span className="text-[#22C55E] text-xs font-bold font-myanmar">{t.statusConnected}</span>
               </div>
             ) : (
                <div className="flex items-center gap-2 bg-[#2A2A2A] px-3 py-1.5 rounded-full border border-[#333]">
                  <span className="text-gray-400 text-xs font-bold font-myanmar">{t.statusStandard}</span>
                </div>
             )}
          </div>

          {/* Save Button */}
          <button 
            onClick={() => onSave(key, useProxy, proxyUrl)}
            className="w-full py-4 bg-white hover:bg-gray-100 text-black rounded-[20px] font-bold text-lg font-myanmar transition-colors"
          >
            {t.save}
          </button>
        </div>
      </div>
    </div>
  );
};
