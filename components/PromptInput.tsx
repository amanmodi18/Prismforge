import React from 'react';
import { Eraser, Sparkles, Zap, Pencil, Palette, Grid3x3, Box, Film, Star, Monitor } from 'lucide-react';
import { PresetPrompt, AspectRatio } from '../types';

interface PromptInputProps {
  prompt: string;
  setPrompt: (prompt: string) => void;
  aspectRatio: AspectRatio;
  setAspectRatio: (ratio: AspectRatio) => void;
  onGenerate: () => void;
  isGenerating: boolean;
  disabled: boolean;
}

export const PromptInput: React.FC<PromptInputProps> = ({ 
  prompt, 
  setPrompt, 
  aspectRatio,
  setAspectRatio,
  onGenerate, 
  isGenerating,
  disabled
}) => {
  
  const handlePreset = (text: string) => {
    setPrompt(text);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      if (!disabled && prompt.trim()) {
        onGenerate();
      }
    }
  };

  const presets = [
    { label: 'Remove BG', icon: Eraser, value: PresetPrompt.REMOVE_BG },
    { label: 'Blue Screen', icon: Monitor, value: PresetPrompt.BLUE_SCREEN },
    { label: 'Green Screen', icon: Monitor, value: PresetPrompt.GREEN_SCREEN },
    { label: 'Retro', icon: Sparkles, value: PresetPrompt.RETRO_FILTER },
    { label: 'Cyberpunk', icon: Zap, value: PresetPrompt.CYBERPUNK },
    { label: 'Sketch', icon: Pencil, value: PresetPrompt.SKETCH },
    { label: 'Watercolor', icon: Palette, value: PresetPrompt.WATERCOLOR },
    { label: 'Pixel Art', icon: Grid3x3, value: PresetPrompt.PIXEL_ART },
    { label: 'Claymation', icon: Box, value: PresetPrompt.CLAYMATION },
    { label: 'Noir', icon: Film, value: PresetPrompt.NOIR },
    { label: 'Fantasy', icon: Star, value: PresetPrompt.FANTASY },
  ];

  const ratios: AspectRatio[] = ["1:1", "3:4", "4:3", "9:16", "16:9"];

  return (
    <div className="w-full space-y-5">
      {/* Quick Actions */}
      <div className="space-y-2">
        <label className="text-xs font-semibold text-[#2b6f77] uppercase tracking-wider opacity-70 block">
          Filters & Effects
        </label>
        <div className="flex flex-wrap gap-2">
          {presets.map((preset) => (
            <button 
              key={preset.label}
              onClick={() => handlePreset(preset.value)}
              disabled={disabled}
              className="flex items-center gap-2 px-3 py-1.5 bg-[#2b6f77] hover:bg-[#1e5259] text-white border border-transparent rounded-full text-xs transition-all disabled:opacity-50 shadow-sm shadow-[#2b6f77]/20"
            >
              <preset.icon className="w-3 h-3 text-white" />
              {preset.label}
            </button>
          ))}
        </div>
      </div>

      {/* Aspect Ratio Selector */}
      <div className="space-y-2">
        <label className="text-xs font-semibold text-[#2b6f77] uppercase tracking-wider opacity-70 block">
          Output Aspect Ratio
        </label>
        <div className="flex flex-wrap gap-2">
          {ratios.map((ratio) => (
             <button
               key={ratio}
               onClick={() => setAspectRatio(ratio)}
               disabled={disabled}
               className={`
                 px-3 py-1.5 rounded-full text-xs font-medium transition-all shadow-sm border
                 ${aspectRatio === ratio
                   ? 'bg-[#e11584] border-[#e11584] text-white' // Selected: Pink
                   : 'bg-[#2b6f77] border-[#2b6f77] text-white hover:bg-[#1e5259]' // Unselected: Teal
                 }
                 disabled:opacity-50
               `}
             >
               {ratio}
             </button>
          ))}
        </div>
      </div>

      <div className="relative group">
        <textarea
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          onKeyDown={handleKeyDown}
          disabled={disabled}
          placeholder={disabled ? "Upload an image to start editing..." : "Describe how you want to change the image (e.g., 'Make it look like a cartoon', 'Remove the background')"}
          className="w-full h-32 bg-white/60 border border-[#2b6f77]/20 rounded-2xl p-4 text-[#2b6f77] placeholder-[#2b6f77]/40 focus:outline-none focus:ring-2 focus:ring-[#e11584]/30 focus:border-[#e11584] transition-all resize-none disabled:opacity-50 disabled:cursor-not-allowed text-sm leading-relaxed shadow-sm hover:bg-white"
        />
        
        <div className="absolute bottom-3 right-3">
          <button
            onClick={onGenerate}
            disabled={disabled || !prompt.trim() || isGenerating}
            className={`
              flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold text-white
              transition-all duration-300 transform
              ${disabled || !prompt.trim() || isGenerating
                ? 'bg-[#e11584] opacity-50 cursor-not-allowed' 
                : 'bg-[#e11584] hover:bg-[#c40e71] hover:scale-105 shadow-lg shadow-[#e11584]/20'}
            `}
          >
            {isGenerating ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                <span>Processing...</span>
              </>
            ) : (
              <>
                <Wand2 className="w-4 h-4" />
                <span>Generate Edit</span>
              </>
            )}
          </button>
        </div>
      </div>
      <p className="text-xs text-[#2b6f77] opacity-60 text-center">
        Powered by Gemini 2.5 Flash Image. For best results, use clear instructions.
      </p>
    </div>
  );
};

// Simple internal icon component since Wand2 is used multiple times
const Wand2 = ({ className }: { className?: string }) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round" 
    className={className}
  >
    <path d="m21.64 3.64-1.28-1.28a1.21 1.21 0 0 0-1.72 0L2.36 18.64a1.21 1.21 0 0 0 0 1.72l1.28 1.28a1.2 1.2 0 0 0 1.72 0L21.64 5.36a1.2 1.2 0 0 0 0-1.72Z" />
    <path d="m14 7 3 3" />
    <path d="M5 6v4" />
    <path d="M19 14v4" />
    <path d="M10 2v2" />
    <path d="M7 8H3" />
    <path d="M21 16h-4" />
    <path d="M11 3H9" />
  </svg>
);