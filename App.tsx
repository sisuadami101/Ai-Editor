import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { ControlPanel } from './components/ControlPanel';
import { ResultPanel } from './components/ResultPanel';
import { AspectRatio, ImageSize, AppMode, BgRemovalItem } from './types';
import { generateBannerImage, removeBackground } from './services/gemini';

const App: React.FC = () => {
  // Global State
  const [apiKeySet, setApiKeySet] = useState(false);
  const [currentMode, setCurrentMode] = useState<AppMode>(AppMode.BANNER_GEN);

  // Banner Gen State
  const [description, setDescription] = useState('');
  const [targetUrl, setTargetUrl] = useState('');
  const [aspectRatio, setAspectRatio] = useState<AspectRatio>(AspectRatio.LANDSCAPE_16_9);
  const [imageSize, setImageSize] = useState<ImageSize>(ImageSize.SIZE_1K);
  const [isGenerating, setIsGenerating] = useState(false);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  // BG Removal State
  const [bgRemovalQueue, setBgRemovalQueue] = useState<BgRemovalItem[]>([]);
  const [isProcessingQueue, setIsProcessingQueue] = useState(false);

  // Initial API Key Check
  useEffect(() => {
    const checkKey = async () => {
      const aistudio = (window as any).aistudio;
      if (aistudio && aistudio.hasSelectedApiKey) {
        const hasKey = await aistudio.hasSelectedApiKey();
        setApiKeySet(hasKey);
      }
    };
    checkKey();
  }, []);

  // Handle API Key Selection
  const handleSelectKey = async () => {
    const aistudio = (window as any).aistudio;
    if (aistudio && aistudio.openSelectKey) {
      try {
        await aistudio.openSelectKey();
        setApiKeySet(true);
      } catch (e) {
        console.error("Failed to select key", e);
        setApiKeySet(false);
      }
    } else {
      console.warn("AI Studio API not available");
      alert("AI Studio environment not detected.");
    }
  };

  // Handle Banner Generation
  const handleGenerate = async () => {
    if (!apiKeySet) {
      handleSelectKey();
      return;
    }

    setIsGenerating(true);
    setError(null);
    setImageUrl(null);

    try {
      const result = await generateBannerImage(description, targetUrl, aspectRatio, imageSize);
      if (result) {
        setImageUrl(result);
      } else {
        setError("The model generated a response but no image data was found.");
      }
    } catch (err: any) {
      console.error(err);
      if (err.message?.includes("Requested entity was not found") || err.message?.includes("403")) {
          setApiKeySet(false);
          setError("API Key validation failed. Please select your key again.");
          await handleSelectKey();
      } else {
          setError(err.message || "An unexpected error occurred during generation.");
      }
    } finally {
      setIsGenerating(false);
    }
  };

  // Handle BG Removal File Selection
  const handleBgFilesSelected = async (files: File[]) => {
    if (!apiKeySet) {
      await handleSelectKey();
      // Check again if key was set, if not, don't proceed
      // In a real app we might wait for effect, but here we rely on the user flow
    }

    const newItems: BgRemovalItem[] = files.map(file => ({
      id: Math.random().toString(36).substring(7),
      filename: file.name,
      originalUrl: URL.createObjectURL(file),
      processedUrl: null,
      status: 'pending'
    }));

    setBgRemovalQueue(prev => [...newItems, ...prev]);
    
    // Trigger processing (using a simple loop for now, can be optimized for concurrency)
    processBgQueue(newItems);
  };

  const processBgQueue = async (items: BgRemovalItem[]) => {
     // We process the newly added items
     // In a real app, use a robust queue system. Here we just iterate.
     setIsProcessingQueue(true);

     for (const item of items) {
        try {
          // Update status to processing
          setBgRemovalQueue(prev => prev.map(i => i.id === item.id ? { ...i, status: 'processing' } : i));

          // Fetch blob to base64
          const response = await fetch(item.originalUrl);
          const blob = await response.blob();
          const base64 = await new Promise<string>((resolve) => {
            const reader = new FileReader();
            reader.onloadend = () => resolve(reader.result as string);
            reader.readAsDataURL(blob);
          });

          const resultBase64 = await removeBackground(base64);

          if (resultBase64) {
            setBgRemovalQueue(prev => prev.map(i => i.id === item.id ? { ...i, status: 'completed', processedUrl: resultBase64 } : i));
          } else {
            throw new Error("No image returned");
          }

        } catch (e: any) {
           console.error("Failed to process image", item.filename, e);
           setBgRemovalQueue(prev => prev.map(i => i.id === item.id ? { ...i, status: 'error', error: e.message || 'Failed' } : i));
           
           if (e.message?.includes("Requested entity was not found")) {
              setApiKeySet(false);
           }
        }
     }

     setIsProcessingQueue(false);
  };

  return (
    <div className="flex h-screen flex-col bg-slate-900 text-slate-100 overflow-hidden">
      <Header 
        hasKey={apiKeySet} 
        onSelectKey={handleSelectKey} 
        currentMode={currentMode}
        onModeChange={setCurrentMode}
      />
      
      <main className="flex flex-1 overflow-hidden">
        {/* Left Panel: Controls */}
        <aside className="w-[400px] border-r border-slate-800 bg-slate-900/50 z-20 hidden md:block">
          <ControlPanel
            mode={currentMode}
            hasKey={apiKeySet}
            // Banner Props
            description={description}
            setDescription={setDescription}
            targetUrl={targetUrl}
            setTargetUrl={setTargetUrl}
            aspectRatio={aspectRatio}
            setAspectRatio={setAspectRatio}
            imageSize={imageSize}
            setImageSize={setImageSize}
            isGenerating={isGenerating}
            onGenerate={handleGenerate}
            // BG Removal Props
            onFilesSelected={handleBgFilesSelected}
            isProcessingQueue={isProcessingQueue}
          />
        </aside>

        {/* Right Panel: Results */}
        <section className="flex-1 relative">
          <ResultPanel
            mode={currentMode}
            // Banner Props
            imageUrl={imageUrl}
            isGenerating={isGenerating}
            error={error}
            selectedRatio={aspectRatio}
            // BG Removal Props
            bgRemovalQueue={bgRemovalQueue}
          />
        </section>
      </main>
    </div>
  );
};

export default App;