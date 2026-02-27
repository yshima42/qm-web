import Image from "next/image";
import { useTranslations } from "next-intl";

import { Link } from "@/i18n/routing";
import { getBasePath, type LpNamespace } from "@/utils/namespace";

import { AppConfig } from "../../app-config";

type LogoProps = {
  xl?: boolean;
  namespace?: string;
  /** ヘッダーが暗い背景のとき true（ロゴテキストを白に） */
  lightText?: boolean;
};

const LOGO_ICONS: Record<Exclude<LpNamespace, "">, string> = {
  alcohol: "/images/kinshu_icon.png",
  kinshu: "/images/alcohol_icon.png",
  porn: "/images/porn_icon.png",
  tobacco: "/images/tobacco_icon.png",
};

export const Logo = ({ xl = false, namespace = "", lightText = false }: LogoProps) => {
  const size = xl ? 56 : 42;
  const fontStyle = xl ? "text-4xl" : "text-[28px]";
  const t = useTranslations(namespace ? `${namespace}.common` : "common");
  const siteName = namespace ? t("title").split("|")[0].trim() : AppConfig.site_name;
  const basePath = namespace ? getBasePath(namespace as LpNamespace) : "";
  const href = basePath || "/";
  const iconSrc =
    namespace && namespace in LOGO_ICONS
      ? LOGO_ICONS[namespace as Exclude<LpNamespace, "">]
      : "/images/icon-web.png";
  const textColor = lightText ? "text-white" : "text-gray-900";

  return (
    <Link href={href} className={`inline-flex items-center ${lightText ? "text-white" : ""}`}>
      <div className="inline-flex items-center gap-2" style={{ minHeight: size }}>
        <span
          className="flex shrink-0 items-center justify-center"
          style={{ width: size, height: size }}
        >
          <Image src={iconSrc} alt={siteName} width={size} height={size} className="block" />
        </span>
        <span
          className={`${fontStyle} font-medium leading-[1.1] ${textColor} self-center`}
          style={{
            fontWeight: 550,
            fontFamily: "'Inter', 'Noto Sans JP', sans-serif",
          }}
        >
          {siteName}
        </span>
      </div>
    </Link>
  );
};
