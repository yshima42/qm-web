"use client";

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "../ui/dialog";
import { DialogTrigger } from "../ui/dialog";
import React from "react";
import { StoreBadges } from "./store-badge";
import Image from "next/image";

type AppDownloadDialogContentProps = {
  title: string;
  description: string;
  qrCodeLabel: string;
  qrCodeAlt: string;
  storeLabel: string;
};

// ダイアログの共通コンテンツを独立したコンポーネントとして切り出す
const AppDownloadDialogContent = ({
  title,
  description,
  qrCodeLabel,
  qrCodeAlt,
  storeLabel,
}: AppDownloadDialogContentProps) => {
  return (
    <>
      <DialogHeader>
        <DialogTitle className="text-xl md:text-2xl">{title}</DialogTitle>
        <DialogDescription className="text-base md:text-lg mt-2">
          {description}
        </DialogDescription>
      </DialogHeader>
      <div className="flex flex-col gap-3 py-3 md:gap-6 md:py-4">
        <div className="flex flex-col items-center space-y-4 md:space-y-6">
          <div className="flex flex-col items-center">
            <p className="font-medium">{qrCodeLabel}</p>
            <div className="bg-white rounded-lg p-2">
              <Image 
                src="/images/qr-code.svg" 
                alt={qrCodeAlt}
                width={120} 
                height={120}
                className="rounded"
              />
            </div>
          </div>
          
          <div className="flex flex-col items-center">
            <p className="font-medium mb-2 md:mb-3">{storeLabel}</p>
            <StoreBadges size="medium" />
          </div>
        </div>
      </div>
    </>
  );
};

// アイコンをダイアログトリガーとして使用するラッパーコンポーネント
export function AppDownloadDialogTrigger({ 
  children, 
  className,
  title,
  description,
  qrCodeLabel,
  qrCodeAlt,
  storeLabel,
}: { 
  children: React.ReactNode; 
  className?: string;
  title: string;
  description: string;
  qrCodeLabel: string;
  qrCodeAlt: string;
  storeLabel: string;
}) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <div 
          role="button"
          tabIndex={0}
          className={className} 
          aria-label={qrCodeAlt}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              (e.currentTarget as HTMLElement).click();
            }
          }}
        >
          {children}
        </div>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <AppDownloadDialogContent
          title={title}
          description={description}
          qrCodeLabel={qrCodeLabel}
          qrCodeAlt={qrCodeAlt}
          storeLabel={storeLabel}
        />
      </DialogContent>
    </Dialog>
  );
}

