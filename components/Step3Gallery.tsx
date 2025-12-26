import React from 'react';
import { TRANSLATIONS } from '../constants';
import { CampaignState, Language } from '../types';

// Declare JSZip on window since we load it via CDN
declare global {
  interface Window {
    JSZip: any;
  }
}

interface Props {
  state: CampaignState;
  lang: Language;
  onRestart: () => void;
}

export const Step3Gallery: React.FC<Props> = ({ state, lang, onRestart }) => {
  const t = TRANSLATIONS[lang];

  // If we are generating, we want to show 6 placeholders
  const displayItems = state.isGenerating 
    ? Array(6).fill(null) 
    : state.generatedImages;

  const handleDownloadZip = async () => {
    if (!window.JSZip || state.generatedImages.length === 0) return;

    const zip = new window.JSZip();
    const folder = zip.folder("burmese-studio-campaign");

    // Add images to zip
    state.generatedImages.forEach((imgData, index) => {
      if (imgData) {
        // Strip the base64 header
        const base64Content = imgData.split(',')[1];
        if (base64Content && folder) {
           folder.file(`campaign-shot-${index + 1}.png`, base64Content, { base64: true });
        }
      }
    });

    // Generate zip
    const content = await zip.generateAsync({ type: "blob" });
    
    // Trigger download
    const url = URL.createObjectURL(content);
    const link = document.createElement("a");
    link.href = url;
    link.download = "burmese-studio-campaign.zip";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="animate-fade-in space-y-6 pb-24">
      <div className="text-center">
        <h2 className="text-2xl font-bold dark:text-white">{t.step3Title}</h2>
        {state.isGenerating ? (
          <p className="text-brand-600 dark:text-brand-400 font-medium animate-pulse mt-2">
            {t.step3Loading}
          </p>
        ) : (
          <div className="mt-4 flex justify-center">
            <button 
              onClick={handleDownloadZip}
              className="flex items-center gap-2 bg-slate-900 dark:bg-white text-white dark:text-slate-900 px-6 py-3 rounded-full font-bold shadow-lg hover:scale-105 transition-transform active:scale-95"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
              </svg>
              {t.btnDownloadZip}
            </button>
          </div>
        )}
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
        {displayItems.map((imgSrc, idx) => (
          <div 
            key={idx}
            className={`relative aspect-[3/4] rounded-xl overflow-hidden shadow-sm border border-slate-200 dark:border-slate-700 bg-slate-100 dark:bg-slate-800 
              ${imgSrc ? 'group cursor-zoom-in' : ''}`}
            onClick={() => imgSrc && window.open(imgSrc, '_blank')}
          >
            {imgSrc ? (
              <>
                 {/* eslint-disable-next-line @next/next/no-img-element */}
                <img 
                  src={imgSrc} 
                  alt={`Campaign shot ${idx + 1}`}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center">
                   <svg className="w-8 h-8 text-white opacity-0 group-hover:opacity-100 transform scale-75 group-hover:scale-100 transition-all" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" />
                   </svg>
                </div>
              </>
            ) : (
              // Skeleton Loader
              <>
                <div className="absolute inset-0 bg-slate-200 dark:bg-slate-700 animate-pulse"></div>
                <div className="absolute inset-0 flex flex-col items-center justify-center p-4 text-center z-10">
                   <div className="w-12 h-12 bg-white dark:bg-slate-600 rounded-full flex items-center justify-center mb-3 shadow-sm">
                      <svg className="w-6 h-6 text-brand-500 animate-bounce" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                   </div>
                   <div className="space-y-2 w-full flex flex-col items-center">
                     <span className="text-xs text-slate-500 dark:text-slate-400 font-semibold tracking-wider uppercase">
                       Developing
                     </span>
                     <div className="w-16 h-1 bg-slate-300 dark:bg-slate-600 rounded-full overflow-hidden">
                       <div className="h-full bg-brand-500 w-1/2 animate-[pulse_1s_ease-in-out_infinite]"></div>
                     </div>
                   </div>
                </div>
              </>
            )}
            
            <div className={`absolute bottom-2 left-2 px-2 py-1 rounded text-[10px] font-bold transition-colors
              ${imgSrc 
                ? 'bg-black/60 backdrop-blur-sm text-white' 
                : 'bg-slate-200 dark:bg-slate-700 text-slate-400 dark:text-slate-500'
              }`}>
              #{idx + 1}
            </div>
          </div>
        ))}
      </div>

      {!state.isGenerating && (
        <div className="fixed bottom-0 left-0 right-0 p-4 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-t border-slate-200 dark:border-slate-800 z-10 flex justify-center">
          <button
            onClick={onRestart}
            className="w-full max-w-md py-4 text-slate-500 dark:text-slate-400 font-medium hover:text-slate-700 dark:hover:text-slate-200 transition-colors"
          >
            {t.btnRestart}
          </button>
        </div>
      )}
    </div>
  );
};