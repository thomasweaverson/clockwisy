import { useState } from "react";
import { clockAudio } from "../utils/clock-audio";
import ControlButton from "./control-button";

export default function SoundToggler() {
  const [isMuted, setIsMuted] = useState(() => clockAudio.getMuted());

  const handleToggle = () => {
    const nextState = !isMuted;
    clockAudio.setMute(nextState);
    setIsMuted(nextState);

    if (!nextState) {
      clockAudio.playClick();
    }
  };

  return (
    <ControlButton
      isActive={!isMuted}
      onClick={handleToggle}
      aria-label={isMuted ? "Sound on" : "Sound off"}
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
        {/* The body of the speaker is common to both states */}
        <path
          d="M11 5L6 9H2v6h4l5 4V5z"
          className={`transition-colors duration-300 ${isMuted ? "fill-none" : "fill-current/15"}`}
        />

        {isMuted ? (
          /* X — there is no sound */
          <>
            <line x1="23" y1="9" x2="17" y2="15" />
            <line x1="17" y1="9" x2="23" y2="15" />
          </>
        ) : (
          /* sound waves */
          <>
            <path d="M15.54 8.46a5 5 0 0 1 0 7.07" />
            <path d="M19.07 4.93a10 10 0 0 1 0 14.14" />
          </>
        )}
      </svg>
    </ControlButton>
  );
}
