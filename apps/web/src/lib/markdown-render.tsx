import ReactMarkdown, { Components } from 'react-markdown';
import remarkGfm from 'remark-gfm';

type MarkdownRendererProps = {
  content: string;
  className?: string;
  variant?: 'default' | 'compact'; // Add variants as needed
};

export function MarkdownRenderer({
  content,
  className = '',
  variant = 'default',
}: MarkdownRendererProps) {
  return (
    <div className={`prose max-w-none dark:prose-invert ${className}`}>
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={
          {
            h1: (props) => <h1 className="mb-6 mt-10 text-3xl font-bold" {...props} />,
            h2: (props) => (
              <h2
                className="mb-4 mt-8 border-b border-gray-200 pb-2 text-2xl font-bold dark:border-gray-800"
                {...props}
              />
            ),
            h3: (props) => <h3 className="mb-3 mt-6 text-xl font-semibold" {...props} />,
            p: (props) => (
              <p
                className={`${variant === 'compact' ? 'my-1' : 'my-3'} whitespace-pre-line text-lg leading-relaxed`}
                {...props}
              />
            ),
            a: (props) => (
              <a
                className="font-medium text-green-800 no-underline hover:underline dark:text-green-400"
                {...props}
              />
            ),
            blockquote: (props) => (
              <blockquote
                className="border-l-4 border-green-300 bg-green-50 py-0.5 pl-4 italic dark:border-green-700 dark:bg-green-900/30"
                {...props}
              />
            ),
            pre: (props) => (
              <pre
                className="rounded-lg border border-gray-200 bg-gray-50 p-4 text-lg text-gray-800 shadow-sm dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100"
                {...props}
              />
            ),
          } as Components
        }
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}

