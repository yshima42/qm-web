import React from 'react';

interface AutoLinkTextProps {
  text: string;
  className?: string;
}

export function AutoLinkText({ text, className = '' }: AutoLinkTextProps) {
  const urlRegex = /(https?:\/\/[^\s]+)/g;
  
  const parts = text.split(urlRegex);
  
  return (
    <span className={className}>
      {parts.map((part, index) => {
        if (part.match(urlRegex)) {
          return (
            <a 
              key={index}
              href={part}
              target="_blank"
              rel="noopener noreferrer"
              className="text-green-800 dark:text-green-500 hover:underline"
            >
              {part}
            </a>
          );
        }
        return <React.Fragment key={index}>{part}</React.Fragment>;
      })}
    </span>
  );
}