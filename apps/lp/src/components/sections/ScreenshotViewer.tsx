import { useState, useEffect, useRef, useCallback } from "react";

type Screenshot = {
  src: string;
  alt: string;
};

type Props = {
  screenshots: Screenshot[];
  className?: string;
  indicatorActiveClassName?: string;
};

const AUTO_PLAY_INTERVAL_MS = 4000;
const ANIMATION_DURATION_MS = 300;
const MIN_SWIPE_DISTANCE = 50;

export default function ScreenshotViewer({
  screenshots,
  className = "",
  indicatorActiveClassName = "bg-green-800",
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
      {/* スクリーンショット画像エリア */}
      <div
        className="screenshot-image-area"
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        <img
          src={screenshots[currentScreenshot].src}
          alt={screenshots[currentScreenshot].alt}
          className={`absolute inset-0 size-full object-contain transition-opacity duration-300 ${
            isAnimating ? "opacity-80" : "opacity-100"
          }`}
        />
      </div>

      {/* インジケーター（画像エリアの外） */}
      {screenshots.length > 1 && (
        <div className="flex justify-center gap-2 pt-4">
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
