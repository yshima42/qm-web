type DocumentLayoutProps = {
  children: React.ReactNode;
  title: string;
  namespace?: string;
};

export const DocumentLayout = ({ children, title, namespace = "" }: DocumentLayoutProps) => {
  const bgColor =
    namespace === "porn"
      ? "bg-[#1a0a1f]"
      : namespace === "tobacco"
        ? "bg-[#e8f5e9]"
        : namespace === "kinshu"
          ? "bg-[#e8eaf6]"
          : namespace === "alcohol"
            ? "bg-[#d8e8d4]"
            : "bg-[#f8fbf7]";
  const cardBg = namespace === "porn" ? "bg-[#2d1b4e]/90" : "bg-white";
  const titleColor = namespace === "porn" ? "text-white" : "text-gray-900";

  return (
    <div className={`min-h-screen ${bgColor}`}>
      <main className="p-4 sm:px-6 sm:py-8 lg:px-8">
        <div className="mx-auto max-w-4xl">
          <div className={`rounded-lg ${cardBg} p-6 shadow-md sm:p-8`}>
            <h1 className={`mb-4 text-2xl font-bold ${titleColor} sm:mb-6 sm:text-3xl`}>{title}</h1>
            <div className={namespace === "porn" ? "prose-invert prose" : ""}>{children}</div>
          </div>
        </div>
      </main>
    </div>
  );
};
