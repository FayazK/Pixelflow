import { useState, useEffect } from 'react';
import { hasApiKey } from '../utils/store';
import Settings from './Settings';

const ApiKeyCheck = ({ children }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [hasKey, setHasKey] = useState(false);
  const [showSettings, setShowSettings] = useState(false);

  useEffect(() => {
    const checkApiKey = async () => {
      const keyExists = await hasApiKey();
      setHasKey(keyExists);
      
      // If no API key, automatically show settings
      if (!keyExists) {
        setShowSettings(true);
      }
      
      setIsLoading(false);
    };
    
    checkApiKey();
  }, []);
  
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-500"></div>
      </div>
    );
  }
  
  if (showSettings) {
    return (
      <div className="p-4">
        <Settings onClose={() => {
          // Only allow closing the settings if an API key exists
          if (hasKey) {
            setShowSettings(false);
          }
        }} />
      </div>
    );
  }
  
  return (
    <div>
      {children}
      <button 
        onClick={() => setShowSettings(true)}
        className="fixed bottom-4 right-4 p-2 bg-indigo-600 text-white rounded-full shadow-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        title="Settings"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      </button>
    </div>
  );
};

export default ApiKeyCheck;
