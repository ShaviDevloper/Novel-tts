// This file encapsulates the logic for interacting with a Piper TTS model
// running client-side via WebAssembly and ONNX Runtime.

import type { VoiceInstance } from "../types";

// In a real implementation, this would import the actual piper-js library
declare global {
  interface Window {
    Piper: {
      create: (config: {
        voiceUrl: string;
        voiceConfigUrl: string;
      }) => Promise<{
        synthesize: (text: string) => Promise<Float32Array>;
      }>;
    };
    ort: any; // ONNX Runtime
  }
}

class PiperService {
  async loadVoice(voiceConfigUrl: string, voiceUrl: string): Promise<VoiceInstance> {
    try {
      // Fetch the model config to get the sample rate
      const configResponse = await fetch(voiceConfigUrl);
      if (!configResponse.ok) {
        throw new Error(`Failed to fetch model config from ${voiceConfigUrl}: ${configResponse.statusText}`);
      }
      const config = await configResponse.json();
      const sampleRate = config.audio?.sample_rate || 22050;

      // Initialize the Piper WASM voice engine
      const voice = await window.Piper.create({
        voiceUrl: voiceUrl,
        voiceConfigUrl: voiceConfigUrl,
      });

      return { voice, sampleRate };
    } catch (error) {
      console.error(`Error initializing Piper voice from ${voiceUrl}:`, error);
      throw error;
    }
  }
}

export const piperService = new PiperService();
