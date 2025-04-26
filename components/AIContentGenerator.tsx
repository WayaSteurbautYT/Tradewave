// components/AIContentGenerator.tsx
import React, { useState } from 'react';
import { generateContentWithGemini } from '@/lib/aiService';

const AIContentGenerator: React.FC = () => {
  const [prompt, setPrompt] = useState('');
  const [generatedContent, setGeneratedContent] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleGenerateContent = async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await generateContentWithGemini(prompt);
      setGeneratedContent(result.text);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 border rounded-lg shadow-md">
      <h2 className="text-xl font-bold mb-4">AI Content Generator</h2>
      <textarea
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
        placeholder="Enter your content prompt here..."
        className="w-full p-2 border rounded mb-4"
        rows={4}
      />
      <button
        onClick={handleGenerateContent}
        disabled={loading}
        className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700 disabled:bg-gray-400"
      >
        {loading ? 'Generating...' : 'Generate Content'}
      </button>
      {error && <div className="mt-2 text-red-600">{error}</div>}
      {generatedContent && (
        <div className="mt-4 p-4 border rounded bg-gray-100">
          <h3 className="text-lg font-semibold">Generated Content:</h3>
          <p>{generatedContent}</p>
        </div>
      )}
    </div>
  );
};

export default AIContentGenerator;
