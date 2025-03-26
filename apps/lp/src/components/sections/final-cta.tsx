'use client';

import Link from 'next/link';
import Image from 'next/image';

export const FinalCTA = () => {
  return (
    <section className="py-20 px-6 text-center bg-gradient-to-b from-[#f8fbf7] to-white">
      <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-800">
        一人で抱え込まずに、仲間と一歩ずつ。
      </h2>
      <p className="text-gray-600 text-lg max-w-xl mx-auto mb-8">
        QuitMateで、やめたい気持ちを続けられる力に変えよう。
      </p>
      <div className="flex flex-col sm:flex-row justify-center items-center gap-4">
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
        <Link href="https://play.google.com/store/apps/details?id=com.quitmate.app" target="_blank">
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
    </section>
  );
};
