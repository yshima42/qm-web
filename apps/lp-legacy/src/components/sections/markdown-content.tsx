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

export function MarkdownContent({ content, namespace }: MarkdownContentProps) {
  const isDark = namespace === "porn";
  const headingColor = isDark ? "text-white" : "text-gray-900";
  const textColor = isDark ? "text-gray-200" : "text-gray-800";
  const linkColor = isDark ? "text-purple-300" : "text-green-600";
  const strongColor = isDark ? "text-white" : "text-gray-900";
  const blockquoteColor = isDark ? "text-gray-300" : "text-gray-700";
  const blockquoteBorder = isDark ? "border-purple-400" : "border-gray-300";
  const codeBg = isDark ? "bg-white/10" : "bg-gray-100";
  const codeColor = isDark ? "text-gray-200" : "text-gray-900";
  const tableBg = isDark ? "bg-white/10" : "bg-gray-100";
  const tableBorder = isDark ? "border-purple-400/60" : "border-gray-400";
  const tableText = isDark ? "text-gray-200" : "text-gray-800";

  return (
    <div className="prose prose-2xl max-w-none">
      <ReactMarkdown
        rehypePlugins={[rehypeRaw, rehypeSanitize]}
        remarkPlugins={[remarkGfm]}
        components={{
          h1: ({ ...props }) => (
            <h1
              className={`mt-12 mb-8 text-[2.75rem] leading-tight font-bold ${headingColor}`}
              {...props}
            />
          ),
          h2: ({ ...props }) => (
            <h2
              className={`mt-14 mb-6 text-[1.75rem] leading-tight font-bold ${headingColor}`}
              {...props}
            />
          ),
          h3: ({ ...props }) => (
            <h3
              className={`mt-8 mb-4 text-[1.375rem] leading-tight font-semibold ${headingColor}`}
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
            const srcStr = typeof src === "string" ? src : "";
            let imgSrc = srcStr;

            // httpから始まる外部URL
            if (srcStr.startsWith("http")) {
              // 外部画像の場合は通常のimgタグを使用
              return (
                <span className="my-8 flex justify-center">
                  <Image
                    src={srcStr}
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
            if (srcStr.startsWith("/")) {
              imgSrc = srcStr;
            }
            // 相対パスの場合
            else {
              // ブログ関連の画像を優先的にチェック
              const blogImagePath = `/blog/images/${srcStr}`;
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
                ? `/images/${srcStr}`
                : `/blog/images/${srcStr}`;

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
