import React, { useMemo } from "react";

import { ThemeContext, type Theme } from "./types";

type ThemeProviderProps = {
  children: React.ReactNode;
  theme: Theme;
};

export const ThemeProvider: React.FC<ThemeProviderProps> = ({
  children,
  theme
}) => {

  const isDark = theme === "dark";

  const themeClasses = useMemo(() => {
    const activeArrowColor = isDark ? "stroke-amber-500" : "stroke-indigo-600";

    return {
      appBackground: isDark ? "bg-slate-950" : "bg-slate-200",
      appText: isDark ? "text-slate-100" : "text-slate-800",
      headerGradient: `bg-clip-text text-transparent bg-gradient-to-r ${isDark ? "from-amber-500 to-orange-900" : "from-indigo-600 to-slate-800"}`,
      containerBackground: isDark ? "bg-slate-900/50" : "bg-slate-300/40",
      containerBorder: isDark ? "border-slate-800/80" : "border-slate-400/20",
      faceBackground: isDark ? "bg-slate-800" : "bg-slate-50",
      textNeutral: isDark ? "text-slate-300" : "text-slate-600",
      textActive: isDark ? "text-amber-400" : "text-indigo-600",
      buttonBackground: isDark ? "bg-slate-800/80" : "bg-slate-100",
      buttonActiveBackground: isDark ? "bg-amber-500/10" : "bg-slate-100",
      buttonFocus: isDark ? "focus-visible:ring-amber-500/60" : "focus-visible:ring-indigo-600/60",
      minuteArrowColor: "stroke-slate-500",
      hourArrowColor: isDark ? "stroke-slate-100" : "stroke-slate-800",
      activeArrowColor,
      inputComplexStyle: isDark
        ? "bg-slate-800/90 text-amber-400 focus-visible:ring-amber-500/60 border border-amber-500/20"
        : "bg-slate-100 text-slate-600 focus-visible:ring-indigo-500/60 border border-slate-300"
    };
  }, [isDark]);

  const mainColor = isDark ? "#f8fafc" : "#1e293b";
  const secondaryColor = isDark ? "#dae0e7" : "#334155";
  const accentColor = isDark ? "#fbbf24" : "#4f46e5";

  const value = {
    isDark,
    themeClasses,
    mainColor,
    secondaryColor,
    accentColor
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
};
