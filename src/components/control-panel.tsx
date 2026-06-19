import type { ClockStyle } from "../constants/clock-variants";
import type { Theme } from "../theme/types";
import { useTheme } from "../theme/use-theme";
import AmPmToggler from "./am-pm-toggler";
import ClockStyleToggler from "./clock-style-toggler";
import InfoToggler from "./info-toggler";
import SoundToggler from "./sound-toggler";
import Synchronizer from "./synchronizer";
import ThemeToggler from "./theme-toggler";

interface ControlPanelProps {
  isSynchronized: boolean;
  onToggleSynchronized: () => void;
  currentStyle: ClockStyle;
  onStyleChange: (style: ClockStyle) => void;
  isAmPm: boolean;
  onChangeAmPm: (isAmPm: boolean) => void;
  onChangeTheme: (theme: Theme) => void;
}

export default function ControlPanel({
  isSynchronized,
  onToggleSynchronized,
  currentStyle,
  onStyleChange,
  isAmPm,
  onChangeAmPm,
  onChangeTheme,
}: ControlPanelProps) {
  const { themeClasses } = useTheme();
  const { containerBackground, containerBorder } = themeClasses;

  return (
    <section
      className={`
        flex flex-row flex-wrap items-center justify-center gap-3
        w-full p-1.5 rounded-xl border transition-all duration-700
        ${containerBackground} ${containerBorder}
      `.trim()}
    >

      <AmPmToggler
        isAmPm={isAmPm}
        onChangeAmPm={onChangeAmPm}
      />

      <ClockStyleToggler
        currentStyle={currentStyle}
        onStyleChange={onStyleChange}
      />

      <Synchronizer
        isSynchronized={isSynchronized}
        onToggle={onToggleSynchronized}
      />

      <ThemeToggler
        onChangeTheme={onChangeTheme}
      />

      <SoundToggler />

      <InfoToggler />
    </section>
  );
}
