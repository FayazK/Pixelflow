import React, { useState, useEffect } from 'react';
import { Sun, Moon, Cog, FolderOpen } from 'lucide-react';
import SettingsPage from "./components/SettingsPage.jsx";
import LayoutHeader from "./components/Layout/LayoutHeader.jsx";
import { generateImage, getGenerationsPath } from './services/api.js';
import { open } from '@tauri-apps/plugin-shell';

const ImagenV2 = () => {
  const [darkMode, setDarkMode] = useState(false);
  const [promptValue, setPromptValue] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [promptStrength, setPromptStrength] = useState(0.1);
  const [aspectRatio, setAspectRatio] = useState('1:1');
  const [safetyTolerance, setSafetyTolerance] = useState(2);
  const [seed, setSeed] = useState('');
  const [outputFormat, setOutputFormat] = useState('jpeg');
  const [generateRaw, setGenerateRaw] = useState(false);
  const [generatedImage, setGeneratedImage] = useState(null);
  const [showSettings, setShowSettings] = useState(false);
  const [isEnhancing, setIsEnhancing] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationError, setGenerationError] = useState(null);
  const [generationsPath, setGenerationsPath] = useState(null);
  const [lastGenerationPath, setLastGenerationPath] = useState(null);

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  useEffect(() => {
    // Fetch the generations path when the component mounts
    const fetchGenerationsPath = async () => {
      try {
        const path = await getGenerationsPath();
        setGenerationsPath(path);
      } catch (error) {
        console.error('Failed to get generations path:', error);
      }
    };

    fetchGenerationsPath();
  }, []);

  const handleGenerate = async () => {
    // Reset states
    setGenerationError(null);
    setIsGenerating(true);
    setLastGenerationPath(null);

    try {
      // Validate that we have a prompt
      if (!promptValue.trim()) {
        throw new Error('Please enter a prompt before generating an image.');
      }

      // Call the API to generate the image
      const response = await generateImage({
        prompt: promptValue,
        aspect_ratio: aspectRatio,
        output_format: outputFormat,
        safety_tolerance: safetyTolerance,
        seed: seed || undefined,  // Only pass seed if it's not empty
        raw: generateRaw
      });

      // Set the generated image URL
      if (response.output && response.output.length > 0) {
        setGeneratedImage(response.output[0]);

        // Set the last generation path based on the timestamp
        const now = new Date();
        const timestamp = now.toISOString().replace(/[:T.]/g, '').slice(0, 14);
        
        // For simplicity, we're using a format similar to what the Rust code uses
        // This is an approximation and may not exactly match the Rust-generated path
        const folderName = `${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, '0')}${String(now.getDate()).padStart(2, '0')}_${String(now.getHours()).padStart(2, '0')}${String(now.getMinutes()).padStart(2, '0')}${String(now.getSeconds()).padStart(2, '0')}`;
        if (generationsPath) {
          setLastGenerationPath(`${generationsPath}/${folderName}`);
        }
      } else {
        throw new Error('No image was generated. Please try again.');
      }
    } catch (error) {
      console.error('Error generating image:', error);
      setGenerationError(error.message || 'Failed to generate image. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  const enhancePrompt = async (prompt) => {
    setIsEnhancing(true);
    try {
      const response = await window.tauri.invoke('enhance_prompt', { prompt });
      setPromptValue(response);
    } catch (error) {
      console.error('Error enhancing prompt:', error);
    } finally {
      setIsEnhancing(false);
    }
  };

  return (
      <div className={`min-h-screen ${darkMode ? 'bg-gray-900 text-gray-100' : 'bg-gray-50 text-gray-800'} transition-colors duration-200`}>
        <LayoutHeader setShowSettings={setShowSettings} toggleDarkMode={toggleDarkMode} darkMode={darkMode}/>

        <main className="max-w-6xl mx-auto py-8 px-4">
          <div className="flex flex-col gap-8">
            {/* Form Controls */}
            <div className={`p-6 rounded-xl shadow-lg ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
              <h2 className="text-xl font-semibold mb-6 pb-2 border-b border-gray-300 dark:border-gray-700">Image Generation</h2>

              {/* Text Prompt */}
              <div className="mb-6">
                <label className="block text-sm font-medium mb-2">Prompt <span className="text-indigo-500">*</span></label>
                <button
                    onClick={() => enhancePrompt(promptValue)}
                    disabled={isEnhancing || !promptValue}
                    className="enhance-button mb-2"
                >
                  {isEnhancing ? 'Enhancing...' : 'Enhance with Gemini'}
                </button>
                <textarea
                    className={`w-full p-3 rounded-lg border ${darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-gray-50 border-gray-300'} focus:ring-2 focus:ring-indigo-500 focus:border-transparent`}
                    placeholder="Enter your prompt here..."
                    value={promptValue}
                    onChange={(e) => setPromptValue(e.target.value)}
                    rows={5}
                />
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Text prompt for image generation</p>
              </div>

              {/* Image Prompt */}
              {/*<div className="mb-6">
                <label className="block text-sm font-medium mb-2">Image Prompt</label>
                <input
                    type="text"
                    className={`w-full p-3 rounded-lg border ${darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-gray-50 border-gray-300'} focus:ring-2 focus:ring-indigo-500 focus:border-transparent`}
                    placeholder="Image URL"
                    value={imageUrl}
                    onChange={(e) => setImageUrl(e.target.value)}
                />
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Image to use with Flux Redux</p>
              </div>*/}

              {/* Image Prompt Strength */}
              {/*<div className="mb-6">
                <div className="flex justify-between items-center mb-2">
                  <label className="text-sm font-medium">Image Prompt Strength: {promptStrength}</label>
                </div>
                <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.01"
                    className="w-full h-2 bg-gray-300 dark:bg-gray-600 rounded-lg appearance-none cursor-pointer accent-indigo-600"
                    value={promptStrength}
                    onChange={(e) => setPromptStrength(parseFloat(e.target.value))}
                />
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Blend between the prompt and the image prompt</p>
              </div>*/}

              {/* Inline Form Fields */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                {/* Aspect Ratio */}
                <div>
                  <label className="block text-sm font-medium mb-2">Aspect Ratio</label>
                  <select
                      className={`w-full p-3 rounded-lg border ${darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-gray-50 border-gray-300'} focus:ring-2 focus:ring-indigo-500 focus:border-transparent`}
                      value={aspectRatio}
                      onChange={(e) => setAspectRatio(e.target.value)}
                  >
                    <option value="1:1">1:1 (Square)</option>
                    <option value="16:9">16:9 (Landscape)</option>
                    <option value="21:9">21:9 (Ultrawide)</option>
                    <option value="3:2">3:2 (Classic)</option>
                    <option value="2:3">2:3 (Portrait)</option>
                    <option value="4:5">4:5 (Portrait)</option>
                    <option value="5:4">5:4 (Landscape)</option>
                    <option value="3:4">3:4 (Portrait)</option>
                    <option value="4:3">4:3 (Standard)</option>
                    <option value="9:16">9:16 (Portrait)</option>
                    <option value="9:21">9:21 (Vertical Ultrawide)</option>
                  </select>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Aspect ratio for the generated image</p>
                </div>

                {/* Seed */}
                <div>
                  <label className="block text-sm font-medium mb-2">Seed</label>
                  <input
                      type="text"
                      className={`w-full p-3 rounded-lg border ${darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-gray-50 border-gray-300'} focus:ring-2 focus:ring-indigo-500 focus:border-transparent`}
                      placeholder="Random seed (leave empty)"
                      value={seed}
                      onChange={(e) => {
                        // Only allow unsigned numbers
                        const value = e.target.value;
                        if (value === '' || /^\d+$/.test(value)) {
                          setSeed(value);
                        }
                      }}
                  />
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Numeric seed for reproducible generation</p>
                </div>

                {/* Output Format */}
                <div>
                  <label className="block text-sm font-medium mb-2">Output Format</label>
                  <select
                      className={`w-full p-3 rounded-lg border ${darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-gray-50 border-gray-300'} focus:ring-2 focus:ring-indigo-500 focus:border-transparent`}
                      value={outputFormat}
                      onChange={(e) => setOutputFormat(e.target.value)}
                  >
                    <option value="jpeg">JPEG</option>
                    <option value="png">PNG</option>
                  </select>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Format of the output images</p>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                {/* Safety Tolerance */}
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <label className="text-sm font-medium">Safety Tolerance: {safetyTolerance}</label>
                  </div>
                  <input
                      type="range"
                      min="1"
                      max="6"
                      step="1"
                      className="w-full h-2 bg-gray-300 dark:bg-gray-600 rounded-lg appearance-none cursor-pointer accent-indigo-600"
                      value={safetyTolerance}
                      onChange={(e) => setSafetyTolerance(parseInt(e.target.value))}
                  />
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Safety tolerance, 1 is most strict and 6 is most permissive</p>
                </div>

                {/* Generate Raw Image */}
                <div className="flex items-center justify-start mt-8">
                  <input
                      id="generate-raw"
                      type="checkbox"
                      className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                      checked={generateRaw}
                      onChange={() => setGenerateRaw(!generateRaw)}
                  />
                  <label htmlFor="generate-raw" className="ml-2 block text-sm">
                    Generate Raw Image
                  </label>
                  <p className="text-xs text-gray-500 dark:text-gray-400 ml-2">Less processed, more natural-looking images</p>
                </div>
              </div>

              {/* Generate Button */}
              <button
                  onClick={handleGenerate}
                  className="w-full py-3 px-4 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-lg shadow transition-colors duration-200 disabled:bg-indigo-400 disabled:cursor-not-allowed"
                  disabled={isGenerating}
              >
                {isGenerating ? 'Generating...' : 'Generate Image'}
              </button>
              
              {generationError && (
                <div className="mt-4 p-3 bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-200 rounded-lg">
                  {generationError}
                </div>
              )}
            </div>

            {/* Image Preview */}
            <div className={`p-6 rounded-xl shadow-lg ${darkMode ? 'bg-gray-800' : 'bg-white'} flex flex-col`}>
              <h2 className="text-xl font-semibold mb-6 pb-2 border-b border-gray-300 dark:border-gray-700">Generated Image</h2>

              <div className="flex-grow flex flex-col items-center justify-center h-96">
                {generatedImage ? (
                    <>
                      <img
                          src={generatedImage}
                          alt="Generated output"
                          className="max-w-full max-h-full rounded-lg shadow-md object-contain mb-4"
                      />
                      {lastGenerationPath && (
                        <button 
                          onClick={() => open(`file://${lastGenerationPath}`)}
                          className="flex items-center px-4 py-2 mt-2 bg-green-600 hover:bg-green-700 text-white font-medium rounded-lg shadow transition-colors duration-200">
                          <FolderOpen className="mr-2" size={16} />
                          Open Saved Files
                        </button>
                      )}
                    </>
                ) : (
                    <div className={`w-full h-full rounded-lg border-2 border-dashed ${darkMode ? 'border-gray-700' : 'border-gray-300'} flex items-center justify-center`}>
                      <p className="text-gray-500 dark:text-gray-400">Generated image will appear here</p>
                    </div>
                )}
              </div>
            </div>
          </div>
        </main>

        <footer className={`mt-8 py-4 px-6 ${darkMode ? 'bg-gray-800' : 'bg-gray-100'}`}>
          <div className="max-w-6xl mx-auto text-center text-sm text-gray-500 dark:text-gray-400">
            <p>Imagen v2 • AI Image Generation Tool</p>
          </div>
        </footer>
        {showSettings && <SettingsPage onClose={() => setShowSettings(false)} darkMode={darkMode} />}
      </div>
  );
};

export default ImagenV2;