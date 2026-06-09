import { useTheme } from "../theme/use-theme";

export default function AppContainer({ children }: React.PropsWithChildren) {
  const { themeClasses } = useTheme();
  const { appBackground, appText } = themeClasses;

  return (
    <div
      className={`
        flex min-h-dvh flex-col items-center justify-center p-3 gap-3
        ${appBackground} ${appText}
      `}
    >
      {children}
    </div>
  );
}
