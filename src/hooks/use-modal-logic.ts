import { useEffect, useRef, useState } from "react";
import { clockAudio } from "../utils/clock-audio";

interface UseModalLogicProps {
  isOpen: boolean;
  onClose: () => void;
}

export function useModalLogic({ isOpen, onClose }: UseModalLogicProps) {
  const [shouldRender, setShouldRender] = useState(isOpen);

  const modalRef = useRef<HTMLDivElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const previousFocusRef = useRef<HTMLElement | null>(null);

  // Синхронизация рендеринга на этапе вызова функции
  if (isOpen && !shouldRender) {
    setShouldRender(true);
  }

  // 1. Управление жизненным циклом DOM и скроллом страницы
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
      return;
    }

    const timer = setTimeout(() => setShouldRender(false), 150);
    document.body.style.overflow = "";

    return () => {
      clearTimeout(timer);
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  // 2. Менеджмент фокуса (Автофокус + Возврат)
  useEffect(() => {
    if (isOpen) {
      previousFocusRef.current = document.activeElement as HTMLElement;
      const timer = setTimeout(() => closeButtonRef.current?.focus(), 50);
      return () => clearTimeout(timer);
    } else {
      previousFocusRef.current?.focus();
    }
  }, [isOpen]);

  // 3. Обработка клавиш (Esc + Focus Trap)
  useEffect(() => {
    if (!isOpen) { return; }

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        clockAudio.playClick();
        onClose();
        return;
      }

      if (e.key === "Tab") {
        if (!modalRef.current) { return; }

        const focusable = modalRef.current.querySelectorAll<HTMLElement>(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );

        if (focusable.length === 0) { return; }

        const first = focusable[0];
        const last = focusable[focusable.length - 1];

        if (focusable.length === 1) {
          e.preventDefault();
          first.focus();
          return;
        }

        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  const handleCloseWithSound = () => {
    clockAudio.playClick();
    onClose();
  };

  return {
    shouldRender,
    modalRef,
    closeButtonRef,
    handleCloseWithSound,
  };
}
