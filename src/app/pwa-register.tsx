"use client";

import { useEffect } from "react";

export default function PwaRegister() {
  useEffect(() => {
    if ("serviceWorker" in navigator) {
      const register = () => navigator.serviceWorker.register("/sw.js", { scope: "/" }).catch((error) => {
        console.error("Crescent PWA service worker registration failed:", error);
      });
      if (document.readyState === "complete") void register();
      else window.addEventListener("load", register, { once: true });
    }
  }, []);

  return null;
}
