import { Geist } from "next/font/google";
import Link from "next/link";
import { ThemeProvider } from "next-themes";

import DeployButton from "@/components/deploy-button";
import { EnvVarWarning } from "@/components/env-var-warning";
import { ThemeSwitcher } from "@/components/theme-switcher";
import { HabitCategoryName } from "@/lib/types";
import { hasEnvVars } from "@/utils/supabase/check-env-vars";
import "./globals.css";

const defaultUrl = process.env.VERCEL_URL
  ? `https://${process.env.VERCEL_URL}`
  : "http://localhost:3000";

const habitCategories: HabitCategoryName[] = [
  "Game",
  "Tobacco",
  "Shopping",
  "Drugs",
  "Overeating",
  "Porno",
  "SNS",
  "Gambling",
  "Caffeine",
  "Cosmetic Surgery",
  "Custom",
  "Alcohol",
  "Codependency",
  "Official",
];

export const metadata = {
  metadataBase: new URL(defaultUrl),
  title: "Next.js and Supabase Starter Kit",
  description: "The fastest way to build apps with Next.js and Supabase",
};

const geistSans = Geist({
  display: "swap",
  subsets: ["latin"],
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={geistSans.className} suppressHydrationWarning>
      <body className="bg-background text-foreground">
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <main className="flex min-h-screen flex-col items-center">
            <div className="flex w-full flex-1 flex-col items-center gap-20">
              <nav className="flex h-16 w-full justify-center border-b border-b-foreground/10">
                <div className="flex w-full max-w-5xl items-center justify-between p-3 px-5 text-sm">
                  <div className="flex items-center gap-5 font-semibold">
                    <Link href={"/"}>Next.js Supabase Starter</Link>
                    <div className="flex items-center gap-2">
                      <DeployButton />
                      <Link href="/tutorial" className="hover:underline">
                        チュートリアル
                      </Link>
                    </div>
                  </div>
                  {!hasEnvVars ? <EnvVarWarning /> : <></>}
                </div>
              </nav>
              <div className="flex w-full max-w-5xl gap-8">
                <aside className="w-64 shrink-0">
                  <nav className="sticky top-4 space-y-2">
                    <div className="mb-6 space-y-2">
                      <Link
                        href="/"
                        className="block rounded px-4 py-2 font-medium transition-colors hover:bg-foreground/5"
                      >
                        ストーリー一覧
                      </Link>
                      <Link
                        href="/articles"
                        className="block rounded px-4 py-2 font-medium transition-colors hover:bg-foreground/5"
                      >
                        記事一覧
                      </Link>
                    </div>

                    <div className="mb-4 border-b border-foreground/10" />

                    {Object.values(habitCategories).map((category) => (
                      <Link
                        key={category}
                        href={`/stories/habits/${category.toLowerCase().replace(/\s+/g, "-")}`}
                        className="block rounded px-4 py-2 transition-colors hover:bg-foreground/5"
                      >
                        {category}
                      </Link>
                    ))}
                  </nav>
                </aside>
                <div className="flex-1 p-5">{children}</div>
              </div>

              <footer className="mx-auto flex w-full items-center justify-center gap-8 border-t py-16 text-center text-xs">
                <p>
                  Powered by{" "}
                  <a
                    href="https://supabase.com/?utm_source=create-next-app&utm_medium=template&utm_term=nextjs"
                    target="_blank"
                    className="font-bold hover:underline"
                    rel="noreferrer"
                  >
                    Supabase
                  </a>
                </p>
                <ThemeSwitcher />
              </footer>
            </div>
          </main>
        </ThemeProvider>
      </body>
    </html>
  );
}
