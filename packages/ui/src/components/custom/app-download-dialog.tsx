import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "../ui/dialog";
import { DialogTrigger } from "../ui/dialog";
import React from "react";
import { StoreBadges } from "./store-badge";
import Image from "next/image";

// ダイアログの共通コンテンツを独立したコンポーネントとして切り出す
const AppDownloadDialogContent = () => {
  return (
    <>
      <DialogHeader>
        <DialogTitle className="text-xl md:text-2xl">アプリをダウンロード</DialogTitle>
        <DialogDescription className="text-base md:text-lg mt-2">
          まずは無料でダウンロード！あなただけじゃない。共になら、やめられる。
        </DialogDescription>
      </DialogHeader>
      <div className="flex flex-col gap-3 py-3 md:gap-6 md:py-4">
        <div className="flex flex-col items-center space-y-4 md:space-y-6">
          <div className="hidden md:flex md:flex-col md:items-center">
            <p className="font-medium mb-2">QRコードでダウンロード</p>
            <div className="bg-white p-2 rounded-lg">
              <Image 
                src="/images/qr-code.svg" 
                alt="アプリダウンロードQRコード" 
                width={120} 
                height={120}
                className="rounded"
              />
            </div>
          </div>
          
          <div className="flex flex-col items-center">
            <p className="font-medium mb-2 md:mb-3">ストアからダウンロード</p>
            <StoreBadges size="medium" />
          </div>
        </div>
      </div>
    </>
  );
}

export function AppDownloadDialog() {
  return (
    <Dialog>
      <DialogContent className="sm:max-w-md">
        <AppDownloadDialogContent />
      </DialogContent>
    </Dialog>
  );
}

// アイコンをダイアログトリガーとして使用するラッパーコンポーネント
export function AppDownloadDialogTrigger({ 
  children, 
  className 
}: { 
  children: React.ReactNode; 
  className?: string 
}) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <button className={className} aria-label="ダウンロードダイアログを開く">
          {children}
        </button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <AppDownloadDialogContent />
      </DialogContent>
    </Dialog>
  );
}