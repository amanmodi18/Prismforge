
export interface ImageState {
  file: File | null;
  previewUrl: string | null;
  base64: string | null;
  mimeType: string | null;
}

export interface GenerationResult {
  imageUrl: string | null;
  loading: boolean;
  error: string | null;
}

export interface HistoryItem {
  imageUrl: string;
  prompt: string;
}

export type AspectRatio = "1:1" | "3:4" | "4:3" | "9:16" | "16:9";

export enum PresetPrompt {
  REMOVE_BG = "Remove the background from the image perfectly, leaving only the main subject. Keep high details.",
  BLUE_SCREEN = "Replace the entire background behind the main subject with a solid pure blue color (chroma key blue).",
  GREEN_SCREEN = "Replace the entire background behind the main subject with a solid pure green color (chroma key green).",
  EXPAND = "Keep the original subject and composition but expand the field of view to fill the entire image. Generate new, matching surroundings to fit the new aspect ratio seamlessly.",
  ENHANCE = "Significantly improve the image resolution, detail, and sharpness. Remove noise and blur while keeping the original composition and colors natural.",
  RETRO_FILTER = "Apply a vintage 1980s retro filter to the image with grain and color shift.",
  STUDIO_GHIBLI = "Transform this image into the style of a Studio Ghibli anime movie, with lush backgrounds, vibrant natural colors, and characteristic character designs.",
  POKEMON = "Transform the subject into a Pokemon anime style character or scene, with bold outlines, cel shading, and bright primary colors.",
  SKETCH = "Convert this image into a detailed pencil sketch.",
  WATERCOLOR = "Convert this image into a soft, artistic watercolor painting.",
  PIXEL_ART = "Transform this image into 8-bit pixel art style.",
  CLAYMATION = "Make the image look like a claymation stop-motion animation."
}
