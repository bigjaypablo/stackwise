import { useEffect, useState } from "react";

const KEY = "stackwise-editor-zoom";
const MIN = 60;
const MAX = 140;

export function useTextSize() {
  const [zoom, setZoom] = useState(100);

  useEffect(() => {
    try {
      const saved = Number(window.localStorage.getItem(KEY));
      if (saved >= MIN && saved <= MAX) setZoom(saved);
    } catch {
      // storage unavailable, keep the default
    }
  }, []);

  function change(next: number) {
    const value = Math.min(MAX, Math.max(MIN, next));
    setZoom(value);
    try {
      window.localStorage.setItem(KEY, String(value));
    } catch {
      // ignore
    }
  }

  return { zoom, change };
}
