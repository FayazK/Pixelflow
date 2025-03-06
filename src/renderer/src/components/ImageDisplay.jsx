import React from 'react'
import { Download, ExternalLink, Folder } from 'lucide-react'

/**
 * Component to display generated images
 */
const ImageDisplay = ({ images, timestamp, darkMode }) => {
  if (!images || images.length === 0) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className={`text-center ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
          <div className="w-16 h-16 mx-auto mb-4 opacity-30">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
          </div>
          <p className="text-lg font-medium">No images generated yet</p>
          <p className="mt-2">Fill out the form and click Generate to create images</p>
        </div>
      </div>
    )
  }

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold">Generated Images</h3>
        <span className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
          {new Date(timestamp.replace(/-/g, ':')).toLocaleString()}
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {images.map((imageUrl, index) => (
          <div 
            key={index}
            className={`relative rounded-lg overflow-hidden border ${
              darkMode ? 'border-gray-700' : 'border-gray-200'
            }`}
          >
            <img 
              src={imageUrl} 
              alt={`Generated image ${index + 1}`} 
              className="w-full h-auto object-contain"
            />
            
            <div className={`absolute bottom-0 left-0 right-0 flex justify-between p-2 ${
              darkMode ? 'bg-gray-800 bg-opacity-75' : 'bg-white bg-opacity-75'
            }`}>
              <a 
                href={imageUrl} 
                download={`image-${index}.png`}
                className="p-2 rounded-full hover:bg-opacity-10 hover:bg-black"
                title="Download image"
              >
                <Download size={18} />
              </a>
              <a 
                href={imageUrl} 
                target="_blank" 
                rel="noopener noreferrer"
                className="p-2 rounded-full hover:bg-opacity-10 hover:bg-black"
                title="Open in new tab"
              >
                <ExternalLink size={18} />
              </a>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default ImageDisplay
