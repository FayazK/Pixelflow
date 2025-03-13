import { join } from 'path'
import { writeFileSync, mkdirSync } from 'fs'
import { app } from 'electron'
import { httpRequest, downloadImage, pollPredictionUntilComplete } from './httpHelper'

/**
 * Sends a progress update to the renderer process
 * @param {number} progress - The progress value (0-100)
 */
function updateProgress(progress) {
  if (global.progressCallback) {
    global.progressCallback(progress);
  }
}

/**
 * Sends a status update to the renderer process
 * @param {string} status - The status message
 */
function updateStatus(status) {
  if (global.statusCallback) {
    global.statusCallback(status);
  }
}

/**
 * Handles image generation using the Replicate API
 * @param {Object} params - The parameters for image generation
 * @param {string} apiKey - The Replicate API key
 * @returns {Promise<Object>} - The results including image paths and timestamps
 */
export async function generateImage(params, apiKey) {
  try {
    // Extract model-specific info
    const { modelId, endpoint, version, ...modelParams } = params;
    
    // Create the HTTPS request options for Replicate API
    const apiEndpoint = endpoint || `https://api.replicate.com/v1/models/${modelId}/predictions`;
    const headers = {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json'
    };

    // Create a timestamped directory
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const generationPath = join(app.getPath('userData'), 'generation', timestamp);
    mkdirSync(generationPath, { recursive: true });
    
    updateStatus(`Preparing request for model: ${modelId}`);
    updateProgress(15);

    // Create request payload based on model type
    let requestData;
    
    // Handle NVIDIA Sana model which has a different payload structure
    if (modelId === 'nvidia/sana') {
      requestData = {
        version: version,
        input: modelParams
      };
    } 
    // For Flux 1.1 Pro Ultra model - needs minimal parameters
    else if (modelId === 'black-forest-labs/flux-1.1-pro-ultra') {
      // Make sure we only include valid parameters for this model
      const validParams = {
        prompt: modelParams.prompt,
        aspect_ratio: modelParams.aspect_ratio
      };
      
      // Only include these if they have valid values
      if (modelParams.safety_tolerance) validParams.safety_tolerance = modelParams.safety_tolerance;
      if (modelParams.seed && modelParams.seed !== '') validParams.seed = parseInt(modelParams.seed);
      if (modelParams.raw !== undefined) validParams.raw = modelParams.raw;
      if (modelParams.output_format) validParams.output_format = modelParams.output_format;
      
      requestData = { input: validParams };
    }
    // For Flux Dev model
    else if (modelId === 'black-forest-labs/flux-dev') {
      // Make sure we only include valid parameters for this model
      const validParams = {
        prompt: modelParams.prompt
      };
      
      // Only include these if they have valid values
      if (modelParams.aspect_ratio) validParams.aspect_ratio = modelParams.aspect_ratio;
      if (modelParams.guidance !== undefined) validParams.guidance = parseFloat(modelParams.guidance);
      if (modelParams.num_inference_steps) validParams.num_inference_steps = parseInt(modelParams.num_inference_steps);
      if (modelParams.seed && modelParams.seed !== '') validParams.seed = parseInt(modelParams.seed);
      if (modelParams.output_format) validParams.output_format = modelParams.output_format;
      
      requestData = { input: validParams };
    }
    // All other models get standard treatment
    else {
      // Clean the parameters (convert empty strings to undefined, etc.)
      const cleanParams = {};
      
      // Only include non-empty values and convert types appropriately
      for (const [key, value] of Object.entries(modelParams)) {
        if (value !== '') {
          // Convert strings to numbers when appropriate
          if (key === 'seed' && value !== '') {
            cleanParams[key] = parseInt(value);
          } 
          else if (typeof value === 'string' && !isNaN(value) && 
                  !['prompt', 'negative_prompt'].includes(key)) {
            cleanParams[key] = parseFloat(value);
          } 
          else {
            cleanParams[key] = value;
          }
        }
      }
      
      requestData = { input: cleanParams };
    }

    console.log('API Endpoint:', apiEndpoint);
    console.log('Request Data:', JSON.stringify(requestData, null, 2));
    
    updateStatus('Sending request to Replicate API...');
    updateProgress(20);

    // Start the prediction
    let prediction = await httpRequest(apiEndpoint, 'POST', headers, requestData);
    console.log('Initial API Response:', JSON.stringify(prediction, null, 2));
    
    updateStatus(`Request initiated (ID: ${prediction.id}), waiting for processing...`);
    updateProgress(30);

    // If the prediction is not complete, poll for the result
    if (prediction.status !== 'succeeded') {
      prediction = await pollPredictionUntilComplete(
        prediction.urls.get, 
        headers, 
        updateStatus,
        updateProgress
      );
    }

    updateStatus('Processing complete, downloading results...');
    updateProgress(80);

    // Once prediction is complete, check for output
    const output = prediction.output;

    if (!output) {
      throw new Error(`No output received from the API. Status: ${prediction.status}, Error: ${prediction.error || 'None'}`);
    }

    // Convert output to proper format if needed
    const outputArray = Array.isArray(output) ? output : [output];

    // Save the API response as JSON
    const responsePath = join(generationPath, 'response.json');
    writeFileSync(responsePath, JSON.stringify({
      modelId,
      params: modelParams,
      response: prediction
    }, null, 2));

    // Save the model parameters used
    const paramsPath = join(generationPath, 'params.json');
    writeFileSync(paramsPath, JSON.stringify(modelParams, null, 2));

    // Determine output format from parameters or default to webp
    const outputFormat = modelParams.output_format || 'webp';
    
    updateStatus('Downloading generated images...');
    updateProgress(85);

    // Download images
    const imagePaths = [];
    for (let i = 0; i < outputArray.length; i++) {
      updateStatus(`Downloading image ${i + 1} of ${outputArray.length}...`);
      const imageUrl = outputArray[i];
      const imagePath = join(generationPath, `image-${i}.${outputFormat}`);
      await downloadImage(imageUrl, imagePath, writeFileSync);
      imagePaths.push(imagePath);
    }
    
    updateStatus('All images downloaded successfully!');
    updateProgress(95);

    // Return results
    return {
      timestamp,
      directory: generationPath,
      imagePaths,
      response: outputArray
    };
  } catch (error) {
    console.error('Image generation failed:', error);
    updateStatus(`Error: ${error.message}`);
    throw error;
  }
}
