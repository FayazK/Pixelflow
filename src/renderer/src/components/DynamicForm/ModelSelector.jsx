import React from 'react';
import { getModelOptions } from '../../config/models';
import Tooltip from '../Tooltip';

const ModelSelector = ({ selectedModelId, onChange, darkMode }) => {
  const modelOptions = getModelOptions();

  return (
    <div className="space-y-1 mb-4">
      <div className="flex items-center">
        <label htmlFor="model-selector" className="block text-sm font-medium">
          Model
        </label>
        <Tooltip darkMode={darkMode} text="Select a text-to-image model" />
      </div>
      
      <select
        id="model-selector"
        value={selectedModelId}
        onChange={(e) => onChange(e.target.value)}
        className={`w-full p-2 text-sm rounded-lg border ${
          darkMode ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-300'
        } focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:outline-none`}
      >
        {modelOptions.map((model) => (
          <option key={model.id} value={model.id}>
            {model.name}
          </option>
        ))}
      </select>
      
      {/* Show the selected model description */}
      <div className={`text-xs mt-1 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
        {modelOptions.find(m => m.id === selectedModelId)?.description || ''}
      </div>
    </div>
  );
};

export default ModelSelector;
