import type { HandType } from "../constants/common";

interface ClockHandProps extends React.SVGProps<SVGGElement> {
  type: HandType;
  degree: number;
  length: number;
  hitWidth: number;
  visibleWidth: number;
  arrowColor: string;
  activeArrowColor: string;
  isActive: boolean;
  hoverClasses: string;
  setIsHoveringHand: (value: boolean) => void;
  handlePointerDown: (hand: HandType, e: React.PointerEvent<SVGElement>) => void;
}

const BASE_HAND_CLASSES = "origin-bottom ease-in-out";

export default function ClockHand({
  type,
  degree,
  length,
  hitWidth,
  visibleWidth,
  arrowColor,
  activeArrowColor,
  isActive,
  hoverClasses,
  setIsHoveringHand,
  handlePointerDown,
  ...rest // Captures handlePointerMove, handlePointerUp and other inherited SVG props safely
}: ClockHandProps) {

  // Scoped handlers ensuring layout boundary safety on mouse-driven platforms
  const handlePointerEnter = (e: React.PointerEvent<SVGElement>) => {
    if (e.pointerType === "mouse") { setIsHoveringHand(true); }
  };

  const handlePointerLeave = (e: React.PointerEvent<SVGElement>) => {
    if (e.pointerType === "mouse") { setIsHoveringHand(false); }
  };

  // Pre-compile state tokens avoiding string allocations on high frequency frame re-renders
  const stateTransitionClasses = isActive
    ? `${activeArrowColor} transition-none`
    : `${arrowColor} transition-all duration-300`;

  return (
    <g
      transform={`translate(150, 150) rotate(${degree})`}
      className="group cursor-grab active:cursor-grabbing"
      onPointerDown={(e) => handlePointerDown(type, e)}
      onPointerEnter={handlePointerEnter}
      onPointerLeave={handlePointerLeave}
      {...rest} // Attaches necessary gesture movement handlers passed down from root SVG context
    >
      {/* Invisible expanded interaction target area padding */}
      <line
        x1="0"
        y1="0"
        x2="0"
        y2={-(length + 5)}
        stroke="transparent"
        strokeWidth={hitWidth}
        strokeLinecap="round"
      />

      {/* Visual high-definition rendered layout vector */}
      <line
        x1="0"
        y1="0"
        x2="0"
        y2={-length}
        strokeWidth={visibleWidth}
        strokeLinecap="round"
        className={`${BASE_HAND_CLASSES} ${hoverClasses} ${stateTransitionClasses}`}
      />
    </g>
  );
}
