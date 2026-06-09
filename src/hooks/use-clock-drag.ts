import { useState, useRef, type RefObject } from "react";
import { clockAudio } from "../utils/clock-audio";
import {
  calculate24Hour,
  degreesToHours,
  degreesToHoveredHour,
  degreesToMinutes,
  getAngleFromCoordinates,
  hoursToDegrees,
  minutesToDegrees
} from "../utils/clock-math";

type ActiveHand = "hour" | "minute" | null;

type UseClockDragProps = {
  hours: number;
  minutes: number;
  svgRef: RefObject<SVGSVGElement | null>;
  isHoveringHand: boolean;
  setHoveredHour: (hour: number | null) => void;
  onChangeTime: (hours: number, minutes: number) => void;
};

export const useClockDrag = ({
  hours,
  minutes,
  svgRef,
  isHoveringHand,
  setHoveredHour,
  onChangeTime,
}: UseClockDragProps) => {
  const [activeHand, setActiveHand] = useState<ActiveHand>(null);
  const [localHourDeg, setLocalHourDeg] = useState<number | null>(null);

  // Флаг для определения, было ли движение (чтобы предотвратить ложный клик после драга)
  const wasDraggingRef = useRef(false);

  const isPm = hours >= 12;
  const minuteDeg = minutesToDegrees(minutes);
  const hourDeg = localHourDeg !== null ? localHourDeg : hoursToDegrees(hours, minutes, true);

  const animateHourHandTo = (targetDeg: number, currentDeg: number, onComplete?: () => void) => {
    let diff = targetDeg - currentDeg;
    if (diff > 180) { diff -= 360; }
    if (diff < -180) { diff += 360; }

    const duration = 250;
    const startTime = performance.now();

    const step = (now: number) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const ease = 1 - Math.pow(1 - progress, 3);
      const nextDeg = currentDeg + diff * ease;

      setLocalHourDeg(nextDeg);

      if (progress < 1) {
        requestAnimationFrame(step);
      } else {
        clockAudio.playClick();
        if (onComplete) { onComplete(); }
        setLocalHourDeg(null);
      }
    };

    requestAnimationFrame(step);
  };

  const handleSvgMouseMove = (e: React.PointerEvent<SVGSVGElement>) => {
    // На мобильных устройствах (touch) ховер-эффекты циферблата не нужны
    if (e.pointerType === "touch") {
      setHoveredHour(null);
      return;
    }

    if (activeHand || isHoveringHand || !svgRef.current) {
      setHoveredHour(null);
      return;
    }
    const rect = svgRef.current.getBoundingClientRect();
    const currentAngle = getAngleFromCoordinates(e.clientX, e.clientY, rect);
    setHoveredHour(degreesToHoveredHour(currentAngle));
  };

  const handleSvgClick = (e: React.MouseEvent<SVGSVGElement>) => {
    // Если пользователь только что отпустил палец после перетаскивания стрелки — игнорируем клик
    if (wasDraggingRef.current) { return; }
    if (activeHand || isHoveringHand || !svgRef.current) { return; }

    const rect = svgRef.current.getBoundingClientRect();
    // Извлекаем координаты прямо из переданного события, а не из window.event
    const currentAngle = getAngleFromCoordinates(e.clientX, e.clientY, rect);
    const clickedHour = degreesToHoveredHour(currentAngle);

    const target24Hour = calculate24Hour(clickedHour, hours);
    const currentHourDeg = hoursToDegrees(hours, minutes, true);
    const targetHourDeg = hoursToDegrees(target24Hour, minutes, true);

    if (Math.abs(currentHourDeg - targetHourDeg) < 0.1) { return; }

    setLocalHourDeg(currentHourDeg);
    animateHourHandTo(targetHourDeg, currentHourDeg, () => {
      onChangeTime(target24Hour, minutes);
    });
  };

  const handlePointerDown = (hand: "hour" | "minute", e: React.PointerEvent<SVGElement>) => {
    e.stopPropagation();
    e.currentTarget.setPointerCapture(e.pointerId);
    setActiveHand(hand);
    setHoveredHour(null);
    wasDraggingRef.current = false; // Сбрасываем флаг при начале нового касания
    if (hand === "hour") { setLocalHourDeg(hoursToDegrees(hours, minutes, true)); }
  };

  const handlePointerMove = (e: React.PointerEvent<SVGElement>) => {
    if (!activeHand || !svgRef.current) { return; }

    // Если палец/курсор сдвинулся, фиксируем, что происходит процесс перетаскивания (драг)
    wasDraggingRef.current = true;

    const rect = svgRef.current.getBoundingClientRect();
    const currentAngle = getAngleFromCoordinates(e.clientX, e.clientY, rect);

    if (activeHand === "minute") {
      const newMinutes = degreesToMinutes(currentAngle);
      let updatedHours = hours;
      if (minutes >= 45 && newMinutes <= 15) { updatedHours = (hours + 1) % 24; }
      else if (minutes <= 15 && newMinutes >= 45) { updatedHours = (hours - 1 + 24) % 24; }

      if (newMinutes !== minutes) {
        if (updatedHours !== hours) { clockAudio.playHourTick(); }
        else { clockAudio.playTick(); }
      }
      onChangeTime(updatedHours, newMinutes);
    } else if (activeHand === "hour") {
      let updatedHours = hours;
      if (localHourDeg !== null) {
        const prevAngle = localHourDeg;
        if (prevAngle >= 330 && currentAngle <= 30) { updatedHours = isPm ? (hours - 12) : (hours + 12); }
        else if (prevAngle <= 30 && currentAngle >= 330) { updatedHours = isPm ? (hours - 12) : (hours + 12); }
      }
      setLocalHourDeg(currentAngle);

      const base12Hour = degreesToHours(currentAngle);
      if (base12Hour !== (hours % 12)) {
        clockAudio.playHourTick();
      }

      const currentIsPm = updatedHours >= 12;
      let final24Hour = currentIsPm ? (base12Hour === 12 ? 12 : base12Hour + 12) : (base12Hour === 12 ? 0 : base12Hour);
      final24Hour = (final24Hour + 24) % 24;

      onChangeTime(final24Hour, minutes);
    }
  };

  const handlePointerUp = (e: React.PointerEvent<SVGElement>) => {
    if (!activeHand) { return; }
    e.currentTarget.releasePointerCapture(e.pointerId);

    if (activeHand === "hour" && localHourDeg !== null) {
      const targetHourDeg = hoursToDegrees(hours, minutes, true);
      animateHourHandTo(targetHourDeg, localHourDeg);
    } else if (activeHand === "minute") {
      clockAudio.playClick();
    }

    setActiveHand(null);

    // Сбрасываем флаг с минимальной задержкой, чтобы последующее событие onClick успело его считать и заблокироваться
    setTimeout(() => {
      wasDraggingRef.current = false;
    }, 50);
  };

  return {
    hourDeg,
    minuteDeg,
    activeHand,
    handleSvgMouseMove,
    handleSvgClick,
    handlePointerDown,
    handlePointerMove,
    handlePointerUp,
  };
};
