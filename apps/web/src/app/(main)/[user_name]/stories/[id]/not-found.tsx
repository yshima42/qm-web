import { NotFoundBase } from "@quitmate/ui";

export default function NotFound() {
  return (
    <NotFoundBase
      message="The specified story does not exist."
      linkText="Return to story list"
      linkHref="/"
    />
  );
}
