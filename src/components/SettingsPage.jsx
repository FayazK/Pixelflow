import React, { useState } from 'react';
import { Sun, Moon, Settings, Eye, EyeOff, X } from 'lucide-react';

// Enhanced Settings Component
const SettingsPage = ({ onClose, darkMode }) => {
  const [apiKey, setApiKey] = useState("");
  const [savedApiKey, setSavedApiKey] = useState("");
  const [isValidating, setIsValidating] = useState(false);
  const [validationStatus, setValidationStatus] = useState(null);
  const [showApiKey, setShowApiKey] = useState(false);

  // Simulate loading the API key on component mount
  React.useEffect(() => {
    // This would be replaced with your actual getApiKey function
    const simulatedApiKey = "rep_abc123xyz456";
    setSavedApiKey(simulatedApiKey);
    setApiKey(simulatedApiKey);
  }, []);

  const handleSave = async () => {
    if (!apiKey.trim()) {
      setValidationStatus({
        success: false,
        message: "Please enter an API key."
      });
      return;
    }

    setIsValidating(true);
    setValidationStatus(null);

    // Simulate API validation
    setTimeout(() => {
      setIsValidating(false);
      setSavedApiKey(apiKey);
      setValidationStatus({
        success: true,
        message: "API key validated and saved successfully!"
      });
    }, 1000);
  };

  const handleClear = () => {
    setApiKey("");
    setSavedApiKey("");
    setValidationStatus({
      success: true,
      message: "API key cleared successfully."
    });
  };

  return (
      <div className="fixed inset-0 z-50 overflow-y-auto">
        <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
          <div className="fixed inset-0 transition-opacity" aria-hidden="true">
            <div className={`absolute inset-0 ${darkMode ? 'bg-gray-900' : 'bg-gray-500'} opacity-75`}></div>
          </div>

          <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>

          <div className={`inline-block align-bottom rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full ${darkMode ? 'bg-gray-800 text-gray-100' : 'bg-white text-gray-800'}`}>
            <div className="px-6 pt-5 pb-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold">Settings</h3>
                <button
                    onClick={onClose}
                    className={`rounded-full p-1 ${darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'} transition-colors`}
                >
                  <X size={20} />
                </button>
              </div>

              <div className="mb-6">
                <label className="block text-sm font-medium mb-2">
                  Replicate API Key
                </label>
                <div className="relative">
                  <input
                      type={showApiKey ? "text" : "password"}
                      value={apiKey}
                      onChange={(e) => setApiKey(e.target.value)}
                      className={`w-full rounded-lg border p-3 pr-10 ${
                          darkMode
                              ? 'bg-gray-700 border-gray-600 text-white focus:ring-indigo-500 focus:border-indigo-500'
                              : 'bg-gray-50 border-gray-300 focus:ring-indigo-500 focus:border-indigo-500'
                      }`}
                      placeholder="Enter your Replicate API key"
                  />
                  <button
                      type="button"
                      onClick={() => setShowApiKey(!showApiKey)}
                      className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-500 hover:text-gray-700"
                  >
                    {showApiKey ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
                <p className={`mt-1 text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                  Your API key is stored locally on your device and never sent to our servers.
                </p>
              </div>

              <div className="flex space-x-4">
                <button
                    onClick={handleSave}
                    disabled={isValidating || apiKey === savedApiKey}
                    className={`py-2 px-4 rounded-lg text-sm font-medium text-white ${
                        isValidating || apiKey === savedApiKey
                            ? "bg-indigo-400 cursor-not-allowed"
                            : "bg-indigo-600 hover:bg-indigo-700"
                    } transition-colors`}
                >
                  {isValidating ? "Validating..." : "Save API Key"}
                </button>

                {savedApiKey && (
                    <button
                        onClick={handleClear}
                        className={`py-2 px-4 rounded-lg text-sm font-medium ${
                            darkMode
                                ? 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                        } transition-colors`}
                    >
                      Clear API Key
                    </button>
                )}
              </div>

              {validationStatus && (
                  <div className={`mt-4 p-3 rounded-md ${
                      validationStatus.success
                          ? darkMode ? "bg-green-800 bg-opacity-20 text-green-300" : "bg-green-50 text-green-800"
                          : darkMode ? "bg-red-800 bg-opacity-20 text-red-300" : "bg-red-50 text-red-800"
                  }`}>
                    {validationStatus.message}
                  </div>
              )}

              <div className="mt-6">
                <h3 className={`text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  How to get your Replicate API Key:
                </h3>
                <ol className={`list-decimal pl-5 text-sm space-y-1 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  <li>Sign up or log in to <a href="https://replicate.com" target="_blank" rel="noopener noreferrer" className="text-indigo-500 hover:text-indigo-400">Replicate</a></li>
                  <li>Go to your account settings</li>
                  <li>Find the API tokens section</li>
                  <li>Create a new API token</li>
                  <li>Copy the token and paste it here</li>
                </ol>
              </div>
            </div>
          </div>
        </div>
      </div>
  );
};
export default SettingsPage;