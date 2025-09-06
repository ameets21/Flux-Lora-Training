import { GoogleGenAI, Modality } from "@google/genai";

if (!process.env.API_KEY) {
  throw new Error("API_KEY environment variable not set");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

/**
 * Converts a File object to a base64 encoded string and extracts its MIME type.
 * @param file The file to convert.
 * @returns A promise that resolves to an object containing the MIME type and base64 data.
 */
const fileToBase64 = (file: File): Promise<{ mimeType: string; data: string }> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      const mimeType = result.split(';')[0].split(':')[1];
      const data = result.split(',')[1];
      resolve({ mimeType, data });
    };
    reader.onerror = (error) => reject(error);
    reader.readAsDataURL(file);
  });
};

/**
 * Generates sample images using a multimodal approach, taking a base image and a text prompt.
 * @param prompt The text prompt to guide the image generation.
 * @param imageFile The base image file to provide visual context.
 * @returns A promise that resolves to an array of base64 data URLs for the generated images.
 */
export const generateSampleImages = async (prompt: string, imageFile: File): Promise<string[]> => {
  try {
    const { mimeType, data: base64ImageData } = await fileToBase64(imageFile);
    
    // Create 4 parallel requests to generate 4 distinct images.
    const generationPromises = Array(4).fill(0).map(() => 
      ai.models.generateContent({
        model: 'gemini-2.5-flash-image-preview',
        contents: {
          parts: [
            {
              inlineData: {
                data: base64ImageData,
                mimeType: mimeType,
              },
            },
            {
              // A more directive prompt to guide the model's creative process.
              text: `Generate a new image in a similar style and composition to the provided image, but incorporate this theme: "${prompt}"`,
            },
          ],
        },
        config: {
          // It is crucial to specify that we expect an IMAGE in the response.
          responseModalities: [Modality.IMAGE, Modality.TEXT],
        },
      })
    );
    
    const responses = await Promise.all(generationPromises);
    const generatedImages: string[] = [];
    
    responses.forEach(response => {
      if (response.candidates?.[0]?.content?.parts) {
        for (const part of response.candidates[0].content.parts) {
          // Find and process the image part of the response.
          if (part.inlineData && part.inlineData.mimeType.startsWith('image/')) {
            const base64ImageBytes = part.inlineData.data;
            const imageUrl = `data:${part.inlineData.mimeType};base64,${base64ImageBytes}`;
            generatedImages.push(imageUrl);
            break; // Move to the next response once an image is found.
          }
        }
      }
    });

    if (generatedImages.length === 0) {
      console.warn("Gemini API did not return any images for the prompts.");
    }

    return generatedImages;

  } catch (error) {
    console.error("Error generating images with Gemini API:", error);
    throw new Error("Failed to generate images. The image and/or prompt may have been blocked or an API error occurred.");
  }
};