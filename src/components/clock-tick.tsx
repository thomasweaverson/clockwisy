import { memo } from "react";
import { useTheme } from "../theme/use-theme";

type ClockTickProps = {
  angle: number;
  tickHour: number;
  hoveredHour: number | null;
};

function ClockTickComponent({ angle, tickHour, hoveredHour }: ClockTickProps) {
  const isMainTick = tickHour % 3 === 0;
  const isHovered = hoveredHour === tickHour;

  const { secondaryColor, accentColor } = useTheme();

  return (
    <line
      x1="0"
      y1={isMainTick ? "-132" : "-136"}
      x2="0"
      y2="-142"
      className="transition-all duration-200 ease-in-out"
      stroke={
        isHovered || isMainTick
          ? accentColor
          : secondaryColor
      }
      strokeWidth={isHovered ? "4" : isMainTick ? "3" : "1.5"}
      filter={isHovered ? `drop-shadow(0 0 3px ${accentColor})` : undefined}
      transform={`rotate(${angle})`}
    />
  );
};

const ClockTick = memo(ClockTickComponent);

export default ClockTick;
