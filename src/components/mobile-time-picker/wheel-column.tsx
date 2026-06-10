
import { useWheelPhysics } from "../../hooks/use-wheel-physics";
import { ITEM_HEIGHT, VISIBLE_ITEMS, WHEEL_HEIGHT } from "./constants";
import WheelItem from "./wheel-item";

interface WheelColumnProps {
  value: number;
  max: number;
  inertiaCoefficient: number;
  onChange: (value: number, loopDelta: number) => void;
  onStartAnimating: () => boolean;
  onStopAnimating: () => void;
}

const CONTAINER_WIDTH_PX = "110px";

export default function WheelColumn(props: WheelColumnProps) {
  const { max } = props;

  // Extract all complex physics calculations and event tracking into a custom hook
  const { renderValue, visualOffset, isSnapping, pointerHandlers } = useWheelPhysics(props);

  // --- Render List Dynamic Array Matrix Computation ---
  const visibleRange = Math.floor(VISIBLE_ITEMS / 2);
  const items = [];

  for (let offset = -visibleRange; offset <= visibleRange; offset++) {
    const normalized = (((renderValue + offset) % max) + max) % max;
    items.push({ value: normalized, offset });
  }

  return (
    <div
      {...pointerHandlers}
      className="relative overflow-hidden rounded-2xl px-6 touch-none select-none"
      style={{
        height: `${WHEEL_HEIGHT}px`,
        width: CONTAINER_WIDTH_PX,
      }}
    >
      {/* Upper & Lower Ambient Lighting Mask overlays */}
      <div className="pointer-events-none absolute inset-0 z-10 bg-gradient-to-b from-white via-transparent to-white dark:from-slate-950 dark:via-transparent dark:to-slate-950" />

      {/* Target Focus Center Highlighter Row */}
      <div
        className="absolute left-2 right-2 z-0 rounded-xl border border-amber-500/20 bg-slate-500/5 backdrop-blur-sm dark:border-amber-400/20 dark:bg-white/5"
        style={{
          height: `${ITEM_HEIGHT}px`,
          top: `${ITEM_HEIGHT * visibleRange}px`,
        }}
      />

      {/* Real-time Render View List Container */}
      <div className="relative h-full">
        {items.map((item) => (
          <WheelItem
            key={`${item.value}-${item.offset}`}
            value={item.value}
            offsetFromCenter={item.offset}
            visualOffset={visualOffset}
            isSnapping={isSnapping}
          />
        ))}
      </div>
    </div>
  );
}
