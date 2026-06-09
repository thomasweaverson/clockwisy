import type { ClockVariantConfig } from "../constants/clock-variants";

type ClockNumberProps = {
  num: { text: string; angle: number };
  numHour: number;
  hoveredHour: number | null;
  isPm: boolean;
  variant: ClockVariantConfig;
};

export default function ClockNumber({ num, numHour, hoveredHour, isPm, variant }: ClockNumberProps) {
  const isHovered = hoveredHour === numHour;

  return (
    <g transform={`rotate(${num.angle})`}>
      <text
        x="0"
        y={-variant.radius}
        textAnchor="middle"
        dominantBaseline="central"
        transform={`rotate(${-num.angle}, 0, ${-variant.radius})`}
        className={`font-sans select-none transition-all duration-200 ease-in-out ${variant.textSize}`}
        fill={
          isHovered
            ? isPm ? "#fbbf24" : "#4f46e5"
            : isPm ? "#64748b" : "#94a3b8"
        }
        filter={isHovered ? `drop-shadow(0 0 4px ${isPm ? "rgba(251,191,36,0.6)" : "rgba(79,70,229,0.5)"})` : undefined}
      >
        {num.text}
      </text>
    </g>
  );
};
