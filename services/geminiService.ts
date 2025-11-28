import { GoogleGenAI } from "@google/genai";

// Initialize the client with the API key from the environment
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

/**
 * Edits an image using the Gemini 2.5 Flash Image model (Nano Banana).
 * 
 * @param base64Image The base64 encoded string of the source image.
 * @param mimeType The MIME type of the source image.
 * @param prompt The text prompt describing the edit.
 * @param aspectRatio The desired aspect ratio for the output image.
 * @returns A promise resolving to the base64 data URI of the generated image.
 */
export const editImageWithGemini = async (
  base64Image: string,
  mimeType: string,
  prompt: string,
  aspectRatio: string = "3:4"
): Promise<string> => {
  try {
    const cleanBase64 = base64Image.replace(/^data:image\/(png|jpeg|jpg|webp);base64,/, '');

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image', // Nano Banana model
      contents: {
        parts: [
          {
            inlineData: {
              data: cleanBase64,
              mimeType: mimeType,
            },
          },
          {
            text: prompt,
          },
        ],
      },
      config: {
        imageConfig: {
          aspectRatio: aspectRatio,
        }
      }
    });

    // Iterate through parts to find the image
    const candidates = response.candidates;
    if (!candidates || candidates.length === 0) {
      throw new Error("No candidates returned from Gemini API.");
    }

    const parts = candidates[0].content.parts;
    let generatedImageBase64: string | null = null;

    for (const part of parts) {
      if (part.inlineData && part.inlineData.data) {
        generatedImageBase64 = part.inlineData.data;
        break; 
      }
    }

    if (!generatedImageBase64) {
      // If the model refused to generate an image, it might have returned text explaining why.
      const textPart = parts.find(p => p.text);
      if (textPart) {
        throw new Error(`Gemini refused to generate image: ${textPart.text}`);
      }
      throw new Error("No image data found in the response.");
    }

    return `data:image/png;base64,${generatedImageBase64}`;

  } catch (error: any) {
    console.error("Gemini Image Edit Error:", error);
    throw new Error(error.message || "Failed to edit image.");
  }
};

/**
 * Helper to convert a File object to a base64 string.
 */
export const fileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = (error) => reject(error);
  });
};