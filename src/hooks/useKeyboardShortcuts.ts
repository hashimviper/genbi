import { useEffect } from 'react';

interface ShortcutConfig {
  onSave?: () => void;
  onUndo?: () => void;
  onRedo?: () => void;
  onExport?: () => void;
  onDelete?: () => void;
  onEscape?: () => void;
  onFullscreen?: () => void;
}

export function useKeyboardShortcuts(config: ShortcutConfig) {
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      const mod = e.ctrlKey || e.metaKey;

      if (mod && e.key === 's') {
        e.preventDefault();
        config.onSave?.();
      }
      if (mod && e.key === 'z' && !e.shiftKey) {
        e.preventDefault();
        config.onUndo?.();
      }
      if (mod && (e.key === 'y' || (e.key === 'z' && e.shiftKey))) {
        e.preventDefault();
        config.onRedo?.();
      }
      if (mod && e.key === 'e') {
        e.preventDefault();
        config.onExport?.();
      }
      if (e.key === 'Delete' && !e.ctrlKey) {
        config.onDelete?.();
      }
      if (e.key === 'Escape') {
        config.onEscape?.();
      }
      if (e.key === 'F11') {
        e.preventDefault();
        config.onFullscreen?.();
      }
    };

    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [config]);
}
