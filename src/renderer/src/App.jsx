import { useState, useEffect } from 'react'
import { Sun, Moon, Image, Sliders, Folder } from 'lucide-react'
import Settings from './components/Settings'
import ImageDisplay from './components/ImageDisplay'
import DynamicForm from './components/DynamicForm'

function App() {
  const [darkMode, setDarkMode] = useState(true)
  const [showSettings, setShowSettings] = useState(false)
  const [isGenerating, setIsGenerating] = useState(false)
  const [progress, setProgress] = useState(0)
  const [status, setStatus] = useState('')
  const [error, setError] = useState(null)
  const [generationResult, setGenerationResult] = useState(null)

  // Set up IPC event listeners for generation updates
  useEffect(() => {
    // Handler for generation updates from the main process
    const handleGenerationUpdate = (updateData) => {
      if (updateData.type === 'progress') {
        setProgress(updateData.value);
      } else if (updateData.type === 'status') {
        setStatus(updateData.message);
      }
    };

    // Register the event listener
    window.ipcRenderer.on('generation:update', handleGenerationUpdate);

    // Clean up the event listener when the component unmounts
    return () => {
      window.ipcRenderer.removeListener('generation:update', handleGenerationUpdate);
    };
  }, []);

  const handleSubmit = async (params) => {
    try {
      // Reset states
      setError(null);
      setIsGenerating(true);
      setProgress(10);
      setStatus('Starting image generation...');

      // Make sure numeric values are properly formatted
      const formattedParams = { ...params };
      Object.entries(formattedParams).forEach(([key, value]) => {
        // Convert empty string seeds to undefined
        if (key === 'seed' && value === '') {
          delete formattedParams.seed;
        } 
        // Convert string numbers to actual numbers
        else if (typeof value === 'string' && !isNaN(value) && key !== 'prompt' && key !== 'negative_prompt') {
          formattedParams[key] = parseFloat(value);
        }
      });

      console.log('Generating image with params:', formattedParams);

      // Call the API (progress updates will come via IPC events)
      const result = await window.api.generation.generateImage(formattedParams);

      // Set complete progress
      setProgress(100);
      setStatus('Generation complete!');

      console.log('Generation result:', result);
      setGenerationResult(result);

      // After a short delay, hide the progress bar
      setTimeout(() => {
        setIsGenerating(false);
        setProgress(0);
        setStatus('');
      }, 1000);
    } catch (err) {
      console.error('Generation failed:', err);
      setError(err.message || 'Image generation failed');
      setIsGenerating(false);
      setProgress(0);
      setStatus('');
    }
  };

  const openGenerationFolder = async () => {
    try {
      await window.api.generation.openGenerationFolder();
    } catch (err) {
      console.error('Failed to open generation folder:', err);
      setError('Failed to open generation folder');
    }
  };

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
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="3"></circle>
                <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path>
              </svg>
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
          <DynamicForm 
            darkMode={darkMode}
            onSubmit={handleSubmit}
            openGenerationFolder={openGenerationFolder}
            isGenerating={isGenerating}
            progress={progress}
            status={status}
            error={error}
          />
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
