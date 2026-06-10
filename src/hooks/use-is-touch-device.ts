import { useEffect, useState } from "react";

const getIsTouchDevice = () => {
  if (typeof window === "undefined") {
    return false;
  }

  return window.matchMedia("(pointer: coarse)").matches;
};

export function useIsTouchDevice() {
  const [isTouchDevice, setIsTouchDevice] =
    useState(getIsTouchDevice);

  useEffect(() => {
    const mediaQuery =
      window.matchMedia("(pointer: coarse)");

    const update = () => {
      setIsTouchDevice(mediaQuery.matches);
    };

    mediaQuery.addEventListener("change", update);

    return () => {
      mediaQuery.removeEventListener("change", update);
    };
  }, []);

  return isTouchDevice;
}
