'use client';

import { Button } from '@quitmate/ui';
import { ArrowLeft } from 'lucide-react';
import { useRouter } from 'next/navigation';

type HeaderProps = {
  title: string;
  titleElement?: React.ReactNode;
  showBackButton?: boolean;
  backUrl?: string;
  rightElement?: React.ReactNode;
};

export function Header({
  title,
  titleElement,
  showBackButton = true,
  backUrl,
  rightElement,
}: HeaderProps) {
  const router = useRouter();

  const handleBack = () => {
    if (backUrl) {
      router.push(backUrl);
    } else {
      router.back();
    }
  };

  return (
    <header className="sticky top-0 z-20 border-b border-border bg-background/80 backdrop-blur-sm">
      <div className="relative flex h-14 items-center justify-between px-4">
        <div className="flex w-24 items-center justify-start">
          {showBackButton && (
            <Button variant="ghost" size="icon" onClick={handleBack} className="ml-12 md:ml-0">
              <ArrowLeft className="size-5" />
              <span className="sr-only">戻る</span>
            </Button>
          )}
        </div>

        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-center">
          {titleElement ? (
            <>
              <div className="md:hidden">{titleElement}</div>
              <h1 className="hidden whitespace-nowrap text-base font-medium md:block">{title}</h1>
            </>
          ) : (
            <h1 className="whitespace-nowrap text-base font-medium">{title}</h1>
          )}
        </div>

        <div className="flex w-24 justify-end">{rightElement}</div>
      </div>
    </header>
  );
}
