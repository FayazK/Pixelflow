import React from 'react'

/**
 * Progress bar component for showing loading status
 */
const ProgressBar = ({ progress = 0, isDarkMode = false }) => {
  return (
    <div className="w-full mt-4">
      <div className="flex items-center justify-between mb-1">
        <span className="text-sm font-medium">Generating...</span>
        <span className="text-sm">
          {Math.round(progress)}%
        </span>
      </div>
      <div 
        className={`w-full h-2.5 rounded-full ${
          isDarkMode ? 'bg-gray-700' : 'bg-gray-200'
        }`}
      >
        <div
          className="h-2.5 rounded-full bg-blue-600 transition-all duration-300"
          style={{ width: `${progress}%` }}
        ></div>
      </div>
    </div>
  )
}

export default ProgressBar
