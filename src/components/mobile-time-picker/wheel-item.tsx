import { useTheme } from "../../theme/use-theme";
import { ITEM_HEIGHT, VISIBLE_ITEMS } from "./constants";

interface WheelItemProps {
  value: number;
  label?: string; // Новый проп для поддержки кастомного текста (например, "AM"/"PM" или "12")
  offsetFromCenter: number;
  visualOffset: number;
  isSnapping: boolean;
}

// --- Compile-time Static Calculations ---
const CENTER_OFFSET = Math.floor(VISIBLE_ITEMS / 2) * ITEM_HEIGHT;

const SNAP_TRANSITION_CLASSES = "transition-transform duration-200 ease-out";
const ACTIVE_DRAG_CLASSES = "transition-none";

export default function WheelItem({
  value,
  label, // Деструктуризируем новый проп
  offsetFromCenter,
  visualOffset,
  isSnapping,
}: WheelItemProps) {
  const { themeClasses } = useTheme();
  const { textNeutral } = themeClasses;
  const distance = Math.abs(offsetFromCenter);

  const scale = distance === 0 ? 1 : Math.max(0.72, 1 - distance * 0.12);
  const opacity = distance === 0 ? 1 : Math.max(0.25, 0.9 - distance * 0.32);

  const targetTranslateY = CENTER_OFFSET + offsetFromCenter * ITEM_HEIGHT + visualOffset;

  const BASE_ITEM_CLASSES = `
      absolute left-0 flex w-full items-center justify-center
      font-mono text-3xl font-semibold tabular-nums select-none
      ${textNeutral}
    `.trim();

  return (
    <div
      className={`${BASE_ITEM_CLASSES} ${isSnapping ? SNAP_TRANSITION_CLASSES : ACTIVE_DRAG_CLASSES}`}
      style={{
        height: `${ITEM_HEIGHT}px`,
        top: 0,
        opacity,
        transform: `translateY(${targetTranslateY}px) scale(${scale})`,
      }}
    >
      {label !== undefined ? label : String(value).padStart(2, "0")}
    </div>
  );
}
