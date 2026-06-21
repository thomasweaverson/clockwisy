export type OscillatorShape = "sine" | "square" | "sawtooth" | "triangle";

export type SynthParams = {
  type: OscillatorShape;
  startFreq: number;
  endFreq?: number;
  pitchDropDuration?: number;
  attack?: number;
  decay?: number;
  volume?: number;
  detune?: number;
  vibratePattern?: number | number[]; // Vibration pattern tied to the specific synth layer
};

class ClockAudioEngine {
  private context: AudioContext | null = null;
  private isMuted: boolean = true;
  private isVibrationEnabled: boolean = true;

  // Timestamps for tracking completion based on performance.now() in milliseconds
  private nextTickAllowTime: number = 0;
  private nextHourTickAllowTime: number = 0;

  // Duration of sounds converted to milliseconds for unified performance.now() tracking
  private readonly TICK_DURATION_MS = 50;
  private readonly HOUR_TICK_DURATION_MS = 72;

  private init() {
    if (!this.context) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      this.context = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
    if (this.context.state === "suspended") {
      this.context.resume();
    }
  }

  public setMute(muted: boolean) {
    this.isMuted = muted;
    if (!muted) { this.init(); }
  }

  public getMuted(): boolean {
    return this.isMuted;
  }

  public setVibration(enabled: boolean) {
    this.isVibrationEnabled = enabled;
  }

  public getVibration(): boolean {
    return this.isVibrationEnabled && typeof navigator !== "undefined" && !!navigator.vibrate;
  }

  private triggerVibration(pattern?: number | number[]) {
    if (!pattern || !this.isVibrationEnabled) { return; }

    try {
      // Safe check for SSR environments and browser support (silently skips iOS Safari)
      if (typeof navigator !== "undefined" && navigator.vibrate) {
        navigator.vibrate(pattern);
      }
    } catch (e) {
      console.warn("Vibration failed:", e);
    }
  }

  // LOW-LEVEL SYNTHESIZER WITH INDEPENDENT HAPTIC CONTROL
  private synthesize(params: SynthParams, startTime: number) {
    // Trigger haptic feedback independently of the audio mute state
    if (params.vibratePattern) {
      this.triggerVibration(params.vibratePattern);
    }

    // Skip audio synthesis if the engine is muted or context is not available
    if (this.isMuted || !this.context) { return; }

    try {
      const osc = this.context.createOscillator();
      const gainNode = this.context.createGain();

      const {
        type = "sine",
        startFreq,
        endFreq,
        pitchDropDuration = 0.01,
        attack = 0.002,
        decay = 0.05,
        volume = 0.2,
        detune = 0
      } = params;

      osc.type = type;
      osc.frequency.setValueAtTime(startFreq, startTime);
      if (detune) { osc.detune.setValueAtTime(detune, startTime); }

      if (endFreq) {
        osc.frequency.exponentialRampToValueAtTime(endFreq, startTime + pitchDropDuration);
      }

      gainNode.gain.setValueAtTime(0.0, startTime);
      gainNode.gain.linearRampToValueAtTime(volume, startTime + attack);
      gainNode.gain.exponentialRampToValueAtTime(0.001, startTime + attack + decay);

      osc.connect(gainNode);
      gainNode.connect(this.context.destination);

      osc.start(startTime);
      osc.stop(startTime + attack + decay + 0.01);
    } catch (e) {
      console.warn("Synthesis error:", e);
    }
  }

  // 1. Thin acoustic "tick" (Minutes) with protection against layering
  public playTick() {
    if (!this.isMuted) { this.init(); }

    // Use unified monotonic clock (milliseconds) for rate-limiting to prevent timeline desync
    const nowMs = performance.now();

    // IF THE PREVIOUS TICK HAS NOT YET PLAYED, WE IGNORE THE NEXT ONE
    if (nowMs < this.nextTickAllowTime) { return; }

    // Set the time when the next tick is allowed
    this.nextTickAllowTime = nowMs + this.TICK_DURATION_MS;

    const audioStartTime = this.context ? this.context.currentTime : 0;

    this.synthesize({
      type: "triangle",
      startFreq: 1800,
      endFreq: 400,
      pitchDropDuration: 0.008,
      attack: 0.001,
      decay: 0.015,
      volume: 0.12,
      vibratePattern: 7 // Ultra-short 7ms impulse for a crisp minute tick
    }, audioStartTime);
  }

  // 2. Tight click of the gear (Clock) with protection against layering
  public playHourTick() {
    if (!this.isMuted) { this.init(); }

    const nowMs = performance.now();

    // IF THE PREVIOUS CLOCK CLICK HAS NOT YET PLAYED, IGNORE IT
    if (nowMs < this.nextHourTickAllowTime) { return; }

    // Set the blocking time
    this.nextHourTickAllowTime = nowMs + this.HOUR_TICK_DURATION_MS;

    const audioStartTime = this.context ? this.context.currentTime : 0;

    // Basic dense tone
    this.synthesize({
      type: "triangle",
      startFreq: 340,
      endFreq: 60,
      pitchDropDuration: 0.012,
      attack: 0.002,
      decay: 0.025,
      volume: 0.35,
      vibratePattern: 15 // Slightly longer 15ms vibration for a weightier hour tick
    }, audioStartTime);

    // Soft sub-click for volume
    this.synthesize({
      type: "sine",
      startFreq: 180,
      endFreq: 40,
      pitchDropDuration: 0.02,
      attack: 0.003,
      decay: 0.035,
      volume: 0.3
    }, audioStartTime);
  }

  // 3. Soft final click of fixation (not limited, as it is called rarely)
  public playClick() {
    if (!this.isMuted) { this.init(); }

    const audioStartTime = this.context ? this.context.currentTime : 0;

    this.synthesize({
      type: "sine",
      startFreq: 220,
      endFreq: 80,
      pitchDropDuration: 0.04,
      attack: 0.002,
      decay: 0.06,
      volume: 0.3,
      vibratePattern: [10, 10, 15] // Double tap pattern: 10ms vibe, 10ms pause, 15ms vibe
    }, audioStartTime);

    this.synthesize({
      type: "triangle",
      startFreq: 1200,
      endFreq: 300,
      pitchDropDuration: 0.015,
      attack: 0.001,
      decay: 0.02,
      volume: 0.15
    }, audioStartTime);
  }
}

export const clockAudio = new ClockAudioEngine();
