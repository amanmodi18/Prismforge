import React from 'react';
import { Download, AlertCircle, Undo2, Redo2 } from 'lucide-react';

interface ResultDisplayProps {
  imageUrl: string | null;
  loading: boolean;
  error: string | null;
  onUndo?: () => void;
  onRedo?: () => void;
  canUndo?: boolean;
  canRedo?: boolean;
}

export const ResultDisplay: React.FC<ResultDisplayProps> = ({ 
  imageUrl, 
  loading, 
  error,
  onUndo,
  onRedo,
  canUndo = false,
  canRedo = false
}) => {
  const handleDownload = () => {
    if (imageUrl) {
      const link = document.createElement('a');
      link.href = imageUrl;
      link.download = `nano-banana-edit-${Date.now()}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  const Controls = () => (
    <div className="absolute top-4 right-4 flex gap-2 z-10">
      <button
        onClick={onUndo}
        disabled={!canUndo}
        className={`p-2 rounded-lg backdrop-blur-md shadow-lg transition-all border border-[#2b6f77]/10 ${
          canUndo 
            ? 'bg-white/90 hover:bg-white text-[#2b6f77]' 
            : 'bg-white/50 text-[#2b6f77]/40 cursor-not-allowed'
        }`}
        title="Undo"
      >
        <Undo2 className="w-5 h-5" />
      </button>
      <button
        onClick={onRedo}
        disabled={!canRedo}
        className={`p-2 rounded-lg backdrop-blur-md shadow-lg transition-all border border-[#2b6f77]/10 ${
          canRedo 
            ? 'bg-white/90 hover:bg-white text-[#2b6f77]' 
            : 'bg-white/50 text-[#2b6f77]/40 cursor-not-allowed'
        }`}
        title="Redo"
      >
        <Redo2 className="w-5 h-5" />
      </button>
    </div>
  );

  if (loading) {
    return (
      <div className="w-full h-full min-h-[250px] bg-white/50 rounded-2xl border border-[#2b6f77]/20 flex flex-col items-center justify-center p-8 relative shadow-sm">
        <Controls />
        <div className="loader"></div>
        <p className="text-sm text-[#2b6f77] mt-8 text-center max-w-xs font-medium">
          The AI is processing your request. This typically takes a few seconds...
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full h-full min-h-[250px] bg-red-50 rounded-2xl border border-red-200 flex flex-col items-center justify-center p-8 relative shadow-sm">
        <Controls />
        <div className="p-3 bg-red-100 rounded-full mb-4">
          <AlertCircle className="w-8 h-8 text-red-500" />
        </div>
        <h3 className="text-lg font-medium text-red-700">Generation Failed</h3>
        <p className="text-sm text-red-600 mt-2 text-center max-w-xs">
          {error}
        </p>
      </div>
    );
  }

  if (!imageUrl) {
    return (
      <div className="w-full h-full min-h-[250px] bg-white/30 rounded-2xl border border-[#2b6f77]/20 flex flex-col items-center justify-center p-8 text-center relative">
        <Controls />
        <div className="w-16 h-16 rounded-2xl bg-white/50 mb-4 flex items-center justify-center rotate-3 shadow-sm">
          <div className="w-full h-full border-2 border-dashed border-[#2b6f77]/30 rounded-2xl opacity-50"></div>
        </div>
        <h3 className="text-[#2b6f77] font-medium">No edits yet</h3>
        <p className="text-[#2b6f77] opacity-60 text-sm mt-1">
          Your edited image will appear here after generation.
        </p>
      </div>
    );
  }

  return (
    <div className="relative w-full h-full min-h-[250px] bg-white/50 rounded-2xl overflow-hidden border border-[#e11584]/30 group shadow-2xl shadow-[#e11584]/10">
      <img 
        src={imageUrl} 
        alt="Generated Result" 
        className="w-full h-full object-contain bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] bg-[#2b6f77]/5" 
      />
      
      <Controls />
      
      <div className="absolute bottom-4 right-4 flex gap-2">
         <button 
          onClick={handleDownload}
          className="flex items-center gap-2 px-4 py-2 bg-[#e11584] hover:bg-[#c40e71] text-white rounded-xl font-semibold shadow-lg transition-all hover:scale-105"
        >
          <Download className="w-4 h-4" />
          Download Result
        </button>
      </div>
      
       <div className="absolute top-4 left-4">
            <span className="px-3 py-1 bg-[#e11584] text-white text-xs font-bold rounded-full shadow-lg">
                AI Edited
            </span>
        </div>
    </div>
  );
};