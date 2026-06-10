import { useTheme } from "../theme/use-theme";
import ClockHand from "./clock-hand";

type HandType = "hour" | "minute";
type ActiveHand = HandType | null;

interface ClockHandsProps {
  hourDeg: number;
  minuteDeg: number;
  activeHand: ActiveHand;
  isPm: boolean;
  setIsHoveringHand: (value: boolean) => void;
  handlePointerDown: (hand: HandType, e: React.PointerEvent<SVGElement>) => void;
  handlePointerMove: (e: React.PointerEvent<SVGSVGElement>) => void;
  handlePointerUp: (e: React.PointerEvent<SVGSVGElement>) => void;
}

// --- High Performance Static Layout Tokens ---
const HOVER_PM_CLASSES = "media-[hover:hover]:group-hover:stroke-amber-500 media-[hover:hover]:group-hover:drop-shadow-[0_0_8px_rgba(251,191,36,0.7)]";
const HOVER_AM_CLASSES = "media-[hover:hover]:group-hover:stroke-indigo-600 media-[hover:hover]:group-hover:drop-shadow-[0_0_8px_rgba(79,70,229,0.4)]";

export default function ClockHands({
  hourDeg,
  minuteDeg,
  activeHand,
  isPm,
  setIsHoveringHand,
  handlePointerDown,
  handlePointerMove,
  handlePointerUp,
}: ClockHandsProps) {
  const { themeClasses, mainColor } = useTheme();
  const { activeArrowColor, hourArrowColor, minuteArrowColor } = themeClasses;

  // Resolve active theme palette variant without dynamic template parsing execution steps
  const handHoverStyles = isPm ? HOVER_PM_CLASSES : HOVER_AM_CLASSES;

  // Package matching event delegates for downstream generic layout spreads
  const gestureDelegates = {
    onPointerMove: handlePointerMove as unknown as (e: React.PointerEvent<SVGSVGElement>) => void,
    onPointerUp: handlePointerUp as unknown as (e: React.PointerEvent<SVGSVGElement>) => void,
  };

  return (
    <>
      {/* Central Center Pin Anchor Node */}
      <circle
        cx="150"
        cy="150"
        r="5"
        className="transition-colors duration-700"
        fill={mainColor}
      />

      {/* Hour Hand Controller */}
      <ClockHand
        type="hour"
        degree={hourDeg}
        length={70}
        hitWidth={28}
        visibleWidth={6.5}
        arrowColor={hourArrowColor}
        activeArrowColor={activeArrowColor}
        isActive={activeHand === "hour"}
        hoverClasses={handHoverStyles}
        setIsHoveringHand={setIsHoveringHand}
        handlePointerDown={handlePointerDown}
        {...gestureDelegates}
      />

      {/* Minute Hand Controller */}
      <ClockHand
        type="minute"
        degree={minuteDeg}
        length={110}
        hitWidth={24}
        visibleWidth={4}
        arrowColor={minuteArrowColor}
        activeArrowColor={activeArrowColor}
        isActive={activeHand === "minute"}
        hoverClasses={handHoverStyles}
        setIsHoveringHand={setIsHoveringHand}
        handlePointerDown={handlePointerDown}
        {...gestureDelegates}
      />
    </>
  );
}
