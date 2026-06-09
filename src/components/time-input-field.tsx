
import React from "react";

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
          w-20 rounded-xl p-2.5 text-center font-semibold
          transition-all duration-300 focus-visible:outline-none focus-visible:ring-2
          ${className}
        `.trim()}
      />
    </div>
  );
}
