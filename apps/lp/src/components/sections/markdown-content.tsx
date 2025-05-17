import Image from "next/image";
import React from "react";
import ReactMarkdown from "react-markdown";
import rehypeRaw from "rehype-raw";
import rehypeSanitize from "rehype-sanitize";
import remarkGfm from "remark-gfm";

type MarkdownContentProps = {
  content: string;
  className?: string;
};

export function MarkdownContent({
  content,
  className = "",
}: MarkdownContentProps) {
  return (
    <div className={`prose prose-lg max-w-none ${className}`}>
      <ReactMarkdown
        rehypePlugins={[rehypeRaw, rehypeSanitize]}
        remarkPlugins={[remarkGfm]}
        components={{
          h1: ({ ...props }) => (
            <h1
              className="mb-8 mt-16 border-b border-gray-100 pb-3 text-4xl font-bold text-gray-900"
              {...props}
            />
          ),
          h2: ({ ...props }) => (
            <h2
              className="mb-4 mt-14 border-b border-gray-100 pb-2 text-3xl font-bold text-gray-900"
              {...props}
            />
          ),
          h3: ({ ...props }) => (
            <h3
              className="mb-4 mt-10 text-2xl font-semibold text-gray-900"
              {...props}
            />
          ),
          p: ({ node, ...props }) => {
            // pタグの子要素が画像だけの場合は特別な処理をする
            if (node && "children" in node) {
              const element = node;
              const children = element.children;

              // 子要素が1つの画像だけかチェック
              if (
                children.length === 1 &&
                children[0].type === "element" &&
                "tagName" in children[0] &&
                children[0].tagName === "img"
              ) {
                // imgタグの属性を取得
                const imgNode = children[0];
                const imgProperties =
                  "properties" in imgNode ? imgNode.properties : {};
                const src =
                  typeof imgProperties.src === "string"
                    ? imgProperties.src
                    : undefined;
                const alt =
                  typeof imgProperties.alt === "string"
                    ? imgProperties.alt
                    : "";

                if (src) {
                  // 画像パスが相対パスの場合、ブログ画像への絶対パスに変換
                  const imageSrc = src.startsWith("/")
                    ? src
                    : `/blog/images/${src}`;

                  // pタグではなく直接divとImageを返す
                  return (
                    <div className="my-10 overflow-hidden rounded-lg shadow-md">
                      <Image
                        src={imageSrc}
                        alt={alt}
                        width={800}
                        height={450}
                        className="h-auto w-full object-cover"
                        sizes="(max-width: 768px) 100vw, 800px"
                      />
                    </div>
                  );
                }
              }
            }

            // 通常のpタグを返す
            return (
              <p
                className="mb-8 text-lg leading-loose text-gray-800"
                {...props}
              />
            );
          },
          ul: ({ ...props }) => (
            <ul
              className="mb-10 mt-6 list-disc space-y-4 pl-8 text-lg text-gray-800"
              {...props}
            />
          ),
          ol: ({ ...props }) => (
            <ol
              className="mb-10 mt-6 list-decimal space-y-4 pl-8 text-lg text-gray-800"
              {...props}
            />
          ),
          li: ({ ...props }) => (
            <li className="mb-3 pl-2 leading-loose" {...props} />
          ),
          a: ({ ...props }) => (
            <a
              className="border-b border-green-200 font-medium text-green-700 no-underline transition-colors hover:border-green-700 hover:text-green-800"
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
              className="my-8 rounded-r border-l-4 border-green-300 bg-green-50 px-6 py-5 text-lg italic leading-relaxed text-gray-700"
              {...props}
            />
          ),
          code: ({ ...props }) => (
            <code
              className="rounded bg-gray-100 px-1.5 py-0.5 font-mono text-sm text-gray-800"
              {...props}
            />
          ),
          pre: ({ ...props }) => (
            <pre
              className="mb-8 overflow-auto rounded-lg bg-gray-900 p-4 font-mono text-sm text-gray-100"
              {...props}
            />
          ),
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}
