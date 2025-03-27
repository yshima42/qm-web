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
    <div className="prose prose-lg max-w-none">
      <ReactMarkdown
        rehypePlugins={[rehypeRaw, rehypeSanitize]}
        remarkPlugins={[remarkGfm]}
        components={{
          h1: ({ ...props }) => (
            <h1
              className="mb-4 mt-8 text-2xl font-bold text-gray-900"
              {...props}
            />
          ),
          h2: ({ ...props }) => (
            <h2
              className="mb-3 mt-7 border-b border-gray-200 pb-1 text-xl font-bold text-gray-900"
              {...props}
            />
          ),
          h3: ({ ...props }) => (
            <h3
              className="mb-2 mt-6 text-lg font-semibold text-gray-900"
              {...props}
            />
          ),
          p: ({ ...props }) => (
            <p className="mb-4 leading-relaxed text-gray-900" {...props} />
          ),
          ul: ({ ...props }) => (
            <ul className="mb-4 list-disc pl-6 text-gray-900" {...props} />
          ),
          ol: ({ ...props }) => (
            <ol className="mb-4 list-decimal pl-6 text-gray-900" {...props} />
          ),
          li: ({ ...props }) => <li className="mb-2" {...props} />,
          a: ({ ...props }) => (
            <a
              className="font-medium text-blue-600 hover:underline"
              {...props}
            />
          ),
          strong: ({ ...props }) => (
            <strong className="font-bold text-gray-900" {...props} />
          ),
          em: ({ ...props }) => (
            <em className="italic text-gray-900" {...props} />
          ),
          blockquote: ({ ...props }) => (
            <blockquote
              className="border-l-4 border-gray-300 pl-4 italic text-gray-700"
              {...props}
            />
          ),
          code: ({ ...props }) => (
            <code
              className="rounded bg-gray-100 px-1 py-0.5 text-gray-900"
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
