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
        <DialogTitle>アプリをダウンロード</DialogTitle>
        <DialogDescription>
          より良い体験のために、アプリをダウンロードしてください。
        </DialogDescription>
      </DialogHeader>
      <div className="flex flex-col gap-6 py-4">
        <p className="text-center">アプリを使うとより快適に利用できます。今すぐダウンロードしましょう！</p>
        
        <div className="flex flex-col items-center space-y-6">
          <div className="flex flex-col items-center">
            <p className="font-medium mb-3">QRコードでダウンロード</p>
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
            <p className="font-medium mb-3">ストアからダウンロード</p>
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
export function IconWithDownloadDialog({ 
  children, 
  className 
}: { 
  children: React.ReactNode; 
  className?: string 
}) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <button className={className}>
          {children}
        </button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <AppDownloadDialogContent />
      </DialogContent>
    </Dialog>
  );
}