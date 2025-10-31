import React, { useState, useEffect } from 'react';
import TTSControls from './components/TTSControls';
import VoiceSelector from './components/VoiceSelector';
import { useTTS } from './hooks/useTTS';
import type { TTSState } from './types';
import { VOICES } from './constants';

const App: React.FC = () => {
  const [chapterContent, setChapterContent] = useState<string>(
    `Leylin Farlier surveyed the bubbling cauldron with an impassive gaze. The pungent aroma of crushed Ghost-Patterned Mushrooms and powdered Iron-Knight bones filled his laboratory, a scent that would make lesser apprentices retch. To him, it was the smell of progress. His A.I. Chip, a remnant of his past life in a world of technology, processed the potion's energy fluctuations with cold, hard data. "Analysis complete," a monotone voice echoed in his mind. "Probability of successful concoction: 97.8%. Minor fluctuations detected in the mana matrix. Recommend adjusting heat by 3.2 degrees." He made the minute adjustment, his movements precise and economical. In this world of sword and sorcery, knowledge was power, but the scientific method he brought from his past was the ultimate advantage. Every potion, every spell, was an experiment to be perfected.`
  );
  const [selectedVoiceId, setSelectedVoiceId] = useState<string>(VOICES[0].id);

  const {
    speak,
    cancel,
    pause,
    resume,
    ttsState,
  } = useTTS(selectedVoiceId);
  
  useEffect(() => {
    const overlay = document.getElementById('loading-overlay');
    if (overlay) {
      if (ttsState === 'loading') {
        overlay.style.display = 'flex';
        overlay.style.opacity = '1';
      } else {
        overlay.style.opacity = '0';
        setTimeout(() => {
          overlay.style.display = 'none';
        }, 300);
      }
    }
  }, [ttsState]);

  const handlePlay = () => {
    if (ttsState === 'paused') {
      resume();
    } else if (chapterContent && ttsState === 'idle') {
      speak(chapterContent);
    }
  };

  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    if (ttsState === 'playing' || ttsState === 'paused') {
      cancel();
    }
    setChapterContent(e.target.value);
  }
  
  const handleVoiceChange = (voiceId: string) => {
    if (ttsState === 'playing' || ttsState === 'paused') {
      cancel();
    }
    setSelectedVoiceId(voiceId);
  }

  return (
    <div className="min-h-screen bg-gray-900 text-gray-200 flex flex-col items-center p-4 sm:p-8 font-sans">
      <div className="w-full max-w-3xl text-center">
        <h1 className="text-4xl sm:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-sky-400 to-blue-500">
          Novel TTS Player
        </h1>
        <p className="mt-4 text-lg text-gray-400">
          Paste your novel chapter below. This app uses the high-quality Piper TTS engine directly in your browser.
        </p>
      </div>
      
      <div className="w-full max-w-3xl mt-8">
        <VoiceSelector 
          selectedVoiceId={selectedVoiceId}
          onVoiceChange={handleVoiceChange}
          disabled={ttsState !== 'idle'}
        />
      </div>

      <main className="w-full max-w-3xl mt-4 flex-grow flex flex-col">
        <textarea
          value={chapterContent}
          onChange={handleTextChange}
          placeholder="Paste your chapter text here..."
          className="flex-grow w-full bg-gray-800/50 border border-gray-600 text-gray-300 rounded-lg p-6 focus:ring-2 focus:ring-sky-500 focus:border-sky-500 outline-none transition-all duration-300 resize-none min-h-[50vh] sm:min-h-[40vh]"
          aria-label="Novel Chapter Content"
          disabled={ttsState === 'loading'}
        />
      </main>

      <footer className="sticky bottom-0 w-full flex justify-center p-4 mt-4">
          <TTSControls
              ttsState={ttsState}
              onPlay={handlePlay}
              onPause={pause}
              onStop={cancel}
          />
      </footer>
    </div>
  );
};

export default App;
