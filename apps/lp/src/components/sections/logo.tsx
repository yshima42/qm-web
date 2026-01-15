import Image from "next/image";
import { useTranslations } from "next-intl";

import { Link } from "@/i18n/routing";

import { AppConfig } from "../../app-config";

type LogoProps = {
  xl?: boolean;
  namespace?: string;
};

export const Logo = ({ xl = false, namespace = "" }: LogoProps) => {
  const size = xl ? 56 : 42;
  const fontStyle = xl ? "text-4xl" : "text-3xl";
  const t = useTranslations(namespace ? `${namespace}.common` : "common");
  const siteName = namespace ? t("title").split("|")[0].trim() : AppConfig.site_name;
  const href = namespace === "alcohol" ? "/alcohol" : "/";
  const iconSrc = namespace === "alcohol" ? "/images/kinshu_icon.png" : "/images/icon-web.png";

  return (
    <Link href={href} className="flex items-center">
      <div className="flex items-center">
        <Image src={iconSrc} alt={siteName} width={size} height={size} className="mr-3" />
        <span
          className={`${fontStyle} font-medium text-gray-800`}
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
