import { ITEM_HEIGHT, VISIBLE_ITEMS } from "./constants";

interface WheelItemProps {
  value: number;
  offsetFromCenter: number;
  visualOffset: number;
  isSnapping: boolean;
}

// --- Compile-time Static Calculations ---
// Pre-calculating this once tokens are loaded avoids redundant math operations during high-frequency frame renders
const CENTER_OFFSET = Math.floor(VISIBLE_ITEMS / 2) * ITEM_HEIGHT;

// --- Performance Optimized Tailwind Styles ---
const BASE_ITEM_CLASSES = `
  absolute left-0 flex w-full items-center justify-center
  font-mono text-3xl font-semibold tabular-nums select-none
  text-slate-800 dark:text-slate-100
`.trim();

// Target only transform properties to enforce GPU acceleration and avoid layout thrashing
const SNAP_TRANSITION_CLASSES = "transition-transform duration-200 ease-out";
const ACTIVE_DRAG_CLASSES = "transition-none";

export default function WheelItem({
  value,
  offsetFromCenter,
  visualOffset,
  isSnapping,
}: WheelItemProps) {
  const distance = Math.abs(offsetFromCenter);

  // Smooth layout scaling and alpha opacity factors based on current distance from view focal slot
  const scale = distance === 0 ? 1 : Math.max(0.72, 1 - distance * 0.12);
  const opacity = distance === 0 ? 1 : Math.max(0.25, 0.9 - distance * 0.32);

  // Calculate precise absolute target pixel placement matrix inside the virtual viewport
  const targetTranslateY = CENTER_OFFSET + offsetFromCenter * ITEM_HEIGHT + visualOffset;

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
      {String(value).padStart(2, "0")}
    </div>
  );
}
