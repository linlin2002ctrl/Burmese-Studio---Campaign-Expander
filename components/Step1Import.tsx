import React, { ChangeEvent } from 'react';
import { TRANSLATIONS } from '../constants';
import { CampaignState, Language } from '../types';

interface Props {
  state: CampaignState;
  updateState: (updates: Partial<CampaignState>) => void;
  lang: Language;
  onNext: () => void;
}

export const Step1Import: React.FC<Props> = ({ state, updateState, lang, onNext }) => {
  const t = TRANSLATIONS[lang];

  const handleHeroUpload = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        updateState({ heroImageBase64: reader.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSellingItemUpload = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        updateState({ sellingItemBase64: reader.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  const isReady = state.masterPrompt.length > 5 && !!state.heroImageBase64 && !!state.sellingItemBase64;

  return (
    <div className="animate-fade-in space-y-8 pb-24">
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-bold dark:text-white">{t.step1Title}</h2>
        <p className="text-slate-500 dark:text-slate-400">{t.step1Desc}</p>
      </div>

      <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 space-y-8">
        
        {/* Slot 1: Master Prompt */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
            1. {t.promptLabel}
          </label>
          <textarea
            value={state.masterPrompt}
            onChange={(e) => updateState({ masterPrompt: e.target.value })}
            placeholder={t.promptPlaceholder}
            className="w-full p-4 h-28 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-brand-500 focus:outline-none transition-all resize-none dark:text-white text-sm"
          />
        </div>

        {/* Grid for Images */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          {/* Slot 2: Hero Shot */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
              2. {t.imageLabel}
            </label>
            <div className="relative group h-48">
              <input
                type="file"
                accept="image/*"
                onChange={handleHeroUpload}
                className="hidden"
                id="hero-upload"
              />
              <label
                htmlFor="hero-upload"
                className={`flex flex-col items-center justify-center w-full h-full border-2 border-dashed rounded-xl cursor-pointer transition-all overflow-hidden
                  ${state.heroImageBase64 
                    ? 'border-brand-500 bg-brand-50 dark:bg-brand-900/20' 
                    : 'border-slate-300 dark:border-slate-600 hover:border-brand-400 hover:bg-slate-50 dark:hover:bg-slate-800'
                  }`}
              >
                {state.heroImageBase64 ? (
                  <div className="relative w-full h-full">
                     {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img 
                      src={state.heroImageBase64} 
                      alt="Hero" 
                      className="w-full h-full object-contain"
                    />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <span className="text-white text-xs font-bold">Change Reference</span>
                    </div>
                  </div>
                ) : (
                  <div className="text-center p-4">
                    <svg className="mx-auto h-8 w-8 text-slate-400 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                    <p className="text-xs text-slate-500">Upload Character/Pose Ref</p>
                  </div>
                )}
              </label>
            </div>
          </div>

          {/* Slot 3: Selling Item */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
              3. {t.sellingItemLabel}
            </label>
            <div className="relative group h-48">
              <input
                type="file"
                accept="image/*"
                onChange={handleSellingItemUpload}
                className="hidden"
                id="item-upload"
              />
              <label
                htmlFor="item-upload"
                className={`flex flex-col items-center justify-center w-full h-full border-2 border-dashed rounded-xl cursor-pointer transition-all overflow-hidden
                  ${state.sellingItemBase64 
                    ? 'border-brand-500 bg-brand-50 dark:bg-brand-900/20' 
                    : 'border-slate-300 dark:border-slate-600 hover:border-brand-400 hover:bg-slate-50 dark:hover:bg-slate-800'
                  }`}
              >
                {state.sellingItemBase64 ? (
                  <div className="relative w-full h-full">
                     {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img 
                      src={state.sellingItemBase64} 
                      alt="Product" 
                      className="w-full h-full object-contain"
                    />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <span className="text-white text-xs font-bold">Change Product</span>
                    </div>
                  </div>
                ) : (
                  <div className="text-center p-4">
                    <svg className="mx-auto h-8 w-8 text-slate-400 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                    </svg>
                    <p className="text-xs text-slate-500">Upload Garment/Product</p>
                  </div>
                )}
              </label>
            </div>
          </div>

        </div>
      </div>

      <div className="pt-4 sticky bottom-6 z-10">
        <button
          onClick={onNext}
          disabled={!isReady || state.isAnalyzing}
          className={`w-full py-4 rounded-xl text-lg font-bold shadow-lg transition-all transform active:scale-95 flex items-center justify-center gap-2
            ${isReady && !state.isAnalyzing
              ? 'bg-brand-600 hover:bg-brand-500 text-white shadow-brand-500/30' 
              : 'bg-slate-200 dark:bg-slate-700 text-slate-400 cursor-not-allowed'
            }`}
        >
          {state.isAnalyzing ? (
            <>
              <svg className="animate-spin h-5 w-5 text-current" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              <span>Analyzing Inputs...</span>
            </>
          ) : (
            <>
              <span>{t.btnPlan}</span>
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </>
          )}
        </button>
      </div>
    </div>
  );
};