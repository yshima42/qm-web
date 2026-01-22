type DocumentLayoutProps = {
  children: React.ReactNode;
  title: string;
  namespace?: string;
};

export const DocumentLayout = ({ children, title, namespace = "" }: DocumentLayoutProps) => {
  const isAlcohol = namespace === "alcohol";
  const bgColor = isAlcohol ? "bg-[#d8e8d4]" : "bg-[#f8fbf7]";
  const cardBg = "bg-white";
  const titleColor = "text-gray-900";

  return (
    <div className={`min-h-screen ${bgColor}`}>
      <main className="p-4 sm:px-6 sm:py-8 lg:px-8">
        <div className="mx-auto max-w-4xl">
          <div className={`rounded-lg ${cardBg} p-6 shadow-md sm:p-8`}>
            <h1 className={`mb-4 text-2xl font-bold ${titleColor} sm:mb-6 sm:text-3xl`}>{title}</h1>
            {children}
          </div>
        </div>
      </main>
    </div>
  );
};
