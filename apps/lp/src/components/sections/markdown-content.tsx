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
              className="mb-8 mt-16 text-4xl font-bold text-gray-900 pb-3 border-b border-gray-100"
              {...props}
            />
          ),
          h2: ({ ...props }) => (
            <h2
              className="mb-4 mt-14 pb-2 text-3xl font-bold text-gray-900 border-b border-gray-100"
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
                        className="w-full h-auto object-cover"
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
              className="mb-10 mt-6 list-disc pl-8 text-gray-800 space-y-4 text-lg"
              {...props}
            />
          ),
          ol: ({ ...props }) => (
            <ol
              className="mb-10 mt-6 list-decimal pl-8 text-gray-800 space-y-4 text-lg"
              {...props}
            />
          ),
          li: ({ ...props }) => (
            <li className="mb-3 pl-2 leading-loose" {...props} />
          ),
          a: ({ ...props }) => (
            <a
              className="font-medium text-green-700 hover:text-green-800 transition-colors border-b border-green-200 hover:border-green-700 no-underline"
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
              className="border-l-4 border-green-300 bg-green-50 pl-6 italic text-gray-700 py-5 px-6 my-8 rounded-r text-lg leading-relaxed"
              {...props}
            />
          ),
          code: ({ ...props }) => (
            <code
              className="rounded bg-gray-100 px-1.5 py-0.5 text-gray-800 font-mono text-sm"
              {...props}
            />
          ),
          pre: ({ ...props }) => (
            <pre
              className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-auto mb-8 font-mono text-sm"
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
