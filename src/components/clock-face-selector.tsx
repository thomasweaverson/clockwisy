import { CLOCK_VARIANTS, type ClockStyle } from "../constants/clock-variants";
import { useTheme } from "../theme/use-theme";

interface ClockFaceSelectorProps {
  currentStyle: ClockStyle;
  onStyleChange: (clockStyle: ClockStyle) => void;
}

export default function ClockFaceSelector({
  currentStyle,
  onStyleChange,
}: ClockFaceSelectorProps) {
  const { themeClasses } = useTheme();

  const {
    containerBackground,
    containerBorder,
    textActive,
    textNeutral,
    buttonActiveBackground,
    buttonFocus,
  } = themeClasses;

  return (
    <div
      className={`
        grid grid-cols-3 gap-1 w-full p-1.5 rounded-xl border
        transition-all duration-700
        ${containerBackground} ${containerBorder}
      `.trim()}
    >
      {(Object.keys(CLOCK_VARIANTS) as ClockStyle[]).map((styleId) => {
        const isActive = currentStyle === styleId;

        const activeClasses = `${buttonActiveBackground} ${textActive}`;

        const inactiveClasses = `
          ${textNeutral} bg-transparent
          hover:bg-current/20
          active:scale-95
        `;

        return (
          <button
            key={styleId}
            type="button"
            onClick={() => onStyleChange(styleId)}
            className={`
              py-2 text-base font-bold rounded-lg
              transition-all duration-300 cursor-pointer select-none
              focus-visible:outline-none focus-visible:ring-2 ${buttonFocus}
              ${isActive ? activeClasses : inactiveClasses}
            `.trim().replace(/\s+/g, " ")}
          >
            {CLOCK_VARIANTS[styleId].name.split(" ")[0]}
          </button>
        );
      })}
    </div>
  );
}
