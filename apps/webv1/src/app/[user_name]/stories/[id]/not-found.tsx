import { NotFoundBase } from '@quitmate/ui';

export default function NotFound() {
  return (
    <NotFoundBase
      message="指定されたストーリーは存在しません。"
      linkText="ストーリー一覧に戻る"
      linkHref="/"
    />
  );
}
