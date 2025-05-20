import Image from "next/image";
import React from "react";
import ReactMarkdown from "react-markdown";
import rehypeRaw from "rehype-raw";
import rehypeSanitize from "rehype-sanitize";
import remarkGfm from "remark-gfm";

type MarkdownContentProps = {
  content: string;
};

export function MarkdownContent({ content }: MarkdownContentProps) {
  return (
    <div className="prose prose-2xl max-w-none">
      <ReactMarkdown
        rehypePlugins={[rehypeRaw, rehypeSanitize]}
        remarkPlugins={[remarkGfm]}
        components={{
          h1: ({ ...props }) => (
            <h1
              className="mt-12 mb-8 text-5xl font-bold leading-tight text-gray-900"
              {...props}
            />
          ),
          h2: ({ ...props }) => (
            <h2
              className="mt-14 mb-6 text-3xl font-bold leading-tight text-gray-900"
              {...props}
            />
          ),
          h3: ({ ...props }) => (
            <h3
              className="mt-8 mb-4 text-2xl font-semibold leading-tight text-gray-900"
              {...props}
            />
          ),
          p: ({ ...props }) => (
            <p
              className="mb-6 text-xl leading-relaxed text-gray-800"
              {...props}
            />
          ),
          ul: ({ ...props }) => (
            <ul
              className="mb-6 pl-8 text-xl list-disc text-gray-800"
              {...props}
            />
          ),
          ol: ({ ...props }) => (
            <ol
              className="mb-6 pl-8 text-xl list-decimal text-gray-800"
              {...props}
            />
          ),
          li: ({ ...props }) => <li className="mb-3 text-xl" {...props} />,
          a: ({ ...props }) => (
            <a
              className="font-medium text-green-600 hover:underline"
              {...props}
            />
          ),
          strong: ({ ...props }) => (
            <strong className="font-bold text-gray-900" {...props} />
          ),
          em: ({ ...props }) => (
            <em className="italic text-gray-800" {...props} />
          ),
          blockquote: ({ ...props }) => (
            <blockquote
              className="my-8 border-l-4 border-gray-300 pl-8 text-xl italic text-gray-700"
              {...props}
            />
          ),
          code: ({ ...props }) => (
            <code
              className="rounded bg-gray-100 px-1 py-0.5 font-mono text-base text-gray-900"
              {...props}
            />
          ),
          img: ({ src, alt }) => {
            // 画像パスの処理
            let imgSrc = src;

            // httpから始まる外部URL
            if (src?.startsWith("http")) {
              // 外部画像の場合は通常のimgタグを使用
              return (
                <span className="flex justify-center my-8">
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
                <span className="flex justify-center my-8">
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
                  <span className="flex justify-center my-8">
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
                  <span className="flex justify-center my-8">
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
