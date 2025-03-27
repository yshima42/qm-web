"use client";

import Image from "next/image";

import { StoreBadges } from "../sections/store-badge";

export const Hero = () => {
  return (
    <section className="flex items-center justify-center bg-gradient-to-b from-[#f8fbf7] to-white p-8 md:py-16">
      <div className="flex w-full max-w-5xl flex-col items-center justify-between gap-2 md:flex-row md:gap-6">
        <div className="flex max-w-lg flex-col items-center text-center md:items-start md:text-left">
          <h1 className="mb-2 text-3xl font-bold leading-tight text-gray-800 md:mb-4 md:text-4xl lg:text-4xl">
            共になら、やめられる
          </h1>
          <p className="mb-4 text-lg md:text-xl lg:text-2xl text-gray-600 md:mb-6">
            禁酒・禁ギャンブル・禁煙・禁欲等
            <br />
            依存症を克服するための匿名SNSアプリ
          </p>
          <StoreBadges size="xl" />
        </div>

        <div className="relative mt-4 h-[550px] w-full md:mt-0 md:w-[350px] lg:w-[400px]">
          <Image
            src="/images/screenshot-stories.png"
            alt="QuitMateアプリのスクリーンショット"
            fill
            className="object-contain drop-shadow-xl"
            priority
          />
        </div>
      </div>
    </section>
  );
};
