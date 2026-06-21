import { clockAudio } from "../utils/clock-audio";
import ControlButton from "./control-button";

interface AmPmTogglerProps {
  isAmPm: boolean
  onChangeAmPm: (isAmPm: boolean) => void
}

export default function AmPmToggler({
  isAmPm,
  onChangeAmPm,
}: AmPmTogglerProps) {
    const toggleAmPm = () => {
    clockAudio.playClick();
    onChangeAmPm(!isAmPm);
  };

  return (
    <ControlButton
      isActive={true}
      onClick={toggleAmPm}
      aria-label={isAmPm ? "Switch to 24-hour format" : "Switch to 12-hour format"}
    >
      <span className="font-bold transition-transform duration-300 group-hover:scale-110">
        {isAmPm ? "12H" : "24H"}
      </span>
    </ControlButton>
  );
}
