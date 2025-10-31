export type TTSState = 'idle' | 'loading' | 'playing' | 'paused';

export type Voice = {
  id: string;
  name: string;
  url: string;
  configUrl: string;
};

export type VoiceInstance = {
  voice: {
    synthesize: (text: string) => Promise<Float32Array>;
  };
  sampleRate: number;
};
