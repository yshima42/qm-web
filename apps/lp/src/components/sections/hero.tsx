"use client";

import { StoreBadges } from "@quitmate/ui";

import { ScreenshotViewer } from "../sections/screenshot-viewer";

export const Hero = () => {
  const screenshots = [
    {
      src: "/images/screenshot-stories.png",
      alt: "QuitMateアプリのストーリー画面",
    },
    {
      src: "/images/screenshot-categories.png",
      alt: "QuitMateアプリのカテゴリ画面",
    },
    {
      src: "/images/screenshot-program.png",
      alt: "QuitMateアプリのプログラム画面",
    },
    {
      src: "/images/screenshot-habits.png",
      alt: "QuitMateアプリの習慣画面",
    },
  ];

  return (
    <section className="flex items-center justify-center bg-gradient-to-b from-[#f8fbf7] to-white p-8 py-12 md:py-16">
      <div className="flex w-full max-w-5xl flex-col items-center justify-between gap-2 md:flex-row md:gap-6">
        <div className="flex max-w-lg flex-col items-center text-center md:items-start md:text-left">
          <h1 className="mb-2 text-3xl font-semibold leading-tight text-gray-800 md:mb-4 md:text-4xl md:font-bold lg:text-4xl">
            共になら、やめられる
          </h1>
          <p className="mb-4 text-lg text-gray-600 md:mb-6 md:text-xl lg:text-2xl">
            禁酒・禁ギャンブル・禁煙・禁欲など
            <br />
            依存症を克服するための匿名SNSアプリ
          </p>
          <div className="hidden md:block">
            <StoreBadges size="xl" />
          </div>
          <div className="block md:hidden">
            <StoreBadges size="medium" />
          </div>
        </div>

        <div className="relative mt-4 h-[600px] w-full md:mt-0 md:w-[380px] lg:w-[450px]">
          <ScreenshotViewer screenshots={screenshots} />
        </div>
      </div>
    </section>
  );
};
