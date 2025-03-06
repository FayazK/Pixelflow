import { join } from 'path'
import { writeFileSync, mkdirSync } from 'fs'
import { app } from 'electron'
import https from 'https'
import path from 'path'

// Create a custom HTTPS agent with proper SSL options
const httpsAgent = new https.Agent({
  keepAlive: true
})

/**
 * Handles image generation using the Replicate API
 * @param {Object} params - The parameters for image generation
 * @param {string} apiKey - The Replicate API key
 * @returns {Promise<Object>} - The results including image paths and timestamps
 */
export async function generateImage(params, apiKey) {
  try {
    // Create the HTTPS request options for Replicate API
    const apiEndpoint = 'https://api.replicate.com/v1/models/black-forest-labs/flux-schnell/predictions'
    const headers = {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
      'Prefer': 'wait'
    }

    // Create a timestamped directory
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-')
    const generationPath = join(app.getPath('userData'), 'generation', timestamp)
    mkdirSync(generationPath, { recursive: true })

    // Create request to start the prediction
    const requestData = {
      input: params
    }

    // Start the prediction with the 'wait' preference which blocks until complete
    const prediction = await httpRequest(apiEndpoint, 'POST', headers, requestData)
    
    // With 'Prefer: wait', the API waits until the prediction is done
    // and returns the result directly
    const output = prediction.output
    
    if (!output) {
      throw new Error('No output received from the API')
    }
    
    // Convert output to proper format if needed
    const outputArray = Array.isArray(output) ? output : [output]

    // Save the API response as JSON
    const responsePath = join(generationPath, 'response.json')
    writeFileSync(responsePath, JSON.stringify(outputArray, null, 2))

    // Download images
    const imagePaths = []
    for (let i = 0; i < outputArray.length; i++) {
      const imageUrl = outputArray[i]
      const imagePath = join(generationPath, `image-${i}.${params.output_format}`)
      await downloadImage(imageUrl, imagePath)
      imagePaths.push(imagePath)
    }

    // Return results
    return {
      timestamp,
      directory: generationPath,
      imagePaths,
      response: outputArray
    }
  } catch (error) {
    console.error('Image generation failed:', error)
    throw error
  }
}

/**
 * Downloads an image from a URL and saves it to disk
 * @param {string} url - The URL of the image
 * @param {string} destination - The path to save the image
 * @returns {Promise<void>}
 */
/**
 * Generic HTTP request function
 * @param {string} url - The URL to request
 * @param {string} method - The HTTP method (GET, POST, etc.)
 * @param {Object} headers - Request headers
 * @param {Object} [body] - Optional request body
 * @returns {Promise<Object>} - Parsed JSON response
 */
function httpRequest(url, method = 'GET', headers = {}, body = null) {
  return new Promise((resolve, reject) => {
    const options = {
      method,
      headers,
      agent: httpsAgent
    }

    const req = https.request(url, options, (response) => {
      const chunks = []

      response.on('data', (chunk) => {
        chunks.push(chunk)
      })

      response.on('end', () => {
        const buffer = Buffer.concat(chunks)
        const responseText = buffer.toString('utf8')

        try {
          const jsonResponse = JSON.parse(responseText)
          if (response.statusCode >= 200 && response.statusCode < 300) {
            resolve(jsonResponse)
          } else {
            reject(new Error(`API request failed: ${jsonResponse.error || response.statusCode}`))
          }
        } catch (error) {
          reject(new Error(`Failed to parse API response: ${error.message}`))
        }
      })

      response.on('error', (error) => {
        reject(error)
      })
    })

    req.on('error', (error) => {
      reject(error)
    })

    if (body) {
      req.write(JSON.stringify(body))
    }

    req.end()
  })
}

/**
 * Downloads an image from a URL and saves it to disk
 * @param {string} url - The URL of the image
 * @param {string} destination - The path to save the image
 * @returns {Promise<void>}
 */
function downloadImage(url, destination) {
  return new Promise((resolve, reject) => {
    https
      .get(url, { agent: httpsAgent }, (response) => {
        const chunks = []

        response.on('data', (chunk) => {
          chunks.push(chunk)
        })

        response.on('end', () => {
          const buffer = Buffer.concat(chunks)
          try {
            writeFileSync(destination, buffer)
            resolve()
          } catch (error) {
            reject(error)
          }
        })

        response.on('error', (error) => {
          reject(error)
        })
      })
      .on('error', (error) => {
        reject(error)
      })
  })
}
