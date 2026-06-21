import { useCallback, useEffect, useRef } from "react";
import { clockAudio } from "../../utils/clock-audio";
import type { Hours, Minutes } from "../../utils/clock-math";
import WheelColumn from "./wheel-column";
import { useTheme } from "../../theme/use-theme";

type WheelType = "hours" | "minutes";

interface MobileTimePickerProps {
  hours: Hours;
  minutes: Minutes;
  isWorking: boolean;
  isAmPm: boolean;
  onChangeTime: (hours: Hours, minutes: Minutes) => void;
}

const getWrappedHours = (currentHours: number, delta: number): Hours => {
  return (((currentHours + delta + 24) % 24) as Hours);
};

export default function MobileTimePicker({
  hours,
  minutes,
  isWorking,
  isAmPm,
  onChangeTime,
}: MobileTimePickerProps) {
  const stateRef = useRef({ hours, minutes });
  const activeWheelRef = useRef<WheelType | null>(null);

  const { themeClasses } = useTheme();
  const { containerBackground, containerBorder, textNeutral } = themeClasses;

  const CONTAINER_CLASSES = `
    relative flex items-center justify-center gap-6 rounded-2xl border p-4 backdrop-blur-md
    ${containerBackground} ${containerBorder}
  `.trim();

  const COLON_CLASSES = `
    pb-1 text-4xl font-bold select-none ${textNeutral}
  `.trim();

  useEffect(() => {
    stateRef.current = { hours, minutes };
  }, [hours, minutes]);

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

  const isPm = hours >= 12;

  const displayHoursValue = isAmPm ? (hours % 12) : hours;

  const formatAmPmHours = (val: number) => {
    const displayHour = val === 0 ? 12 : val;
    return displayHour.toString().padStart(2, "0");
  };

  const handleHoursChange = useCallback((nextHoursIndex: number, loopDelta: number) => {
    if (isAmPm) {
      let currentHours24 = stateRef.current.hours;

      if (loopDelta !== 0) {
        currentHours24 = getWrappedHours(currentHours24, loopDelta * 12);
      }

      const currentIsPm = currentHours24 >= 12;

      const targetHours = currentIsPm ? (nextHoursIndex + 12) : nextHoursIndex;
      stateRef.current.hours = targetHours as Hours;
    } else {
      stateRef.current.hours = nextHoursIndex as Hours;
    }

    clockAudio.playHourTick();
    onChangeTime(stateRef.current.hours, stateRef.current.minutes);
  }, [isAmPm, onChangeTime]);

  const handleMinutesChange = useCallback((nextMinutes: number, loopDelta: number) => {
    stateRef.current.minutes = nextMinutes as Minutes;

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
        value={displayHoursValue}
        max={isAmPm ? 12 : 24}
        inertiaCoefficient={2}
        onStartAnimating={() => handleStartAnimating("hours")}
        onStopAnimating={handleStopAnimating}
        onChange={handleHoursChange}
        formatLabel={isAmPm ? formatAmPmHours : undefined}
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

      {isAmPm && (
        <span
          className={`
            absolute top-3 left-1/2 -translate-x-1/2
            text-xl font-bold tracking-wider select-none transition-colors duration-300
            ${textNeutral}
          `.trim()}
        >
          {isPm ? "PM" : "AM"}
        </span>
      )}
    </section>
  );
}
