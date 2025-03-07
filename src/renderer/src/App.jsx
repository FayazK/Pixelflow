import { useState } from 'react'
import { Sun, Moon, Image, Sliders, Send, Settings as SettingsIcon, Folder } from 'lucide-react'
import Settings from './components/Settings'
import ProgressBar from './components/ProgressBar'
import ImageDisplay from './components/ImageDisplay'
import Tooltip from './components/Tooltip'

function App() {
  const [darkMode, setDarkMode] = useState(true)
  const [formData, setFormData] = useState({
    prompt: '',
    aspect_ratio: '1:1',
    num_outputs: 1,
    num_inference_steps: 4,
    seed: '',
    output_format: 'webp',
    output_quality: 80,
    disable_safety_checker: false,
    go_fast: true,
    megapixels: '1'
  })

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    try {
      // Reset states
      setError(null)
      setIsGenerating(true)
      setProgress(10) // Start with some progress to show activity

      // Make sure seed is a number or undefined
      const params = { ...formData }
      if (params.seed === '') {
        // Let the backend handle random seed generation
        delete params.seed
      } else {
        params.seed = parseInt(params.seed, 10)
      }

      // Convert string values to numbers where needed
      params.num_outputs = parseInt(params.num_outputs, 10)
      params.num_inference_steps = parseInt(params.num_inference_steps, 10)
      params.output_quality = parseInt(params.output_quality, 10)

      console.log('Generating image with params:', params)

      // Start generation with progress simulation
      const progressInterval = setInterval(() => {
        setProgress((prev) => {
          const newProgress = prev + Math.random() * 5
          return newProgress < 90 ? newProgress : 90 // Cap at 90% until actual completion
        })
      }, 500)

      // Call the API
      const result = await window.api.generation.generateImage(params)

      // Clear interval and set full progress
      clearInterval(progressInterval)
      setProgress(100)

      console.log('Generation result:', result)
      setGenerationResult(result)

      // After a short delay, hide the progress bar
      setTimeout(() => {
        setIsGenerating(false)
        setProgress(0)
      }, 1000)
    } catch (err) {
      console.error('Generation failed:', err)
      setError(err.message || 'Image generation failed')
      setIsGenerating(false)
      setProgress(0)
    }
  }

  const openGenerationFolder = async () => {
    try {
      await window.api.generation.openGenerationFolder()
    } catch (err) {
      console.error('Failed to open generation folder:', err)
      setError('Failed to open generation folder')
    }
  }

  const [showSettings, setShowSettings] = useState(false)
  const [isGenerating, setIsGenerating] = useState(false)
  const [progress, setProgress] = useState(0)
  const [error, setError] = useState(null)
  const [generationResult, setGenerationResult] = useState(null)

  return (
    <div
      className={`flex h-screen w-full ${darkMode ? 'bg-gray-900 text-gray-100' : 'bg-gray-50 text-gray-800'}`}
    >
      {/* Sidebar - 30% width */}
      <div
        className={`w-3/10 flex flex-col border-r ${darkMode ? 'border-gray-700 bg-gray-800' : 'border-gray-200 bg-white'}`}
      >
        {/* Header with logo and theme toggle */}
        <div className="flex items-center justify-between p-4 border-b border-opacity-50 h-16">
          <div className="flex items-center space-x-2">
            <Image className="w-6 h-6" />
            <h1 className="text-xl font-bold">PixelFlow</h1>
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setShowSettings(true)}
              className={`p-2 rounded-full ${darkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-200 hover:bg-gray-300'}`}
              title="Settings"
            >
              <SettingsIcon size={18} />
            </button>
            <button
              onClick={() => setDarkMode(!darkMode)}
              className={`p-2 rounded-full ${darkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-200 hover:bg-gray-300'}`}
              title={darkMode ? 'Light Mode' : 'Dark Mode'}
            >
              {darkMode ? <Sun size={18} /> : <Moon size={18} />}
            </button>
          </div>
        </div>

        {/* Form container */}
        <div className="flex-grow overflow-auto p-4">
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Prompt */}
            <div className="space-y-1">
              <div className="flex items-center">
                <label htmlFor="prompt" className="block text-sm font-medium">
                  Prompt *
                </label>
                <Tooltip darkMode={darkMode} text="Prompt for generated image" />
              </div>
              <textarea
                id="prompt"
                name="prompt"
                value={formData.prompt}
                onChange={handleChange}
                required
                rows="3"
                placeholder="Describe the image you want to generate..."
                className={`w-full p-2 rounded-lg border text-sm resize-none ${darkMode ? 'bg-gray-700 border-gray-600 focus:border-blue-500' : 'bg-white border-gray-300 focus:border-blue-500'} focus:ring-2 focus:ring-blue-500 focus:outline-none`}
              />
            </div>

            {/* Aspect Ratio */}
            <div className="space-y-1">
              <div className="flex items-center">
                <label htmlFor="aspect_ratio" className="block text-sm font-medium">
                  Aspect Ratio
                </label>
                <Tooltip darkMode={darkMode} text="Aspect ratio for the generated image" />
              </div>
              <select
                id="aspect_ratio"
                name="aspect_ratio"
                value={formData.aspect_ratio}
                onChange={handleChange}
                className={`w-full p-2 text-sm rounded-lg border ${darkMode ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-300'} focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:outline-none`}
              >
                {[
                  '1:1',
                  '16:9',
                  '21:9',
                  '3:2',
                  '2:3',
                  '4:5',
                  '5:4',
                  '3:4',
                  '4:3',
                  '9:16',
                  '9:21'
                ].map((ratio) => (
                  <option key={ratio} value={ratio}>
                    {ratio}
                  </option>
                ))}
              </select>
            </div>

            {/* Number of Outputs */}
            <div className="space-y-1">
              <div className="flex items-center">
                <label htmlFor="num_outputs" className="block text-sm font-medium">
                  Number of Outputs
                </label>
                <Tooltip darkMode={darkMode} text="Number of outputs to generate (1-4)" />
              </div>
              <input
                type="number"
                id="num_outputs"
                name="num_outputs"
                value={formData.num_outputs}
                onChange={handleChange}
                min="1"
                max="4"
                className={`w-full p-2 text-sm rounded-lg border ${darkMode ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-300'} focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:outline-none`}
              />
            </div>

            {/* Number of Inference Steps */}
            <div className="space-y-1">
              <div className="flex items-center">
                <label htmlFor="num_inference_steps" className="block text-sm font-medium">
                  Inference Steps
                </label>
                <Tooltip darkMode={darkMode} text="Number of denoising steps (1-4)" />
              </div>
              <input
                type="number"
                id="num_inference_steps"
                name="num_inference_steps"
                value={formData.num_inference_steps}
                onChange={handleChange}
                min="1"
                max="4"
                className={`w-full p-2 text-sm rounded-lg border ${darkMode ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-300'} focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:outline-none`}
              />
            </div>

            {/* Seed */}
            <div className="space-y-1">
              <div className="flex items-center">
                <label htmlFor="seed" className="block text-sm font-medium">
                  Seed
                </label>
                <Tooltip darkMode={darkMode} text="Random seed for reproducible generation" />
              </div>
              <input
                type="number"
                id="seed"
                name="seed"
                value={formData.seed}
                onChange={handleChange}
                className={`w-full p-2 text-sm rounded-lg border ${darkMode ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-300'} focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:outline-none`}
                placeholder="Random if empty"
              />
            </div>

            {/* Output Format */}
            <div className="space-y-1">
              <div className="flex items-center">
                <label htmlFor="output_format" className="block text-sm font-medium">
                  Output Format
                </label>
                <Tooltip darkMode={darkMode} text="Format of the output images" />
              </div>
              <select
                id="output_format"
                name="output_format"
                value={formData.output_format}
                onChange={handleChange}
                className={`w-full p-2 text-sm rounded-lg border ${darkMode ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-300'} focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:outline-none`}
              >
                {['webp', 'jpg', 'png'].map((format) => (
                  <option key={format} value={format}>
                    {format}
                  </option>
                ))}
              </select>
            </div>

            {/* Output Quality */}
            <div className="space-y-1">
              <div className="flex items-center">
                <label htmlFor="output_quality" className="block text-sm font-medium">
                  Output Quality
                </label>
                <Tooltip darkMode={darkMode} text="Quality of output images (0-100)" />
              </div>
              <div className="flex items-center space-x-2">
                <input
                  type="range"
                  id="output_quality"
                  name="output_quality"
                  value={formData.output_quality}
                  onChange={handleChange}
                  min="0"
                  max="100"
                  className="flex-grow h-2 rounded-lg appearance-none cursor-pointer"
                />
                <span className="w-8 text-center text-sm">{formData.output_quality}</span>
              </div>
            </div>

            {/* Megapixels */}
            <div className="space-y-1">
              <div className="flex items-center">
                <label htmlFor="megapixels" className="block text-sm font-medium">
                  Megapixels
                </label>
                <Tooltip darkMode={darkMode} text="Approximate megapixels for generated image" />
              </div>
              <select
                id="megapixels"
                name="megapixels"
                value={formData.megapixels}
                onChange={handleChange}
                className={`w-full p-2 text-sm rounded-lg border ${darkMode ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-300'} focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:outline-none`}
              >
                <option value="1">1 MP</option>
                <option value="0.25">0.25 MP</option>
              </select>
            </div>

            {/* Checkboxes */}
            <div className="space-y-3">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="go_fast"
                  name="go_fast"
                  checked={formData.go_fast}
                  onChange={handleChange}
                  className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <label htmlFor="go_fast" className="ml-2 block text-sm">
                  Go Fast
                </label>
                <Tooltip darkMode={darkMode} text="Run faster predictions with optimized model" />
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="disable_safety_checker"
                  name="disable_safety_checker"
                  checked={formData.disable_safety_checker}
                  onChange={handleChange}
                  className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <label htmlFor="disable_safety_checker" className="ml-2 block text-sm">
                  Disable Safety Checker
                </label>
                <Tooltip darkMode={darkMode} text="Disable safety checker for generated images" />
              </div>
            </div>

            {/* Generate Button */}
            <div className="flex space-x-2">
              <button
                type="submit"
                disabled={isGenerating || !formData.prompt.trim()}
                className={`flex-grow flex items-center justify-center space-x-2 p-2 rounded-lg ${isGenerating || !formData.prompt.trim() ? 'bg-gray-500 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'} text-white font-medium transition-colors`}
              >
                <Send size={16} />
                <span>{isGenerating ? 'Generating...' : 'Generate'}</span>
              </button>

              <button
                type="button"
                onClick={openGenerationFolder}
                className={`p-2 rounded-lg ${darkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-200 hover:bg-gray-300'} transition-colors`}
                title="Open Generation Folder"
              >
                <Folder size={16} />
              </button>
            </div>

            {/* Error Message */}
            {error && (
              <div className="p-3 rounded-md bg-red-100 text-red-800 dark:bg-red-800 dark:text-red-100 mt-4">
                {error}
              </div>
            )}

            {/* Progress Bar */}
            {isGenerating && <ProgressBar progress={progress} isDarkMode={darkMode} />}
          </form>
        </div>
      </div>

      {/* Main Content Area - 70% width */}
      <div className="w-7/10 flex flex-col">
        {showSettings ? (
          <Settings darkMode={darkMode} onClose={() => setShowSettings(false)} />
        ) : (
          <>
            <div
              className={`h-16 border-b ${darkMode ? 'border-gray-700' : 'border-gray-200'} flex items-center justify-between px-6`}
            >
              <div className="flex items-center space-x-2">
                <Sliders size={18} />
                <h2 className="font-medium">Generated Images</h2>
              </div>

              <button
                onClick={openGenerationFolder}
                className={`flex items-center space-x-1 p-2 rounded-lg ${darkMode ? 'hover:bg-gray-800' : 'hover:bg-gray-100'} transition-colors`}
                title="Open Generation Folder"
              >
                <Folder size={16} />
                <span className="text-sm">Open Folder</span>
              </button>
            </div>
            <div
              className={`flex-grow p-6 overflow-auto ${darkMode ? 'bg-gray-900' : 'bg-gray-50'}`}
            >
              <ImageDisplay
                images={generationResult?.response}
                imagePaths={generationResult?.imagePaths}
                timestamp={generationResult?.timestamp}
                darkMode={darkMode}
              />
            </div>
          </>
        )}
      </div>
    </div>
  )
}

export default App
