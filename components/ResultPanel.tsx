import React from 'react';
import { Download, Maximize2, AlertCircle, Check, Loader2 } from 'lucide-react';
import { AspectRatio, AppMode, BgRemovalItem } from '../types';

interface ResultPanelProps {
  mode: AppMode;
  
  // Banner Props
  imageUrl: string | null;
  isGenerating: boolean;
  error: string | null;
  selectedRatio: AspectRatio;

  // BG Removal Props
  bgRemovalQueue: BgRemovalItem[];
}

export const ResultPanel: React.FC<ResultPanelProps> = ({
  mode,
  imageUrl,
  isGenerating,
  error,
  selectedRatio,
  bgRemovalQueue
}) => {
  // --- Helper Functions ---
  const getAspectRatioStyle = (ratio: AspectRatio) => {
    const [w, h] = ratio.split(':').map(Number);
    return { aspectRatio: `${w}/${h}` };
  };

  const downloadImage = (url: string, filename: string) => {
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // --- Banner Generation View ---
  if (mode === AppMode.BANNER_GEN) {
    return (
      <div className="flex h-full w-full flex-col items-center justify-center bg-slate-950 p-8 relative overflow-hidden">
        {/* Background Grid Pattern */}
        <div className="absolute inset-0 opacity-20" 
          style={{
              backgroundImage: 'radial-gradient(#475569 1px, transparent 1px)',
              backgroundSize: '24px 24px'
          }} 
        />

        {error && (
          <div className="z-10 mb-6 flex items-center gap-3 rounded-lg border border-red-500/20 bg-red-500/10 px-4 py-3 text-red-400">
            <AlertCircle className="h-5 w-5" />
            <p className="text-sm">{error}</p>
          </div>
        )}

        <div className="z-10 flex w-full max-w-5xl flex-col items-center justify-center gap-4">
          {isGenerating ? (
            <div 
              className="relative w-full max-w-2xl overflow-hidden rounded-lg border border-slate-800 bg-slate-900 shadow-2xl"
              style={getAspectRatioStyle(selectedRatio)}
            >
                <div className="absolute inset-0 flex flex-col items-center justify-center gap-4">
                  <div className="h-12 w-12 animate-spin rounded-full border-4 border-indigo-500 border-t-transparent"></div>
                  <p className="animate-pulse text-sm font-medium text-slate-400">AI is crafting your visual...</p>
                </div>
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -skew-x-12 animate-[shimmer_2s_infinite]"></div>
            </div>
          ) : imageUrl ? (
            <div className="group relative w-full max-w-4xl animate-in fade-in zoom-in duration-500">
              <div className="relative overflow-hidden rounded-lg shadow-2xl ring-1 ring-white/10">
                <img 
                  src={imageUrl} 
                  alt="Generated Banner" 
                  className="h-full w-full object-cover"
                />
                
                {/* Overlay Actions */}
                <div className="absolute bottom-0 left-0 right-0 flex items-center justify-between bg-black/60 p-4 opacity-0 backdrop-blur-md transition-opacity group-hover:opacity-100">
                  <span className="text-xs font-medium text-white/80">Generated with Gemini 3 Pro</span>
                  <div className="flex gap-2">
                      <button 
                        onClick={() => window.open(imageUrl, '_blank')}
                        className="rounded-lg bg-white/10 p-2 text-white hover:bg-white/20"
                        title="View Full Size"
                      >
                        <Maximize2 className="h-4 w-4" />
                      </button>
                      <button 
                        onClick={() => downloadImage(imageUrl, `ad-banner-${Date.now()}.png`)}
                        className="flex items-center gap-2 rounded-lg bg-indigo-600 px-3 py-2 text-sm font-semibold text-white hover:bg-indigo-500"
                      >
                        <Download className="h-4 w-4" />
                        Download PNG
                      </button>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center gap-4 text-center">
              <div className="rounded-full bg-slate-900 p-6 ring-1 ring-slate-800">
                <div className="h-16 w-16 rounded-lg bg-gradient-to-tr from-slate-800 to-slate-700 opacity-50"></div>
              </div>
              <div className="space-y-1">
                <h3 className="text-xl font-medium text-white">Ready to Create</h3>
                <p className="text-slate-400 max-w-sm mx-auto">
                  Describe your product and choose a size to generate professional banner ads instantly.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  // --- Background Removal View ---
  return (
    <div className="flex h-full w-full flex-col bg-slate-950 relative overflow-hidden">
      <div className="absolute inset-0 opacity-20" 
          style={{
              backgroundImage: 'radial-gradient(#475569 1px, transparent 1px)',
              backgroundSize: '24px 24px'
          }} 
      />

      <div className="z-10 flex-1 overflow-y-auto p-8">
        {bgRemovalQueue.length === 0 ? (
          <div className="flex h-full flex-col items-center justify-center gap-4 text-center">
            <div className="rounded-full bg-slate-900 p-6 ring-1 ring-slate-800">
              <div className="h-16 w-16 rounded-lg bg-gradient-to-tr from-emerald-900 to-slate-900 opacity-50 flex items-center justify-center">
                 <Download className="h-8 w-8 text-slate-600" />
              </div>
            </div>
            <div className="space-y-1">
              <h3 className="text-xl font-medium text-white">No Images Uploaded</h3>
              <p className="text-slate-400 max-w-sm mx-auto">
                Upload images from the panel on the left to automatically remove their backgrounds.
              </p>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3 max-w-7xl mx-auto">
            {bgRemovalQueue.map((item) => (
              <div key={item.id} className="group relative overflow-hidden rounded-xl bg-slate-900 border border-slate-800 shadow-lg transition-all hover:border-emerald-500/30">
                
                {/* Status Indicator */}
                <div className="absolute top-3 left-3 z-20">
                   {item.status === 'pending' && <span className="rounded-full bg-slate-800/90 px-2 py-1 text-xs text-slate-400 backdrop-blur">Pending...</span>}
                   {item.status === 'processing' && <span className="flex items-center gap-1 rounded-full bg-indigo-500/90 px-2 py-1 text-xs text-white backdrop-blur"><Loader2 className="h-3 w-3 animate-spin"/> Processing</span>}
                   {item.status === 'completed' && <span className="flex items-center gap-1 rounded-full bg-emerald-500/90 px-2 py-1 text-xs text-white backdrop-blur"><Check className="h-3 w-3"/> Done</span>}
                   {item.status === 'error' && <span className="flex items-center gap-1 rounded-full bg-red-500/90 px-2 py-1 text-xs text-white backdrop-blur"><AlertCircle className="h-3 w-3"/> Failed</span>}
                </div>

                {/* Images Container */}
                <div className="relative aspect-square w-full bg-[url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAMUlEQVQ4T2NkYGAQYcAP3uCTZhw1gGGYhAGBZIA/nYDCgBDAm9BGDWAAJyRCgLaBCAAgXwixzAS0pgAAAABJRU5ErkJggg==')]">
                   {/* If processed, show processed. Hover to show original. */}
                   {item.status === 'completed' && item.processedUrl ? (
                     <>
                       <img src={item.processedUrl} className="absolute inset-0 h-full w-full object-contain transition-opacity duration-300 group-hover:opacity-0" alt="Processed" />
                       <img src={item.originalUrl} className="absolute inset-0 h-full w-full object-contain opacity-0 transition-opacity duration-300 group-hover:opacity-100" alt="Original" />
                       <div className="absolute bottom-3 left-1/2 -translate-x-1/2 rounded-full bg-black/50 px-3 py-1 text-xs font-medium text-white opacity-0 backdrop-blur transition-opacity group-hover:opacity-100 pointer-events-none">
                         Show Original
                       </div>
                     </>
                   ) : (
                     <img src={item.originalUrl} className={`absolute inset-0 h-full w-full object-contain ${item.status === 'processing' ? 'opacity-50' : ''}`} alt="Original" />
                   )}
                </div>

                {/* Action Bar */}
                <div className="flex items-center justify-between bg-slate-800 p-3">
                  <span className="truncate text-xs font-medium text-slate-400 max-w-[120px]" title={item.filename}>
                    {item.filename}
                  </span>
                  {item.status === 'completed' && item.processedUrl && (
                    <button
                      onClick={() => downloadImage(item.processedUrl!, item.filename.replace(/\.[^/.]+$/, "") + "_bg_removed.png")}
                      className="flex items-center gap-1.5 rounded-md bg-emerald-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-emerald-500 transition-colors"
                    >
                      <Download className="h-3.5 w-3.5" />
                      Save PNG
                    </button>
                  )}
                  {item.status === 'error' && (
                    <span className="text-xs text-red-400 truncate max-w-[150px]">{item.error || "Error"}</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};