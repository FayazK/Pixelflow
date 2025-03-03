// Simple secure store implementation using browser localStorage
// with encryption for sensitive data

// Initialize encryption key (in a real app, you might want to derive this from a device-specific source)
const ENCRYPTION_KEY = 'imagen-v2-secure-storage';

// Helper function to encrypt data
const encrypt = (data) => {
  try {
    // In a production app, you'd use a proper encryption library
    // This is a simple obfuscation for demo purposes
    const encoded = btoa(JSON.stringify(data));
    return encoded;
  } catch (error) {
    console.error('Encryption error:', error);
    return null;
  }
};

// Helper function to decrypt data
const decrypt = (encryptedData) => {
  try {
    // In a production app, you'd use a proper decryption method
    // This is a simple de-obfuscation for demo purposes
    const decoded = JSON.parse(atob(encryptedData));
    return decoded;
  } catch (error) {
    console.error('Decryption error:', error);
    return null;
  }
};

// API key management
export const saveApiKey = async (key) => {
  const encryptedKey = encrypt(key);
  localStorage.setItem('replicate_api_key', encryptedKey);
  return true;
};

export const getApiKey = async () => {
  const encryptedKey = localStorage.getItem('replicate_api_key');
  if (!encryptedKey) return null;
  return decrypt(encryptedKey);
};

// Check if API key exists
export const hasApiKey = async () => {
  const key = await getApiKey();
  return !!key;
};

// Clear API key (for logout/reset functionality)
export const clearApiKey = async () => {
  localStorage.removeItem('replicate_api_key');
  return true;
};

// This function could be used if we want to expand storage to other items
export const getItem = async (key) => {
  const item = localStorage.getItem(key);
  if (!item) return null;
  
  try {
    return JSON.parse(item);
  } catch {
    return item;
  }
};

// This function could be used if we want to expand storage to other items
export const setItem = async (key, value) => {
  const valueToStore = typeof value === 'string' ? value : JSON.stringify(value);
  localStorage.setItem(key, valueToStore);
  return true;
};

// For compatibility with the rest of your code
export default {
  get: getItem,
  set: setItem,
  delete: (key) => localStorage.removeItem(key),
  save: () => Promise.resolve(true)
};
