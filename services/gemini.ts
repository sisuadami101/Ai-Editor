import { GoogleGenAI } from "@google/genai";
import { AspectRatio, ImageSize } from "../types";

export const generateBannerImage = async (
  description: string,
  targetUrl: string,
  aspectRatio: AspectRatio,
  imageSize: ImageSize
): Promise<string | null> => {
  try {
    // Initialize with the environment variable which is injected after selection
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

    // Construct a professional prompt for ad generation
    const prompt = `
      Professional advertising product photography for a banner ad.
      Product Description: ${description}.
      ${targetUrl ? `Brand Context/URL: ${targetUrl}.` : ''}
      
      Style: High-end commercial photography, studio lighting, 8k resolution, detailed textures, cinematic, hyper-realistic.
      Composition: Balanced for text overlay (copy space), clean background, visually striking.
      Do not include text in the image.
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-image-preview',
      contents: {
        parts: [
          {
            text: prompt,
          },
        ],
      },
      config: {
        imageConfig: {
          aspectRatio: aspectRatio,
          imageSize: imageSize,
        },
      },
    });

    // Parse response for image data
    for (const part of response.candidates?.[0]?.content?.parts || []) {
      if (part.inlineData) {
        const base64EncodeString = part.inlineData.data;
        return `data:image/png;base64,${base64EncodeString}`;
      }
    }

    return null;
  } catch (error) {
    console.error("Error generating image:", error);
    throw error;
  }
};

export const removeBackground = async (base64Image: string): Promise<string | null> => {
  try {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

    // Clean base64 string if it contains data URI prefix
    const cleanBase64 = base64Image.replace(/^data:image\/(png|jpeg|jpg|webp);base64,/, '');

    const prompt = `
      Task: Remove the background from the uploaded images automatically, preserving the subject perfectly.

      Requirements:
      1. Automatically detect the main subject (human, object, product, logo, design).
      2. Detect unwanted background and remove it completely.
      3. Keep transparency in background (PNG output).
      4. Preserve fine details like hair, small design elements, shadows (if desired).
      5. Optimize for T-shirt and other print-ready designs (high resolution).
      6. Detect and separate: Desired object (subject) vs Undesired parts (background).
      7. Ignore watermarks or irrelevant objects.
      8. Output format: PNG, transparent background, original resolution.
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: {
        parts: [
          {
            inlineData: {
              data: cleanBase64,
              mimeType: 'image/png', // Assuming input is converted or compatible
            },
          },
          {
            text: prompt,
          },
        ],
      },
    });

    for (const part of response.candidates?.[0]?.content?.parts || []) {
      if (part.inlineData) {
        const base64EncodeString = part.inlineData.data;
        return `data:image/png;base64,${base64EncodeString}`;
      }
    }

    return null;
  } catch (error) {
    console.error("Error removing background:", error);
    throw error;
  }
};