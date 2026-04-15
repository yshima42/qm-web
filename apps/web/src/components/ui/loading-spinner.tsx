type LoadingSpinnerProps = {
  fullHeight?: boolean;
};

export const LoadingSpinner = ({ fullHeight = false }: LoadingSpinnerProps) => {
  return (
    <div className={`flex items-center justify-center ${fullHeight ? "min-h-screen" : ""}`}>
      <div className="border-muted-foreground/20 border-t-foreground size-12 animate-spin rounded-full border-4"></div>
    </div>
  );
};
