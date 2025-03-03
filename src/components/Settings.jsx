import { useState, useEffect } from "react";
import { saveApiKey, getApiKey, clearApiKey } from "../utils/store";
import { validateApiKey } from "../services/api";

const Settings = ({ onClose }) => {
  const [apiKey, setApiKey] = useState("");
  const [savedApiKey, setSavedApiKey] = useState("");
  const [isValidating, setIsValidating] = useState(false);
  const [validationStatus, setValidationStatus] = useState(null);
  const [showApiKey, setShowApiKey] = useState(false);

  useEffect(() => {
    const loadApiKey = async () => {
      const key = await getApiKey();
      if (key) {
        setSavedApiKey(key);
        setApiKey(key);
      }
    };
    
    loadApiKey();
  }, []);

  const handleSave = async () => {
    setIsValidating(true);
    setValidationStatus(null);
    
    try {
      const isValid = await validateApiKey(apiKey);
      
      if (isValid) {
        await saveApiKey(apiKey);
        setSavedApiKey(apiKey);
        setValidationStatus({ success: true, message: "API key saved successfully!" });
      } else {
        setValidationStatus({ success: false, message: "Invalid API key. Please check and try again." });
      }
    } catch (error) {
      setValidationStatus({ 
        success: false, 
        message: "Error validating API key. Please check your internet connection."
      });
    } finally {
      setIsValidating(false);
    }
  };

  const handleClear = async () => {
    await clearApiKey();
    setApiKey("");
    setSavedApiKey("");
    setValidationStatus({ success: true, message: "API key cleared successfully." });
  };

  return (
    <div className="bg-white shadow-lg rounded-lg overflow-hidden max-w-2xl mx-auto mt-8">
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold">Settings</h2>
          <button 
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Replicate API Key
          </label>
          <div className="relative">
            <input
              type={showApiKey ? "text" : "password"}
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              className="w-full rounded-md border border-gray-300 p-2 pr-10 focus:border-indigo-500 focus:ring-indigo-500"
              placeholder="Enter your Replicate API key"
            />
            <button
              type="button"
              onClick={() => setShowApiKey(!showApiKey)}
              className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-500 hover:text-gray-700"
            >
              {showApiKey ? (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
              )}
            </button>
          </div>
          <p className="mt-1 text-xs text-gray-500">
            Your API key is stored locally on your device and never sent to our servers.
          </p>
        </div>
        
        <div className="flex space-x-4">
          <button
            onClick={handleSave}
            disabled={isValidating || apiKey === savedApiKey}
            className={`py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white ${
              isValidating || apiKey === savedApiKey
                ? "bg-indigo-400"
                : "bg-indigo-600 hover:bg-indigo-700"
            } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500`}
          >
            {isValidating ? "Validating..." : "Save API Key"}
          </button>
          
          {savedApiKey && (
            <button
              onClick={handleClear}
              className="py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Clear API Key
            </button>
          )}
        </div>
        
        {validationStatus && (
          <div className={`mt-4 p-3 rounded-md ${validationStatus.success ? "bg-green-50 text-green-800" : "bg-red-50 text-red-800"}`}>
            {validationStatus.message}
          </div>
        )}
        
        <div className="mt-6">
          <h3 className="text-sm font-medium text-gray-700 mb-2">How to get your Replicate API Key:</h3>
          <ol className="list-decimal pl-5 text-sm text-gray-600 space-y-1">
            <li>Sign up or log in to <a href="https://replicate.com" target="_blank" rel="noopener noreferrer" className="text-indigo-600 hover:text-indigo-800">Replicate</a></li>
            <li>Go to your account settings</li>
            <li>Find the API tokens section</li>
            <li>Create a new API token</li>
            <li>Copy the token and paste it here</li>
          </ol>
        </div>
      </div>
    </div>
  );
};

export default Settings;
