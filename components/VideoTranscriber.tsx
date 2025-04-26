// components/VideoTranscriber.tsx
import React, { useState } from 'react';
import { transcribeVideoWithWhisper } from '@/lib/aiService';

const VideoTranscriber: React.FC = () => {
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [transcription, setTranscription] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setVideoFile(file);
    }
  };

  const handleTranscribe = async () => {
    if (!videoFile) {
      setError('Please upload a video file.');
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const result = await transcribeVideoWithWhisper(videoFile);
      setTranscription(result.text);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 border rounded-lg shadow-md">
      <h2 className="text-xl font-bold mb-4">Video Transcriber</h2>
      <input
        type="file"
        accept="video/*"
        onChange={handleFileChange}
        className="w-full p-2 border rounded mb-4"
      />
      <button
        onClick={handleTranscribe}
        disabled={loading || !videoFile}
        className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700 disabled:bg-gray-400"
      >
        {loading ? 'Transcribing...' : 'Transcribe Video'}
      </button>
      {error && <div className="mt-2 text-red-600">{error}</div>}
      {transcription && (
        <div className="mt-4 p-4 border rounded bg-gray-100">
          <h3 className="text-lg font-semibold">Transcription:</h3>
          <p>{transcription}</p>
        </div>
      )}
    </div>
  );
};

export default VideoTranscriber;
