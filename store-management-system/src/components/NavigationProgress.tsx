"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname, useSearchParams } from "next/navigation";

export default function NavigationProgress() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [progress, setProgress] = useState(0);
  const [visible, setVisible] = useState(false);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const completeTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const prevPath = useRef(pathname);

  const start = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    if (completeTimerRef.current) clearTimeout(completeTimerRef.current);
    setProgress(0);
    setVisible(true);
    let p = 0;
    timerRef.current = setInterval(() => {
      p += Math.random() * 12 + 3;
      if (p >= 85) {
        p = 85;
        if (timerRef.current) clearInterval(timerRef.current);
      }
      setProgress(p);
    }, 120);
  };

  const complete = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    setProgress(100);
    completeTimerRef.current = setTimeout(() => {
      setVisible(false);
      setProgress(0);
    }, 350);
  };

  useEffect(() => {
    const currentPath = pathname + searchParams.toString();
    if (prevPath.current !== currentPath) {
      prevPath.current = currentPath;
      complete();
    }
  }, [pathname, searchParams]);

  // Expose start on the window so NavItem can call it
  useEffect(() => {
    (window as any).__navProgressStart = start;
    (window as any).__navProgressComplete = complete;
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
      if (completeTimerRef.current) clearTimeout(completeTimerRef.current);
    };
  }, []);

  if (!visible && progress === 0) return null;

  return (
    <div
      className="fixed top-0 left-0 right-0 h-[2.5px] z-[99999] pointer-events-none"
      style={{ opacity: visible ? 1 : 0, transition: "opacity 0.3s ease" }}
    >
      <div
        className="h-full bg-gradient-to-r from-cyan-400 via-blue-400 to-cyan-300 shadow-[0_0_12px_rgba(0,207,255,0.9)]"
        style={{
          width: `${progress}%`,
          transition:
            progress === 100
              ? "width 0.2s ease"
              : "width 0.15s cubic-bezier(0.16, 1, 0.3, 1)",
        }}
      />
    </div>
  );
}
