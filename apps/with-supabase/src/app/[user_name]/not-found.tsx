import { NotFoundBase } from '@quitmate/ui';

export default function NotFound() {
  return (
    <NotFoundBase
      message="The specified profile does not exist."
      linkText="Return to top page"
      linkHref="/"
    />
  );
}

