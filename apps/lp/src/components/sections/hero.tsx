"use client";

import Link from "next/link";
import Image from "next/image";

export const Hero = () => {
  return (
    <section className="flex items-center justify-center py-16 px-4 bg-gradient-to-b from-[#f8fbf7] to-white">
      <div className="flex flex-col md:flex-row items-center justify-between w-full max-w-5xl gap-4 md:gap-6">
        <div className="flex flex-col items-center md:items-start text-center md:text-left max-w-lg">
          <h1 className="text-3xl md:text-4xl lg:text-4xl font-bold mb-4 leading-tight text-gray-800">
            共になら、やめられる。
          </h1>
          <p className="text-gray-600 text-lg mb-6">
            QuitMateは、アルコール・ギャンブル・たばこなど、依存症の克服を支える匿名SNSアプリです。
          </p>

          <div className="flex flex-col sm:flex-row items-center gap-3">
            <Link href="https://apps.apple.com/jp/app/id123456789" target="_blank">
              <div className="h-[50px] flex items-center">
                <Image 
                  src="/images/apple-store-badge.png" 
                  alt="App Store" 
                  width={150} 
                  height={50} 
                  className="h-full w-auto object-contain"
                />
              </div>
            </Link>
            <Link
              href="https://play.google.com/store/apps/details?id=com.quitmate.app"
              target="_blank"
            >
              <div className="h-[50px] flex items-center">
                <Image 
                  src="/images/google-play-badge.png" 
                  alt="Google Play" 
                  width={168} 
                  height={50} 
                  className="h-full w-auto object-contain"
                />
              </div>
            </Link>
          </div>
        </div>

        <div className="relative w-full md:w-[350px] lg:w-[400px] h-[550px] mt-8 md:mt-0">
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
