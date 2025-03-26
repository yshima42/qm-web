interface DocumentLayoutProps {
  children: React.ReactNode;
  title: string;
}

export const DocumentLayout = ({ children, title }: DocumentLayoutProps) => {
  return (
    <div className="min-h-screen bg-[#f8fbf7]">
      <main className="py-4 sm:py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white shadow-md rounded-lg p-6 sm:p-8">
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4 sm:mb-6">{title}</h1>
            {children}
          </div>
        </div>
      </main>
    </div>
  );
};