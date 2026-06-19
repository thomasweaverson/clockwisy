import { useWheelPhysics } from "../../hooks/use-wheel-physics";
import { useTheme } from "../../theme/use-theme";
import { ITEM_HEIGHT, VISIBLE_ITEMS, WHEEL_HEIGHT } from "./constants";
import WheelItem from "./wheel-item";

interface WheelColumnProps {
  value: number;
  max: number;
  inertiaCoefficient: number;
  onChange: (value: number, loopDelta: number) => void;
  onStartAnimating: () => boolean;
  onStopAnimating: () => void;
  formatLabel?: (value: number) => string; // Новый необязательный проп
}

const CONTAINER_WIDTH_PX = "100px";

export default function WheelColumn(props: WheelColumnProps) {
  const { max, formatLabel } = props;
  const { isDark } = useTheme();

  // Извлекаем расчеты физики и хандлеры событий
  const { renderValue, visualOffset, isSnapping, pointerHandlers } = useWheelPhysics(props);

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
      {/* Затемняющий градиент сверху и снизу */}
      <div
        className="pointer-events-none absolute inset-0 z-10"
        style={{
          background: isDark
            ? "linear-gradient(to bottom, rgba(15,23,42,0.38) 0%, rgba(15,23,42,0.14) 18%, rgba(15,23,42,0.02) 35%, rgba(15,23,42,0.02) 65%, rgba(15,23,42,0.14) 82%, rgba(15,23,42,0.38) 100%)"
            : "linear-gradient(to bottom, rgba(255,255,255,0.55) 0%, rgba(255,255,255,0.18) 18%, rgba(255,255,255,0.02) 35%, rgba(255,255,255,0.02) 65%, rgba(255,255,255,0.18) 82%, rgba(255,255,255,0.55) 100%)",
        }}
      />

      {/* Центральная рамка фокуса */}
      <div
        className="absolute left-2 right-2 z-0 rounded-xl border border-slate-500/20 bg-slate-500/5 backdrop-blur-sm dark:border-slate-400/20 dark:bg-white/5"
        style={{
          height: `${ITEM_HEIGHT}px`,
          top: `${ITEM_HEIGHT * visibleRange}px`,
        }}
      />

      {/* Список элементов барабана */}
      <div className="relative h-full">
        {items.map((item) => {
          // Форматируем текст: если передан formatLabel — берем его, иначе бьем по классике с пададингом
          const label = formatLabel
            ? formatLabel(item.value)
            : item.value.toString().padStart(2, "0");

          return (
            <WheelItem
              key={`${item.value}-${item.offset}`}
              value={item.value}
              label={label} // Твой WheelItem должен выводить label вместо value, если передан
              offsetFromCenter={item.offset}
              visualOffset={visualOffset}
              isSnapping={isSnapping}
            />
          );
        })}
      </div>
    </div>
  );
}
