type LoadingSpinnerProps = {
  fullHeight?: boolean;
};

export const LoadingSpinner = ({ fullHeight = false }: LoadingSpinnerProps) => {
  return (
    <div className={`flex items-center justify-center ${fullHeight ? 'min-h-screen' : ''}`}>
      <div className="size-12 animate-spin rounded-full border-4 border-gray-200 border-t-gray-900 dark:border-gray-700 dark:border-t-gray-100"></div>
    </div>
  );
};
