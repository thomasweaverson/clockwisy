import { useState } from "react";
import { clockAudio } from "../utils/clock-audio";
import ControlButton from "./control-button";
import InfoModal from "./info-modal";

export default function InfoToggler() {
  const [isOpen, setIsOpen] = useState(false);

  const handleOpen = () => {
    clockAudio.playClick();
    setIsOpen(true);
  };

  return (
    <>
      <ControlButton
        isActive={isOpen}
        onClick={handleOpen}
        aria-label="Show help guide"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="w-6 h-6 transition-transform duration-300 group-hover:scale-110"
        >
          <circle cx="12" cy="12" r="10" />
          <path d="M12 16v-4" />
          <path d="M12 8h.01" />
        </svg>
      </ControlButton>

      <InfoModal isOpen={isOpen} onClose={() => setIsOpen(false)} />
    </>
  );
}
