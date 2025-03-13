import https from 'https';

// Create a custom HTTPS agent with proper SSL options
const httpsAgent = new https.Agent({
  keepAlive: true
});

/**
 * Enhanced HTTP request function with better error handling
 * @param {string} url - The URL to request
 * @param {string} method - The HTTP method (GET, POST, etc.)
 * @param {Object} headers - Request headers
 * @param {Object} [body] - Optional request body
 * @returns {Promise<Object>} - Parsed JSON response
 */
export function httpRequest(url, method = 'GET', headers = {}, body = null) {
  return new Promise((resolve, reject) => {
    const options = {
      method,
      headers,
      agent: httpsAgent
    };

    console.log(`Making ${method} request to: ${url}`);
    if (body) {
      console.log('Request body:', JSON.stringify(body, null, 2));
    }

    const req = https.request(url, options, (response) => {
      const chunks = [];

      response.on('data', (chunk) => {
        chunks.push(chunk);
      });

      response.on('end', () => {
        const buffer = Buffer.concat(chunks);
        const responseText = buffer.toString('utf8');

        console.log(`Response status: ${response.statusCode}`);
        
        try {
          const jsonResponse = JSON.parse(responseText);
          
          if (response.statusCode === 422) {
            console.error('422 Error Details:', responseText);
            const errorDetails = jsonResponse.detail || jsonResponse.error || 'Invalid parameters';
            reject(new Error(`API request failed (422 Unprocessable Entity): ${errorDetails}`));
          }
          else if (response.statusCode >= 200 && response.statusCode < 300) {
            resolve(jsonResponse);
          } else {
            console.error(`Error response (${response.statusCode}):`, responseText);
            reject(new Error(`API request failed: ${response.statusCode} - ${jsonResponse.error || 'Unknown error'}`));
          }
        } catch (error) {
          console.error('Failed to parse response as JSON:', responseText);
          reject(new Error(`Failed to parse API response: ${error.message}`));
        }
      });

      response.on('error', (error) => {
        console.error('Response error:', error);
        reject(error);
      });
    });

    req.on('error', (error) => {
      console.error('Request error:', error);
      reject(error);
    });

    if (body) {
      req.write(JSON.stringify(body));
    }

    req.end();
  });
}

/**
 * Downloads an image from a URL and saves it to disk
 * @param {string} url - The URL of the image
 * @param {string} destination - The path to save the image
 * @param {Function} writeFileSync - Function to write file
 * @returns {Promise<void>}
 */
export function downloadImage(url, destination, writeFileSync) {
  return new Promise((resolve, reject) => {
    console.log(`Downloading image from ${url} to ${destination}`);
    
    https
      .get(url, { agent: httpsAgent }, (response) => {
        const chunks = [];

        response.on('data', (chunk) => {
          chunks.push(chunk);
        });

        response.on('end', () => {
          const buffer = Buffer.concat(chunks);
          try {
            writeFileSync(destination, buffer);
            console.log(`Successfully saved image to ${destination}`);
            resolve();
          } catch (error) {
            console.error('Error saving image:', error);
            reject(error);
          }
        });

        response.on('error', (error) => {
          console.error('Image download error:', error);
          reject(error);
        });
      })
      .on('error', (error) => {
        console.error('Image request error:', error);
        reject(error);
      });
  });
}

/**
 * Polls a prediction URL until the prediction is complete
 * @param {string} url - The URL to poll
 * @param {Object} headers - The request headers
 * @param {Function} updateStatus - Function to update status message
 * @param {Function} updateProgress - Function to update progress
 * @returns {Promise<Object>} - The completed prediction
 */
export async function pollPredictionUntilComplete(url, headers, updateStatus, updateProgress) {
  const maxAttempts = 60;  // Maximum number of polling attempts
  const pollingInterval = 2000;  // Polling interval in milliseconds (2 seconds)
  
  let attempts = 0;
  
  while (attempts < maxAttempts) {
    attempts++;
    
    try {
      // Get the prediction status
      const prediction = await httpRequest(url, 'GET', headers);
      const status = prediction.status;
      console.log(`Polling attempt ${attempts}, status: ${status}`);
      
      // Update the UI with the current status
      if (updateStatus) {
        updateStatus(`Generation in progress: ${status} (attempt ${attempts}/${maxAttempts})`);
      }
      
      // Calculate progress based on polling progress (from 30% to 80%)
      if (updateProgress) {
        const progressIncrement = 50 / maxAttempts; // 50% range divided by max attempts
        const currentProgress = 30 + (attempts * progressIncrement);
        updateProgress(Math.min(80, currentProgress));
      }
      
      // If the prediction has completed or failed, return it
      if (status === 'succeeded' || status === 'failed' || status === 'canceled') {
        if (status === 'failed') {
          if (updateStatus) {
            updateStatus(`Generation failed: ${prediction.error || 'Unknown error'}`);
          }
          throw new Error(`Generation failed: ${prediction.error || 'Unknown error'}`);
        } else if (status === 'canceled') {
          if (updateStatus) {
            updateStatus('Generation was canceled');
          }
          throw new Error('Generation was canceled');
        }
        
        return prediction;
      }
    } catch (error) {
      console.error(`Error during polling attempt ${attempts}:`, error);
      // If there's an error during polling, we'll try again
      if (attempts >= maxAttempts) {
        throw error; // Only throw if we've reached max attempts
      }
    }
    
    // Wait before polling again
    await new Promise(resolve => setTimeout(resolve, pollingInterval));
  }
  
  if (updateStatus) {
    updateStatus('Generation timed out - the process took too long');
  }
  throw new Error('Prediction timed out after maximum polling attempts');
}
