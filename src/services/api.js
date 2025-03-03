import axios from 'axios';
import { getApiKey } from '../utils/store';

export const generateImage = async (formData) => {
  try {
    // Get API key from store
    const apiKey = await getApiKey();
    
    if (!apiKey) {
      throw new Error('API key not configured. Please add your API key in Settings.');
    }
    
    const requestData = {
      input: {
        prompt: formData.prompt,
        aspect_ratio: formData.aspect_ratio,
      },
    };
    
    // Only add optional parameters if they have values
    if (formData.image_prompt) requestData.input.image_prompt = formData.image_prompt;
    if (formData.image_prompt_strength) requestData.input.image_prompt_strength = parseFloat(formData.image_prompt_strength);
    if (formData.safety_tolerance) requestData.input.safety_tolerance = parseInt(formData.safety_tolerance);
    if (formData.seed) requestData.input.seed = parseInt(formData.seed);
    if (formData.raw !== undefined) requestData.input.raw = formData.raw;
    if (formData.output_format) requestData.input.output_format = formData.output_format;
    
    const response = await axios.post(
      'https://api.replicate.com/v1/models/black-forest-labs/flux-1.1-pro-ultra/predictions',
      requestData,
      {
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
          'Prefer': 'wait'
        }
      }
    );
    
    return response.data;
  } catch (error) {
    console.error('Error generating image:', error);
    throw error;
  }
};

export const validateApiKey = async (apiKey) => {
  try {
    const response = await axios.get('https://api.replicate.com/v1/models', {
      headers: {
        'Authorization': `Bearer ${apiKey}`
      }
    });
    
    return response.status === 200;
  } catch (error) {
    return false;
  }
};
