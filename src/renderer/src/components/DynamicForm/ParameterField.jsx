import React from 'react';
import Tooltip from '../Tooltip';

// Component to render a form field based on parameter definition
const ParameterField = ({ parameter, formData, handleChange, darkMode }) => {
  // Check if this parameter should be conditionally shown
  if (parameter.conditionalOn) {
    const { field, value } = parameter.conditionalOn;
    if (formData[field] !== value) {
      return null;
    }
  }

  // Common label element
  const label = (
    <div className="flex items-center">
      <label htmlFor={parameter.id} className="block text-sm font-medium">
        {parameter.name} {parameter.required && '*'}
      </label>
      <Tooltip darkMode={darkMode} text={parameter.description} />
    </div>
  );

  // Common input class
  const inputClass = `w-full p-2 text-sm rounded-lg border ${
    darkMode ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-300'
  } focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:outline-none`;

  // Render field based on type
  switch (parameter.type) {
    case 'text': 
      return (
        <div className="space-y-1">
          {label}
          <textarea
            id={parameter.id}
            name={parameter.id}
            value={formData[parameter.id] || parameter.default}
            onChange={handleChange}
            required={parameter.required}
            rows={parameter.id === 'prompt' ? "3" : "2"}
            placeholder={parameter.default}
            className={`${inputClass} resize-none`}
          />
        </div>
      );
    
    case 'number':
      return (
        <div className="space-y-1">
          {label}
          <input
            type="number"
            id={parameter.id}
            name={parameter.id}
            value={formData[parameter.id] !== undefined ? formData[parameter.id] : parameter.default}
            onChange={handleChange}
            min={parameter.min}
            max={parameter.max}
            step={parameter.step || 1}
            className={inputClass}
            placeholder={parameter.default === '' ? 'Random if empty' : parameter.default.toString()}
          />
        </div>
      );
    
    case 'select':
      return (
        <div className="space-y-1">
          {label}
          <select
            id={parameter.id}
            name={parameter.id}
            value={formData[parameter.id] || parameter.default}
            onChange={handleChange}
            className={inputClass}
          >
            {parameter.options.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </div>
      );
    
    case 'range':
      return (
        <div className="space-y-1">
          {label}
          <div className="flex items-center space-x-2">
            <input
              type="range"
              id={parameter.id}
              name={parameter.id}
              value={formData[parameter.id] !== undefined ? formData[parameter.id] : parameter.default}
              onChange={handleChange}
              min={parameter.min}
              max={parameter.max}
              step={parameter.step || 0.1}
              className="flex-grow h-2 rounded-lg appearance-none cursor-pointer"
            />
            <span className="w-12 text-center text-sm">
              {formData[parameter.id] !== undefined ? formData[parameter.id] : parameter.default}
            </span>
          </div>
        </div>
      );
    
    case 'checkbox':
      return (
        <div className="flex items-center">
          <input
            type="checkbox"
            id={parameter.id}
            name={parameter.id}
            checked={formData[parameter.id] !== undefined ? formData[parameter.id] : parameter.default}
            onChange={handleChange}
            className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
          />
          <label htmlFor={parameter.id} className="ml-2 block text-sm">
            {parameter.name}
          </label>
          <Tooltip darkMode={darkMode} text={parameter.description} />
        </div>
      );
    
    case 'image':
      // Placeholder for image upload functionality
      // In a real implementation, this would handle file selection
      return (
        <div className="space-y-1">
          {label}
          <div className={`p-2 border border-dashed rounded-lg text-center ${darkMode ? 'border-gray-600' : 'border-gray-300'}`}>
            <p className="text-sm">Image upload not implemented in this prototype</p>
          </div>
        </div>
      );
      
    default:
      return (
        <div className="p-2 bg-red-100 dark:bg-red-800 rounded-md">
          <p className="text-sm text-red-800 dark:text-red-100">
            Unknown parameter type: {parameter.type}
          </p>
        </div>
      );
  }
};

export default ParameterField;
