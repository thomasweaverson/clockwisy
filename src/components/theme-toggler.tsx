import type { Theme } from "../theme/types";
import { useTheme } from "../theme/use-theme";
import { clockAudio } from "../utils/clock-audio";
import ControlButton from "./control-button";

interface ThemeTogglerProps {
  onChangeTheme: (theme: Theme) => void
}

export default function ThemeToggler({
  onChangeTheme,
}: ThemeTogglerProps) {
    const { isDark } = useTheme();

  const toggleTheme = () => {
    clockAudio.playClick();
    onChangeTheme(isDark ? "light" : "dark");
  };

  return (
    <ControlButton
      isActive={isDark}
      onClick={toggleTheme}
      aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
    >
      <span className="text-xl transition-transform duration-300 group-hover:scale-110">
        {isDark ? "🌙" : "☀️"}
      </span>
    </ControlButton>
  );
}
