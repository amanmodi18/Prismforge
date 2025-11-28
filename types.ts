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
  RETRO_FILTER = "Apply a vintage 1980s retro filter to the image with grain and color shift.",
  CYBERPUNK = "Transform the image into a cyberpunk style with neon lights and dark tones.",
  SKETCH = "Convert this image into a detailed pencil sketch.",
  WATERCOLOR = "Convert this image into a soft, artistic watercolor painting.",
  PIXEL_ART = "Transform this image into 8-bit pixel art style.",
  CLAYMATION = "Make the image look like a claymation stop-motion animation.",
  NOIR = "Convert to black and white film noir style with high contrast and dramatic shadows.",
  FANTASY = "Transform the image into a fantasy painting style with magical lighting."
}