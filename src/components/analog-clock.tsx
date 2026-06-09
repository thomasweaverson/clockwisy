import { useMemo, useRef, useState } from "react";
import { type ClockStyle, CLOCK_VARIANTS } from "../constants/clock-variants";
import { useClockDrag } from "../hooks/use-clock-drag";
import { useTheme } from "../theme/use-theme";
import type { Hours, Minutes } from "../utils/clock-math";
import ClockNumber from "./clock-number";
import ClockTick from "./clock-tick";

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

  const { themeClasses, isPm, mainColor } = useTheme();

  const clockVariant = CLOCK_VARIANTS[currentStyle];
  const { faceBackground, activeArrowColor, hourArrowColor, minuteArrowColor } = themeClasses;

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

  const dialTicks = useMemo(() => Array.from({ length: 12 }, (_, i) => (i + 1) * 30), []);

  const handHoverStyles = isPm
    ? "group-hover:stroke-amber-500 group-hover:drop-shadow-[0_0_8px_rgba(251,191,36,0.7)]"
    : "group-hover:stroke-indigo-600 group-hover:drop-shadow-[0_0_8px_rgba(79,70,229,0.4)]";

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
        {/* 1. serifs */}
        {clockVariant.showTicks && (
          <g transform="translate(150, 150)">
            {dialTicks.map((angle, index) => (
              <ClockTick
                key={angle}
                angle={angle}
                tickHour={index + 1}
                hoveredHour={hoveredHour}
              />
            ))}
          </g>
        )}

        {/* 2. numbers */}
        <g transform="translate(150, 150)">
          {clockVariant.numbers.map((num, index) => (
            <ClockNumber
              key={num.text}
              num={num}
              numHour={index + 1}
              hoveredHour={hoveredHour}
              isPm={isPm}
              variant={clockVariant}
            />
          ))}
        </g>

        {/* axis */}
        <circle
          cx="150"
          cy="150"
          r="5"
          className="transition-colors duration-700"
          fill={mainColor}
        />

        {/* hour hand */}
        <g
          transform={`translate(150, 150) rotate(${hourDeg})`}
          className="group cursor-grab active:cursor-grabbing"
          onPointerDown={(e) => handlePointerDown("hour", e)}
          onPointerEnter={(e) => {
            if (e.pointerType === "mouse") { setIsHoveringHand(true); }
          }}
          onPointerLeave={(e) => {
            if (e.pointerType === "mouse") { setIsHoveringHand(false); }
          }}
        >
          {/* Wide invisible capture area */}
          <line x1="0" y1="0" x2="0" y2="-75" stroke="transparent" strokeWidth="28" strokeLinecap="round" />
          {/* Visible arrow */}
          <line
            x1="0"
            y1="0"
            x2="0"
            y2="-70"
            strokeWidth="6.5"
            strokeLinecap="round"
            className={`
              origin-bottom ease-in-out ${handHoverStyles}
              ${activeHand === "hour" ? `${activeArrowColor} transition-none` : `${hourArrowColor} transition-all duration-300`}
            `.trim().replace(/\s+/g, " ")}
          />
        </g>

        {/* minute hand */}
        <g
          transform={`translate(150, 150) rotate(${minuteDeg})`}
          className="group cursor-grab active:cursor-grabbing"
          onPointerDown={(e) => handlePointerDown("minute", e)}
          onPointerEnter={(e) => {
            if (e.pointerType === "mouse") { setIsHoveringHand(true); }
          }}
          onPointerLeave={(e) => {
            if (e.pointerType === "mouse") { setIsHoveringHand(false); }
          }}
        >
          {/* Wide invisible capture area */}
          <line x1="0" y1="0" x2="0" y2="-115" stroke="transparent" strokeWidth="24" strokeLinecap="round" />
          {/* Visible arrow */}
          <line
            x1="0"
            y1="0"
            x2="0"
            y2="-110"
            strokeWidth="4"
            strokeLinecap="round"
            className={`
              origin-bottom ease-in-out ${handHoverStyles}
              ${activeHand === "minute" ? `${activeArrowColor} transition-none` : `${minuteArrowColor} transition-all duration-300`}
            `.trim().replace(/\s+/g, " ")}
          />
        </g>
      </svg>
    </div>
  );
}
