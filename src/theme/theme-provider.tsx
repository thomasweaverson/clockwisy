// providers/ThemeProvider.tsx
import React, { useMemo } from "react";

import { ThemeContext } from "./types";

type ThemeProviderProps = {
  children: React.ReactNode;
  isPm: boolean
};

export const ThemeProvider: React.FC<ThemeProviderProps> = ({
  children,
  isPm = false
}) => {

  const themeClasses = useMemo(() => {
    const activeArrowColor = isPm ? "stroke-amber-500" : "stroke-indigo-600";

    return {
      appBackground: isPm ? "bg-slate-950" : "bg-slate-200",
      appText: isPm ? "text-slate-100" : "text-slate-800",
      headerGradient: `bg-clip-text text-transparent bg-gradient-to-r ${isPm ? "from-amber-500 to-orange-900" : "from-indigo-600 to-slate-800"}`,
      containerBackground: isPm ? "bg-slate-900/50" : "bg-slate-300/40",
      containerBorder: isPm ? "border-slate-800/80" : "border-slate-400/20",
      faceBackground: isPm ? "bg-slate-800" : "bg-slate-50",
      textNeutral: "text-slate-400",
      textActive: isPm ? "text-amber-400" : "text-indigo-600",
      buttonBackground: isPm ? "bg-slate-800/80" : "bg-slate-100",
      buttonActiveBackground: isPm ? "bg-amber-500/10" : "bg-slate-100",
      buttonFocus: isPm ? "focus-visible:ring-amber-500/60" : "focus-visible:ring-indigo-600/60",
      minuteArrowColor: "stroke-slate-500",
      hourArrowColor: isPm ? "stroke-slate-100" : "stroke-slate-800",
      activeArrowColor,
      inputComplexStyle: isPm
        ? "bg-slate-800/90 text-amber-400 focus-visible:ring-amber-500/60 border border-amber-500/20"
        : "bg-slate-100 text-slate-600 focus-visible:ring-indigo-500/60 border border-slate-300"
    };
  }, [isPm]);

  const mainColor = isPm ? "#f8fafc" : "#1e293b";
  const secondaryColor = isPm ? "#dae0e7" : "#334155";
  const accentColor = isPm ? "#fbbf24" : "#4f46e5";

  const value = {
    isPm,
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
