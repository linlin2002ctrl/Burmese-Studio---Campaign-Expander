import React, { useState, useEffect } from 'react';
import { TRANSLATIONS } from '../constants';
import { Language } from '../types';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSave: (key: string) => void;
  currentKey: string;
  lang: Language;
}

export const SettingsModal: React.FC<Props> = ({ isOpen, onClose, onSave, currentKey, lang }) => {
  const [key, setKey] = useState(currentKey);
  const t = TRANSLATIONS[lang];

  // Sync internal state if prop changes
  useEffect(() => {
    setKey(currentKey);
  }, [currentKey, isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-fade-in">
      <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 w-full max-w-md shadow-2xl border border-slate-200 dark:border-slate-700 transform transition-all">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold dark:text-white">{t.settingsTitle}</h2>
          <button 
            onClick={onClose} 
            className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
          >
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="space-y-6">
          <div className="space-y-2">
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
              {t.apiKeyLabel}
            </label>
            <input
              type="password"
              value={key}
              onChange={(e) => setKey(e.target.value)}
              placeholder={t.apiKeyPlaceholder}
              className="w-full p-3.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-brand-500 outline-none dark:text-white transition-all font-mono text-sm"
              autoFocus
            />
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Your key is stored locally in your browser and used only for API calls.
            </p>
          </div>

          <div className="flex gap-3 justify-end">
            <button 
              onClick={onClose}
              className="px-4 py-2.5 text-slate-600 dark:text-slate-400 font-medium hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors"
            >
              {t.cancel}
            </button>
            <button 
              onClick={() => onSave(key)}
              disabled={!key.trim()}
              className="px-6 py-2.5 bg-brand-600 text-white font-bold rounded-lg hover:bg-brand-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-brand-500/20"
            >
              {t.save}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};