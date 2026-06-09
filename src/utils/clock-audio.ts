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
};

class ClockAudioEngine {
  private context: AudioContext | null = null;
  private isMuted: boolean = true;

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

  // LOW-LEVEL SYNTHESIZER
  private synthesize(params: SynthParams, startTime: number) {
    try {
      if (!this.context) { return; }

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
    if (this.isMuted) { return; }
    this.init();
    if (!this.context) { return; }

    const now = this.context.currentTime;

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
      volume: 0.12
    }, now);
  }

  // 2. Tight click of the gear (Clock) with protection against layering
  public playHourTick() {
    if (this.isMuted) { return; }
    this.init();
    if (!this.context) { return; }

    const now = this.context.currentTime;

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
      volume: 0.35
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
    if (this.isMuted) { return; }
    this.init();
    if (!this.context) { return; }

    const now = this.context.currentTime;

    this.synthesize({
      type: "sine",
      startFreq: 220,
      endFreq: 80,
      pitchDropDuration: 0.04,
      attack: 0.002,
      decay: 0.06,
      volume: 0.3
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
