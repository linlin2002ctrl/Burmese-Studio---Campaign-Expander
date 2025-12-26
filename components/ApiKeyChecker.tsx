
import React, { useEffect, useState } from 'react';
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

interface ApiKeyCheckerProps {
  lang: Language;
  onReady: () => void;
  onOpenSettings: () => void;
}

export const ApiKeyChecker: React.FC<ApiKeyCheckerProps> = ({ lang, onReady, onOpenSettings }) => {
  const [hasKey, setHasKey] = useState(false);
  const t = TRANSLATIONS[lang];

  const checkKey = async () => {
    if (window.aistudio) {
      const selected = await window.aistudio.hasSelectedApiKey();
      if (selected) {
        setHasKey(true);
        onReady();
      }
    } else {
      // In BYOK mode, this component is only shown if NO key is present in state.
    }
  };

  useEffect(() => {
    checkKey();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSelectKey = async () => {
    if (window.aistudio) {
      await window.aistudio.openSelectKey();
      // Assume success after dialog closes
      setHasKey(true);
      onReady();
    }
  };

  if (hasKey) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-fade-in">
      <div className="bg-white dark:bg-mono-800 rounded-2xl p-6 max-w-sm w-full shadow-2xl text-center border border-slate-200 dark:border-mono-700">
        <h3 className="text-xl font-bold mb-4 dark:text-white">{t.errorNoKey}</h3>
        <p className="text-sm text-mono-500 dark:text-mono-300 mb-6">
          To generate high-quality campaign images, please provide an API key.
        </p>
        
        <div className="space-y-3">
          {/* Only show Google Button if we are in the correct environment */}
          {window.aistudio && (
            <button
              onClick={handleSelectKey}
              className="w-full py-3 bg-accent hover:bg-accent-hover text-white rounded-xl font-medium transition-all transform hover:scale-[1.02] active:scale-95 shadow-md"
            >
              {t.selectKey}
            </button>
          )}

          <button
            onClick={onOpenSettings}
            className={`w-full py-3 rounded-xl font-medium transition-all border border-mono-300 dark:border-mono-600 hover:bg-mono-50 dark:hover:bg-mono-700 text-mono-700 dark:text-mono-200
              ${!window.aistudio ? 'bg-accent hover:bg-accent-hover text-white border-transparent' : ''}
            `}
          >
            {window.aistudio ? t.orEnterKey : t.settingsTitle}
          </button>
        </div>
      </div>
    </div>
  );
};
