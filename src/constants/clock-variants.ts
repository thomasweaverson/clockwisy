export type ClockStyle = "minimal" | "arabic" | "roman";

type ClockNumber = {
  text: string;
  angle: number;
};

export type ClockVariantConfig = {
  id: ClockStyle;
  title: string;
  showTicks: boolean;
  textSize: string;
  radius: number;
  numbers: ClockNumber[];
};

const clockAngles = Array.from({ length: 12 }, (_, i) => (i + 1) * 30);

const ARABIC_LABELS = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12"];
const ROMAN_LABELS = ["I", "II", "III", "IV", "V", "VI", "VII", "VIII", "IX", "X", "XI", "XII"];

export const CLOCK_VARIANTS: Record<ClockStyle, ClockVariantConfig> = {
  minimal: {
    id: "minimal",
    title: "|",
    showTicks: true,
    textSize: "text-sm",
    radius: 110,
    numbers: [],
  },
  arabic: {
    id: "arabic",
    title: "12",
    showTicks: false,
    textSize: "text-2xl font-black",
    radius: 120,
    numbers: clockAngles.map((angle, index) => ({
      text: ARABIC_LABELS[index],
      angle,
    })),
  },
  roman: {
    id: "roman",
    title: "XII",
    showTicks: false,
    textSize: "text-2xl font-medium tracking-tight",
    radius: 120,
    numbers: clockAngles.map((angle, index) => ({
      text: ROMAN_LABELS[index],
      angle,
    })),
  },
};
