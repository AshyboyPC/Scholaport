type CueNote = {
  frequency: number;
  offset: number;
  duration: number;
  gain: number;
};

export type AppSoundCue = "save" | "complete" | "generate" | "warning" | "remove" | "copy";

function soundEffectsEnabled() {
  if (typeof document === "undefined") return false;
  return document.documentElement.dataset.soundEffects !== "false";
}

function playCue(notes: CueNote[], duration: number, volume: number) {
  if (typeof window === "undefined" || !soundEffectsEnabled()) return;
  const AudioContextClass = window.AudioContext;
  if (!AudioContextClass) return;

  const context = new AudioContextClass();
  const start = context.currentTime + 0.02;
  const master = context.createGain();
  master.gain.setValueAtTime(0.0001, start);
  master.gain.exponentialRampToValueAtTime(volume, start + 0.025);
  master.gain.exponentialRampToValueAtTime(0.0001, start + duration);
  master.connect(context.destination);

  notes.forEach((note) => {
    const oscillator = context.createOscillator();
    const gain = context.createGain();
    const noteStart = start + note.offset;
    oscillator.type = "sine";
    oscillator.frequency.setValueAtTime(note.frequency, noteStart);
    gain.gain.setValueAtTime(0.0001, noteStart);
    gain.gain.exponentialRampToValueAtTime(note.gain, noteStart + 0.018);
    gain.gain.exponentialRampToValueAtTime(0.0001, noteStart + note.duration);
    oscillator.connect(gain);
    gain.connect(master);
    oscillator.start(noteStart);
    oscillator.stop(noteStart + note.duration + 0.02);
  });

  window.setTimeout(() => void context.close(), Math.ceil((duration + 0.15) * 1000));
}

export function playRankCue(level: number) {
  playCue(
    [
      { frequency: 392, offset: 0, duration: 0.24, gain: 0.48 },
      { frequency: 523.25, offset: 0.09, duration: 0.26, gain: 0.52 },
      {
        frequency: Math.min(783.99, 587.33 + level * 18),
        offset: 0.18,
        duration: 0.34,
        gain: 0.58,
      },
    ],
    0.56,
    0.12,
  );
}

export function playAppCue(cue: AppSoundCue) {
  if (cue === "save") {
    playCue(
      [
        { frequency: 523.25, offset: 0, duration: 0.16, gain: 0.38 },
        { frequency: 659.25, offset: 0.08, duration: 0.22, gain: 0.42 },
      ],
      0.32,
      0.075,
    );
    return;
  }
  if (cue === "complete") {
    playCue(
      [
        { frequency: 440, offset: 0, duration: 0.18, gain: 0.4 },
        { frequency: 554.37, offset: 0.075, duration: 0.2, gain: 0.45 },
        { frequency: 659.25, offset: 0.15, duration: 0.28, gain: 0.5 },
      ],
      0.46,
      0.09,
    );
    return;
  }
  if (cue === "generate") {
    playCue(
      [
        { frequency: 392, offset: 0, duration: 0.16, gain: 0.3 },
        { frequency: 493.88, offset: 0.055, duration: 0.18, gain: 0.34 },
        { frequency: 587.33, offset: 0.11, duration: 0.2, gain: 0.38 },
        { frequency: 783.99, offset: 0.18, duration: 0.28, gain: 0.42 },
      ],
      0.5,
      0.08,
    );
    return;
  }
  if (cue === "warning") {
    playCue(
      [
        { frequency: 311.13, offset: 0, duration: 0.2, gain: 0.34 },
        { frequency: 261.63, offset: 0.12, duration: 0.24, gain: 0.34 },
      ],
      0.4,
      0.07,
    );
    return;
  }
  if (cue === "remove") {
    playCue(
      [
        { frequency: 349.23, offset: 0, duration: 0.12, gain: 0.3 },
        { frequency: 233.08, offset: 0.07, duration: 0.2, gain: 0.36 },
      ],
      0.31,
      0.065,
    );
    return;
  }
  playCue(
    [
      { frequency: 587.33, offset: 0, duration: 0.12, gain: 0.3 },
      { frequency: 698.46, offset: 0.065, duration: 0.16, gain: 0.34 },
    ],
    0.25,
    0.06,
  );
}

export function playSaveCue() {
  playAppCue("save");
}
