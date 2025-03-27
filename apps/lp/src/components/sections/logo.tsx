import Image from "next/image";
import Link from "next/link";
import { AppConfig } from "./app-config";

type LogoProps = {
  xl?: boolean;
};

export const Logo = ({ xl = false }: LogoProps) => {
  const size = xl ? 56 : 42;
  const fontStyle = xl ? "text-4xl" : "text-3xl";

  return (
    <Link href="/" className="flex items-center">
      <div className="flex items-center">
        <Image
          src="/images/icon-web.png"
          alt={AppConfig.site_name}
          width={size}
          height={size}
          className="mr-1"
        />
        <span
          className={`${fontStyle} font-medium text-gray-800`}
          style={{ fontWeight: 550, letterSpacing: "0.02em" }}
        >
          {AppConfig.site_name}
        </span>
      </div>
    </Link>
  );
};
