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

  // Timestamps for tracking completion of sounds (in AudioContext seconds)
  private nextTickAllowTime: number = 0;
  private nextHourTickAllowTime: number = 0;

  // Duration of sounds in seconds (must match the sum of attack + decay + threshold)
  private readonly TICK_DURATION = 0.05;       // the tick itself is about 16 ms. But to make it sound distinct, I set it to 50 ms (15 + 1 + 34)
  private readonly HOUR_TICK_DURATION = 0.072;  // the hour tick is approximately 38 ms, but to make it sound distinct, I set it to 72 ms (38 + 1 + 34)

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
    // Ensure context is ready if audio is active, but proceed for haptics regardless
    if (!this.isMuted) { this.init(); }

    // Use a fallback clock source if AudioContext is unavailable/muted to maintain haptic timing consistency
    const now = this.context && !this.isMuted ? this.context.currentTime : performance.now() / 1000;

    // IF THE PREVIOUS TICK HAS NOT YET PLAYED, WE IGNORE THE NEXT ONE
    if (now < this.nextTickAllowTime) { return; }

    // Set the time when the next tick is allowed
    this.nextTickAllowTime = now + this.TICK_DURATION;

    this.synthesize({
      type: "triangle",
      startFreq: 1800,
      endFreq: 400,
      pitchDropDuration: 0.008,
      attack: 0.001,
      decay: 0.015,
      volume: 0.12,
      vibratePattern: 7 // Ultra-short 7ms impulse for a crisp minute tick
    }, now);
  }

  // 2. Tight click of the gear (Clock) with protection against layering
  public playHourTick() {
    if (!this.isMuted) { this.init(); }

    const now = this.context && !this.isMuted ? this.context.currentTime : performance.now() / 1000;

    // IF THE PREVIOUS CLOCK CLICK HAS NOT YET PLAYED, IGNORE IT
    if (now < this.nextHourTickAllowTime) { return; }

    // Set the blocking time
    this.nextHourTickAllowTime = now + this.HOUR_TICK_DURATION;

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
    }, now);

    // Soft sub-click for volume
    this.synthesize({
      type: "sine",
      startFreq: 180,
      endFreq: 40,
      pitchDropDuration: 0.02,
      attack: 0.003,
      decay: 0.035,
      volume: 0.3
    }, now);
  }

  // 3. Soft final click of fixation (not limited, as it is called rarely)
  public playClick() {
    if (!this.isMuted) { this.init(); }

    const now = this.context && !this.isMuted ? this.context.currentTime : performance.now() / 1000;

    this.synthesize({
      type: "sine",
      startFreq: 220,
      endFreq: 80,
      pitchDropDuration: 0.04,
      attack: 0.002,
      decay: 0.06,
      volume: 0.3,
      vibratePattern: [10, 10, 15] // Double tap pattern: 10ms vibe, 10ms pause, 15ms vibe
    }, now);

    this.synthesize({
      type: "triangle",
      startFreq: 1200,
      endFreq: 300,
      pitchDropDuration: 0.015,
      attack: 0.001,
      decay: 0.02,
      volume: 0.15
    }, now);
  }
}

export const clockAudio = new ClockAudioEngine();
