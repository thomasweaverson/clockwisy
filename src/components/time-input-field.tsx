
import React from "react";
import { BREAK_POINT } from "../constants/common";
import { useWindowWidth } from "../hooks/use-window-size";

interface TimeInputFieldProps {
  name: string;
  value: string;
  label: string;
  className?: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onKeyDown: (e: React.KeyboardEvent<HTMLInputElement>) => void;
  onBlur: () => void;
}

export default function TimeInputField({
  name,
  value,
  label,
  className = "",
  onChange,
  onKeyDown,
  onBlur,
}: TimeInputFieldProps) {

  const viewportWidth = useWindowWidth();
  const inputWidthClassNames = viewportWidth > BREAK_POINT ? "w-32" : "w-24";

  return (
    <div className="flex flex-col">
      <input
        name={name}
        type="text"
        inputMode="numeric"
        pattern="[0-9]*"
        aria-label={label}
        value={value}
        onChange={onChange}
        onKeyDown={onKeyDown}
        onBlur={onBlur}
        className={`
          ${inputWidthClassNames} rounded-xl text-center font-semibold
          transition-all duration-300 focus-visible:outline-none focus-visible:ring-2
          ${className}
        `.trim()}
      />
    </div>
  );
}
