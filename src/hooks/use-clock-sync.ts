import { useCallback, useEffect, useState } from "react";
import { type Hours, type Minutes } from "../utils/clock-math";

interface ClockTime {
  hours: Hours;
  minutes: Minutes;
}

const getSystemTime = (): ClockTime => {
  const now = new Date();
  return {
    hours: now.getHours() as Hours,
    minutes: now.getMinutes() as Minutes,
  };
};

export function useClockSync() {
  const [time, setTime] = useState<ClockTime>(getSystemTime);
  const [isSynchronized, setIsSynchronized] = useState(true);

  useEffect(() => {
    if (!isSynchronized) { return; }

    let intervalId: ReturnType<typeof setInterval>;

    // Calculate the time until the next minute
    const now = new Date();
    const msUntilNextMinute = 60000 - (now.getSeconds() * 1000 + now.getMilliseconds());

    // We start a timeout that will run exactly at 00 seconds of the next minute
    const timeoutId = setTimeout(() => {
      setTime(getSystemTime());

      // And immediately inside we start an interval for every 60 seconds
      intervalId = setInterval(() => {
        setTime(getSystemTime());
      }, 60000);
    }, msUntilNextMinute);

    return () => {
      clearTimeout(timeoutId);
      if (intervalId) { clearInterval(intervalId); }
    };
  }, [isSynchronized]);

  const updateTime = useCallback((newHours: Hours, newMinutes: Minutes) => {
    setIsSynchronized(false);
    setTime({ hours: newHours, minutes: newMinutes });
  }, []);

  const toggleSynchronization = useCallback(() => {
    setIsSynchronized((prev) => {
      const nextSyncState = !prev;
      if (nextSyncState) {
        setTime(getSystemTime());
      }
      return nextSyncState;
    });
  }, []);

  return {
    time,
    isSynchronized,
    updateTime,
    toggleSynchronization,
  };
}
