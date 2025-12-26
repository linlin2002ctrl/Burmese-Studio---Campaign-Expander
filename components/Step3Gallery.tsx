
import React from 'react';
import { TRANSLATIONS } from '../constants';
import { CampaignState, Language } from '../types';

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

  const displayItems = state.isGenerating 
    ? Array(6).fill(null) 
    : state.generatedImages;

  const handleDownloadZip = async () => {
    if (!window.JSZip || state.generatedImages.length === 0) return;
    const zip = new window.JSZip();
    const folder = zip.folder("burmese-studio-campaign");
    state.generatedImages.forEach((imgData, index) => {
      if (imgData) {
        const base64Content = imgData.split(',')[1];
        if (base64Content && folder) {
           folder.file(`campaign-shot-${index + 1}.png`, base64Content, { base64: true });
        }
      }
    });
    const content = await zip.generateAsync({ type: "blob" });
    const url = URL.createObjectURL(content);
    const link = document.createElement("a");
    link.href = url;
    link.download = "burmese-studio-campaign.zip";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  if (!state.isGenerating && state.generatedImages.length === 0) {
      return (
        <div className="flex flex-col items-center justify-center h-[60vh] text-center space-y-6 animate-fade-in">
             <div className="w-24 h-24 rounded-full bg-mono-100 dark:bg-mono-800 flex items-center justify-center shadow-inner">
                 <svg className="w-12 h-12 text-mono-300" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"/></svg>
             </div>
             <div className="space-y-2">
                 <h3 className="text-2xl font-bold dark:text-white">Gallery is empty</h3>
                 <p className="text-mono-400 max-w-sm mx-auto">Generate a campaign to view the results here.</p>
             </div>
        </div>
      )
  }

  return (
    <div className="animate-fade-in space-y-8 pt-2 pb-12">
      <div className="flex items-center justify-between">
        <div>
           <h2 className="text-3xl md:text-5xl font-bold dark:text-white tracking-tight">{t.step3Title}</h2>
           {state.isGenerating && <p className="text-accent text-lg font-medium animate-pulse mt-2">{t.step3Loading}</p>}
        </div>
        {!state.isGenerating && (
             <div className="flex gap-4">
                 <button
                    onClick={onRestart}
                    className="text-mono-400 hover:text-mono-900 dark:hover:text-white text-sm font-bold transition-colors opacity-80 hover:opacity-100 px-4"
                  >
                    {t.btnRestart}
                  </button>
                 <button 
                   onClick={handleDownloadZip} 
                   className="bg-mono-900 dark:bg-white text-white dark:text-black rounded-full px-6 py-3 text-sm font-bold shadow-soft active:scale-95 transition-all hover:shadow-glow"
                 >
                   {t.btnDownloadZip}
                 </button>
             </div>
        )}
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {displayItems.map((imgSrc, idx) => (
          <div 
            key={idx}
            className="relative aspect-[3/4] rounded-2xl overflow-hidden bg-white dark:bg-mono-800 shadow-soft group cursor-zoom-in"
            onClick={() => imgSrc && window.open(imgSrc, '_blank')}
          >
            {imgSrc ? (
                 /* eslint-disable-next-line @next/next/no-img-element */
                <img 
                  src={imgSrc} 
                  alt={`Shot ${idx + 1}`}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
            ) : (
               <div className="absolute inset-0 flex flex-col items-center justify-center p-4 text-center">
                   <div className="w-12 h-12 rounded-full border-2 border-mono-200 dark:border-mono-700 border-t-accent animate-spin mb-3"></div>
               </div>
            )}
            
            {/* Minimal Index Badge */}
            <div className="absolute bottom-4 left-4 w-8 h-8 bg-black/40 backdrop-blur-md rounded-full flex items-center justify-center text-xs font-bold text-white opacity-0 group-hover:opacity-100 transition-opacity">
              {idx + 1}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
