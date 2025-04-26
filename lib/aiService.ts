// lib/aiService.ts
import axios from 'axios';

// Google Gemini API configuration
const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta';
const GEMINI_API_KEY = process.env.GEMINI_API_KEY || '';

// Whisper API configuration (assuming using OpenAI's API for Whisper)
const WHISPER_API_URL = 'https://api.openai.com/v1/audio/transcriptions';
const WHISPER_API_KEY = process.env.OPENAI_API_KEY || '';

export interface GeminiResponse {
  text: string;
  // Add other relevant fields
}

export interface WhisperResponse {
  text: string;
  // Add other relevant fields
}

export const generateContentWithGemini = async (prompt: string): Promise<GeminiResponse> => {
  try {
    // Call internal API route to keep API key secure
    const response = await axios.post('/api/ai/generate', { prompt });
    return response.data;
  } catch (error) {
    console.error('Error generating content with Gemini:', error);
    throw new Error('Failed to generate content with Gemini');
  }
};

export const transcribeVideoWithWhisper = async (videoFile: File): Promise<WhisperResponse> => {
  try {
    const formData = new FormData();
    formData.append('file', videoFile);
    formData.append('model', 'whisper-1');

    const response = await axios.post(
      WHISPER_API_URL,
      formData,
      {
        headers: {
          'Authorization': `Bearer ${WHISPER_API_KEY}`,
          'Content-Type': 'multipart/form-data',
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error('Error transcribing video with Whisper:', error);
    throw new Error('Failed to transcribe video with Whisper');
  }
};
