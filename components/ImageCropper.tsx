import React, { useState, useRef, useEffect, MouseEvent as ReactMouseEvent, TouchEvent as ReactTouchEvent } from 'react';
import { Check, X } from 'lucide-react';

interface ImageCropperProps {
  imageSrc: string;
  onConfirm: (croppedBase64: string) => void;
  onCancel: () => void;
}

export const ImageCropper: React.FC<ImageCropperProps> = ({ imageSrc, onConfirm, onCancel }) => {
  const imageRef = useRef<HTMLImageElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  
  // Crop state in percentages (0-100)
  const [crop, setCrop] = useState({ x: 10, y: 10, width: 80, height: 80 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragAction, setDragAction] = useState<string | null>(null); // 'move', 'nw', 'ne', 'sw', 'se'
  const [startPos, setStartPos] = useState({ x: 0, y: 0 });
  const [startCrop, setStartCrop] = useState({ x: 0, y: 0, width: 0, height: 0 });
  const [imageLoaded, setImageLoaded] = useState(false);

  const getClientPos = (e: ReactMouseEvent | ReactTouchEvent | MouseEvent | TouchEvent) => {
    if ('touches' in e) {
      return { x: e.touches[0].clientX, y: e.touches[0].clientY };
    }
    return { x: (e as MouseEvent | ReactMouseEvent).clientX, y: (e as MouseEvent | ReactMouseEvent).clientY };
  };

  const handleStart = (e: ReactMouseEvent | ReactTouchEvent, action: string) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
    setDragAction(action);
    const pos = getClientPos(e);
    setStartPos(pos);
    setStartCrop({ ...crop });
  };

  useEffect(() => {
    const handleMove = (e: MouseEvent | TouchEvent) => {
      if (!isDragging || !containerRef.current || !dragAction) return;
      e.preventDefault();
      
      const pos = getClientPos(e);
      const rect = containerRef.current.getBoundingClientRect();
      
      // Calculate delta in percentages relative to the image container
      const deltaXPercent = ((pos.x - startPos.x) / rect.width) * 100;
      const deltaYPercent = ((pos.y - startPos.y) / rect.height) * 100;

      let newCrop = { ...startCrop };

      if (dragAction === 'move') {
        newCrop.x = Math.min(Math.max(startCrop.x + deltaXPercent, 0), 100 - startCrop.width);
        newCrop.y = Math.min(Math.max(startCrop.y + deltaYPercent, 0), 100 - startCrop.height);
      } else {
        // Resizing logic
        if (dragAction.includes('e')) {
           newCrop.width = Math.min(Math.max(startCrop.width + deltaXPercent, 10), 100 - startCrop.x);
        }
        if (dragAction.includes('s')) {
           newCrop.height = Math.min(Math.max(startCrop.height + deltaYPercent, 10), 100 - startCrop.y);
        }
        if (dragAction.includes('w')) {
           const maxDelta = startCrop.width - 10;
           const actualDelta = Math.min(Math.max(deltaXPercent, -startCrop.x), maxDelta);
           newCrop.x = startCrop.x + actualDelta;
           newCrop.width = startCrop.width - actualDelta;
        }
        if (dragAction.includes('n')) {
           const maxDelta = startCrop.height - 10;
           const actualDelta = Math.min(Math.max(deltaYPercent, -startCrop.y), maxDelta);
           newCrop.y = startCrop.y + actualDelta;
           newCrop.height = startCrop.height - actualDelta;
        }
      }
      setCrop(newCrop);
    };

    const handleEnd = () => {
      setIsDragging(false);
      setDragAction(null);
    };

    if (isDragging) {
      window.addEventListener('mousemove', handleMove, { passive: false });
      window.addEventListener('touchmove', handleMove, { passive: false });
      window.addEventListener('mouseup', handleEnd);
      window.addEventListener('touchend', handleEnd);
    }

    return () => {
      window.removeEventListener('mousemove', handleMove);
      window.removeEventListener('touchmove', handleMove);
      window.removeEventListener('mouseup', handleEnd);
      window.removeEventListener('touchend', handleEnd);
    };
  }, [isDragging, dragAction, startPos, startCrop]);

  const handleConfirm = () => {
    if (!imageRef.current) return;
    const canvas = document.createElement('canvas');
    const image = imageRef.current;
    
    // Use natural dimensions to get full resolution crop
    const scaleX = image.naturalWidth / 100;
    const scaleY = image.naturalHeight / 100;
    
    const pixelCrop = {
      x: crop.x * scaleX,
      y: crop.y * scaleY,
      w: crop.width * scaleX,
      h: crop.height * scaleY
    };

    canvas.width = pixelCrop.w;
    canvas.height = pixelCrop.h;
    const ctx = canvas.getContext('2d');
    
    if (ctx) {
        ctx.drawImage(
          image,
          pixelCrop.x, pixelCrop.y, pixelCrop.w, pixelCrop.h,
          0, 0, pixelCrop.w, pixelCrop.h
        );
        onConfirm(canvas.toDataURL('image/png'));
    }
  };

  return (
    <div className="absolute inset-0 z-20 bg-[#ddeeff] flex flex-col p-4 rounded-2xl overflow-hidden select-none">
       <div className="flex justify-between items-center mb-4">
          <span className="font-semibold text-sm text-[#2b6f77]">Crop Source Image</span>
          <div className="flex gap-2">
             <button 
                onClick={onCancel} 
                className="flex items-center gap-1 px-3 py-1.5 bg-gray-200 hover:bg-gray-300 text-[#2b6f77] rounded-full text-xs font-medium transition-colors"
             >
                <X className="w-3 h-3" /> Cancel
             </button>
             <button 
                onClick={handleConfirm} 
                className="flex items-center gap-1 px-3 py-1.5 bg-[#e11584] hover:bg-[#c40e71] text-white rounded-full text-xs font-medium transition-colors shadow-sm"
             >
                <Check className="w-3 h-3" /> Apply Crop
             </button>
          </div>
       </div>
       
       <div className="flex-1 relative flex items-center justify-center overflow-hidden bg-black/5 rounded-xl border border-[#2b6f77]/10 w-full h-full p-4">
          <div className="relative inline-block" ref={containerRef}>
            <img 
              ref={imageRef}
              src={imageSrc} 
              onLoad={() => setImageLoaded(true)}
              alt="Crop target"
              className="max-w-full max-h-[50vh] md:max-h-[60vh] object-contain pointer-events-none select-none block"
              draggable={false}
            />
            
            {imageLoaded && (
                <div 
                   className="absolute cursor-move outline outline-2 outline-white shadow-[0_0_0_9999px_rgba(0,0,0,0.5)] z-10" 
                   style={{ 
                     left: `${crop.x}%`, 
                     top: `${crop.y}%`, 
                     width: `${crop.width}%`, 
                     height: `${crop.height}%`
                   }}
                   onMouseDown={(e) => handleStart(e, 'move')}
                   onTouchStart={(e) => handleStart(e, 'move')}
                >
                    {/* Grid lines for rule of thirds */}
                    <div className="absolute inset-0 pointer-events-none opacity-30">
                        <div className="absolute left-1/3 top-0 bottom-0 w-px bg-white"></div>
                        <div className="absolute right-1/3 top-0 bottom-0 w-px bg-white"></div>
                        <div className="absolute top-1/3 left-0 right-0 h-px bg-white"></div>
                        <div className="absolute bottom-1/3 left-0 right-0 h-px bg-white"></div>
                    </div>

                    {/* Resize Handles */}
                    <div className="absolute top-0 left-0 w-5 h-5 -translate-x-1/2 -translate-y-1/2 flex items-center justify-center cursor-nw-resize pointer-events-auto" onMouseDown={(e) => handleStart(e, 'nw')} onTouchStart={(e) => handleStart(e, 'nw')}>
                        <div className="w-3 h-3 bg-[#e11584] rounded-full ring-2 ring-white"></div>
                    </div>
                    <div className="absolute top-0 right-0 w-5 h-5 translate-x-1/2 -translate-y-1/2 flex items-center justify-center cursor-ne-resize pointer-events-auto" onMouseDown={(e) => handleStart(e, 'ne')} onTouchStart={(e) => handleStart(e, 'ne')}>
                         <div className="w-3 h-3 bg-[#e11584] rounded-full ring-2 ring-white"></div>
                    </div>
                    <div className="absolute bottom-0 left-0 w-5 h-5 -translate-x-1/2 translate-y-1/2 flex items-center justify-center cursor-sw-resize pointer-events-auto" onMouseDown={(e) => handleStart(e, 'sw')} onTouchStart={(e) => handleStart(e, 'sw')}>
                         <div className="w-3 h-3 bg-[#e11584] rounded-full ring-2 ring-white"></div>
                    </div>
                    <div className="absolute bottom-0 right-0 w-5 h-5 translate-x-1/2 translate-y-1/2 flex items-center justify-center cursor-se-resize pointer-events-auto" onMouseDown={(e) => handleStart(e, 'se')} onTouchStart={(e) => handleStart(e, 'se')}>
                         <div className="w-3 h-3 bg-[#e11584] rounded-full ring-2 ring-white"></div>
                    </div>
                </div>
            )}
          </div>
       </div>
    </div>
  );
};
