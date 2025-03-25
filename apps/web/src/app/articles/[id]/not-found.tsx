import NotFoundBase from '@/components/ui/not-found-base';

export default function NotFound() {
  return (
    <NotFoundBase
      message="指定された記事は存在しません。"
      linkText="記事一覧に戻る"
      linkHref="/articles"
    />
  );
}
