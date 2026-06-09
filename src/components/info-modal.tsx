import { createPortal } from "react-dom";
import { useModalLogic } from "../hooks/use-modal-logic";
import { useTheme } from "../theme/use-theme";

interface InfoModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function InfoModal({ isOpen, onClose }: InfoModalProps) {
  const { themeClasses } = useTheme();
  const { containerBackground, containerBorder, textActive, appText, buttonFocus } = themeClasses;

  const { shouldRender, modalRef, closeButtonRef, handleCloseWithSound } = useModalLogic({ isOpen, onClose });

  if (!shouldRender) { return null; }

  const overlayClasses = `
    fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs
    ${isOpen ? "animate-fade-in" : "animate-fade-out"}
  `.trim().replace(/\s+/g, " ");

  const cardClasses = `
    relative w-full max-w-sm p-6 rounded-2xl border shadow-2xl flex flex-col gap-4 transition-all duration-500
    ${containerBackground} ${containerBorder} ${textActive}
    ${isOpen ? "animate-scale-up" : "animate-scale-down"}
  `.trim().replace(/\s+/g, " ");

  const closeButtonClasses = `
    absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-xl bg-transparent cursor-pointer transition-all duration-300 active:scale-90 outline-none
    ${appText} opacity-60 hover:opacity-100 hover:${textActive} focus-visible:opacity-100 focus-visible:${textActive} focus-visible:ring-2 ${buttonFocus}
  `.trim().replace(/\s+/g, " ");

  return createPortal(
    <div className={overlayClasses} onClick={handleCloseWithSound}>
      <div ref={modalRef} className={cardClasses} onClick={(e) => e.stopPropagation()}>

        {/* Кнопка закрытия */}
        <button ref={closeButtonRef} type="button" onClick={handleCloseWithSound} className={closeButtonClasses} aria-label="Close help">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>

        {/* Контентная часть */}
        <h2 className="text-xl font-bold tracking-tight pr-8">ClockWisy Guide</h2>

        <div className={`space-y-3 text-sm font-sans ${appText}`}>
          <ul className="pl-5 space-y-1.5">
            <li>
              <strong className={textActive}>Drag Hands:</strong> Click and drag the clock hands directly to set custom hours or minutes manually
            </li>
            <li>
              <strong className={textActive}>Digital Inputs:</strong> Change the time in the input fields and see how the time on the clock face changes
            </li>
            <li>
              <strong className={textActive}>Have fun:</strong> Just try all the buttons
            </li>
          </ul>
        </div>

      </div>
    </div>,
    document.body
  );
}
