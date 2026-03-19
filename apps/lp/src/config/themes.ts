/**
 * namespace ごとのテーマカラー設定
 * 各コンポーネントで繰り返されていた条件分岐をデータドリブンに集約
 */

export type ThemeConfig = {
  headerBg: string;
  heroBg: string;
  introBg: string;
  featuresBg: string;
  testimonialsBg: string;
  finalCtaBg: string;
  footerBg: string;
  documentBg: string;
  cardBg: string;
  titleColor: string;
  descColor: string;
  navText: string;
  navHover: string;
  mobileLinkColor: string;
  footerLinkColor: string;
  footerBorder: string;
  footerSocial: string;
  footerCopyright: string;
  indicatorColor: string;
  iconColor: string;
  lightText: boolean;
};

const defaultTheme: ThemeConfig = {
  headerBg: "bg-white shadow-sm",
  heroBg: "bg-gradient-to-b from-[#f8fbf7] to-white",
  introBg: "bg-[#f8fbf7]",
  featuresBg: "bg-white",
  testimonialsBg: "bg-[#f8fbf7]",
  finalCtaBg: "bg-gradient-to-b from-[#f8fbf7] to-white",
  footerBg: "bg-white",
  documentBg: "bg-[#f8fbf7]",
  cardBg: "bg-white",
  titleColor: "text-gray-800",
  descColor: "text-gray-600",
  navText: "text-gray-600",
  navHover: "hover:text-primary-light",
  mobileLinkColor: "text-gray-600 hover:text-primary-light",
  footerLinkColor: "text-gray-600 hover:text-primary-light",
  footerBorder: "border-gray-200",
  footerSocial: "text-gray-600 hover:text-primary-light",
  footerCopyright: "text-gray-500",
  indicatorColor: "bg-[#2E6C28]",
  iconColor: "text-[#2E6C28]",
  lightText: false,
};

const themes: Record<string, Partial<ThemeConfig>> = {
  alcohol: {
    headerBg: "bg-[#d8e8d4] shadow-sm",
    heroBg: "bg-gradient-to-b from-[#d8e8d4] to-white",
    introBg: "bg-[#d8e8d4]",
    featuresBg: "bg-[#e8f0e6]",
    testimonialsBg: "bg-[#d8e8d4]",
    finalCtaBg: "bg-gradient-to-b from-[#d8e8d4] to-white",
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
  },
  kinshu: {
    headerBg: "bg-[#e8eaf6] shadow-sm",
    heroBg: "bg-gradient-to-b from-[#e8eaf6] to-white",
    introBg: "bg-[#e8eaf6]",
    featuresBg: "bg-[#c5cae9]",
    testimonialsBg: "bg-[#e8eaf6]",
    finalCtaBg: "bg-gradient-to-b from-[#c5cae9] to-white",
    footerBg: "bg-[#e8eaf6]",
    documentBg: "bg-[#e8eaf6]",
    titleColor: "text-gray-900",
    descColor: "text-gray-700",
    navText: "text-gray-900",
    navHover: "hover:text-gray-700",
    mobileLinkColor: "text-gray-900 hover:text-gray-700",
    footerLinkColor: "text-gray-900 hover:text-gray-700",
    footerBorder: "border-indigo-200",
    footerSocial: "text-gray-900 hover:text-gray-700",
    footerCopyright: "text-gray-700",
    indicatorColor: "bg-[#3949ab]",
    iconColor: "text-gray-700",
  },
  porn: {
    headerBg: "bg-[#1a0a1f] shadow-none",
    heroBg: "bg-gradient-to-b from-[#1a0a1f] via-[#2d1b4e] to-[#1a0a1f]",
    introBg: "bg-[#1a0a1f]",
    featuresBg: "bg-[#2d1b4e]",
    testimonialsBg: "bg-[#1a0a1f]",
    finalCtaBg: "bg-gradient-to-b from-[#2d1b4e] to-[#1a0a1f]",
    footerBg: "bg-[#1a0a1f]",
    documentBg: "bg-[#1a0a1f]",
    cardBg: "bg-[#1a0a1f]/80",
    titleColor: "text-white",
    descColor: "text-purple-200",
    navText: "text-purple-200",
    navHover: "hover:text-white",
    mobileLinkColor: "text-purple-200 hover:text-white",
    footerLinkColor: "text-purple-200 hover:text-white",
    footerBorder: "border-purple-900/50",
    footerSocial: "text-purple-300 hover:text-white",
    footerCopyright: "text-purple-400",
    indicatorColor: "bg-purple-400",
    iconColor: "text-purple-400",
    lightText: true,
  },
  tobacco: {
    headerBg: "bg-[#e8f5e9] shadow-sm",
    heroBg: "bg-gradient-to-b from-[#e8f5e9] to-white",
    introBg: "bg-[#e8f5e9]",
    featuresBg: "bg-[#c8e6c9]",
    testimonialsBg: "bg-[#e8f5e9]",
    finalCtaBg: "bg-gradient-to-b from-[#e8f5e9] to-white",
    footerBg: "bg-[#e8f5e9]",
    documentBg: "bg-[#e8f5e9]",
    titleColor: "text-gray-900",
    descColor: "text-gray-700",
    navText: "text-gray-900",
    navHover: "hover:text-gray-700",
    mobileLinkColor: "text-gray-900 hover:text-gray-700",
    footerLinkColor: "text-gray-900 hover:text-gray-700",
    footerBorder: "border-green-200",
    footerSocial: "text-gray-900 hover:text-gray-700",
    footerCopyright: "text-gray-700",
    indicatorColor: "bg-green-600",
    iconColor: "text-gray-700",
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
  "": "/images/icon-web.png",
  alcohol: "/images/kinshu_icon.png",
  kinshu: "/images/alcohol_icon.png",
  porn: "/images/porn_icon.png",
  tobacco: "/images/tobacco_icon.png",
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
    { image: "screenshot-stories.png", altKey: "screenshot-stories-alt" },
    { image: "screenshot-categories.png", altKey: "screenshot-categories-alt" },
    { image: "screenshot-program.png", altKey: "screenshot-program-alt" },
    { image: "screenshot-habits.png", altKey: "screenshot-habits-alt" },
  ],
  alcohol: [
    { image: "k-screenshot-home.png", altKey: "screenshot-home-alt" },
    { image: "k-screenshot-timeline.png", altKey: "screenshot-timeline-alt" },
    { image: "k-screenshot-profile.png", altKey: "screenshot-profile-alt" },
    { image: "k-screenshot-diagnosis.png", altKey: "screenshot-diagnosis-alt" },
    { image: "k-screenshot-roadmap.png", altKey: "screenshot-roadmap-alt" },
  ],
  kinshu: [
    { image: "a-screenshot-home.png", altKey: "screenshot-home-alt" },
    { image: "a-screenshot-habits.png", altKey: "screenshot-habits-alt" },
  ],
  porn: [
    { image: "p-screenshot-home.png", altKey: "screenshot-home-alt" },
    { image: "p-screenshot-habits.png", altKey: "screenshot-habits-alt" },
  ],
  tobacco: [
    { image: "t-screenshot-home.png", altKey: "screenshot-home-alt" },
    { image: "t-screenshot-habits.png", altKey: "screenshot-habits-alt" },
  ],
};
