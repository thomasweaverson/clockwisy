import { useEffect, useRef, useCallback } from "react";
import { clockAudio } from "../../utils/clock-audio";
import type { Hours, Minutes } from "../../utils/clock-math";
import WheelColumn from "./wheel-column";

type WheelType = "hours" | "minutes";

interface MobileTimePickerProps {
  hours: Hours;
  minutes: Minutes;
  isWorking: boolean;
  onChangeTime: (hours: Hours, minutes: Minutes) => void;
}

// --- Tailwind Class Styles to keep JSX clean and scannable ---
const CONTAINER_CLASSES = `
  flex items-center justify-center gap-4 rounded-3xl border p-4 backdrop-blur-md
  border-slate-200/60 bg-white/60 shadow-xl shadow-slate-200/40
  dark:border-slate-700/40 dark:bg-slate-900/40 dark:shadow-none
`.trim();

const COLON_CLASSES = `
  pb-1 text-4xl font-bold text-slate-400 dark:text-slate-600 select-none
`.trim();

/**
 * Pure helper function to wrap hours correctly around the 24-hour cycle
 */
const getWrappedHours = (currentHours: number, delta: number): Hours => {
  return (((currentHours + delta + 24) % 24) as Hours);
};

export default function MobileTimePicker({
  hours,
  minutes,
  isWorking,
  onChangeTime,
}: MobileTimePickerProps) {
  // Shared ref state to bypass stale closures during high-velocity physics animations
  const stateRef = useRef({ hours, minutes });
  const activeWheelRef = useRef<WheelType | null>(null);

  // Keep mutational refs perfectly synced with incoming synchronized system time
  useEffect(() => {
    stateRef.current = { hours, minutes };
  }, [hours, minutes]);

  // --- Wheel Animation Lock Handlers ---
  const handleStartAnimating = useCallback((wheel: WheelType): boolean => {
    if (activeWheelRef.current === null || activeWheelRef.current === wheel) {
      activeWheelRef.current = wheel;
      return true;
    }
    return false;
  }, []);

  const handleStopAnimating = useCallback(() => {
    activeWheelRef.current = null;
  }, []);

  // --- Wheel Value Change Handlers ---
  const handleHoursChange = useCallback((nextHours: number) => {
    stateRef.current.hours = nextHours as Hours;
    clockAudio.playHourTick();
    onChangeTime(stateRef.current.hours, stateRef.current.minutes);
  }, [onChangeTime]);

  const handleMinutesChange = useCallback((nextMinutes: number, loopDelta: number) => {
    stateRef.current.minutes = nextMinutes as Minutes;

    // Handle hour overflow when minutes cross the boundary via inertia or dragging
    if (loopDelta !== 0) {
      stateRef.current.hours = getWrappedHours(stateRef.current.hours, loopDelta);
      clockAudio.playHourTick();
    }

    onChangeTime(stateRef.current.hours, stateRef.current.minutes);
  }, [onChangeTime]);

  return (
    <section className={CONTAINER_CLASSES}>
      {/* Hours Column */}
      <WheelColumn
        value={hours}
        max={24}
        inertiaCoefficient={2}
        onStartAnimating={() => handleStartAnimating("hours")}
        onStopAnimating={handleStopAnimating}
        onChange={handleHoursChange}
      />

      {/* Flashing Time Divider */}
      <div className={`${COLON_CLASSES} ${isWorking ? "animate-clock-blink" : ""}`}>
        :
      </div>

      {/* Minutes Column */}
      <WheelColumn
        value={minutes}
        max={60}
        inertiaCoefficient={8}
        onStartAnimating={() => handleStartAnimating("minutes")}
        onStopAnimating={handleStopAnimating}
        onChange={handleMinutesChange}
      />
    </section>
  );
}
