
import React from "react";

export type ThemeContextType = {
  isPm: boolean;
  themeClasses: {
    appBackground: string;
    appText: string;
    headerGradient: string;
    containerBackground: string;
    containerBorder: string;
    faceBackground: string;
    textNeutral: string;
    textActive: string;
    buttonBackground: string;
    buttonActiveBackground: string;
    buttonFocus: string;
    minuteArrowColor: string;
    hourArrowColor: string;
    activeArrowColor: string;
    inputComplexStyle: string;
  };
  mainColor: string;
  secondaryColor: string;
  accentColor: string;
};

export const ThemeContext = React.createContext<ThemeContextType | undefined>(undefined);
