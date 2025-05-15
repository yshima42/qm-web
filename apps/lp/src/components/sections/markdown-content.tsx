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
              className="mb-6 mt-10 text-3xl font-bold text-gray-900 pb-2 border-b border-gray-100"
              {...props}
            />
          ),
          h2: ({ ...props }) => (
            <h2
              className="mb-4 mt-8 pb-2 text-2xl font-bold text-gray-900 border-b border-gray-100"
              {...props}
            />
          ),
          h3: ({ ...props }) => (
            <h3
              className="mb-3 mt-6 text-xl font-semibold text-gray-900"
              {...props}
            />
          ),
          p: ({ ...props }) => (
            <p className="mb-5 leading-relaxed text-gray-700" {...props} />
          ),
          ul: ({ ...props }) => (
            <ul
              className="mb-5 list-disc pl-6 text-gray-700 space-y-2"
              {...props}
            />
          ),
          ol: ({ ...props }) => (
            <ol
              className="mb-5 list-decimal pl-6 text-gray-700 space-y-2"
              {...props}
            />
          ),
          li: ({ ...props }) => <li className="mb-1" {...props} />,
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
              className="border-l-4 border-green-300 bg-green-50 pl-4 italic text-gray-700 py-3 px-4 my-5 rounded-r"
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
              className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-auto mb-5 font-mono text-sm"
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
