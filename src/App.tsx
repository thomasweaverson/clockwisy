import { useState } from "react";
import { type ClockStyle } from "./constants/clock-variants";

import { useClockSync } from "./hooks/use-clock-sync";
import { ThemeProvider } from "./theme/theme-provider";

import AnalogClock from "./components/analog-clock";
import AppContainer from "./components/app-container";
import AppFooter from "./components/app-footer";
import AppHeader from "./components/app-header";
import ControlPanel from "./components/control-panel";
import MobileTimePicker from "./components/mobile-time-picker/mobile-time-picker";
import TimeInput from "./components/time-input";
import { useIsTouchDevice } from "./hooks/use-is-touch-device";
import type { Theme } from "./theme/types";

export default function App() {
  const { time, isSynchronized, updateTime, toggleSynchronization } = useClockSync();
  const [clockStyle, setClockStyle] = useState<ClockStyle>("roman");
  const [isAmPm, setIsAmPm] = useState(false);

  const [theme, setTheme] = useState<Theme>("light");
  const isTouchDevice = useIsTouchDevice();

  return (
    <ThemeProvider theme={theme}>
      <AppContainer>
        <AppHeader />

        <main className="flex max-w-sm flex-col items-center gap-1">
          <ControlPanel
            isSynchronized={isSynchronized}
            onToggleSynchronized={toggleSynchronization}
            currentStyle={clockStyle}
            onStyleChange={setClockStyle}
            isAmPm={isAmPm}
            onChangeAmPm={setIsAmPm}
            onChangeTheme={setTheme}
          />

          <AnalogClock
            hours={time.hours}
            minutes={time.minutes}
            currentStyle={clockStyle}
            onChangeTime={updateTime}
          />

          {isTouchDevice ? (
            <MobileTimePicker
              hours={time.hours}
              minutes={time.minutes}
              isWorking={isSynchronized}
              isAmPm={isAmPm}
              onChangeTime={updateTime}
            />
          ) : (
            <TimeInput
              hours={time.hours}
              minutes={time.minutes}
              isWorking={isSynchronized}
              isAmPm={isAmPm}
              onChangeTime={updateTime}
            />
          )}
        </main>
        <AppFooter />
      </AppContainer>
    </ThemeProvider>
  );
}
