import React from 'react';
import { TRANSLATIONS } from '../constants';
import { CampaignState, Language } from '../types';

interface Props {
  state: CampaignState;
  updateState: (updates: Partial<CampaignState>) => void;
  lang: Language;
  onNext: () => void;
  onBack: () => void;
}

export const Step2Plan: React.FC<Props> = ({ state, updateState, lang, onNext, onBack }) => {
  const t = TRANSLATIONS[lang];

  const handlePoseChange = (index: number, value: string) => {
    const newPoses = [...state.poses];
    newPoses[index] = value;
    updateState({ poses: newPoses });
  };

  return (
    <div className="animate-fade-in space-y-6 pb-24">
      <div className="flex items-center gap-4">
        <button 
          onClick={onBack}
          className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
        >
          <svg className="w-6 h-6 text-slate-600 dark:text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <div>
          <h2 className="text-2xl font-bold dark:text-white">{t.step2Title}</h2>
          <p className="text-sm text-slate-500 dark:text-slate-400">{t.step2Desc}</p>
        </div>
      </div>

      <div className="space-y-4">
        {state.poses.map((pose, idx) => (
          <div 
            key={idx}
            className="group relative bg-white dark:bg-slate-800 rounded-xl p-4 shadow-sm border border-slate-200 dark:border-slate-700 transition-all focus-within:ring-2 focus-within:ring-brand-500 focus-within:border-transparent"
          >
            <div className="absolute top-4 left-4 w-6 h-6 rounded-full bg-brand-100 dark:bg-brand-900/30 text-brand-600 dark:text-brand-400 flex items-center justify-center text-xs font-bold">
              {idx + 1}
            </div>
            <textarea
              value={pose}
              onChange={(e) => handlePoseChange(idx, e.target.value)}
              className="w-full pl-10 bg-transparent border-none focus:ring-0 text-slate-700 dark:text-slate-200 resize-none h-20 text-sm leading-relaxed"
            />
          </div>
        ))}
      </div>

      <div className="fixed bottom-0 left-0 right-0 p-4 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-t border-slate-200 dark:border-slate-800 z-10 flex justify-center">
        <div className="w-full max-w-2xl">
           <button
            onClick={onNext}
            className="w-full py-4 bg-brand-600 hover:bg-brand-500 text-white rounded-xl text-lg font-bold shadow-lg shadow-brand-500/30 transition-all transform active:scale-95 flex items-center justify-center gap-2"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.384-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
            </svg>
            {t.btnGenerate}
          </button>
        </div>
      </div>
    </div>
  );
};