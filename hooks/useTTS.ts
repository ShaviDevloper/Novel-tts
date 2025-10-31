import { useState, useEffect, useRef, useCallback } from 'react';
import { piperService } from '../services/piperService';
import { VOICES } from '../constants';
import type { TTSState, VoiceInstance } from '../types';

export const useTTS = (voiceId: string) => {
  const [ttsState, setTtsState] = useState<TTSState>('loading');
  const audioContextRef = useRef<AudioContext | null>(null);
  const sourceNodeRef = useRef<AudioBufferSourceNode | null>(null);
  const loadedVoiceRef = useRef<VoiceInstance | null>(null);

  // Effect to load/change the voice model
  useEffect(() => {
    const loadVoice = async () => {
      // Clean up previous voice/playback
      if (sourceNodeRef.current) {
        sourceNodeRef.current.onended = null;
        sourceNodeRef.current.stop();
        sourceNodeRef.current = null;
      }

      setTtsState('loading');
      const voiceInfo = VOICES.find(v => v.id === voiceId);
      if (!voiceInfo) {
        console.error(`Voice with id ${voiceId} not found.`);
        // In a real app, you might want to set an error state
        setTtsState('idle'); 
        return;
      }
      
      try {
        const voice = await piperService.loadVoice(voiceInfo.configUrl, voiceInfo.url);
        loadedVoiceRef.current = voice;
        setTtsState('idle');
      } catch (error) {
        console.error("Failed to load Piper voice:", error);
      }
    };

    loadVoice();
  }, [voiceId]);
  
  const speak = useCallback(async (text: string) => {
    if (!text || !loadedVoiceRef.current || ttsState !== 'idle') return;

    // Create or resume AudioContext on user gesture.
    if (!audioContextRef.current) {
        audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
    if (audioContextRef.current.state === 'suspended') {
      await audioContextRef.current.resume();
    }
    
    // Stop any currently playing audio from this hook.
    if (sourceNodeRef.current) {
        sourceNodeRef.current.onended = null;
        sourceNodeRef.current.stop();
        sourceNodeRef.current = null;
    }

    setTtsState('playing');
    try {
      const { voice, sampleRate } = loadedVoiceRef.current;
      const audioData = await voice.synthesize(text);
      
      if (!audioContextRef.current || audioData.length === 0) {
        setTtsState('idle');
        return;
      }
      
      const audioContext = audioContextRef.current;
      const buffer = audioContext.createBuffer(1, audioData.length, sampleRate);
      buffer.getChannelData(0).set(audioData);

      const sourceNode = audioContext.createBufferSource();
      sourceNode.buffer = buffer;
      sourceNode.connect(audioContext.destination);
      sourceNode.onended = () => {
        if (sourceNodeRef.current === sourceNode) {
            setTtsState('idle');
            sourceNodeRef.current = null;
        }
      };
      sourceNode.start(0);
      sourceNodeRef.current = sourceNode;

    } catch (error) {
      console.error("Error synthesizing audio:", error);
      setTtsState('idle');
    }
  }, [ttsState]);

  const pause = () => {
    if (audioContextRef.current && ttsState === 'playing') {
      audioContextRef.current.suspend();
      setTtsState('paused');
    }
  };

  const resume = () => {
    if (audioContextRef.current && ttsState === 'paused') {
      audioContextRef.current.resume();
      setTtsState('playing');
    }
  };

  const cancel = useCallback(() => {
    if (sourceNodeRef.current) {
      sourceNodeRef.current.onended = null;
      sourceNodeRef.current.stop();
      sourceNodeRef.current = null;
    }
    if (audioContextRef.current?.state === 'running') {
      audioContextRef.current.suspend();
    }
    setTtsState('idle');
  }, []);

  return {
    ttsState,
    speak,
    pause,
    resume,
    cancel,
  };
};
