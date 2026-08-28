export class GameAudio {
  constructor() {
    this.context = null;
    this.muted = false;
  }

  async unlock() {
    if (this.muted) return;
    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    if (!AudioContextClass) return;
    if (!this.context) this.context = new AudioContextClass();
    if (this.context.state === "suspended") await this.context.resume();
  }

  setMuted(muted) {
    this.muted = muted;
    if (muted) this.context?.suspend().catch(() => {});
    else this.unlock().catch(() => {});
  }

  toggleMuted() {
    this.setMuted(!this.muted);
    return this.muted;
  }

  handleGameEvent(event) {
    if (this.muted || !this.context) return;
    if (event.type === "launch" || event.type === "what-if") this.boing(event.type === "what-if" ? 1.14 : 1);
    if (event.type === "impact") this.impact(event.speed, event.surface);
    if (event.type === "success") this.success();
    if (event.type === "failure") this.failure();
    if (event.type === "move-complete") this.pop(240, 0.07);
  }

  tone({ frequency, endFrequency = frequency, duration, type = "sine", volume = 0.12, delay = 0 }) {
    if (!this.context || this.muted) return;
    const now = this.context.currentTime + delay;
    const oscillator = this.context.createOscillator();
    const gain = this.context.createGain();
    oscillator.type = type;
    oscillator.frequency.setValueAtTime(Math.max(20, frequency), now);
    oscillator.frequency.exponentialRampToValueAtTime(Math.max(20, endFrequency), now + duration);
    gain.gain.setValueAtTime(0.0001, now);
    gain.gain.exponentialRampToValueAtTime(volume, now + Math.min(0.018, duration * 0.2));
    gain.gain.exponentialRampToValueAtTime(0.0001, now + duration);
    oscillator.connect(gain);
    gain.connect(this.context.destination);
    oscillator.start(now);
    oscillator.stop(now + duration + 0.02);
  }

  noise(duration = 0.08, volume = 0.08, delay = 0) {
    if (!this.context || this.muted) return;
    const sampleCount = Math.ceil(this.context.sampleRate * duration);
    const buffer = this.context.createBuffer(1, sampleCount, this.context.sampleRate);
    const channel = buffer.getChannelData(0);
    for (let index = 0; index < sampleCount; index += 1) {
      channel[index] = (Math.random() * 2 - 1) * Math.pow(1 - index / sampleCount, 1.8);
    }
    const source = this.context.createBufferSource();
    const gain = this.context.createGain();
    source.buffer = buffer;
    gain.gain.value = volume;
    source.connect(gain);
    gain.connect(this.context.destination);
    source.start(this.context.currentTime + delay);
  }

  boing(pitchScale = 1) {
    this.tone({ frequency: 155 * pitchScale, endFrequency: 430 * pitchScale, duration: 0.18, type: "triangle", volume: 0.14 });
    this.tone({ frequency: 310 * pitchScale, endFrequency: 115 * pitchScale, duration: 0.32, type: "sine", volume: 0.11, delay: 0.06 });
  }

  impact(speed = 300, surface = "ground") {
    const amount = Math.min(1, Math.max(0.25, speed / 800));
    const base = surface === "trampoline" ? 220 : surface === "wall" ? 82 : 115;
    this.tone({ frequency: base, endFrequency: base * 0.48, duration: 0.11 + amount * 0.08, type: "square", volume: 0.035 + amount * 0.07 });
    this.noise(0.045 + amount * 0.055, 0.03 + amount * 0.07);
  }

  pop(frequency, duration) {
    this.tone({ frequency, endFrequency: frequency * 1.8, duration, type: "triangle", volume: 0.08 });
  }

  success() {
    [0, 0.09, 0.18, 0.31].forEach((delay, index) => {
      const notes = [392, 523.25, 659.25, 783.99];
      this.tone({ frequency: notes[index], endFrequency: notes[index] * 1.02, duration: 0.26, type: "triangle", volume: 0.085, delay });
    });
    this.noise(0.22, 0.035, 0.16);
  }

  failure() {
    this.tone({ frequency: 210, endFrequency: 74, duration: 0.48, type: "sawtooth", volume: 0.045 });
    this.tone({ frequency: 123, endFrequency: 59, duration: 0.42, type: "triangle", volume: 0.07, delay: 0.08 });
  }
}
