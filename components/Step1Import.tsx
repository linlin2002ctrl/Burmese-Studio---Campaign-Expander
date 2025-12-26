
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

  const handleUpload = (e: ChangeEvent<HTMLInputElement>, key: 'heroImageBase64' | 'sellingItemBase64') => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => updateState({ [key]: reader.result as string });
      reader.readAsDataURL(file);
    }
  };

  const isReady = state.masterPrompt.length > 5 && !!state.heroImageBase64 && !!state.sellingItemBase64;

  return (
    <div className="animate-fade-in space-y-8">
      
      <div className="space-y-2 max-w-4xl">
        <h2 className="text-3xl md:text-5xl font-bold text-mono-900 dark:text-white tracking-tight">{t.step1Title}</h2>
        <p className="text-mono-400 dark:text-mono-300 font-medium text-lg leading-relaxed max-w-2xl">{t.step1Desc}</p>
      </div>

      {/* Bento Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 pt-4">
        
        {/* Left Column: Creative Core (Prompt) */}
        <div className="lg:col-span-7 flex flex-col gap-6">
          <div className="group relative bg-white dark:bg-mono-800 rounded-[2rem] p-2 shadow-soft transition-all hover:shadow-lg h-full min-h-[300px] flex flex-col">
            <textarea
              value={state.masterPrompt}
              onChange={(e) => updateState({ masterPrompt: e.target.value })}
              placeholder={t.promptPlaceholder}
              className="w-full flex-1 bg-transparent rounded-3xl p-6 text-xl md:text-2xl text-mono-900 dark:text-white placeholder:text-mono-300 resize-none focus:outline-none leading-relaxed"
            />
            <div className="flex justify-end p-4">
               <span className="text-[10px] font-bold text-mono-300 uppercase tracking-widest bg-mono-100 dark:bg-mono-700 px-3 py-1 rounded-full">DNA Prompt</span>
            </div>
          </div>
        </div>

        {/* Right Column: Context (Assets) */}
        <div className="lg:col-span-5 flex flex-col gap-6">
            <div className="grid grid-cols-2 gap-4 h-full">
               {/* Hero Image */}
               <div className="relative aspect-[3/4] lg:aspect-auto lg:h-full">
                  <input type="file" accept="image/*" onChange={(e) => handleUpload(e, 'heroImageBase64')} className="hidden" id="hero-upload" />
                  <label 
                    htmlFor="hero-upload"
                    className="block w-full h-full cursor-pointer overflow-hidden rounded-3xl shadow-soft transition-all active:scale-95 bg-white dark:bg-mono-800 hover:bg-mono-50 dark:hover:bg-mono-700 group border-2 border-transparent hover:border-accent/20"
                  >
                     {state.heroImageBase64 ? (
                       /* eslint-disable-next-line @next/next/no-img-element */
                       <img src={state.heroImageBase64} alt="Hero" className="w-full h-full object-cover" />
                     ) : (
                       <div className="w-full h-full flex flex-col items-center justify-center gap-3 text-mono-300 group-hover:text-accent transition-colors">
                         <div className="w-14 h-14 rounded-full bg-mono-100 dark:bg-mono-700 flex items-center justify-center">
                            <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
                         </div>
                         <span className="text-xs font-bold uppercase tracking-wide">{t.imageLabel}</span>
                       </div>
                     )}
                  </label>
               </div>

               {/* Product Image */}
               <div className="relative aspect-[3/4] lg:aspect-auto lg:h-full">
                  <input type="file" accept="image/*" onChange={(e) => handleUpload(e, 'sellingItemBase64')} className="hidden" id="item-upload" />
                  <label 
                    htmlFor="item-upload"
                    className="block w-full h-full cursor-pointer overflow-hidden rounded-3xl shadow-soft transition-all active:scale-95 bg-white dark:bg-mono-800 hover:bg-mono-50 dark:hover:bg-mono-700 group border-2 border-transparent hover:border-accent/20"
                  >
                     {state.sellingItemBase64 ? (
                       /* eslint-disable-next-line @next/next/no-img-element */
                       <img src={state.sellingItemBase64} alt="Product" className="w-full h-full object-cover" />
                     ) : (
                       <div className="w-full h-full flex flex-col items-center justify-center gap-3 text-mono-300 group-hover:text-accent transition-colors">
                          <div className="w-14 h-14 rounded-full bg-mono-100 dark:bg-mono-700 flex items-center justify-center">
                            <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" /></svg>
                          </div>
                         <span className="text-xs font-bold uppercase tracking-wide">{t.sellingItemLabel}</span>
                       </div>
                     )}
                  </label>
               </div>
            </div>
        </div>

      </div>

      {/* Action Bar */}
      <div className="pt-4 flex justify-end">
        <button
          onClick={onNext}
          disabled={!isReady || state.isAnalyzing}
          className={`w-full lg:w-auto px-12 py-5 rounded-2xl font-bold text-lg transition-all duration-300 active:scale-95 flex items-center justify-center gap-3
            ${isReady && !state.isAnalyzing
              ? 'bg-mono-900 dark:bg-white text-white dark:text-black shadow-float hover:shadow-glow hover:-translate-y-1' 
              : 'bg-mono-200 dark:bg-mono-800 text-mono-400 cursor-not-allowed'
            }`}
        >
          {state.isAnalyzing ? (
            <>
              <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
              <span>Analyzing DNA...</span>
            </>
          ) : (
            <>
                <span>{t.btnPlan}</span>
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
            </>
          )}
        </button>
      </div>
    </div>
  );
};
