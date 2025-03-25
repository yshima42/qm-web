import { useEffect, useState } from 'react';
import ReactMarkdown from 'react-markdown';

import { Background } from '@/background/Background';
import { Section } from '@/layout/Section';

import { Meta } from '../layout/Meta';
import { AppConfig } from '../utils/AppConfig';
import { Footer } from './Footer';
import { Header } from './Header';

type MarkdownDocumentProps = {
  documentPath: string;
};

const MarkdownDocument: React.FC<MarkdownDocumentProps> = ({
  documentPath,
}) => {
  const [markdownContent, setMarkdownContent] = useState('');

  useEffect(() => {
    fetch(documentPath)
      .then((response) => response.text())
      .then((text) => setMarkdownContent(text))
      .catch(() => {});
  }, [documentPath]);

  return (
    <div className="antialiased">
      <Background color="bg-gray-100">
        <Header />
        <Meta title={AppConfig.title} description={AppConfig.description} />
        <Section yPadding="md:pt-0 pb-10 mb:pb-20">
          <div className="markdown-content">
            <ReactMarkdown>{markdownContent}</ReactMarkdown>
          </div>
        </Section>
        <Footer />
      </Background>
    </div>
  );
};

export { MarkdownDocument };
