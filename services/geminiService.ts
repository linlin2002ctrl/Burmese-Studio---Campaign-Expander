
import { GoogleGenAI, Type } from "@google/genai";

// Helper to parse specific Gemini errors into user-friendly messages
const formatGeminiError = (error: any): string => {
  const msg = error?.message || '';
  const status = error?.status || error?.response?.status;
  
  if (msg.includes('API Key not found')) return msg;

  if (status === 400 || msg.includes('400') || msg.includes('InvalidArgument')) {
    return "Invalid request. Please check your prompt or images.";
  }
  if (status === 401 || msg.includes('401') || msg.includes('API key not valid')) {
    return "Invalid API Key. Please check your key in Settings.";
  }
  if (status === 403 || msg.includes('403') || msg.includes('permission denied')) {
    return "Access denied. Your API Key does not have permission for this model or region.";
  }
  if (status === 404 || msg.includes('404') || msg.includes('not found')) {
    return "Model not found. The selected model might be unavailable in your region.";
  }
  if (status === 429 || msg.includes('429') || msg.includes('Quota exceeded') || msg.includes('Resource has been exhausted')) {
    return "Quota exceeded. Please try again later or use a different API key.";
  }
  if (status === 503 || msg.includes('503') || msg.includes('Overloaded')) {
    return "AI Service is overloaded. Please try again in a moment.";
  }
  
  // Return the raw message if it's short, otherwise generic
  return msg.length < 100 ? msg : "An unexpected error occurred. Please check your connection.";
};

// Helper to ensure we have a key (environment, local storage, or injected via window.aistudio)
const getClient = (apiKey?: string, baseUrl?: string) => {
  // Prioritize the explicitly passed key (BYOK), then fallback to process.env
  const key = apiKey || process.env.API_KEY;
  if (!key) {
    throw new Error("API Key not found. Please enter an API key in Settings.");
  }
  
  // Initialize config with API key
  const config: any = { apiKey: key };
  
  // If a custom proxy URL is provided, try to set it as baseUrl.
  if (baseUrl) {
    config.baseUrl = baseUrl;
  }
  
  return new GoogleGenAI(config);
};

// Retry helper for Rate Limits (429)
const wait = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

async function withRetry<T>(fn: () => Promise<T>, retries = 3, baseDelay = 2000): Promise<T> {
  try {
    return await fn();
  } catch (error: any) {
    const msg = error?.message || '';
    const status = error?.status;
    
    // Check for rate limit (429) or resource exhaustion
    const isRateLimit = 
      status === 429 || 
      msg.includes('429') || 
      msg.includes('Resource has been exhausted') ||
      msg.includes('Quota exceeded');
      
    // Check for server overload (503)
    const isOverloaded = status === 503 || msg.includes('Overloaded');

    if (retries > 0 && (isRateLimit || isOverloaded)) {
      console.warn(`Rate limit/Overload hit. Retrying in ${baseDelay}ms... (${retries} attempts left)`);
      await wait(baseDelay);
      return withRetry(fn, retries - 1, baseDelay * 2); // Exponential backoff
    }
    
    throw error;
  }
}

export const suggestPoses = async (apiKey: string | undefined, masterPrompt: string, baseUrl?: string): Promise<string[]> => {
  try {
    const ai = getClient(apiKey, baseUrl);
    
    const prompt = `
      Act as a high-end fashion photoshoot director.
      First, analyze the provided "Master Prompt" to extract the SUBJECT, OUTFIT, SETTING, and STYLE.
      
      Master Prompt: "${masterPrompt}"
      
      Task: Generate 6 distinct, commercially viable pose descriptions tailored specifically to the extracted 'STYLE' and 'OUTFIT'.
      
      The 6 poses must cover these exact shot types in order:
      1. Full Body Look (Showcasing the complete silhouette and outfit)
      2. Close-up (Focusing on fabric details, accessories, or makeup)
      3. Action / Dynamic Shot (Movement appropriate to the style, e.g., walking, jumping, or flowing fabric)
      4. Seated / Relaxed Pose (Interacting with the environment/props)
      5. Back View / Angle (Highlighting rear details or a mysterious angle)
      6. Emotive Portrait (Focus on character and expression)
      
      Constraint:
      - If the style is 'Streetwear', suggests dynamic, cool, candid poses.
      - If the style is 'Formal/Studio', suggest elegant, poised, static poses.
      - Return ONLY a JSON array of 6 strings.
      - Do not include numbering or labels like "Pose 1:" in the strings.
    `;

    return await withRetry(async () => {
      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: prompt,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.ARRAY,
            items: { type: Type.STRING },
          }
        }
      });

      const text = response.text;
      if (!text) throw new Error("No text returned from AI");
      
      const parsed = JSON.parse(text);
      return Array.isArray(parsed) && parsed.length >= 6 ? parsed.slice(0, 6) : getFallbackPoses();
    });

  } catch (error) {
    console.error("Error suggesting poses:", error);
    // Throw formatted error to be handled by UI
    throw new Error(formatGeminiError(error));
  }
};

const getFallbackPoses = () => [
  "Full body shot standing confidently, showcasing the full outfit.",
  "Close-up detail shot focusing on the upper body and accessories.",
  "Dynamic shot walking towards the camera with movement.",
  "Seated pose, relaxed and engaging with the environment.",
  "Angled view from behind, looking back over the shoulder.",
  "Intense portrait shot looking directly into the lens."
];

// Helper to extract mime type and data from base64 string
const parseBase64 = (base64String: string) => {
  const match = base64String.match(/^data:(image\/[a-zA-Z]+);base64,(.+)$/);
  if (match) {
    return { mimeType: match[1], data: match[2] };
  }
  // Fallback if header is missing but it's likely jpeg/png
  return { mimeType: 'image/jpeg', data: base64String.replace(/^data:image\/[a-zA-Z]+;base64,/, '') };
};

export const generateCampaignImage = async (
  apiKey: string | undefined,
  heroImageBase64: string,
  sellingItemBase64: string,
  masterPrompt: string,
  poseDescription: string,
  baseUrl?: string
): Promise<string> => {
  try {
    const ai = getClient(apiKey, baseUrl);

    // 1. Prepare Images
    const heroImg = parseBase64(heroImageBase64);
    const itemImg = parseBase64(sellingItemBase64);

    // 2. Construct Strict Consistency Prompt
    const finalPrompt = `
      ${masterPrompt}
      
      CRITICAL INSTRUCTION:
      Generate a photorealistic high-end fashion image.
      
      VISUAL REFERENCES:
      1. HERO SHOT (First Image provided): Strictly copy the Model's Face, Body Type, Skin Tone, and Hair style from this image.
      2. SELLING ITEM REFERENCE (Second Image provided): Strictly copy the Garment/Product details from this image.
      
      CONSISTENCY RULES:
      - The SUBJECT/FACE must be identical to the Hero Shot.
      - The GARMENT/PRODUCT must be identical to the Selling Item Reference.
      - DO NOT alter the logos, colors, patterns, or fabric texture of the Selling Item.
      - Ensure the clothing fits naturally on the model's body in the specified pose.
      
      POSE DIRECTIVE:
      ${poseDescription}
      
      Style: High resolution, editorial fashion photography.
    `;

    return await withRetry(async () => {
      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash-image",
        contents: {
          parts: [
            {
              text: finalPrompt
            },
            // Part 1: Hero Shot (Character Ref)
            {
              inlineData: {
                mimeType: heroImg.mimeType, 
                data: heroImg.data
              }
            },
            // Part 2: Selling Item (Product Ref)
            {
              inlineData: {
                mimeType: itemImg.mimeType, 
                data: itemImg.data
              }
            }
          ]
        },
        config: {
          imageConfig: {
            aspectRatio: "3:4" 
          }
        }
      });

      // Extract image
      if (response.candidates && response.candidates[0].content.parts) {
        for (const part of response.candidates[0].content.parts) {
          if (part.inlineData && part.inlineData.data) {
            // The API typically returns PNG for generated images
            return `data:image/png;base64,${part.inlineData.data}`;
          }
        }
      }
      throw new Error("No image data generated in response.");
    });
  } catch (error) {
    console.error("Error generating image:", error);
    // Throw formatted error
    throw new Error(formatGeminiError(error));
  }
};
