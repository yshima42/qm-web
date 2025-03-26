import React from 'react';
import ReactMarkdown from 'react-markdown';
import rehypeRaw from 'rehype-raw';
import rehypeSanitize from 'rehype-sanitize';
import remarkGfm from 'remark-gfm';

interface MarkdownContentProps {
  content: string;
}

export function MarkdownContent({ content }: MarkdownContentProps) {
  return (
    <div className="prose prose-lg max-w-none">
      <ReactMarkdown
        rehypePlugins={[rehypeRaw, rehypeSanitize]}
        remarkPlugins={[remarkGfm]}
        components={{
          h1: ({ ...props }) => <h1 className="text-2xl font-bold text-gray-900 mt-8 mb-4" {...props} />,
          h2: ({ ...props }) => <h2 className="text-xl font-bold text-gray-900 mt-7 mb-3 border-b pb-1 border-gray-200" {...props} />,
          h3: ({ ...props }) => <h3 className="text-lg font-semibold text-gray-900 mt-6 mb-2" {...props} />,
          p: ({ ...props }) => <p className="text-gray-900 mb-4 leading-relaxed" {...props} />,
          ul: ({ ...props }) => <ul className="list-disc pl-6 mb-4 text-gray-900" {...props} />,
          ol: ({ ...props }) => <ol className="list-decimal pl-6 mb-4 text-gray-900" {...props} />,
          li: ({ ...props }) => <li className="mb-2" {...props} />,
          a: ({ ...props }) => <a className="text-blue-600 font-medium hover:underline" {...props} />,
          strong: ({ ...props }) => <strong className="font-bold text-gray-900" {...props} />,
          em: ({ ...props }) => <em className="italic text-gray-900" {...props} />,
          blockquote: ({ ...props }) => <blockquote className="border-l-4 border-gray-300 pl-4 italic text-gray-700" {...props} />,
          code: ({ ...props }) => <code className="bg-gray-100 rounded px-1 py-0.5 text-gray-900" {...props} />,
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}