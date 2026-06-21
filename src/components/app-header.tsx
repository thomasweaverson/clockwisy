import { BREAK_POINT } from "../constants/common";
import { useWindowWidth } from "../hooks/use-window-size";
import { useTheme } from "../theme/use-theme";

export default function AppHeader() {
  const { themeClasses } = useTheme();
  const { headerGradient, textNeutral } = themeClasses;
  const viewportWidth = useWindowWidth();
  const textSizeHeadingClassNames = viewportWidth > BREAK_POINT ? "text-4xl/14" : "text-3xl/10";
  const textSizeParagraphClassNames = viewportWidth > BREAK_POINT ? "text-base" : "text-xs";

  return (
    <header className="mb-auto relative flex w-full flex-col items-center gap-1 text-center select-none">
      <h1
        className={`
          ${textSizeHeadingClassNames} font-black tracking-wider transition-colors duration-700
          ${headerGradient}
        `}
      >
        ClockWisy
      </h1>

      <p
        className={`
          ${textSizeParagraphClassNames} font-medium tracking-wide transition-colors duration-700
          ${textNeutral}
        `}
      >
        Analog time, made easy
      </p>
    </header>
  );
}
