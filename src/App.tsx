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

export default function App() {
  const { time, isSynchronized, updateTime, toggleSynchronization } = useClockSync();
  const [clockStyle, setClockStyle] = useState<ClockStyle>("roman");
  const isTouchDevice = useIsTouchDevice();
  const isPm = time.hours >= 12;

  return (
    <ThemeProvider isPm={isPm}>
      <AppContainer>
        <AppHeader />

        <main className="flex w-full max-w-sm flex-col items-center gap-3">
          <ControlPanel
            hours={time.hours}
            minutes={time.minutes}
            isSynchronized={isSynchronized}
            onChangeTime={updateTime}
            onToggleSynchronized={toggleSynchronization}
            currentStyle={clockStyle}
            onStyleChange={setClockStyle}
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
              onChangeTime={updateTime}
            />
          ) : (
            <TimeInput
              hours={time.hours}
              minutes={time.minutes}
              isWorking={isSynchronized}
              onChangeTime={updateTime}
            />
          )}
        </main>
        <AppFooter />
      </AppContainer>
    </ThemeProvider>
  );
}
