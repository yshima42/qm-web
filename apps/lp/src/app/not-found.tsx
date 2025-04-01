import { NotFoundBase } from "@quitmate/ui";

export default function NotFound() {
  return (
    <NotFoundBase
      message="指定されたページは存在しません。"
      linkText="トップ画面に戻る"
      linkHref="/"
    />
  );
}
