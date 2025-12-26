
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

export const Step2Plan: React.FC<Props> = ({ state, updateState, lang, onNext }) => {
  const t = TRANSLATIONS[lang];

  const handlePoseChange = (index: number, value: string) => {
    const newPoses = [...state.poses];
    newPoses[index] = value;
    updateState({ poses: newPoses });
  };

  if (state.poses.length === 0) {
      return (
          <div className="flex flex-col items-center justify-center h-[60vh] text-center space-y-6 animate-fade-in">
              <div className="w-24 h-24 rounded-full bg-mono-100 dark:bg-mono-800 flex items-center justify-center shadow-inner">
                 <svg className="w-12 h-12 text-mono-300" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"/></svg>
              </div>
              <div className="space-y-2">
                <h3 className="text-2xl font-bold dark:text-white">Studio is empty</h3>
                <p className="text-mono-400 max-w-sm mx-auto">Upload your hero assets in the Studio tab to begin.</p>
              </div>
          </div>
      )
  }

  return (
    <div className="animate-fade-in space-y-8 pt-2 pb-12">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2">
            <h2 className="text-3xl md:text-5xl font-bold dark:text-white tracking-tight">{t.step2Title}</h2>
            <p className="text-mono-400 dark:text-mono-300 text-lg font-medium">{t.step2Desc}</p>
        </div>
        <button
            onClick={onNext}
            className="w-full md:w-auto px-8 py-4 bg-accent hover:bg-accent-hover text-white rounded-2xl text-lg font-bold shadow-glow transition-all active:scale-95 flex items-center justify-center gap-2"
        >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.384-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
            </svg>
            {t.btnGenerate}
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {state.poses.map((pose, idx) => (
          <div 
            key={idx}
            className="group relative bg-white dark:bg-mono-800 rounded-[2rem] p-6 shadow-soft transition-all hover:scale-[1.01] hover:shadow-lg border border-transparent dark:border-mono-700/50 flex flex-col"
          >
            <div className="flex items-center justify-between mb-4">
                 <div className="w-10 h-10 rounded-full bg-accent/10 text-accent flex items-center justify-center text-sm font-bold font-mono">
                    0{idx + 1}
                 </div>
                 <div className="h-2 w-2 rounded-full bg-mono-200 dark:bg-mono-700 group-hover:bg-accent/50 transition-colors"></div>
            </div>
            
            <textarea
              value={pose}
              onChange={(e) => handlePoseChange(idx, e.target.value)}
              className="w-full bg-transparent border-none focus:ring-0 text-mono-800 dark:text-mono-200 resize-none flex-1 text-base leading-relaxed placeholder:text-mono-300 min-h-[120px]"
            />
          </div>
        ))}
      </div>
    </div>
  );
};
