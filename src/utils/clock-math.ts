// CONSTANTS (Geometry and Time)
const DEGREES_IN_CIRCLE = 360;
const HOURS_ON_DIAL = 12;
const MINUTES_IN_HOUR = 60;

// How many degrees per unit of time
const DEGREES_PER_MINUTE = DEGREES_IN_CIRCLE / MINUTES_IN_HOUR; // 6°
const DEGREES_PER_HOUR = DEGREES_IN_CIRCLE / HOURS_ON_DIAL;    // 30°

// Trigonometric shift correction:
// Math.atan2 considers 0° at "3 o'clock" (east) counterclockwise.
// We need to shift to "12 o'clock" (north) and rotate clockwise.
const TRIG_ANGLE_OFFSET = 90;

// DATA TYPES
export type Degrees = number;
export type Minutes = number;
export type Hours = number;

// HELPERS

// Converts minutes to degrees for the minute hand.

export const minutesToDegrees = (minutes: Minutes): Degrees => {
  return (minutes % MINUTES_IN_HOUR) * DEGREES_PER_MINUTE;
};

/**
 * Converts hours and minutes to degrees for the hour hand.
 * @param exact If true, accounts for minutes for smooth movement within the hour.
 */
export const hoursToDegrees = (hours: Hours, minutes: Minutes, exact = true): Degrees => {
  const hour12 = hours % HOURS_ON_DIAL;
  const hourDegrees = hour12 * DEGREES_PER_HOUR;
  const minuteOffset = exact ? (minutes / MINUTES_IN_HOUR) * DEGREES_PER_HOUR : 0;

  return hourDegrees + minuteOffset;
};

// Calculates the angle (0-360°) relative to the clock center based on pointer coordinates.

export const getAngleFromCoordinates = (clientX: number, clientY: number, rect: DOMRect): Degrees => {
  const centerX = rect.left + rect.width / 2;
  const centerY = rect.top + rect.height / 2;

  const x = clientX - centerX;
  const y = clientY - centerY;

  // Invert Y because in DOM coordinates the Y axis points down
  const radians = Math.atan2(y, x);
  let degrees = radians * (180 / Math.PI);

  // Synchronize the trigonometric circle with the clock face
  degrees = degrees + TRIG_ANGLE_OFFSET;

  // Normalize negative angles to the range [0, 360)
  if (degrees < 0) {
    degrees += DEGREES_IN_CIRCLE;
  }

  return degrees;
};

// Converts the minute hand angle back to minutes with rounding.

export const degreesToMinutes = (degrees: Degrees): Minutes => {
  const minutes = Math.round(degrees / DEGREES_PER_MINUTE);
  return minutes === MINUTES_IN_HOUR ? 0 : minutes;
};

// Converts the hour hand angle back to hour (0-11).

export const degreesToHours = (degrees: Degrees): Hours => {
  const hour = Math.floor(degrees / DEGREES_PER_HOUR);
  return hour === HOURS_ON_DIAL ? 0 : hour;
};

// Adjusts the 12-hour format from coordinates back to 24-hour format,
// based on what time of day (day or evening) was in the state before this.

export const calculate24Hour = (new12Hour: Hours, current24Hour: Hours): Hours => {
  const isPm = current24Hour >= HOURS_ON_DIAL;

  if (isPm) {
    return new12Hour === 0 ? HOURS_ON_DIAL : new12Hour + HOURS_ON_DIAL; // Evening/Night (12-23)
  }

  return new12Hour; // Morning/Day (0-11)
};

/**
 * Converts an angle (0-360°) to a clock hour (1-12) with rounding to the nearest sector (±15°).
 * Perfect for hover and highlighting numbers.
 */
export const degreesToHoveredHour = (degrees: Degrees): Hours => {
  // Math.round automatically divides sectors by ±15 degrees around each hour
  const hour = Math.round(degrees / DEGREES_PER_HOUR);

  // If the angle is at the boundary (around 0° or 360°), round returns 0 or 12.
  // Both of these values correspond to 12 o'clock on the dial.
  if (hour === 0 || hour === HOURS_ON_DIAL) {
    return 12;
  }

  return hour;
};
