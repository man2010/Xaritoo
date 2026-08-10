"use client";

import { useEffect } from "react";

export default function ImmersiveEffects() {
  useEffect(() => {
    const root = document.documentElement;
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const coarsePointer = window.matchMedia("(pointer: coarse)").matches;
    let frame = 0;

    const updateScroll = () => {
      if (frame) return;
      frame = window.requestAnimationFrame(() => {
        const maximum = document.documentElement.scrollHeight - window.innerHeight;
        root.style.setProperty("--scroll-progress", `${maximum > 0 ? window.scrollY / maximum : 0}`);
        root.style.setProperty("--scroll-y", `${Math.min(window.scrollY, 900)}px`);
        frame = 0;
      });
    };

    const updatePointer = (event: PointerEvent) => {
      if (reducedMotion || coarsePointer) return;
      root.style.setProperty("--pointer-x", `${event.clientX}px`);
      root.style.setProperty("--pointer-y", `${event.clientY}px`);
      root.style.setProperty("--pointer-shift-x", `${(event.clientX / window.innerWidth - 0.5) * 16}px`);
      root.style.setProperty("--pointer-shift-y", `${(event.clientY / window.innerHeight - 0.5) * 12}px`);
    };

    updateScroll();
    window.addEventListener("scroll", updateScroll, { passive: true });
    window.addEventListener("resize", updateScroll, { passive: true });
    window.addEventListener("pointermove", updatePointer, { passive: true });

    return () => {
      window.cancelAnimationFrame(frame);
      window.removeEventListener("scroll", updateScroll);
      window.removeEventListener("resize", updateScroll);
      window.removeEventListener("pointermove", updatePointer);
    };
  }, []);

  return (
    <>
      <div className="scroll-progress" aria-hidden="true" />
      <div className="ambient-spotlight" aria-hidden="true" />
    </>
  );
}
