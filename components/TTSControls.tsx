import React from 'react';
import type { TTSState } from '../types';

interface TTSControlsProps {
  ttsState: TTSState;
  onPlay: () => void;
  onPause: () => void;
  onStop: () => void;
}

// SVG Icons
const PlayIcon = () => <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6"><path fillRule="evenodd" d="M4.5 5.653c0-1.426 1.529-2.33 2.779-1.643l11.54 6.647c1.295.742 1.295 2.545 0 3.286L7.279 20.99c-1.25.717-2.779-.217-2.779-1.643V5.653z" clipRule="evenodd" /></svg>;
const PauseIcon = () => <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6"><path fillRule="evenodd" d="M6.75 5.25a.75.75 0 00-.75.75v12a.75.75 0 00.75.75h.75a.75.75 0 00.75-.75V6a.75.75 0 00-.75-.75h-.75zm8.25-.75a.75.75 0 01.75.75v12a.75.75 0 01-.75.75h-.75a.75.75 0 01-.75-.75V6a.75.75 0 01.75-.75h.75z" clipRule="evenodd" /></svg>;
const StopIcon = () => <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6"><path fillRule="evenodd" d="M4.5 7.5a3 3 0 013-3h9a3 3 0 013 3v9a3 3 0 01-3 3h-9a3 3 0 01-3-3v-9z" clipRule="evenodd" /></svg>;
const LoadingIcon = () => <svg className="animate-spin h-6 w-6 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>;

const TTSControls: React.FC<TTSControlsProps> = ({
  ttsState, onPlay, onPause, onStop
}) => {
  const isPlaying = ttsState === 'playing';
  const isLoading = ttsState === 'loading';
  const isDisabled = isLoading || ttsState === 'idle' && false; // Future use

  return (
    <div className="w-full max-w-xs p-4 bg-gray-800/80 backdrop-blur-sm border border-gray-700 rounded-xl shadow-2xl flex justify-center items-center gap-6">
        <button
          onClick={isPlaying ? onPause : onPlay}
          className={`p-3 rounded-full transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed ${isPlaying ? 'bg-yellow-500 hover:bg-yellow-400' : 'bg-green-500 hover:bg-green-400'}`}
          aria-label={isPlaying ? 'Pause' : 'Play'}
          disabled={isLoading}
        >
          {isLoading ? <LoadingIcon /> : (isPlaying ? <PauseIcon /> : <PlayIcon />)}
        </button>
        <button
          onClick={onStop}
          className="p-3 rounded-full bg-red-500 hover:bg-red-400 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          aria-label="Stop"
          disabled={isLoading || ttsState === 'idle'}
        >
          <StopIcon />
        </button>
    </div>
  );
};

export default TTSControls;
