import type { ClockStyle } from "../constants/clock-variants";
import { useTheme } from "../theme/use-theme";
import type { Hours, Minutes } from "../utils/clock-math";
import AmPmToggler from "./am-pm-toggler";
import ClockStyleToggler from "./clock-style-toggler";
import InfoToggler from "./info-toggler";
import SoundToggler from "./sound-toggler";
import Synchronizer from "./synchronizer";

interface ControlPanelProps {
  hours: Hours;
  minutes: Minutes;
  isSynchronized: boolean;
  onChangeTime: (hours: Hours, minutes: Minutes) => void;
  onToggleSynchronized: () => void;
  currentStyle: ClockStyle;
  onStyleChange: (style: ClockStyle) => void;
}

export default function ControlPanel({
  hours,
  minutes,
  isSynchronized,
  onChangeTime,
  onToggleSynchronized,
  currentStyle,
  onStyleChange,
}: ControlPanelProps) {
  const { themeClasses } = useTheme();
  const { containerBackground, containerBorder } = themeClasses;

  return (
    <section
      className={`
        flex flex-row items-center justify-center gap-3
        w-full p-1.5 rounded-xl border transition-all duration-700
        ${containerBackground} ${containerBorder}
      `.trim()}
    >
      <AmPmToggler
        hours={hours}
        minutes={minutes}
        onChangeTime={onChangeTime}
      />

      <ClockStyleToggler
        currentStyle={currentStyle}
        onStyleChange={onStyleChange}
      />

      <Synchronizer
        isSynchronized={isSynchronized}
        onToggle={onToggleSynchronized}
      />

      <SoundToggler />
      <InfoToggler />
    </section>
  );
}
