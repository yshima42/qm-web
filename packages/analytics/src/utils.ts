import { EventParams } from './types';

/**
 * イベントをGoogle Analyticsに送信するユーティリティ関数
 */
export const trackEvent = (
  eventName: string,
  eventParams?: EventParams
) => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', eventName, eventParams);
  }
};

/**
 * ユーザープロパティを設定するユーティリティ関数
 */
export const setUserProperties = (properties: Record<string, string | number | boolean>) => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('set', 'user_properties', properties);
  }
};