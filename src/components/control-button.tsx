import { type ComponentPropsWithoutRef } from "react";
import { useTheme } from "../theme/use-theme";
import { useWindowWidth } from "../hooks/use-window-size";
import { BREAK_POINT } from "../constants/common";

interface ControlButtonProps extends ComponentPropsWithoutRef<"button"> {
  isActive?: boolean;
}

export default function ControlButton({
  isActive = false,
  className = "",
  children,
  type = "button",
  ...props
}: ControlButtonProps) {
  const { themeClasses } = useTheme();
  const viewportWidth = useWindowWidth();
  const buttonSizeClassNames = viewportWidth > BREAK_POINT ? "w-12 h-12" : "w-10 h-10";
  const textSizeClassNames = viewportWidth > BREAK_POINT ? "text-lg" : "text-base";

  const {
    buttonActiveBackground,
    buttonBackground,
    textActive,
    textNeutral,
    buttonFocus,
  } = themeClasses;

  const baseStyles = `
    ${textSizeClassNames} font-bold
    group flex items-center justify-center
    ${buttonSizeClassNames} rounded-xl
    transition-all duration-400
    cursor-pointer select-none
    active:scale-95
    focus-visible:outline-none focus-visible:ring-2
  `;

  const currentBackground = isActive ? buttonActiveBackground : buttonBackground;
  const currentTextColor = isActive ? textActive : textNeutral;

  const combinedClasses = [
    baseStyles,
    currentBackground,
    currentTextColor,
    buttonFocus,
    className,
  ].filter(Boolean).join(" ").trim().replace(/\s+/g, " ");

  return (
    <button
      type={type}
      className={combinedClasses}
      {...props}
    >
      {children}
    </button>
  );
}
