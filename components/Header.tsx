import React from 'react';
import { Sparkles, Key, Lock, Image as ImageIcon, Layers } from 'lucide-react';
import { AppMode } from '../types';

interface HeaderProps {
  hasKey: boolean;
  onSelectKey: () => void;
  currentMode: AppMode;
  onModeChange: (mode: AppMode) => void;
}

export const Header: React.FC<HeaderProps> = ({ hasKey, onSelectKey, currentMode, onModeChange }) => {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-slate-800 bg-slate-900/80 backdrop-blur supports-[backdrop-filter]:bg-slate-900/60">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <div className="flex items-center gap-8">
          <div className="flex items-center gap-2">
            <div className="rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 p-2">
              <Sparkles className="h-5 w-5 text-white" />
            </div>
            <span className="text-xl font-bold text-white tracking-tight">AdGenius</span>
          </div>

          {/* Navigation Tabs */}
          <div className="hidden md:flex items-center gap-1 rounded-lg bg-slate-800 p-1">
            <button
              onClick={() => onModeChange(AppMode.BANNER_GEN)}
              className={`flex items-center gap-2 rounded-md px-3 py-1.5 text-sm font-medium transition-all ${
                currentMode === AppMode.BANNER_GEN
                  ? 'bg-slate-700 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <ImageIcon className="h-4 w-4" />
              Banner Gen
            </button>
            <button
              onClick={() => onModeChange(AppMode.BG_REMOVAL)}
              className={`flex items-center gap-2 rounded-md px-3 py-1.5 text-sm font-medium transition-all ${
                currentMode === AppMode.BG_REMOVAL
                  ? 'bg-slate-700 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Layers className="h-4 w-4" />
              Remove BG
            </button>
          </div>
        </div>
        
        <div className="flex items-center gap-4">
          <button
            onClick={onSelectKey}
            className={`flex items-center gap-2 rounded-full px-4 py-1.5 text-sm font-medium transition-colors ${
              hasKey 
                ? 'bg-green-500/10 text-green-400 hover:bg-green-500/20' 
                : 'bg-amber-500/10 text-amber-400 hover:bg-amber-500/20 border border-amber-500/20 animate-pulse'
            }`}
          >
            {hasKey ? <Lock className="h-3.5 w-3.5" /> : <Key className="h-3.5 w-3.5" />}
            {hasKey ? 'API Key Active' : 'Select API Key'}
          </button>
        </div>
      </div>
    </header>
  );
};