import React from "react";
import { useTheme } from "../theme/use-theme";
import { clockAudio } from "../utils/clock-audio";
import type { Hours, Minutes } from "../utils/clock-math";
import TimeInputField from "./time-input-field";

interface TimeInputProps {
  hours: Hours;
  minutes: Minutes;
  isWorking: boolean;
  onChangeTime: (hours: Hours, minutes: Minutes) => void;
}

export default function TimeInput({
  hours,
  minutes,
  isWorking,
  onChangeTime,
}: TimeInputProps) {
  const { isPm, themeClasses } = useTheme();
  const { containerBackground, containerBorder, inputComplexStyle, textActive, textNeutral } = themeClasses;

  const formatNumber = (num: number): string => num.toString().padStart(2, "0");

  const handleKeyDown = (type: "hours" | "minutes", e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key !== "ArrowUp" && e.key !== "ArrowDown") { return; }

    e.preventDefault();
    const isUp = e.key === "ArrowUp";

    if (type === "hours") {
      let nextHours = isUp ? hours + 1 : hours - 1;
      if (nextHours > 23) { nextHours = 0; }
      if (nextHours < 0) { nextHours = 23; }

      onChangeTime(nextHours as Hours, minutes);
      clockAudio.playHourTick();
    } else {
      let nextMinutes = isUp ? minutes + 1 : minutes - 1;
      let targetHours = hours;

      if (nextMinutes > 59) {
        nextMinutes = 0;
        targetHours = (hours + 1) % 24;
        clockAudio.playHourTick();
      } else if (nextMinutes < 0) {
        nextMinutes = 59;
        targetHours = (hours - 1 + 24) % 24;
        clockAudio.playHourTick();
      }

      onChangeTime(targetHours as Hours, nextMinutes as Minutes);
      clockAudio.playTick();
    }
  };

  const handleHourInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawValue = e.target.value.replace(/\D/g, "");
    if (rawValue === "") {
      onChangeTime("" as unknown as Hours, minutes);
      return;
    }

    let val = parseInt(rawValue.slice(-2), 10);
    if (val > 23) { val = 23; }

    onChangeTime(val as Hours, minutes);
    clockAudio.playTick();
  };

  const handleMinuteInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawValue = e.target.value.replace(/\D/g, "");
    if (rawValue === "") {
      onChangeTime(hours, "" as unknown as Minutes);
      return;
    }

    let val = parseInt(rawValue.slice(-2), 10);
    if (val > 59) { val = 59; }

    onChangeTime(hours, val as Minutes);
    clockAudio.playTick();
  };

  const handleBlur = () => {
    const safeHours = (typeof hours === "number" ? hours : 0) as Hours;
    const safeMinutes = (typeof minutes === "number" ? minutes : 0) as Minutes;
    onChangeTime(safeHours, safeMinutes);
  };

  return (
    <section
      className={`
        flex items-center justify-center gap-3 font-mono text-4xl font-bold
        w-full p-4 rounded-xl border transition-all duration-700 select-none
        ${containerBackground} ${containerBorder}
      `.trim()}
    >
      <TimeInputField
        name="hours"
        label="Hours"
        value={typeof hours === "number" ? formatNumber(hours) : ""}
        className={inputComplexStyle}
        onChange={handleHourInputChange}
        onKeyDown={(e) => handleKeyDown("hours", e)}
        onBlur={handleBlur}
      />

      <span
        aria-hidden="true"
        className={`
          transition-colors duration-300 font-mono text-3xl pb-1.5
          ${isPm ? textActive : textNeutral}
          ${isWorking ? "animate-clock-blink" : ""}
        `.trim()}
      >
        :
      </span>

      <TimeInputField
        name="minutes"
        label="Minutes"
        value={typeof minutes === "number" ? formatNumber(minutes) : ""}
        className={inputComplexStyle}
        onChange={handleMinuteInputChange}
        onKeyDown={(e) => handleKeyDown("minutes", e)}
        onBlur={handleBlur}
      />
    </section>
  );
}
