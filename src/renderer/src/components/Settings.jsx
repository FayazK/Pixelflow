import React, { useState, useEffect } from 'react'
import { Settings as SettingsIcon, Save, Key, AlertCircle } from 'lucide-react'

const Settings = ({ darkMode, onClose }) => {
  const [apiKeys, setApiKeys] = useState({
    replicate: '',
    gemini: ''
  })
  const [isSaving, setIsSaving] = useState(false)
  const [saveStatus, setSaveStatus] = useState(null) // 'success', 'error', or null

  // Load the API keys when the component mounts
  useEffect(() => {
    const loadApiKeys = async () => {
      try {
        const keys = await window.api.settings.getApiKeys()
        setApiKeys(keys)
      } catch (error) {
        console.error('Failed to load API keys:', error)
      }
    }

    loadApiKeys()
  }, [])

  const handleChange = (e) => {
    const { name, value } = e.target
    setApiKeys((prev) => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsSaving(true)
    setSaveStatus(null)

    try {
      await window.api.settings.saveApiKeys(apiKeys)
      setSaveStatus('success')
      setTimeout(() => setSaveStatus(null), 3000)
    } catch (error) {
      console.error('Failed to save API keys:', error)
      setSaveStatus('error')
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <div className={`h-full flex flex-col ${darkMode ? 'text-gray-100' : 'text-gray-800'}`}>
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-opacity-50">
        <div className="flex items-center space-x-2">
          <SettingsIcon className="w-5 h-5" />
          <h2 className="text-xl font-semibold">Settings</h2>
        </div>
        <button
          onClick={onClose}
          className={`px-3 py-1 rounded-md ${
            darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-200'
          } transition-colors`}
        >
          Back
        </button>
      </div>

      {/* Form */}
      <div className="flex-grow p-6 overflow-auto">
        <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl mx-auto">
          <div className="space-y-1">
            <h3 className="text-lg font-medium">API Keys</h3>
            <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
              Configure your API keys for different services.
            </p>
          </div>

          {/* Replicate API Key */}
          <div className="space-y-2">
            <label htmlFor="replicate" className="block text-sm font-medium">
              Replicate API Key
            </label>
            <div className="relative">
              <div
                className={`absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none ${
                  darkMode ? 'text-gray-400' : 'text-gray-500'
                }`}
              >
                <Key size={16} />
              </div>
              <input
                type="password"
                id="replicate"
                name="replicate"
                value={apiKeys.replicate}
                onChange={handleChange}
                className={`w-full pl-10 p-3 rounded-lg border ${
                  darkMode
                    ? 'bg-gray-700 border-gray-600 focus:border-blue-500'
                    : 'bg-white border-gray-300 focus:border-blue-500'
                } focus:ring-2 focus:ring-blue-500 focus:outline-none`}
                placeholder="Enter your Replicate API key"
              />
            </div>
            <p className="text-xs text-gray-500">
              Used for image generation. Get your key at{' '}
              <a
                href="https://replicate.com/account/api-tokens"
                target="_blank"
                rel="noreferrer"
                className="text-blue-500 hover:underline"
              >
                replicate.com
              </a>
            </p>
          </div>

          {/* Google Gemini API Key */}
          <div className="space-y-2">
            <label htmlFor="gemini" className="block text-sm font-medium">
              Google Gemini API Key
            </label>
            <div className="relative">
              <div
                className={`absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none ${
                  darkMode ? 'text-gray-400' : 'text-gray-500'
                }`}
              >
                <Key size={16} />
              </div>
              <input
                type="password"
                id="gemini"
                name="gemini"
                value={apiKeys.gemini}
                onChange={handleChange}
                className={`w-full pl-10 p-3 rounded-lg border ${
                  darkMode
                    ? 'bg-gray-700 border-gray-600 focus:border-blue-500'
                    : 'bg-white border-gray-300 focus:border-blue-500'
                } focus:ring-2 focus:ring-blue-500 focus:outline-none`}
                placeholder="Enter your Google Gemini API key"
              />
            </div>
            <p className="text-xs text-gray-500">
              Used for text processing. Get your key at{' '}
              <a
                href="https://aistudio.google.com/app/apikey"
                target="_blank"
                rel="noreferrer"
                className="text-blue-500 hover:underline"
              >
                Google AI Studio
              </a>
            </p>
          </div>

          {/* Status Message */}
          {saveStatus && (
            <div
              className={`p-3 rounded-md ${
                saveStatus === 'success'
                  ? 'bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100'
                  : 'bg-red-100 text-red-800 dark:bg-red-800 dark:text-red-100'
              } flex items-center space-x-2`}
            >
              <AlertCircle size={16} />
              <span>
                {saveStatus === 'success'
                  ? 'Settings saved successfully!'
                  : 'Failed to save settings. Please try again.'}
              </span>
            </div>
          )}

          {/* Save Button */}
          <button
            type="submit"
            disabled={isSaving}
            className={`w-full flex items-center justify-center space-x-2 p-3 rounded-lg ${
              isSaving
                ? 'bg-gray-500 cursor-not-allowed'
                : 'bg-blue-600 hover:bg-blue-700'
            } text-white font-medium transition-colors`}
          >
            <Save size={18} />
            <span>{isSaving ? 'Saving...' : 'Save Settings'}</span>
          </button>
        </form>
      </div>
    </div>
  )
}

export default Settings
