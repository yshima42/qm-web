export interface AppConfig {
  id: string;
  name: string;
  siteName: string;
  domain: string;
  metadataBase: string;
  logoImage?: string; // ロゴ画像のパス（オプション）
  twitter?: {
    creator?: string;
  };
  ogpImage: {
    ja: string;
    en: string;
  };
}

export type AppId = "quitmate" | "alcohol";
