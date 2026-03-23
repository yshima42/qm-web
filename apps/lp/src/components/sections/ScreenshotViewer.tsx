import { useState, useEffect, useRef, useCallback } from "react";

type Screenshot = {
  src: string;
  alt: string;
};

type Props = {
  screenshots: Screenshot[];
  className?: string;
  indicatorActiveClassName?: string;
  /** @deprecated Use aspectRatio instead for responsive sizing */
  height?: number;
  aspectRatio?: string;
  borderRadius?: number;
  hideIndicators?: boolean;
};

const AUTO_PLAY_INTERVAL_MS = 4000;
const ANIMATION_DURATION_MS = 300;
const MIN_SWIPE_DISTANCE = 50;

export default function ScreenshotViewer({
  screenshots,
  className = "",
  indicatorActiveClassName = "bg-green-800",
  height,
  aspectRatio,
  borderRadius = 0,
  hideIndicators = false,
}: Props) {
  const [currentScreenshot, setCurrentScreenshot] = useState(0);
  const [touchStart, setTouchStart] = useState(0);
  const [touchEnd, setTouchEnd] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const autoPlayTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const clearAutoPlayTimer = useCallback(() => {
    if (autoPlayTimerRef.current) {
      clearInterval(autoPlayTimerRef.current);
      autoPlayTimerRef.current = null;
    }
  }, []);

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

  const goTo = (index: number) => {
    if (isAnimating) return;
    setIsAnimating(true);
    setCurrentScreenshot(index);
    resetAutoPlayTimer();
    setTimeout(() => setIsAnimating(false), ANIMATION_DURATION_MS);
  };

  // インジケーター同期用カスタムイベント
  useEffect(() => {
    window.dispatchEvent(
      new CustomEvent("screenshot-change", {
        detail: { index: currentScreenshot, total: screenshots.length },
      }),
    );
  }, [currentScreenshot, screenshots.length]);

  // 外部からのインジケータータップを受信
  const goToRef = useRef<(index: number) => void>(goTo);
  goToRef.current = goTo;
  useEffect(() => {
    const handler = (e: Event) => {
      const idx = (e as CustomEvent).detail?.index;
      if (typeof idx === "number") goToRef.current?.(idx);
    };
    window.addEventListener("screenshot-goto", handler);
    return () => window.removeEventListener("screenshot-goto", handler);
  }, []);

  const handleTouchStart = (e: React.TouchEvent) => setTouchStart(e.targetTouches[0].clientX);
  const handleTouchMove = (e: React.TouchEvent) => setTouchEnd(e.targetTouches[0].clientX);
  const handleTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    const distance = touchStart - touchEnd;
    if (distance > MIN_SWIPE_DISTANCE) {
      goTo((currentScreenshot + 1) % screenshots.length);
    } else if (distance < -MIN_SWIPE_DISTANCE) {
      goTo((currentScreenshot - 1 + screenshots.length) % screenshots.length);
    }
    setTouchStart(0);
    setTouchEnd(0);
  };

  return (
    <div className={className}>
      <div
        style={{
          position: "relative",
          width: "100%",
          ...(aspectRatio ? { aspectRatio } : { height: `${height ?? 580}px` }),
          overflow: "hidden",
          borderRadius: borderRadius > 0 ? `${borderRadius}px` : undefined,
          background: "#fff",
        }}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        <img
          src={screenshots[currentScreenshot].src}
          alt={screenshots[currentScreenshot].alt}
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            objectFit: "cover",
            objectPosition: "top",
            transition: "opacity 300ms",
            opacity: isAnimating ? 0.8 : 1,
          }}
        />
      </div>

      {!hideIndicators && screenshots.length > 1 && (
        <div style={{ display: "flex", justifyContent: "center", gap: "8px", paddingTop: "16px" }}>
          {screenshots.map((_, index) => (
            <button
              key={index}
              className={`size-2 rounded-full transition-colors ${
                index === currentScreenshot ? indicatorActiveClassName : "bg-gray-300"
              }`}
              onClick={() => goTo(index)}
              aria-label={`Screenshot ${index + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
