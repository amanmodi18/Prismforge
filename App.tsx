
import React, { useState, useRef, useEffect } from 'react';
import { Header } from './components/Header';
import { ImageUploader } from './components/ImageUploader';
import { PromptInput } from './components/PromptInput';
import { ResultDisplay } from './components/ResultDisplay';
import { editImageWithGemini } from './services/geminiService';
import { ImageState, HistoryItem, AspectRatio } from './types';

const App: React.FC = () => {
  const [imageState, setImageState] = useState<ImageState>({
    file: null,
    previewUrl: null,
    base64: null,
    mimeType: null,
  });

  const [prompt, setPrompt] = useState<string>('');
  const [aspectRatio, setAspectRatio] = useState<AspectRatio>("3:4");
  
  // History management
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [historyIndex, setHistoryIndex] = useState<number>(-1);
  
  // Status state
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Refs for scrolling
  const resultRef = useRef<HTMLDivElement>(null);

  // Derived state
  const currentResultUrl = historyIndex >= 0 ? history[historyIndex].imageUrl : null;

  const handleImageChange = (newState: ImageState) => {
    setImageState(newState);
    // Reset history when image changes
    setHistory([]);
    setHistoryIndex(-1);
    setError(null);
    setLoading(false);
  };

  const handleGenerate = async () => {
    if (!imageState.base64 || !imageState.mimeType || !prompt.trim()) return;

    setLoading(true);
    setError(null);

    // Scroll to result section when starting
    setTimeout(() => {
        resultRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }, 100);

    try {
      const editedImageBase64 = await editImageWithGemini(
        imageState.base64,
        imageState.mimeType,
        prompt,
        aspectRatio
      );
      
      // Add to history, removing any future history if we were in the middle of the stack
      const newHistoryItem: HistoryItem = { imageUrl: editedImageBase64, prompt };
      const updatedHistory = [...history.slice(0, historyIndex + 1), newHistoryItem];
      
      setHistory(updatedHistory);
      setHistoryIndex(updatedHistory.length - 1);
      
    } catch (err: any) {
      setError(err.message || "Something went wrong during generation.");
    } finally {
      setLoading(false);
    }
  };

  const handleUndo = () => {
    if (historyIndex > -1) {
      const newIndex = historyIndex - 1;
      setHistoryIndex(newIndex);
      // Restore prompt from history if valid, otherwise leave as is (user might want to retry)
      if (newIndex >= 0) {
        setPrompt(history[newIndex].prompt);
      }
    }
  };

  const handleRedo = () => {
    if (historyIndex < history.length - 1) {
      const newIndex = historyIndex + 1;
      setHistoryIndex(newIndex);
      setPrompt(history[newIndex].prompt);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#ddeeff]">
      <Header />
      
      <main className="flex-1 max-w-5xl mx-auto w-full p-4 md:p-8 space-y-12">
        <section className="text-center max-w-3xl mx-auto mb-6">
           <h2 className="text-3xl md:text-5xl font-bold text-[#2b6f77] mb-4 bg-clip-text text-transparent bg-gradient-to-r from-[#2b6f77] via-[#e11584] to-[#2b6f77]">
             Reimagine your images
           </h2>
           <p className="text-[#2b6f77] text-lg opacity-80">
             Upload an image and describe how you want to change it. Whether it's removing backgrounds or applying creative filters, <span className="text-[#e11584] font-semibold">Gemini 2.5</span> handles it instantly.
           </p>
        </section>

        {/* Step 1: Upload */}
        <section className="space-y-4 max-w-4xl mx-auto w-full">
             <div className="flex items-center justify-between mb-2">
                <h3 className="text-sm font-semibold text-[#2b6f77] uppercase tracking-wider opacity-70">Source Image</h3>
             </div>
             <div className="h-[350px] w-full">
                <ImageUploader 
                  imageState={imageState} 
                  onImageChange={handleImageChange} 
                />
             </div>
        </section>

        {/* Step 2: Prompting */}
        <section className="max-w-4xl mx-auto w-full pt-4">
           <div className="flex items-center gap-3 mb-4">
              <div className="w-1 h-6 bg-[#e11584] rounded-full"></div>
              <h3 className="text-lg font-semibold text-[#2b6f77]">Magic Instructions</h3>
           </div>
           <PromptInput 
            prompt={prompt} 
            setPrompt={setPrompt}
            aspectRatio={aspectRatio}
            setAspectRatio={setAspectRatio}
            onGenerate={handleGenerate} 
            isGenerating={loading}
            disabled={!imageState.base64}
          />
        </section>

        {/* Step 3: Result */}
        <section ref={resultRef} className="space-y-4 pt-8 border-t border-[#2b6f77]/20 max-w-4xl mx-auto w-full">
             <div className="flex items-center justify-between mb-2">
                <h3 className="text-sm font-semibold text-[#2b6f77] uppercase tracking-wider opacity-70">Result</h3>
             </div>
             <div className="h-[450px] w-full">
                <ResultDisplay 
                  imageUrl={currentResultUrl} 
                  loading={loading} 
                  error={error}
                  onUndo={handleUndo}
                  onRedo={handleRedo}
                  canUndo={historyIndex >= 0}
                  canRedo={historyIndex < history.length - 1}
                />
             </div>
        </section>

      </main>

      <footer className="py-8 border-t border-[#2b6f77]/20 mt-auto bg-[#ddeeff]">
        <div className="max-w-7xl mx-auto px-4 text-center text-[#2b6f77] opacity-60 text-sm">
          <p>© {new Date().getFullYear()} Prismforge. Powered by Google Gemini.</p>
        </div>
      </footer>
    </div>
  );
};

export default App;
