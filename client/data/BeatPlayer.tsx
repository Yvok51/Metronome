import Beat from './Beat';
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

class BeatPlayer {
  private static readonly _audioContext = new AudioContext();

  static get audioContext(): AudioContext {
    return BeatPlayer._audioContext;
  }

  private static readonly INTERVAL_MS = 30;
  // Too big and the app will be less responsive, too small and the beats could be off
  private static readonly SCHEDULE_AHEAD_MS = 100;
  private static readonly INTERVAL_S = BeatPlayer.INTERVAL_MS / 1000;
  private static readonly SCHEDULE_AHEAD_S = BeatPlayer.SCHEDULE_AHEAD_MS / 1000;

  private _sounds?: { low: AudioBuffer; mid: AudioBuffer; high: AudioBuffer };
  private _beats: Beat[];
  private _beatInterval: number;
  private _beatIndex = 0;
  private _lastBeatTime = 0;
  private _playing = false; // timerId could be used for this, but this is more readable

  private timerId: number | undefined;

  constructor(beats: Beat[], bpm: number, sounds?: { low: AudioBuffer; mid: AudioBuffer; high: AudioBuffer }) {
    this._beats = beats;
    this._beatInterval = 60 / bpm;
    this._sounds = sounds;
  }

  setBPM(bpm: number): void {
    this._beatInterval = 60 / bpm;
  }

  setBeats(beats: Beat[]): void {
    this._beatIndex = 0;
    this._beats = beats;
  }

  setSounds(sounds: { low: AudioBuffer; mid: AudioBuffer; high: AudioBuffer }): void {
    this._sounds = sounds;
  }

  start(): void {
    if (!this._playing && this._sounds) {
      this._scheduleNextBeat(); // weird problem where the now timer did not start until the first beat was scheduled
      this.timerId = window.setInterval(() => {
        console.log('called');
        this._scheduleNextBeats();
      }, BeatPlayer.INTERVAL_MS);
      this._playing = true;
    }
  }

  stop(): void {
    this._playing = false;
    window.clearInterval(this.timerId);
    this.timerId = undefined;
  }

  private _scheduleNextBeats(): void {
    const now = this._now;
    const firstBeatTime = Math.max(now, this._lastBeatTime + this._beatInterval);
    if (BeatPlayer.SCHEDULE_AHEAD_S + now < firstBeatTime) {
      return;
    }
    const scheduleLength = now + BeatPlayer.SCHEDULE_AHEAD_S - firstBeatTime;
    const beatsToSchedule = Math.floor(scheduleLength / this._beatInterval) + 1;

    for (let i = 0; i < beatsToSchedule; i++) {
      this._scheduleNextBeat(firstBeatTime + i * this._beatInterval);
    }
  }

  private _scheduleNextBeat(): void;
  private _scheduleNextBeat(time: number): void;
  private _scheduleNextBeat(time?: number): void {
    const beat = this._beats[this._beatIndex];
    const sound = this._getSound(beat);
    if (sound) {
      if (time) {
        this._playSound(sound, time);
      } else {
        this._playSound(sound);
      }
    }
    this._beatIndex = this._nextBeatIndex();
    this._lastBeatTime = time ? time : this._now;
  }

  private get _now(): number {
    return BeatPlayer.audioContext.currentTime;
  }

  private _playSound(buffer: AudioBuffer): void;
  private _playSound(buffer: AudioBuffer, time: number): void;
  private _playSound(buffer: AudioBuffer, time?: number): void {
    const source = BeatPlayer.audioContext.createBufferSource();
    source.buffer = buffer;
    source.connect(BeatPlayer.audioContext.destination);

    if (time) {
      source.start(time);
    } else {
      source.start();
    }
  }

  private _getSound(beat: Beat): AudioBuffer | undefined {
    switch (beat.level) {
      case 0:
        return;
      case 1:
        return this._sounds ? this._sounds.low : undefined;
      case 2:
        return this._sounds ? this._sounds.mid : undefined;
      case 3:
        return this._sounds ? this._sounds.high : undefined;
      default:
        throw new Error(`Invalid beat level: ${beat.level}`);
    }
  }

  private _nextBeatIndex(): number {
    return (this._beatIndex + 1) % this._beats.length;
  }
}

export { BeatPlayer, loadSounds };
