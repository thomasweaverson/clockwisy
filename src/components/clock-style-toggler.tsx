import { CLOCK_VARIANTS, type ClockStyle } from "../constants/clock-variants";
import { clockAudio } from "../utils/clock-audio";
import ControlButton from "./control-button";

interface ClockStyleTogglerProps {
  currentStyle: ClockStyle;
  onStyleChange: (style: ClockStyle) => void;
}

export default function ClockStyleToggler({
  currentStyle,
  onStyleChange,
}: ClockStyleTogglerProps) {

  const toggleStyle = () => {
    clockAudio.playClick();

    const styles: ClockStyle[] = ["roman", "minimal", "arabic"];
    const currentIndex = styles.indexOf(currentStyle);

    const nextIndex = (currentIndex + 1) % styles.length;

    onStyleChange(styles[nextIndex]);
  };

  const displayLabel = CLOCK_VARIANTS[currentStyle].title;

  return (
    <ControlButton
      isActive={true}
      onClick={toggleStyle}
      aria-label={`Change clock style. Current: ${currentStyle}`}
    >
      <span className="text-base font-bold transition-transform duration-300 group-hover:scale-110 select-none">
        {displayLabel}
      </span>
    </ControlButton>
  );
}
