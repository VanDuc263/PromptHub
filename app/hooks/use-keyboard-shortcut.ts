import { useEffect } from "react";

export function useKeyboardShortcut(
  key: string,
  callback: () => void,
  options: { ctrlOrMeta?: boolean } = {},
) {
  useEffect(() => {
    const handler = (event: KeyboardEvent) => {
      const modifierMatches =
        !options.ctrlOrMeta || event.ctrlKey || event.metaKey;
      if (event.key.toLowerCase() === key.toLowerCase() && modifierMatches) {
        event.preventDefault();
        callback();
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [callback, key, options.ctrlOrMeta]);
}
