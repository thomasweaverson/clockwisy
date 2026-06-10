import { useRef, useState } from "react";
import { type ClockStyle } from "../constants/clock-variants";
import { useClockDrag } from "../hooks/use-clock-drag";
import { useTheme } from "../theme/use-theme";
import type { Hours, Minutes } from "../utils/clock-math";
import ClockFace from "./clock-face";
import ClockHands from "./clock-hands";

interface AnalogClockProps {
  hours: Hours;
  minutes: Minutes;
  currentStyle: ClockStyle;
  onChangeTime: (hours: Hours, minutes: Minutes) => void;
}

export default function AnalogClock({
  hours,
  minutes,
  currentStyle,
  onChangeTime,
}: AnalogClockProps) {
  const svgRef = useRef<SVGSVGElement>(null);
  const [hoveredHour, setHoveredHour] = useState<number | null>(null);
  const [isHoveringHand, setIsHoveringHand] = useState(false);

  const { themeClasses, isPm } = useTheme();

  const { faceBackground } = themeClasses;

  const {
    hourDeg,
    minuteDeg,
    activeHand,
    handleSvgMouseMove,
    handleSvgClick,
    handlePointerDown,
    handlePointerMove,
    handlePointerUp,
  } = useClockDrag({
    hours,
    minutes,
    svgRef,
    isHoveringHand,
    setHoveredHour,
    onChangeTime: onChangeTime as (hours: number, minutes: number) => void,
  });

  const handleSvgMouseLeave = () => {
    setHoveredHour(null);
  };

  return (
    <div className="relative flex items-center justify-center p-2 select-none">
      <svg
        ref={svgRef}
        width="310"
        height="310"
        viewBox="0 0 300 300"
        onClick={handleSvgClick}
        onPointerMove={(e) => {
          handleSvgMouseMove(e);
          if (activeHand) {
            handlePointerMove(e);
          }
        }}
        onMouseLeave={handleSvgMouseLeave}
        onPointerUp={handlePointerUp}
        className={`
          rounded-full border-4 border-slate-400 touch-none
          transition-colors duration-700 cursor-pointer
          ${faceBackground}
        `.trim()}
      >

        <ClockFace currentStyle={currentStyle} hoveredHour={hoveredHour} isPm={isPm} />

        <ClockHands
          hourDeg={hourDeg}
          minuteDeg={minuteDeg}
          activeHand={activeHand}
          isPm={isPm}
          setIsHoveringHand={setIsHoveringHand}
          handlePointerDown={handlePointerDown}
          handlePointerMove={handlePointerMove}
          handlePointerUp={handlePointerUp}
        />
      </svg>
    </div>
  );
}
