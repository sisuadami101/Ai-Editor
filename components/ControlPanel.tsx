import React, { useCallback, useState } from 'react';
import { AspectRatio, ImageSize, AppMode } from '../types';
import { Wand2, Monitor, Smartphone, Square, Layout, UploadCloud, FileImage, X } from 'lucide-react';

interface ControlPanelProps {
  // Common
  mode: AppMode;
  hasKey: boolean;
  
  // Banner Gen Props
  description: string;
  setDescription: (val: string) => void;
  targetUrl: string;
  setTargetUrl: (val: string) => void;
  aspectRatio: AspectRatio;
  setAspectRatio: (val: AspectRatio) => void;
  imageSize: ImageSize;
  setImageSize: (val: ImageSize) => void;
  isGenerating: boolean;
  onGenerate: () => void;

  // BG Removal Props
  onFilesSelected: (files: File[]) => void;
  isProcessingQueue: boolean;
}

export const ControlPanel: React.FC<ControlPanelProps> = ({
  mode,
  hasKey,
  description,
  setDescription,
  targetUrl,
  setTargetUrl,
  aspectRatio,
  setAspectRatio,
  imageSize,
  setImageSize,
  isGenerating,
  onGenerate,
  onFilesSelected,
  isProcessingQueue
}) => {
  const [isDragging, setIsDragging] = useState(false);

  // --- Drag & Drop Handlers ---
  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    
    const files = Array.from(e.dataTransfer.files).filter((file: File) => 
      file.type.startsWith('image/')
    );
    
    if (files.length > 0) {
      onFilesSelected(files);
    }
  }, [onFilesSelected]);

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files).filter((file: File) => 
        file.type.startsWith('image/')
      );
      if (files.length > 0) {
        onFilesSelected(files);
      }
    }
  };

  const renderAspectRatioIcon = (ratio: AspectRatio) => {
    switch(ratio) {
      case AspectRatio.LANDSCAPE_16_9: return <Monitor className="h-4 w-4" />;
      case AspectRatio.PORTRAIT_9_16: return <Smartphone className="h-4 w-4" />;
      case AspectRatio.SQUARE: return <Square className="h-4 w-4" />;
      default: return <Layout className="h-4 w-4" />;
    }
  };

  // --- Banner Generation View ---
  if (mode === AppMode.BANNER_GEN) {
    return (
      <div className="flex h-full flex-col gap-6 overflow-y-auto p-6">
        <div>
          <h2 className="text-lg font-semibold text-white">Configuration</h2>
          <p className="text-sm text-slate-400">Set up your ad creative parameters.</p>
        </div>

        {/* Description Input */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-slate-300">Product Description</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="E.g., A futuristic neon running shoe floating in mid-air, cyberpunk city background..."
            className="min-h-[120px] w-full rounded-lg border border-slate-700 bg-slate-800 p-3 text-sm text-slate-200 placeholder:text-slate-500 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
          />
        </div>

        {/* URL Input */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-slate-300">Target URL (Optional Context)</label>
          <input
            type="text"
            value={targetUrl}
            onChange={(e) => setTargetUrl(e.target.value)}
            placeholder="https://myshop.com/product"
            className="w-full rounded-lg border border-slate-700 bg-slate-800 p-3 text-sm text-slate-200 placeholder:text-slate-500 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
          />
        </div>

        {/* Aspect Ratio Grid */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-slate-300">Aspect Ratio</label>
          <div className="grid grid-cols-3 gap-2">
            {Object.values(AspectRatio).map((ratio) => (
              <button
                key={ratio}
                onClick={() => setAspectRatio(ratio)}
                className={`flex flex-col items-center justify-center gap-1 rounded-lg border p-3 text-xs font-medium transition-all ${
                  aspectRatio === ratio
                    ? 'border-indigo-500 bg-indigo-500/20 text-white'
                    : 'border-slate-700 bg-slate-800 text-slate-400 hover:border-slate-600 hover:bg-slate-700'
                }`}
              >
                {renderAspectRatioIcon(ratio)}
                {ratio}
              </button>
            ))}
          </div>
        </div>

        {/* Resolution Select */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-slate-300">Resolution (Quality)</label>
          <div className="flex rounded-lg bg-slate-800 p-1 border border-slate-700">
            {Object.values(ImageSize).map((size) => (
              <button
                key={size}
                onClick={() => setImageSize(size)}
                className={`flex-1 rounded-md py-1.5 text-xs font-medium transition-all ${
                  imageSize === size
                    ? 'bg-indigo-500 text-white shadow-sm'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {size}
              </button>
            ))}
          </div>
          <p className="text-xs text-slate-500">4K requires more processing time.</p>
        </div>

        {/* Generate Button */}
        <div className="mt-auto pt-6">
          <button
            onClick={onGenerate}
            disabled={isGenerating || !description || !hasKey}
            className={`group relative flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 px-4 py-4 font-semibold text-white shadow-lg transition-all hover:from-indigo-500 hover:to-purple-500 disabled:cursor-not-allowed disabled:opacity-50 ${
              !hasKey ? 'opacity-50 grayscale' : ''
            }`}
          >
            {isGenerating ? (
              <>
                <div className="h-5 w-5 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                <span>Generating...</span>
              </>
            ) : (
              <>
                <Wand2 className="h-5 w-5 transition-transform group-hover:rotate-12" />
                <span>Generate Banner</span>
              </>
            )}
          </button>
          {!hasKey && (
            <p className="mt-2 text-center text-xs text-amber-500">
              Please select a paid API key to enable generation.
            </p>
          )}
        </div>
      </div>
    );
  }

  // --- Background Removal View ---
  return (
    <div className="flex h-full flex-col gap-6 p-6">
      <div>
        <h2 className="text-lg font-semibold text-white">Upload Images</h2>
        <p className="text-sm text-slate-400">Remove backgrounds instantly.</p>
      </div>

      <div 
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`flex flex-1 flex-col items-center justify-center gap-4 rounded-xl border-2 border-dashed p-6 text-center transition-all ${
          isDragging 
            ? 'border-emerald-500 bg-emerald-500/10' 
            : 'border-slate-700 bg-slate-800/50 hover:bg-slate-800'
        }`}
      >
        <div className={`rounded-full p-4 ${isDragging ? 'bg-emerald-500/20' : 'bg-slate-800'}`}>
          <UploadCloud className={`h-8 w-8 ${isDragging ? 'text-emerald-400' : 'text-slate-400'}`} />
        </div>
        
        <div className="space-y-1">
          <p className="text-sm font-medium text-slate-200">
            Drag & drop images here
          </p>
          <p className="text-xs text-slate-500">
            Supports JPG, PNG, WEBP
          </p>
        </div>

        <label className="cursor-pointer rounded-lg bg-slate-700 px-4 py-2 text-sm font-medium text-white hover:bg-slate-600 transition-colors">
          Select Files
          <input 
            type="file" 
            className="hidden" 
            multiple 
            accept="image/*"
            onChange={handleFileInput}
            disabled={isProcessingQueue}
          />
        </label>
      </div>

      <div className="rounded-lg border border-slate-800 bg-slate-900/50 p-4">
        <div className="flex items-start gap-3">
          <FileImage className="h-5 w-5 text-emerald-500 mt-0.5" />
          <div className="text-sm">
            <p className="font-medium text-slate-200">Pro Tip</p>
            <p className="text-slate-400 mt-1 text-xs leading-relaxed">
              For best results, use images with clear contrast between the subject and background. 
              T-shirt designs and product photos work best.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};