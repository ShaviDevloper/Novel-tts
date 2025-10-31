import React from 'react';
import { VOICES } from '../constants';
import type { Voice } from '../types';

interface VoiceSelectorProps {
  selectedVoiceId: string;
  onVoiceChange: (voiceId: string) => void;
  disabled: boolean;
}

const VoiceSelector: React.FC<VoiceSelectorProps> = ({ selectedVoiceId, onVoiceChange, disabled }) => {
  return (
    <div className="flex flex-col items-start w-full">
      <label htmlFor="voice-select" className="mb-2 text-sm font-medium text-gray-400">
        Select Voice
      </label>
      <select
        id="voice-select"
        value={selectedVoiceId}
        onChange={(e) => onVoiceChange(e.target.value)}
        disabled={disabled}
        className="w-full bg-gray-800 border border-gray-600 text-gray-200 rounded-lg px-4 py-2 focus:ring-2 focus:ring-sky-500 focus:border-sky-500 outline-none transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {VOICES.map((voice: Voice) => (
          <option key={voice.id} value={voice.id}>
            {voice.name}
          </option>
        ))}
      </select>
    </div>
  );
};

export default VoiceSelector;
