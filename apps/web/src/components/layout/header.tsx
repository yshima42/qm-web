import clsx from "clsx";

export type HeaderProps = {
  title?: string;
  titleElement?: React.ReactNode;
  showBackButton?: boolean;
  backUrl?: string;
  rightElement?: React.ReactNode;
  hideTitle?: {
    mobile?: boolean;
    desktop?: boolean;
  };
  icon?: React.ReactNode;
};

export function Header({ title, titleElement, rightElement, hideTitle, icon }: HeaderProps) {
  return (
    <header className="border-border bg-background/80 sticky top-0 z-20 border-b backdrop-blur-sm">
      <div className="relative flex h-14 items-center justify-between px-4">
        <div className="w-24" />

        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-center">
          {titleElement ? (
            <>
              <div
                className={clsx(
                  hideTitle?.mobile ? "hidden" : "",
                  hideTitle?.desktop ? "md:hidden" : "md:block",
                )}
              >
                {titleElement}
              </div>
              {!titleElement && (
                <h1
                  className={clsx(
                    "whitespace-nowrap text-base font-medium",
                    "md:hidden",
                    hideTitle?.desktop ? "hidden" : "block",
                  )}
                >
                  {title}
                </h1>
              )}
            </>
          ) : (
            <div className="flex items-center justify-center gap-2">
              {icon && <div className="text-foreground">{icon}</div>}
              <h1
                className={`whitespace-nowrap text-base font-medium ${hideTitle?.mobile ? "hidden md:block" : ""} ${hideTitle?.desktop ? "md:hidden" : ""}`}
              >
                {title}
              </h1>
            </div>
          )}
        </div>

        <div className="flex w-24 items-center justify-end gap-2">
          {rightElement}
        </div>
      </div>
    </header>
  );
}
