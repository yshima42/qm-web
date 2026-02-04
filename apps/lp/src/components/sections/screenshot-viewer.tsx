"use client";

import Image from "next/image";
import { useState, useEffect, useRef, useCallback } from "react";

type Screenshot = {
  src: string;
  alt: string;
};

type ScreenshotViewerProps = {
  screenshots: Screenshot[];
  className?: string;
};

const AUTO_PLAY_INTERVAL_MS = 4000;
const ANIMATION_DURATION_MS = 300;
const MIN_SWIPE_DISTANCE = 50;
const MOBILE_BREAKPOINT = 768;

function clearTimer(ref: React.MutableRefObject<ReturnType<typeof setInterval> | null>) {
  if (ref.current) {
    clearInterval(ref.current);
    ref.current = null;
  }
}

type NavButtonProps = {
  direction: "prev" | "next";
  isMobile: boolean;
  onClick: () => void;
  "aria-label": string;
};

function NavButton({ direction, isMobile, onClick, "aria-label": ariaLabel }: NavButtonProps) {
  const isPrev = direction === "prev";
  const positionClass = isPrev
    ? isMobile
      ? "-left-4 size-8"
      : "-left-1 size-10"
    : isMobile
      ? "-right-4 size-8"
      : "-right-1 size-10";
  const size = isMobile ? 16 : 20;
  return (
    <button
      type="button"
      onClick={onClick}
      className={`absolute top-1/2 z-10 flex items-center justify-center rounded-full bg-gray-50/80 text-gray-800 shadow-lg transition-all hover:bg-gray-100 active:scale-95 active:bg-gray-200 ${positionClass} -translate-y-1/2`}
      aria-label={ariaLabel}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        {isPrev ? <path d="M15 18l-6-6 6-6" /> : <path d="M9 18l6-6-6-6" />}
      </svg>
    </button>
  );
}

export const ScreenshotViewer = ({ screenshots, className = "" }: ScreenshotViewerProps) => {
  const [currentScreenshot, setCurrentScreenshot] = useState(0);
  const [isMobile, setIsMobile] = useState(false);
  const [touchStart, setTouchStart] = useState(0);
  const [touchEnd, setTouchEnd] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const autoPlayTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const clearAutoPlayTimer = useCallback(() => clearTimer(autoPlayTimerRef), []);

  const resetAutoPlayTimer = useCallback(() => {
    clearAutoPlayTimer();
    if (screenshots.length <= 1) return;
    autoPlayTimerRef.current = setInterval(() => {
      setCurrentScreenshot((prev) => (prev + 1) % screenshots.length);
    }, AUTO_PLAY_INTERVAL_MS);
  }, [screenshots.length, clearAutoPlayTimer]);

  useEffect(() => {
    resetAutoPlayTimer();
    return () => clearAutoPlayTimer();
  }, [resetAutoPlayTimer, clearAutoPlayTimer]);

  useEffect(() => {
    const checkIfMobile = () => setIsMobile(window.innerWidth < MOBILE_BREAKPOINT);
    checkIfMobile();
    window.addEventListener("resize", checkIfMobile);
    return () => window.removeEventListener("resize", checkIfMobile);
  }, []);

  const nextScreenshot = () => {
    if (isAnimating) return;
    setIsAnimating(true);
    setCurrentScreenshot((prev) => (prev + 1) % screenshots.length);
    resetAutoPlayTimer();
    setTimeout(() => setIsAnimating(false), ANIMATION_DURATION_MS);
  };

  const prevScreenshot = () => {
    if (isAnimating) return;
    setIsAnimating(true);
    setCurrentScreenshot((prev) => (prev - 1 + screenshots.length) % screenshots.length);
    resetAutoPlayTimer();
    setTimeout(() => setIsAnimating(false), ANIMATION_DURATION_MS);
  };

  const handleTouchStart = (e: React.TouchEvent) => setTouchStart(e.targetTouches[0].clientX);
  const handleTouchMove = (e: React.TouchEvent) => setTouchEnd(e.targetTouches[0].clientX);
  const handleTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    const distance = touchStart - touchEnd;
    if (distance > MIN_SWIPE_DISTANCE) nextScreenshot();
    else if (distance < -MIN_SWIPE_DISTANCE) prevScreenshot();
    setTouchStart(0);
    setTouchEnd(0);
  };

  return (
    <div className={`relative size-full ${className}`}>
      <div
        className="relative size-full overflow-visible"
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        {/* スクリーンショット画像 */}
        <Image
          src={screenshots[currentScreenshot].src}
          alt={screenshots[currentScreenshot].alt}
          fill
          className={`object-contain transition-opacity duration-300 ${isAnimating ? "opacity-80" : "opacity-100"}`}
          priority
        />

        {/* ページインジケーター - 画像の下に配置 */}
        <div className="absolute inset-x-0 -bottom-8 z-10 flex justify-center gap-2 py-2">
          {screenshots.map((_, index) => (
            <button
              key={index}
              className={`size-2 rounded-full shadow-sm transition-colors ${
                index === currentScreenshot ? "bg-green-800" : "bg-gray-200"
              }`}
              onClick={() => {
                setCurrentScreenshot(index);
                resetAutoPlayTimer();
              }}
              aria-label={`スクリーンショット ${String(index + 1)}を表示`}
            />
          ))}
        </div>

        {screenshots.length > 1 && (
          <>
            <NavButton
              direction="prev"
              isMobile={isMobile}
              onClick={prevScreenshot}
              aria-label="previous screenshot"
            />
            <NavButton
              direction="next"
              isMobile={isMobile}
              onClick={nextScreenshot}
              aria-label="next screenshot"
            />
          </>
        )}
      </div>
    </div>
  );
};
