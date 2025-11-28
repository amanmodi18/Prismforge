import React from 'react';

export const Header: React.FC = () => {
  return (
    <header className="w-full py-6 px-4 md:px-8 border-b border-[#2b6f77]/10 bg-white/40 backdrop-blur-md sticky top-0 z-10">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-white rounded-lg shadow-md shadow-[#2b6f77]/10 hover:rotate-6 transition-transform duration-500 border border-[#2b6f77]/10">
            {/* 3D Solid Multicolour Prism Diagram Logo */}
            <svg width="28" height="28" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
              {/* Back Face (Dark Teal) */}
              <path d="M16 2L2 26H30L16 2Z" fill="#1e5259" /> 
              {/* Front-Right Face (Teal) */}
              <path d="M16 2L30 26L16 18V2Z" fill="#2b6f77" /> 
              {/* Front-Left Face (Pink) */}
              <path d="M16 2L2 26L16 18V2Z" fill="#e11584" /> 
              {/* Internal facets to suggest 3D solid glass/prism structure */}
              <path d="M16 18L2 26H30L16 18Z" fill="#1e5259" fillOpacity="0.4" />
            </svg>
          </div>
          <div>
            <h1 className="text-xl font-bold text-[#2b6f77] tracking-tight">Prismforge</h1>
            <p className="text-xs text-[#2b6f77]/70 font-medium">Powered by Gemini 2.5 Flash</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
           <span className="px-3 py-1 rounded-full bg-white/60 border border-[#2b6f77]/20 text-xs font-mono text-[#2b6f77] flex items-center gap-2">
             <Wand2 className="w-3 h-3 text-[#e11584]" />
             AI Enhanced
           </span>
        </div>
      </div>
    </header>
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