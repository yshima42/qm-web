"use client";

import { StoreBadges } from "../sections/store-badge";

export const FinalCTA = () => {
  return (
    <section className="bg-gradient-to-b from-[#f8fbf7] to-white px-6 py-20 text-center">
      <h2 className="mb-4 text-3xl font-bold text-gray-800 md:text-4xl">
        一人で抱え込まずに、仲間と一歩ずつ。
      </h2>
      <p className="mx-auto mb-8 max-w-xl text-lg text-gray-600">
        QuitMateで、やめたい気持ちを続けられる力に変えよう。
      </p>
      <StoreBadges size="medium" />
    </section>
  );
};
