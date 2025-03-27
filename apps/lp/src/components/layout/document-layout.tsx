type DocumentLayoutProps = {
  children: React.ReactNode;
  title: string;
};

export const DocumentLayout = ({ children, title }: DocumentLayoutProps) => {
  return (
    <div className="min-h-screen bg-[#f8fbf7]">
      <main className="p-4 sm:px-6 sm:py-8 lg:px-8">
        <div className="mx-auto max-w-4xl">
          <div className="rounded-lg bg-white p-6 shadow-md sm:p-8">
            <h1 className="mb-4 text-2xl font-bold text-gray-900 sm:mb-6 sm:text-3xl">
              {title}
            </h1>
            {children}
          </div>
        </div>
      </main>
    </div>
  );
};
