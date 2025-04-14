"use client";

import Image from "next/image";
import { useState, useEffect, useRef } from "react";

type Screenshot = {
  src: string;
  alt: string;
};

type ScreenshotViewerProps = {
  screenshots: Screenshot[];
  className?: string;
};

export const ScreenshotViewer = ({
  screenshots,
  className = "",
}: ScreenshotViewerProps) => {
  const [currentScreenshot, setCurrentScreenshot] = useState(0);
  const [isMobile, setIsMobile] = useState(false);
  const [touchStart, setTouchStart] = useState(0);
  const [touchEnd, setTouchEnd] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // 画面サイズ検出のためのuseEffect
  useEffect(() => {
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkIfMobile();
    window.addEventListener("resize", checkIfMobile);

    return () => {
      window.removeEventListener("resize", checkIfMobile);
    };
  }, []);

  const nextScreenshot = () => {
    if (isAnimating) return;
    setIsAnimating(true);
    setCurrentScreenshot((prev) => (prev + 1) % screenshots.length);
    setTimeout(() => {
      setIsAnimating(false);
    }, 300);
  };

  const prevScreenshot = () => {
    if (isAnimating) return;
    setIsAnimating(true);
    setCurrentScreenshot(
      (prev) => (prev - 1 + screenshots.length) % screenshots.length,
    );
    setTimeout(() => {
      setIsAnimating(false);
    }, 300);
  };

  // スワイプ操作のハンドラー
  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStart(e.targetTouches[0].clientX);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (!touchStart || !touchEnd) return;

    const distance = touchStart - touchEnd;
    const minSwipeDistance = 50;

    if (distance > minSwipeDistance) {
      // 左スワイプ (次へ)
      nextScreenshot();
    } else if (distance < -minSwipeDistance) {
      // 右スワイプ (前へ)
      prevScreenshot();
    }

    setTouchStart(0);
    setTouchEnd(0);
  };

  return (
    <div className={`relative size-full ${className}`}>
      <div
        ref={containerRef}
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
              }}
              aria-label={`スクリーンショット ${String(index + 1)}を表示`}
            />
          ))}
        </div>

        {/* 前後ボタン - PCとモバイルの位置を近づける */}
        {screenshots.length > 1 && (
          <>
            <button
              onClick={prevScreenshot}
              className={`absolute top-1/2 z-10 flex items-center justify-center rounded-full bg-gray-50/80 text-gray-800 shadow-lg transition-all hover:bg-gray-100 active:scale-95 active:bg-gray-200 ${
                isMobile ? "-left-4 size-8" : "-left-1 size-10"
              } -translate-y-1/2`}
              aria-label="previous screenshot"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width={isMobile ? "16" : "20"}
                height={isMobile ? "16" : "20"}
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M15 18l-6-6 6-6" />
              </svg>
            </button>
            <button
              onClick={nextScreenshot}
              className={`absolute top-1/2 z-10 flex items-center justify-center rounded-full bg-gray-50/80 text-gray-800 shadow-lg transition-all hover:bg-gray-100 active:scale-95 active:bg-gray-200 ${
                isMobile ? "-right-4 size-8" : "-right-1 size-10"
              } -translate-y-1/2`}
              aria-label="next screenshot"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width={isMobile ? "16" : "20"}
                height={isMobile ? "16" : "20"}
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M9 18l6-6-6-6" />
              </svg>
            </button>
          </>
        )}
      </div>
    </div>
  );
};
