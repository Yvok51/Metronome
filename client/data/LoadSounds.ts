import beatLowURL from './beatLow.wav';
import beatMidURL from './beatMid.wav';
import beatHighURL from './beatHigh.wav';

async function loadSound(url: string, audioContext: AudioContext, abortSignal?: AbortSignal): Promise<AudioBuffer> {
  const response = await fetch(url, { signal: abortSignal });
  const arrayBuffer = await response.arrayBuffer();
  const audioBuffer = await audioContext.decodeAudioData(arrayBuffer);
  return audioBuffer;
}

async function loadSounds(
  audioContext: AudioContext,
  abortSignal?: AbortSignal,
): Promise<{ low: AudioBuffer; mid: AudioBuffer; high: AudioBuffer }> {
  const sounds = await Promise.all([
    loadSound(beatLowURL, audioContext, abortSignal),
    loadSound(beatMidURL, audioContext, abortSignal),
    loadSound(beatHighURL, audioContext, abortSignal),
  ]);

  return { low: sounds[0], mid: sounds[1], high: sounds[2] };
}

export default loadSounds;