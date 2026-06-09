import { useTheme } from "../theme/use-theme";

export default function AppFooter() {
  const { themeClasses } = useTheme();
  const { textNeutral, textActive } = themeClasses;

  const currentYear = new Date().getFullYear();

  return (
    <footer
      className={`
        mt-auto flex flex-col items-center gap-2 pt-8 pb-4
        text-center text-xs font-medium tracking-wide select-none
        transition-colors duration-700 ${textNeutral}
      `.trim()}
    >
      <a
        href="https://github.com/thomasweaverson/clockwise"
        target="_blank"
        rel="noopener noreferrer"
        className={`
          group flex items-center gap-2 px-3 py-1.5 rounded-lg
          transition-all duration-300 hover:bg-current/20
          focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-current/30
        `.trim()}
        aria-label="Source code on GitHub"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="w-4 h-4 transition-transform duration-300 group-hover:scale-110"
        >
          <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
          <path d="M9 18c-4.51 2-5-2-7-2" />
        </svg>
        <span className={`transition-colors duration-300 group-hover:${textActive}`}>
          View on GitHub
        </span>
      </a>

      <div className="opacity-60 flex flex-col gap-0.5">
        <p>© {currentYear} ClockWise. Built with Vite + React + TS</p>
      </div>
    </footer>
  );
}
