import { useEffect } from 'react';

interface Shortcuts {
  onClear?: () => void;
  onFocus?: () => void;
  onPanic?: () => void;
  onProfile?: () => void;
}

export function useKeyboardShortcuts({ onClear, onFocus, onPanic, onProfile }: Shortcuts) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const isCtrlOrCmd = e.ctrlKey || e.metaKey;

      if (isCtrlOrCmd && e.key === 'k') {
        e.preventDefault();
        onClear?.();
      }

      if (isCtrlOrCmd && e.key === 'l') {
        e.preventDefault();
        onFocus?.();
      }

      if (isCtrlOrCmd && e.key === ',') {
          e.preventDefault();
          onProfile?.();
      }

      // Panic shortcut (Ctrl+Shift+P)
      if (isCtrlOrCmd && e.shiftKey && (e.key === 'p' || e.key === 'P')) {
          e.preventDefault();
          onPanic?.();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClear, onFocus, onPanic, onProfile]);
}
