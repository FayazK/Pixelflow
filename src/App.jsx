import React, { useState } from 'react';
import { Sun, Moon, Cog } from 'lucide-react';
import SettingsPage from "./components/SettingsPage.jsx";

const ImagenV2 = () => {
  const [darkMode, setDarkMode] = useState(false);
  const [promptValue, setPromptValue] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [promptStrength, setPromptStrength] = useState(0.1);
  const [aspectRatio, setAspectRatio] = useState('1:1');
  const [safetyTolerance, setSafetyTolerance] = useState(2);
  const [seed, setSeed] = useState('Random seed');
  const [outputFormat, setOutputFormat] = useState('jpeg');
  const [generateRaw, setGenerateRaw] = useState(false);
  const [generatedImage, setGeneratedImage] = useState(null);
  const [showSettings, setShowSettings] = useState(false);

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  const handleGenerate = () => {
    // Simulation of generation
    setGeneratedImage('/api/placeholder/512/512');
  };

  return (
      <div className={`min-h-screen ${darkMode ? 'bg-gray-900 text-gray-100' : 'bg-gray-50 text-gray-800'} transition-colors duration-200`}>
        <header className={`py-4 px-6 ${darkMode ? 'bg-gray-800' : 'bg-indigo-600 text-white'} shadow-md`}>
          <div className="flex justify-between items-center max-w-6xl mx-auto">
            <h1 className="text-2xl font-bold">Imagen v2</h1>
            <div className="flex gap-2">
              <button
                  onClick={()=>setShowSettings(true)}
                  className={`p-2 rounded-full ${darkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-indigo-500 hover:bg-indigo-400'}`}
              ><Cog size={20} />
              </button>
              <button
                  onClick={toggleDarkMode}
                  className={`p-2 rounded-full ${darkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-indigo-500 hover:bg-indigo-400'}`}
              >
                {darkMode ? <Sun size={20} /> : <Moon size={20} />}
              </button>
            </div>
          </div>
        </header>

        <main className="max-w-6xl mx-auto py-8 px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Left Column - Controls */}
            <div className={`p-6 rounded-xl shadow-lg ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
              <h2 className="text-xl font-semibold mb-6 pb-2 border-b border-gray-300 dark:border-gray-700">Image Generation</h2>

              {/* Text Prompt */}
              <div className="mb-6">
                <label className="block text-sm font-medium mb-2">Prompt <span className="text-indigo-500">*</span></label>
                <textarea
                    className={`w-full h-24 p-3 rounded-lg border ${darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-gray-50 border-gray-300'} focus:ring-2 focus:ring-indigo-500 focus:border-transparent`}
                    placeholder="Enter your prompt here..."
                    value={promptValue}
                    onChange={(e) => setPromptValue(e.target.value)}
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

              {/* Aspect Ratio */}
              <div className="mb-6">
                <label className="block text-sm font-medium mb-2">Aspect Ratio</label>
                <select
                    className={`w-full p-3 rounded-lg border ${darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-gray-50 border-gray-300'} focus:ring-2 focus:ring-indigo-500 focus:border-transparent`}
                    value={aspectRatio}
                    onChange={(e) => setAspectRatio(e.target.value)}
                >
                  <option value="1:1">1:1 (Square)</option>
                  <option value="16:9">16:9 (Landscape)</option>
                  <option value="9:16">9:16 (Portrait)</option>
                  <option value="4:3">4:3 (Standard)</option>
                  <option value="3:2">3:2 (Classic)</option>
                </select>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Aspect ratio for the generated image</p>
              </div>

              {/* Safety Tolerance */}
              <div className="mb-6">
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

              {/* Seed */}
              <div className="mb-6">
                <label className="block text-sm font-medium mb-2">Seed</label>
                <select
                    className={`w-full p-3 rounded-lg border ${darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-gray-50 border-gray-300'} focus:ring-2 focus:ring-indigo-500 focus:border-transparent`}
                    value={seed}
                    onChange={(e) => setSeed(e.target.value)}
                >
                  <option value="Random seed">Random seed</option>
                  <option value="Fixed seed">Fixed seed</option>
                </select>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Random seed. Set for reproducible generation</p>
              </div>

              {/* Output Format */}
              <div className="mb-6">
                <label className="block text-sm font-medium mb-2">Output Format</label>
                <select
                    className={`w-full p-3 rounded-lg border ${darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-gray-50 border-gray-300'} focus:ring-2 focus:ring-indigo-500 focus:border-transparent`}
                    value={outputFormat}
                    onChange={(e) => setOutputFormat(e.target.value)}
                >
                  <option value="jpeg">JPEG</option>
                  <option value="png">PNG</option>
                  <option value="webp">WEBP</option>
                </select>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Format of the output images</p>
              </div>

              {/* Generate Raw Image */}
              <div className="mb-6">
                <div className="flex items-center">
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
                </div>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 ml-6">Generate less processed, more natural-looking images</p>
              </div>

              {/* Generate Button */}
              <button
                  onClick={handleGenerate}
                  className="w-full py-3 px-4 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-lg shadow transition-colors duration-200"
              >
                Generate Image
              </button>
            </div>

            {/* Right Column - Preview */}
            <div className={`p-6 rounded-xl shadow-lg ${darkMode ? 'bg-gray-800' : 'bg-white'} flex flex-col`}>
              <h2 className="text-xl font-semibold mb-6 pb-2 border-b border-gray-300 dark:border-gray-700">Generated Image</h2>

              <div className="flex-grow flex items-center justify-center">
                {generatedImage ? (
                    <img
                        src={generatedImage}
                        alt="Generated output"
                        className="max-w-full max-h-full rounded-lg shadow-md"
                    />
                ) : (
                    <div className={`w-full h-64 rounded-lg border-2 border-dashed ${darkMode ? 'border-gray-700' : 'border-gray-300'} flex items-center justify-center`}>
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