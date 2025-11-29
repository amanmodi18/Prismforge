import React, { useCallback, useState } from 'react';
import { Upload, X, Crop as CropIcon } from 'lucide-react';
import { fileToBase64 } from '../services/geminiService';
import { ImageState } from '../types';
import { ImageCropper } from './ImageCropper';

interface ImageUploaderProps {
  imageState: ImageState;
  onImageChange: (newState: ImageState) => void;
}

export const ImageUploader: React.FC<ImageUploaderProps> = ({ imageState, onImageChange }) => {
  const [isCropping, setIsCropping] = useState(false);
  
  const handleFileChange = useCallback(async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      try {
        const base64 = await fileToBase64(file);
        onImageChange({
          file,
          previewUrl: URL.createObjectURL(file),
          base64,
          mimeType: file.type
        });
        setIsCropping(false);
      } catch (error) {
        console.error("Error reading file", error);
      }
    }
  }, [onImageChange]);

  const handleClear = useCallback(() => {
    if (imageState.previewUrl) {
      URL.revokeObjectURL(imageState.previewUrl);
    }
    onImageChange({ file: null, previewUrl: null, base64: null, mimeType: null });
    setIsCropping(false);
  }, [imageState.previewUrl, onImageChange]);

  const handleCropConfirm = (croppedBase64: string) => {
    // When cropping is confirmed, update the state with the new base64 image
    // Note: We lose the original 'file' object reference here effectively, 
    // but we keep the same mimeType (usually png from canvas) or default to png.
    onImageChange({
        ...imageState,
        previewUrl: croppedBase64, // base64 acts as URL
        base64: croppedBase64,
        mimeType: 'image/png'
    });
    setIsCropping(false);
  };

  if (imageState.previewUrl) {
    if (isCropping) {
        return (
            <div className="relative w-full h-full min-h-[250px] bg-white/50 rounded-2xl overflow-hidden border border-[#2b6f77]/20 shadow-sm">
                <ImageCropper 
                    imageSrc={imageState.previewUrl}
                    onConfirm={handleCropConfirm}
                    onCancel={() => setIsCropping(false)}
                />
            </div>
        );
    }

    return (
      <div className="relative w-full h-full min-h-[250px] bg-white/50 rounded-2xl overflow-hidden border border-[#2b6f77]/20 group shadow-sm">
        <img 
          src={imageState.previewUrl} 
          alt="Original" 
          className="w-full h-full object-contain bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] bg-[#2b6f77]/5" 
        />
        
        <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <button 
            onClick={() => setIsCropping(true)}
            className="p-2 bg-white hover:bg-gray-100 text-[#2b6f77] rounded-full backdrop-blur-md shadow-lg transition-colors border border-[#2b6f77]/10"
            title="Crop Image"
          >
            <CropIcon className="w-5 h-5" />
          </button>
          <button 
            onClick={handleClear}
            className="p-2 bg-red-500/80 hover:bg-red-600 text-white rounded-full backdrop-blur-md shadow-lg transition-colors"
            title="Remove Image"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <div className="absolute bottom-4 left-4">
            <span className="px-3 py-1 bg-[#2b6f77]/80 backdrop-blur-md text-white text-xs font-semibold rounded-full">
                Original Image
            </span>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full h-full min-h-[250px] flex flex-col relative">
      <label 
        htmlFor="image-upload" 
        className="flex-1 flex flex-col items-center justify-center w-full h-full border-2 border-dashed border-[#2b6f77]/20 rounded-2xl hover:border-[#e11584] hover:bg-white/40 transition-all cursor-pointer group bg-white/20"
      >
        <div className="flex flex-col items-center justify-center pt-5 pb-6 text-center px-4">
          <div className="p-4 bg-white rounded-full mb-4 group-hover:scale-110 transition-transform duration-300 group-hover:bg-[#e11584]/10 shadow-sm">
            <Upload className="w-8 h-8 text-[#2b6f77] opacity-60 group-hover:text-[#e11584] group-hover:opacity-100" />
          </div>
          <p className="mb-2 text-sm text-[#2b6f77] font-medium">
            <span className="font-bold text-[#e11584]">Click to upload</span> or drag and drop
          </p>
          <p className="text-xs text-[#2b6f77] opacity-60">SVG, PNG, JPG or WEBP (MAX. 10MB)</p>
        </div>
        <input 
          id="image-upload" 
          type="file" 
          className="hidden" 
          accept="image/*"
          onChange={handleFileChange}
        />
      </label>
    </div>
  );
};