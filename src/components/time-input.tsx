import React from "react";
import { useTheme } from "../theme/use-theme";
import { clockAudio } from "../utils/clock-audio";
import type { Hours, Minutes } from "../utils/clock-math";
import TimeInputField from "./time-input-field";
import { useWindowWidth } from "../hooks/use-window-size";
import { BREAK_POINT } from "../constants/common";

interface TimeInputProps {
  hours: Hours;
  minutes: Minutes;
  isWorking: boolean;
  isAmPm: boolean;
  onChangeTime: (hours: Hours, minutes: Minutes) => void;
}

export default function TimeInput({
  hours,
  minutes,
  isWorking,
  isAmPm,
  onChangeTime,
}: TimeInputProps) {
  const { isDark, themeClasses } = useTheme();
  const { containerBackground, containerBorder, inputComplexStyle, textActive, textNeutral } = themeClasses;
  const isPm = hours >= 12;
  const viewportWidth = useWindowWidth();
  const textSizeClassName = viewportWidth > BREAK_POINT ? "text-5xl" : "text-4xl";
  const amPmFlagTextSizeClassName = viewportWidth > BREAK_POINT ? "text-3xl" : "text-lg";
  const amPmFlagRightPositionClassName = viewportWidth > BREAK_POINT ? "right-8" : "right-2";

  const formatNumber = (num: number): string => num.toString().padStart(2, "0");

  const getDisplayHours = (): string => {
    if (typeof hours !== "number") { return ""; }
    if (!isAmPm) { return formatNumber(hours); }

    const displayHours = hours % 12 === 0 ? 12 : hours % 12;
    return formatNumber(displayHours);
  };

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

    if (isAmPm) {
      // Limit input for 12-hour format (from 1 to 12)
      if (val > 12) { val = 12; }
      if (val === 0) { val = 1; } // In 12-hour format there is no "00" hour, minimum is 12 or 1

      // Convert the entered 12-hour value back to 24-hour format for storage
      if (isPm) {
        // If currently PM and entered 12 — it's 12 noon. If entered 1-11 — add 12.
        val = val === 12 ? 12 : val + 12;
      } else {
        // If currently AM and entered 12 — it's 12 midnight. If 1-11 — keep as is.
        val = val === 12 ? 0 : val;
      }
      onChangeTime(val as Hours, minutes);
    } else {
      if (val > 23) { val = 23; }
      onChangeTime(val as Hours, minutes);
    }

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
        flex items-center justify-center gap-3 font-mono ${textSizeClassName} font-bold
        w-full p-4 rounded-xl border transition-all duration-700 select-none
        ${containerBackground} ${containerBorder} relative
      `.trim()}
    >
      <TimeInputField
        name="hours"
        label="Hours"
        value={getDisplayHours()}
        className={inputComplexStyle}
        onChange={handleHourInputChange}
        onKeyDown={(e) => handleKeyDown("hours", e)}
        onBlur={handleBlur}
      />

      <span
        aria-hidden="true"
        className={`
          transition-colors duration-300 font-mono text-4xl pb-1.5
          ${isDark ? textActive : textNeutral}
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

      {isAmPm && (
        <span className={`absolute ${amPmFlagRightPositionClassName} top-1/2 -translate-y-1/2
          ${amPmFlagTextSizeClassName} tracking-wide select-none ${textNeutral}`}>
          {isPm ? "PM" : "AM"}
        </span>
      )}
    </section>
  );
}
