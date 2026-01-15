import Image from "next/image";
import React from "react";
import ReactMarkdown from "react-markdown";
import rehypeRaw from "rehype-raw";
import rehypeSanitize from "rehype-sanitize";
import remarkGfm from "remark-gfm";

type MarkdownContentProps = {
  content: string;
  namespace?: string;
};

export function MarkdownContent({ content }: MarkdownContentProps) {
  const headingColor = "text-gray-900";
  const textColor = "text-gray-800";
  const linkColor = "text-green-600";
  const strongColor = "text-gray-900";
  const blockquoteColor = "text-gray-700";
  const blockquoteBorder = "border-gray-300";
  const codeBg = "bg-gray-100";
  const codeColor = "text-gray-900";
  const tableBg = "bg-gray-100";
  const tableBorder = "border-gray-400";
  const tableText = "text-gray-800";

  return (
    <div className="prose prose-2xl max-w-none">
      <ReactMarkdown
        rehypePlugins={[rehypeRaw, rehypeSanitize]}
        remarkPlugins={[remarkGfm]}
        components={{
          h1: ({ ...props }) => (
            <h1
              className={`mb-8 mt-12 text-[2.75rem] font-bold leading-tight ${headingColor}`}
              {...props}
            />
          ),
          h2: ({ ...props }) => (
            <h2
              className={`mb-6 mt-14 text-[1.75rem] font-bold leading-tight ${headingColor}`}
              {...props}
            />
          ),
          h3: ({ ...props }) => (
            <h3
              className={`mb-4 mt-8 text-[1.375rem] font-semibold leading-tight ${headingColor}`}
              {...props}
            />
          ),
          p: ({ ...props }) => (
            <p className={`mb-6 text-[1.185rem] leading-relaxed ${textColor}`} {...props} />
          ),
          ul: ({ ...props }) => (
            <ul className={`mb-6 list-disc pl-8 text-[1.185rem] ${textColor}`} {...props} />
          ),
          ol: ({ ...props }) => (
            <ol className={`mb-6 list-decimal pl-8 text-[1.185rem] ${textColor}`} {...props} />
          ),
          li: ({ ...props }) => <li className="mb-3 text-[1.185rem]" {...props} />,
          a: ({ ...props }) => (
            <a className={`font-medium ${linkColor} hover:underline`} {...props} />
          ),
          strong: ({ ...props }) => <strong className={`font-bold ${strongColor}`} {...props} />,
          em: ({ ...props }) => <em className={`italic ${textColor}`} {...props} />,
          blockquote: ({ ...props }) => (
            <blockquote
              className={`my-8 border-l-4 ${blockquoteBorder} pl-8 text-xl italic ${blockquoteColor}`}
              {...props}
            />
          ),
          code: ({ ...props }) => (
            <code
              className={`rounded ${codeBg} px-1 py-0.5 font-mono text-base ${codeColor}`}
              {...props}
            />
          ),
          table: ({ ...props }) => (
            <table className={`my-8 w-full border-collapse text-xl ${tableText}`} {...props} />
          ),
          thead: ({ ...props }) => <thead className={tableBg} {...props} />,
          tbody: ({ ...props }) => <tbody {...props} />,
          tr: ({ ...props }) => <tr className={`border-b ${tableBorder}`} {...props} />,
          th: ({ ...props }) => (
            <th
              className={`border ${tableBorder} px-4 py-2 text-left font-semibold ${headingColor}`}
              {...props}
            />
          ),
          td: ({ ...props }) => (
            <td className={`border ${tableBorder} px-4 py-2 ${tableText}`} {...props} />
          ),
          img: ({ src, alt }) => {
            // 画像パスの処理
            let imgSrc = src;

            // httpから始まる外部URL
            if (src?.startsWith("http")) {
              // 外部画像の場合は通常のimgタグを使用
              return (
                <span className="my-8 flex justify-center">
                  <Image
                    src={src}
                    alt={alt ?? ""}
                    width={700}
                    height={400}
                    className="rounded-lg object-cover"
                    sizes="(max-width: 768px) 100vw, 700px"
                  />
                </span>
              );
            }

            // すでに/で始まるパス
            if (src?.startsWith("/")) {
              imgSrc = src;
            }
            // 相対パスの場合
            else {
              // ブログ関連の画像を優先的にチェック
              const blogImagePath = `/blog/images/${src ?? ""}`;
              imgSrc = blogImagePath;
            }

            try {
              // 内部画像の場合はNext.js Imageコンポーネントを使用
              return (
                <span className="my-8 flex justify-center">
                  <Image
                    src={imgSrc}
                    alt={alt ?? ""}
                    width={700}
                    height={400}
                    className="rounded-lg object-cover"
                    sizes="(max-width: 768px) 100vw, 700px"
                    priority
                  />
                </span>
              );
            } catch (error) {
              console.error("Image error:", error, "for path:", imgSrc);

              // エラーの場合は別のパスを試す
              const fallbackPath = imgSrc.includes("/blog/images/")
                ? `/images/${src ?? ""}`
                : `/blog/images/${src ?? ""}`;

              try {
                return (
                  <span className="my-8 flex justify-center">
                    <Image
                      src={fallbackPath}
                      alt={alt ?? ""}
                      width={700}
                      height={400}
                      className="rounded-lg object-cover"
                      sizes="(max-width: 768px) 100vw, 700px"
                      priority
                    />
                  </span>
                );
              } catch {
                // 最終的にはImageコンポーネントにフォールバック
                return (
                  <span className="my-8 flex justify-center">
                    <Image
                      src={imgSrc}
                      alt={alt ?? ""}
                      width={700}
                      height={400}
                      className="max-w-full rounded-lg object-cover"
                      sizes="(max-width: 768px) 100vw, 700px"
                      unoptimized
                    />
                  </span>
                );
              }
            }
          },
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}
