/**
 * namespace ごとのテーマカラー設定
 * 各コンポーネントで繰り返されていた条件分岐をデータドリブンに集約
 */

export type ThemeConfig = {
  headerBg: string;
  footerBg: string;
  documentBg: string;
  titleColor: string;
  navText: string;
  navHover: string;
  mobileLinkColor: string;
  footerLinkColor: string;
  footerBorder: string;
  footerSocial: string;
  footerCopyright: string;
  indicatorColor: string;
  lightText: boolean;
  /** CSS値としてのアクセントカラー (style属性で使用) */
  accentColor: string;
};

const defaultTheme: ThemeConfig = {
  headerBg: "bg-white/80 shadow-sm",
  footerBg: "bg-white",
  documentBg: "bg-[#f8fbf7]",
  titleColor: "text-gray-800",
  navText: "text-gray-600",
  navHover: "hover:text-primary-light",
  mobileLinkColor: "text-gray-600 hover:text-primary-light",
  footerLinkColor: "text-gray-600 hover:text-primary-light",
  footerBorder: "border-gray-200",
  footerSocial: "text-gray-600 hover:text-primary-light",
  footerCopyright: "text-gray-500",
  indicatorColor: "bg-[#2E6C28]",
  lightText: false,
  accentColor: "#2E6C28",
};

const themes: Record<string, Partial<ThemeConfig>> = {
  alcohol: {
    headerBg: "bg-[#d8e8d4]/80 shadow-sm",
    footerBg: "bg-[#d8e8d4]",
    documentBg: "bg-[#d8e8d4]",
    navText: "text-gray-700",
    navHover: "hover:text-gray-900",
    mobileLinkColor: "text-gray-700 hover:text-gray-900",
    footerLinkColor: "text-gray-700 hover:text-gray-900",
    footerBorder: "border-green-200",
    footerSocial: "text-gray-600 hover:text-gray-800",
    footerCopyright: "text-gray-600",
    indicatorColor: "bg-green-700",
    accentColor: "#15803d",
  },
  kinshu: {
    headerBg: "bg-[#e8eaf6]/80 shadow-sm",
    footerBg: "bg-[#e8eaf6]",
    documentBg: "bg-[#e8eaf6]",
    titleColor: "text-gray-900",
    navText: "text-gray-900",
    navHover: "hover:text-gray-700",
    mobileLinkColor: "text-gray-900 hover:text-gray-700",
    footerLinkColor: "text-gray-900 hover:text-gray-700",
    footerBorder: "border-indigo-200",
    footerSocial: "text-gray-900 hover:text-gray-700",
    footerCopyright: "text-gray-700",
    indicatorColor: "bg-[#3949ab]",
    accentColor: "#3949ab",
  },
  porn: {
    headerBg: "bg-[#1a0a1f]/80 shadow-none",
    footerBg: "bg-[#1a0a1f]",
    documentBg: "bg-[#1a0a1f]",
    titleColor: "text-white",
    navText: "text-purple-200",
    navHover: "hover:text-white",
    mobileLinkColor: "text-purple-200 hover:text-white",
    footerLinkColor: "text-purple-200 hover:text-white",
    footerBorder: "border-purple-900/50",
    footerSocial: "text-purple-300 hover:text-white",
    footerCopyright: "text-purple-400",
    indicatorColor: "bg-purple-400",
    lightText: true,
    accentColor: "#c084fc",
  },
  tobacco: {
    headerBg: "bg-[#e8f5e9]/80 shadow-sm",
    footerBg: "bg-[#e8f5e9]",
    documentBg: "bg-[#e8f5e9]",
    titleColor: "text-gray-900",
    navText: "text-gray-900",
    navHover: "hover:text-gray-700",
    mobileLinkColor: "text-gray-900 hover:text-gray-700",
    footerLinkColor: "text-gray-900 hover:text-gray-700",
    footerBorder: "border-green-200",
    footerSocial: "text-gray-900 hover:text-gray-700",
    footerCopyright: "text-gray-700",
    indicatorColor: "bg-green-600",
    accentColor: "#16a34a",
  },
};

export function getTheme(namespace?: string): ThemeConfig {
  if (!namespace || !(namespace in themes)) return defaultTheme;
  return { ...defaultTheme, ...themes[namespace] };
}

/** namespace ごとのサイト名 */
export const SITE_NAMES: Record<string, string> = {
  "": "QuitMate",
  alcohol: "Alcohol-Free Week",
  kinshu: "Alcohol-Free Mate",
  porn: "Porn-Free Mate",
  tobacco: "Tobacco-Free Mate",
};

/** namespace ごとのストアURL */
export const STORE_URLS: Record<string, { apple: string; google: string }> = {
  default: {
    apple: "https://apps.apple.com/jp/app/id6462843097",
    google: "https://play.google.com/store/apps/details?id=com.quitmate.quitmate",
  },
  alcohol: {
    apple: "https://apps.apple.com/jp/app/id6756336624",
    google: "https://play.google.com/store/apps/details?id=com.quitmate.alcohol",
  },
  kinshu: {
    apple: "https://apps.apple.com/jp/app/id6758752490",
    google: "https://play.google.com/store/apps/details?id=com.quitmate.kinshu",
  },
  porn: {
    apple: "https://apps.apple.com/jp/app/id6759315555",
    google: "https://play.google.com/store/apps/details?id=com.quitmate.abstinence",
  },
  tobacco: {
    apple: "https://apps.apple.com/jp/app/id6759312070",
    google: "https://play.google.com/store/apps/details?id=com.quitmate.tobacco",
  },
};

/** namespace ごとのロゴアイコン */
export const LOGO_ICONS: Record<string, string> = {
  "": "/images/icon-web.webp",
  alcohol: "/images/kinshu_icon.webp",
  kinshu: "/images/alcohol_icon.webp",
  porn: "/images/porn_icon.webp",
  tobacco: "/images/tobacco_icon.webp",
};

/** namespace ごとのOGP画像 */
export const OGP_IMAGES: Record<string, string> = {
  alcohol: "/images/ja/ogp-alcohol.png",
  kinshu: "/images/ja/ogp-kinshu.png",
  porn: "/images/ja/ogp-porn.png",
  tobacco: "/images/ja/ogp-tobacco.png",
};

/** namespace → URLパス */
export const NAMESPACE_TO_PATH: Record<string, string> = {
  alcohol: "/challenge",
  kinshu: "/alcohol",
  porn: "/porn",
  tobacco: "/tobacco",
};

/** namespace ごとのスクリーンショット設定 */
export const SCREENSHOT_CONFIG: Record<string, { image: string; altKey: string }[]> = {
  default: [
    { image: "screenshot-stories.webp", altKey: "screenshot-stories-alt" },
    { image: "screenshot-categories.webp", altKey: "screenshot-categories-alt" },
    { image: "screenshot-program.webp", altKey: "screenshot-program-alt" },
    { image: "screenshot-habits.webp", altKey: "screenshot-habits-alt" },
  ],
  alcohol: [
    { image: "k-screenshot-home.webp", altKey: "screenshot-home-alt" },
    { image: "k-screenshot-timeline.webp", altKey: "screenshot-timeline-alt" },
    { image: "k-screenshot-profile.webp", altKey: "screenshot-profile-alt" },
    { image: "k-screenshot-diagnosis.webp", altKey: "screenshot-diagnosis-alt" },
    { image: "k-screenshot-roadmap.webp", altKey: "screenshot-roadmap-alt" },
  ],
  kinshu: [
    { image: "a-screenshot-home.webp", altKey: "screenshot-home-alt" },
    { image: "a-screenshot-habits.webp", altKey: "screenshot-habits-alt" },
  ],
  porn: [
    { image: "p-screenshot-home.webp", altKey: "screenshot-home-alt" },
    { image: "p-screenshot-habits.webp", altKey: "screenshot-habits-alt" },
  ],
  tobacco: [
    { image: "t-screenshot-home.webp", altKey: "screenshot-home-alt" },
    { image: "t-screenshot-habits.webp", altKey: "screenshot-habits-alt" },
  ],
};
