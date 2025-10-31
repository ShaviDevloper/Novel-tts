import type { Voice } from './types';

const MODEL_BASE_URL = 'https://huggingface.co/rhasspy/piper-voices/resolve/main/';

export const VOICES: Voice[] = [
  {
    id: 'en_US-lessac-medium',
    name: 'Lessac (en-US, Male)',
    url: `${MODEL_BASE_URL}en/en_US/lessac/medium/en_US-lessac-medium.onnx`,
    configUrl: `${MODEL_BASE_URL}en/en_US/lessac/medium/en_US-lessac-medium.onnx.json`,
  },
  {
    id: 'en_GB-alan-medium',
    name: 'Alan (en-GB, Male)',
    url: `${MODEL_BASE_URL}en/en_GB/alan/medium/en_GB-alan-medium.onnx`,
    configUrl: `${MODEL_BASE_URL}en/en_GB/alan/medium/en_GB-alan-medium.onnx.json`,
  },
  {
    id: 'en_US-amy-medium',
    name: 'Amy (en-US, Female)',
    url: `${MODEL_BASE_URL}en/en_US/amy/medium/en_US-amy-medium.onnx`,
    configUrl: `${MODEL_BASE_URL}en/en_US/amy/medium/en_US-amy-medium.onnx.json`,
  },
];
