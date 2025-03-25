import type { ReactNode } from 'react';

type ISectionProps = {
  title?: string;
  description?: string;
  yPadding?: string;
  children: ReactNode;
};

const Section = (props: ISectionProps) => (
  <div
    className={`mx-auto max-w-screen-lg px-6 md:px-8 ${
      props.yPadding ? props.yPadding : 'py-8'
    }`}
  >
    {(props.title || props.description) && (
      <div className="mb-4 text-center">
        {props.title && (
          <h2 className="pt-5 text-3xl font-bold text-gray-900 md:pt-10 md:text-4xl">
            {props.title}
          </h2>
        )}
        {props.description && (
          <div className="md-4 leading-2 my-4 text-lg text-gray-700 md:px-20 md:text-xl">
            {props.description}
          </div>
        )}
      </div>
    )}
    {props.children}
  </div>
);

export { Section };
