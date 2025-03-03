// For Tauri v2, we need to import from @tauri-apps/api
import { invoke } from '@tauri-apps/api/core';
import { getApiKey } from '../utils/store';

export const generateImage = async (formData) => {
  try {
    // Get API key from store
    const apiKey = await getApiKey();

    if (!apiKey) {
      throw new Error('API key not configured. Please add your API key in Settings.');
    }

    // Call the Rust backend command
    const response = await invoke('generate_image', {
      apiKey: apiKey,
      input: {
        prompt: formData.prompt,
        aspect_ratio: formData.aspect_ratio,
        image_prompt: formData.image_prompt || null,
        image_prompt_strength: formData.image_prompt_strength ? parseFloat(formData.image_prompt_strength) : null,
        safety_tolerance: formData.safety_tolerance ? parseInt(formData.safety_tolerance) : null,
        seed: formData.seed ? parseInt(formData.seed) : null,
        raw: formData.raw,
        output_format: formData.output_format || null
      }
    });

    return response;
  } catch (error) {
    console.error('Error generating image:', error);
    throw error;
  }
};

export const validateApiKey = async (apiKey) => {
  try {
    // Call the Rust backend command
    const isValid = await invoke('validate_api_key', { apiKey });
    return isValid;
  } catch (error) {
    console.error('Error validating API key:', error);
    return false;
  }
};