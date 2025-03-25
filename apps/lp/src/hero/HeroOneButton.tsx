import type { FC, ReactNode } from 'react';

interface IHeroOneButtonProps {
  title: string;
  subtitle: string;
  description1: string;
  description2: string;
  button: ReactNode;
}

const HeroOneButton: FC<IHeroOneButtonProps> = ({
  title,
  subtitle,
  description1,
  description2,
  button,
}) => (
  <header className="flex flex-col items-center justify-center md:items-start">
    <h1 className="hidden whitespace-pre-line text-3xl font-bold leading-hero text-gray-900 md:block md:text-5xl">
      {title}
    </h1>
    <h2 className="whitespace-pre-line text-3xl font-bold text-green-700 md:text-4xl">
      {subtitle}
    </h2>
    <div className="py-4 text-lg font-semibold md:text-2xl">
      <p>{description1}</p>
      <p>{description2}</p>
    </div>
    {button}
  </header>
);

export { HeroOneButton };
