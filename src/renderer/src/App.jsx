import { useState } from 'react'
import { Sun, Moon, Image, Sliders, Send, Settings as SettingsIcon } from 'lucide-react'
import Settings from './components/Settings'
import ProgressBar from './components/ProgressBar'
import ImageDisplay from './components/ImageDisplay'

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
            <div className="space-y-2">
              <label htmlFor="prompt" className="block text-sm font-medium">
                Prompt *
              </label>
              <textarea
                id="prompt"
                name="prompt"
                value={formData.prompt}
                onChange={handleChange}
                required
                rows="4"
                placeholder="Describe the image you want to generate..."
                className={`w-full p-3 rounded-lg border resize-none ${darkMode ? 'bg-gray-700 border-gray-600 focus:border-blue-500' : 'bg-white border-gray-300 focus:border-blue-500'} focus:ring-2 focus:ring-blue-500 focus:outline-none`}
              />
              <p className="text-xs text-gray-500">Prompt for generated image</p>
            </div>

            {/* Aspect Ratio */}
            <div className="space-y-2">
              <label htmlFor="aspect_ratio" className="block text-sm font-medium">
                Aspect Ratio
              </label>
              <select
                id="aspect_ratio"
                name="aspect_ratio"
                value={formData.aspect_ratio}
                onChange={handleChange}
                className={`w-full p-3 rounded-lg border ${darkMode ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-300'} focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:outline-none`}
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
              <p className="text-xs text-gray-500">Aspect ratio for the generated image</p>
            </div>

            {/* Number of Outputs */}
            <div className="space-y-2">
              <label htmlFor="num_outputs" className="block text-sm font-medium">
                Number of Outputs
              </label>
              <input
                type="number"
                id="num_outputs"
                name="num_outputs"
                value={formData.num_outputs}
                onChange={handleChange}
                min="1"
                max="4"
                className={`w-full p-3 rounded-lg border ${darkMode ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-300'} focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:outline-none`}
              />
              <p className="text-xs text-gray-500">Number of outputs to generate (1-4)</p>
            </div>

            {/* Number of Inference Steps */}
            <div className="space-y-2">
              <label htmlFor="num_inference_steps" className="block text-sm font-medium">
                Inference Steps
              </label>
              <input
                type="number"
                id="num_inference_steps"
                name="num_inference_steps"
                value={formData.num_inference_steps}
                onChange={handleChange}
                min="1"
                max="4"
                className={`w-full p-3 rounded-lg border ${darkMode ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-300'} focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:outline-none`}
              />
              <p className="text-xs text-gray-500">Number of denoising steps (1-4)</p>
            </div>

            {/* Seed */}
            <div className="space-y-2">
              <label htmlFor="seed" className="block text-sm font-medium">
                Seed
              </label>
              <input
                type="number"
                id="seed"
                name="seed"
                value={formData.seed}
                onChange={handleChange}
                className={`w-full p-3 rounded-lg border ${darkMode ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-300'} focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:outline-none`}
                placeholder="Random if empty"
              />
              <p className="text-xs text-gray-500">Random seed for reproducible generation</p>
            </div>

            {/* Output Format */}
            <div className="space-y-2">
              <label htmlFor="output_format" className="block text-sm font-medium">
                Output Format
              </label>
              <select
                id="output_format"
                name="output_format"
                value={formData.output_format}
                onChange={handleChange}
                className={`w-full p-3 rounded-lg border ${darkMode ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-300'} focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:outline-none`}
              >
                {['webp', 'jpg', 'png'].map((format) => (
                  <option key={format} value={format}>
                    {format}
                  </option>
                ))}
              </select>
              <p className="text-xs text-gray-500">Format of the output images</p>
            </div>

            {/* Output Quality */}
            <div className="space-y-2">
              <label htmlFor="output_quality" className="block text-sm font-medium">
                Output Quality
              </label>
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
                <span className="w-8 text-center">{formData.output_quality}</span>
              </div>
              <p className="text-xs text-gray-500">Quality of output images (0-100)</p>
            </div>

            {/* Megapixels */}
            <div className="space-y-2">
              <label htmlFor="megapixels" className="block text-sm font-medium">
                Megapixels
              </label>
              <select
                id="megapixels"
                name="megapixels"
                value={formData.megapixels}
                onChange={handleChange}
                className={`w-full p-3 rounded-lg border ${darkMode ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-300'} focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:outline-none`}
              >
                <option value="1">1 MP</option>
                <option value="0.25">0.25 MP</option>
              </select>
              <p className="text-xs text-gray-500">Approximate megapixels for generated image</p>
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
              </div>
              <p className="text-xs text-gray-500">Run faster predictions with optimized model</p>

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
              </div>
              <p className="text-xs text-gray-500">Disable safety checker for generated images</p>
            </div>

            {/* Generate Button */}
            <button
              type="submit"
              disabled={isGenerating || !formData.prompt.trim()}
              className={`w-full flex items-center justify-center space-x-2 p-3 rounded-lg ${isGenerating || !formData.prompt.trim() ? 'bg-gray-500 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'} text-white font-medium transition-colors`}
            >
              <Send size={18} />
              <span>{isGenerating ? 'Generating...' : 'Generate'}</span>
            </button>
            
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
              className={`h-16 border-b ${darkMode ? 'border-gray-700' : 'border-gray-200'} flex items-center px-6`}
            >
              <div className="flex items-center space-x-2">
                <Sliders size={18} />
                <h2 className="font-medium">Generated Images</h2>
              </div>
            </div>
            <div
              className={`flex-grow p-6 overflow-auto ${darkMode ? 'bg-gray-900' : 'bg-gray-50'}`}
            >
              <ImageDisplay 
                images={generationResult?.response} 
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
