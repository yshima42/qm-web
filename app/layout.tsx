import DeployButton from "@/components/deploy-button";
import { EnvVarWarning } from "@/components/env-var-warning";
import { ThemeSwitcher } from "@/components/theme-switcher";
import { hasEnvVars } from "@/utils/supabase/check-env-vars";
import { Geist } from "next/font/google";
import { ThemeProvider } from "next-themes";
import Link from "next/link";
import "./globals.css";
import { HabitCategoryName } from "@/lib/types";

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
          <main className="min-h-screen flex flex-col items-center">
            <div className="flex-1 w-full flex flex-col gap-20 items-center">
              <nav className="w-full flex justify-center border-b border-b-foreground/10 h-16">
                <div className="w-full max-w-5xl flex justify-between items-center p-3 px-5 text-sm">
                  <div className="flex gap-5 items-center font-semibold">
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
                        className="block px-4 py-2 rounded hover:bg-foreground/5 transition-colors font-medium"
                      >
                        ストーリー一覧
                      </Link>
                      <Link
                        href="/articles"
                        className="block px-4 py-2 rounded hover:bg-foreground/5 transition-colors font-medium"
                      >
                        記事一覧
                      </Link>
                    </div>

                    <div className="border-b border-foreground/10 mb-4" />

                    {Object.values(habitCategories).map((category) => (
                      <Link
                        key={category}
                        href={`/stories/habits/${category.toLowerCase().replace(/\s+/g, "-")}`}
                        className="block px-4 py-2 rounded hover:bg-foreground/5 transition-colors"
                      >
                        {category}
                      </Link>
                    ))}
                  </nav>
                </aside>
                <div className="flex-1 p-5">{children}</div>
              </div>

              <footer className="w-full flex items-center justify-center border-t mx-auto text-center text-xs gap-8 py-16">
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
