import { memo } from "react";
import { CLOCK_VARIANTS, type ClockStyle } from "../constants/clock-variants";
import ClockNumber from "./clock-number";
import ClockTick from "./clock-tick";
import { useTheme } from "../theme/use-theme";

interface ClockFaceProps {
  currentStyle: ClockStyle;
  hoveredHour: number | null;
}

function ClockFaceComponent({ currentStyle, hoveredHour }: ClockFaceProps) {
  const clockVariant = CLOCK_VARIANTS[currentStyle];
  const dialTicks = Array.from({ length: 12 }, (_, i) => (i + 1) * 30);
  const { isDark } = useTheme();

  return (
    <>
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
            isDark={isDark}
            variant={clockVariant}
          />
        ))}
      </g>
    </>
  );
}

const ClockFace = memo(ClockFaceComponent);

export default ClockFace;
