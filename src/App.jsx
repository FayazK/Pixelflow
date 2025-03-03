import { useState } from "react";
import { generateImage } from "./services/api";

function App() {
  const [formData, setFormData] = useState({
    prompt: "",
    image_prompt: "",
    image_prompt_strength: 0.1,
    aspect_ratio: "1:1",
    safety_tolerance: 2,
    seed: "",
    raw: false,
    output_format: "jpg"
  });
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [generatedImage, setGeneratedImage] = useState(null);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    
    try {
      // For demo purposes, use this to simulate a successful API response
      // In production, replace this with actual API call:
      
      // Demo simulation:
      setTimeout(() => {
        setLoading(false);
        // This would normally be the URL returned from the API
        setGeneratedImage("https://replicate.delivery/pbxt/KJgkVRlEKBn7yDTEWdXCWnm7JT1Pf0YMdILOZFzwFRxVl9kE/out-0.png");
      }, 2000);
      
      // Actual implementation:
      /*
      const response = await generateImage(formData);
      setGeneratedImage(response.output[0]);
      */
    } catch (err) {
      setError("Failed to generate image. Please try again.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 text-center mb-8">
          Imagen v2
        </h1>
        
        <div className="bg-white shadow-lg rounded-lg overflow-hidden">
          <div className="flex flex-col md:flex-row">
            {/* Left Column - Form */}
            <div className="w-full md:w-1/2 p-6 border-r border-gray-200">
              <h2 className="text-xl font-semibold mb-6">Image Generation</h2>
              
              <form onSubmit={handleSubmit}>
                {/* Prompt */}
                <div className="mb-4">
                  <label htmlFor="prompt" className="block text-sm font-medium text-gray-700 mb-1">
                    Prompt *
                  </label>
                  <textarea
                    id="prompt"
                    name="prompt"
                    rows="4"
                    required
                    className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 p-2 border"
                    placeholder="Enter your prompt here..."
                    value={formData.prompt}
                    onChange={handleChange}
                  ></textarea>
                  <p className="mt-1 text-xs text-gray-500">Text prompt for image generation</p>
                </div>
                
                {/* Image Prompt */}
                <div className="mb-4">
                  <label htmlFor="image_prompt" className="block text-sm font-medium text-gray-700 mb-1">
                    Image Prompt
                  </label>
                  <input
                    type="text"
                    id="image_prompt"
                    name="image_prompt"
                    className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 p-2 border"
                    placeholder="Image URL"
                    value={formData.image_prompt}
                    onChange={handleChange}
                  />
                  <p className="mt-1 text-xs text-gray-500">Image to use with Flux Redux</p>
                </div>
                
                {/* Image Prompt Strength */}
                <div className="mb-4">
                  <label htmlFor="image_prompt_strength" className="block text-sm font-medium text-gray-700 mb-1">
                    Image Prompt Strength: {formData.image_prompt_strength}
                  </label>
                  <input
                    type="range"
                    id="image_prompt_strength"
                    name="image_prompt_strength"
                    min="0"
                    max="1"
                    step="0.1"
                    className="w-full"
                    value={formData.image_prompt_strength}
                    onChange={handleChange}
                  />
                  <p className="mt-1 text-xs text-gray-500">Blend between the prompt and the image prompt</p>
                </div>
                
                {/* Aspect Ratio */}
                <div className="mb-4">
                  <label htmlFor="aspect_ratio" className="block text-sm font-medium text-gray-700 mb-1">
                    Aspect Ratio
                  </label>
                  <select
                    id="aspect_ratio"
                    name="aspect_ratio"
                    className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 p-2 border"
                    value={formData.aspect_ratio}
                    onChange={handleChange}
                  >
                    <option value="21:9">21:9</option>
                    <option value="16:9">16:9</option>
                    <option value="3:2">3:2</option>
                    <option value="4:3">4:3</option>
                    <option value="5:4">5:4</option>
                    <option value="1:1">1:1</option>
                    <option value="4:5">4:5</option>
                    <option value="3:4">3:4</option>
                    <option value="2:3">2:3</option>
                    <option value="9:16">9:16</option>
                    <option value="9:21">9:21</option>
                  </select>
                  <p className="mt-1 text-xs text-gray-500">Aspect ratio for the generated image</p>
                </div>
                
                {/* Safety Tolerance */}
                <div className="mb-4">
                  <label htmlFor="safety_tolerance" className="block text-sm font-medium text-gray-700 mb-1">
                    Safety Tolerance: {formData.safety_tolerance}
                  </label>
                  <input
                    type="range"
                    id="safety_tolerance"
                    name="safety_tolerance"
                    min="1"
                    max="6"
                    step="1"
                    className="w-full"
                    value={formData.safety_tolerance}
                    onChange={handleChange}
                  />
                  <p className="mt-1 text-xs text-gray-500">Safety tolerance, 1 is most strict and 6 is most permissive</p>
                </div>
                
                {/* Seed */}
                <div className="mb-4">
                  <label htmlFor="seed" className="block text-sm font-medium text-gray-700 mb-1">
                    Seed
                  </label>
                  <input
                    type="number"
                    id="seed"
                    name="seed"
                    className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 p-2 border"
                    placeholder="Random seed"
                    value={formData.seed}
                    onChange={handleChange}
                  />
                  <p className="mt-1 text-xs text-gray-500">Random seed. Set for reproducible generation</p>
                </div>
                
                {/* Output Format */}
                <div className="mb-4">
                  <label htmlFor="output_format" className="block text-sm font-medium text-gray-700 mb-1">
                    Output Format
                  </label>
                  <select
                    id="output_format"
                    name="output_format"
                    className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 p-2 border"
                    value={formData.output_format}
                    onChange={handleChange}
                  >
                    <option value="jpg">JPG</option>
                    <option value="png">PNG</option>
                  </select>
                  <p className="mt-1 text-xs text-gray-500">Format of the output images</p>
                </div>
                
                {/* Raw Option */}
                <div className="flex items-center mb-6">
                  <input
                    type="checkbox"
                    id="raw"
                    name="raw"
                    className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                    checked={formData.raw}
                    onChange={handleChange}
                  />
                  <label htmlFor="raw" className="ml-2 block text-sm text-gray-700">
                    Generate Raw Image
                  </label>
                  <p className="ml-6 text-xs text-gray-500">Generate less processed, more natural-looking images</p>
                </div>
                
                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={loading}
                  className={`w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white ${
                    loading ? "bg-indigo-400" : "bg-indigo-600 hover:bg-indigo-700"
                  } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500`}
                >
                  {loading ? "Generating..." : "Generate Image"}
                </button>
                
                {error && (
                  <div className="mt-4 text-sm text-red-600">
                    {error}
                  </div>
                )}
              </form>
            </div>
            
            {/* Right Column - Image Display */}
            <div className="w-full md:w-1/2 p-6 flex flex-col">
              <h2 className="text-xl font-semibold mb-6">Generated Image</h2>
              
              <div className="flex-1 flex items-center justify-center bg-gray-50 rounded-lg border border-dashed border-gray-300">
                {loading ? (
                  <div className="text-center">
                    <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-indigo-500 border-t-transparent"></div>
                    <p className="mt-4 text-gray-500">Generating your image...</p>
                  </div>
                ) : generatedImage ? (
                  <img
                    src={generatedImage}
                    alt="Generated"
                    className="max-w-full max-h-full object-contain rounded"
                  />
                ) : (
                  <div className="text-center p-12">
                    <p className="text-gray-500">Generated Image goes here</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
