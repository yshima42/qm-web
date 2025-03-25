import className from 'classnames';
import { useRouter } from 'next/router';

type IVerticalFeatureRowProps = {
  title: string;
  description: string;
  image: string;
  imageAlt: string;
  reverse?: boolean;
};

const VerticalFeatureRow = (props: IVerticalFeatureRowProps) => {
  const verticalFeatureClass = className('flex', 'flex-wrap', 'items-center', {
    'flex-row-reverse': props.reverse,
  });

  const router = useRouter();

  return (
    <div className={verticalFeatureClass}>
      <div className="w-full pt-6 text-center sm:w-3/5 sm:px-6">
        <h3 className="text-2xl font-semibold text-gray-900 md:text-3xl">
          {props.title}
        </h3>
        <div className="leading-2 mt-6 text-lg md:text-xl">
          {props.description}
        </div>
      </div>

      <div className="w-full px-6 sm:w-2/5">
        <img src={`${router.basePath}${props.image}`} alt={props.imageAlt} />
      </div>
    </div>
  );
};

export { VerticalFeatureRow };
