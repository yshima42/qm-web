// Google Analytics イベントの型定義
export type GTagEvent = {
    page_path?: string;
    page_title?: string;
    page_location?: string;
    send_to?: string;
    [key: string]: unknown;
  };
  
  // gtag関数の型定義を修正
  export type GTagFunction = (
    command: 'config' | 'event' | 'js' | 'set',  // 'set'を追加
    targetId: string | { [key: string]: any },   // オブジェクトも受け付けるように
    options?: GTagEvent | Record<string, any>    // オプションの型も拡張
  ) => void;
  
  // イベントパラメータの型定義
  export type EventParams = {
    [key: string]: string | number | boolean | null | undefined;
  };