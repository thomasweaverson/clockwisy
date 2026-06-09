import { useTheme } from "../theme/use-theme";

export default function AppHeader() {
  const { themeClasses } = useTheme();
  const { headerGradient, textNeutral } = themeClasses;

  return (
    <header className="relative flex w-full flex-col items-center gap-1 text-center select-none">
      <h1
        className={`
          text-3xl font-black tracking-wider transition-colors duration-700
          ${headerGradient}
        `}
      >
        ClockWisy
      </h1>

      <p
        className={`
          text-xs font-medium tracking-wide transition-colors duration-700
          ${textNeutral}
        `}
      >
        Analog time, made easy
      </p>
    </header>
  );
}
