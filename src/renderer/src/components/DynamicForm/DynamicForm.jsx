import React, { useState, useEffect } from 'react';
import { getModelById, getDefaultModel } from '../../config/models';
import ModelSelector from './ModelSelector';
import ParameterField from './ParameterField';
import { Folder, Send } from 'lucide-react';
import ProgressBar from '../ProgressBar';

const DynamicForm = ({ darkMode, onSubmit, openGenerationFolder, isGenerating, progress, status, error }) => {
  // State for selected model and form data
  const [selectedModelId, setSelectedModelId] = useState(getDefaultModel().id);
  const [formData, setFormData] = useState({});
  const [selectedModel, setSelectedModel] = useState(getDefaultModel());

  // Update the form data when the selected model changes
  useEffect(() => {
    const model = getModelById(selectedModelId);
    if (model) {
      setSelectedModel(model);
      
      // Initialize form data with default values from the selected model
      const initialData = {};
      model.parameters.forEach(param => {
        if (param.default !== undefined && param.default !== '') {
          initialData[param.id] = param.default;
        }
      });
      
      // Preserve values from the previous form if they exist in the new model
      const newFormData = { ...initialData };
      Object.keys(formData).forEach(key => {
        if (model.parameters.some(param => param.id === key)) {
          newFormData[key] = formData[key];
        }
      });
      
      setFormData(newFormData);
    }
  }, [selectedModelId]);

  // Handle form field changes
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  // Handle model selection change
  const handleModelChange = (modelId) => {
    setSelectedModelId(modelId);
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Prepare the parameters based on the selected model
    const params = {
      modelId: selectedModelId,
      endpoint: selectedModel.endpoint,
      version: selectedModel.version,
      ...formData
    };
    
    onSubmit(params);
  };

  // Sort parameters by order
  const sortedParameters = [...selectedModel.parameters].sort((a, b) => a.order - b.order);

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Model Selector */}
      <ModelSelector
        selectedModelId={selectedModelId}
        onChange={handleModelChange}
        darkMode={darkMode}
      />
      
      {/* Dynamic parameters */}
      {sortedParameters.map(parameter => (
        <ParameterField
          key={parameter.id}
          parameter={parameter}
          formData={formData}
          handleChange={handleChange}
          darkMode={darkMode}
        />
      ))}

      {/* Generate Button */}
      <div className="flex space-x-2">
        <button
          type="submit"
          disabled={isGenerating || !formData.prompt?.trim()}
          className={`flex-grow flex items-center justify-center space-x-2 p-2 rounded-lg 
            ${isGenerating || !formData.prompt?.trim() ? 'bg-gray-500 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'} 
            text-white font-medium transition-colors`}
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

      {/* Status Message */}
      {status && isGenerating && (
        <div className={`p-2 rounded-md ${darkMode ? 'bg-blue-800 text-blue-100' : 'bg-blue-100 text-blue-800'} text-sm`}>
          {status}
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div className="p-3 rounded-md bg-red-100 text-red-800 dark:bg-red-800 dark:text-red-100 mt-4">
          {error}
        </div>
      )}

      {/* Progress Bar */}
      {isGenerating && <ProgressBar progress={progress} isDarkMode={darkMode} />}
    </form>
  );
};

export default DynamicForm;
