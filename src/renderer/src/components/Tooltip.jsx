import React, { useState } from 'react'
import { HelpCircle } from 'lucide-react'

/**
 * Tooltip component for showing help text
 * @param {Object} props - Component props
 * @param {string} props.text - The tooltip text to display
 * @param {boolean} props.darkMode - Whether dark mode is active
 */
const Tooltip = ({ text, darkMode }) => {
  const [isVisible, setIsVisible] = useState(false)

  return (
    <div className="relative inline-block ml-1">
      <button
        type="button"
        className={`p-1 rounded-full ${darkMode ? 'text-gray-400 hover:text-gray-300' : 'text-gray-500 hover:text-gray-700'}`}
        onMouseEnter={() => setIsVisible(true)}
        onMouseLeave={() => setIsVisible(false)}
        onFocus={() => setIsVisible(true)}
        onBlur={() => setIsVisible(false)}
        aria-label="Help"
      >
        <HelpCircle size={14} />
      </button>

      {isVisible && (
        <div
          className={`absolute z-10 w-64 text-xs p-2 rounded-md shadow-lg left-0 transform -translate-x-1/2 mt-1
            ${
              darkMode
                ? 'bg-gray-700 text-gray-200 border border-gray-600'
                : 'bg-white text-gray-700 border border-gray-200'
            }`}
        >
          {text}
          <div
            className={`absolute w-2 h-2 transform rotate-45 -top-1 left-1/2 -translate-x-1/2
              ${darkMode ? 'bg-gray-700 border-t border-l border-gray-600' : 'bg-white border-t border-l border-gray-200'}`}
          ></div>
        </div>
      )}
    </div>
  )
}

export default Tooltip
