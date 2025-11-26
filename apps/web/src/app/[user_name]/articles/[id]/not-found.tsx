import { NotFoundBase } from '@quitmate/ui';

export default function NotFound() {
  return (
    <NotFoundBase
      message="The specified article does not exist."
      linkText="Return to articles"
      linkHref="/articles"
    />
  );
}

