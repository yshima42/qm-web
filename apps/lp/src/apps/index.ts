import { alcoholConfig } from "./alcohol/config";
import { quitmateConfig } from "./quitmate/config";
import type { AppConfig, AppId } from "./types";

export const appConfigs: Record<AppId, AppConfig> = {
  quitmate: quitmateConfig,
  alcohol: alcoholConfig,
};

export const APP_IDS = ["quitmate", "alcohol"] as const;

// 型をエクスポート
export type { AppConfig, AppId } from "./types";

export function getAppConfig(appId: AppId): AppConfig {
  return appConfigs[appId];
}

export function getAppConfigByDomain(domain: string): AppConfig | null {
  const config = Object.values(appConfigs).find((config) => config.domain === domain);
  return config || null;
}
