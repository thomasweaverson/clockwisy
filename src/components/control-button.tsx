import { type ComponentPropsWithoutRef } from "react";
import { useTheme } from "../theme/use-theme";

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

  const {
    buttonActiveBackground,
    buttonBackground,
    textActive,
    textNeutral,
    buttonFocus,
  } = themeClasses;

  const baseStyles = `
    group flex items-center justify-center
    w-10 h-10 rounded-xl
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
