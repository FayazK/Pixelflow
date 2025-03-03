import axios from 'axios';

// This should be set in your environment variables or in a secure storage
// For development, you can set it here, but make sure not to commit this to version control
const REPLICATE_API_TOKEN = '';

export const generateImage = async (formData) => {
  try {
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
          'Authorization': `Bearer ${REPLICATE_API_TOKEN}`,
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
