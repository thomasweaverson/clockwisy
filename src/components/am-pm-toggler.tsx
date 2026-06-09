import { clockAudio } from "../utils/clock-audio";
import type { Hours, Minutes } from "../utils/clock-math";
import ControlButton from "./control-button";

interface AmPmTogglerProps {
  hours: Hours;
  minutes: Minutes;
  onChangeTime: (hours: Hours, minutes: Minutes) => void;
}

export default function AmPmToggler({
  hours,
  minutes,
  onChangeTime,
}: AmPmTogglerProps) {
  const isPm = hours >= 12;

  const toggleDayNight = () => {
    clockAudio.playClick();

    const newHours = (isPm ? hours - 12 : hours + 12) as Hours;
    onChangeTime(newHours, minutes);
  };

  return (
    <ControlButton
      isActive={isPm}
      onClick={toggleDayNight}
      aria-label={isPm ? "Switch to AM" : "Switch to PM"}
    >
      <span className="text-xl transition-transform duration-300 group-hover:scale-110">
        {isPm ? "🌙" : "☀️"}
      </span>
    </ControlButton>
  );
}
