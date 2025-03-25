import { VerticalFeatureRow } from '../feature/VerticalFeatureRow';
import { Section } from '../layout/Section';

const VerticalFeatures = () => (
  <Section
    title="依存症克服SNS"
    description="依存症に関する悩みや経験、それは周りの人には言いづらいもの。このアプリ内では、みんなが当事者や経験者。だからこそ、安心して本音で話すことができます。同じ経験を持つ仲間たちとのやりとりを通じて、依存している習慣を克服しましょう。"
  >
    <VerticalFeatureRow
      title="コミュニティ選択"
      description="アルコール、ギャンブル、過食、たばこ、ゲーム、SNS、買い物、ポルノ、ドラッグ、カフェイン、美容整形のコミュニティがあります。この中にやめたい習慣がない場合は自分で習慣名を決め、カスタムコミュニティに参加することができます。"
      image="/assets/images/feature1.svg"
      imageAlt="Third feature alt text"
    />
    <VerticalFeatureRow
      title="投稿機能"
      description="日常の出来事や感じたこと、依存習慣をやめる上での経験を共有し、他のユーザーからのフィードバックやサポートを得ることができます。"
      image="/assets/images/feature2.svg"
      imageAlt="Second feature alt text"
      reverse
    />
    <VerticalFeatureRow
      title="離脱時間トラッキング"
      description="依存習慣からの離脱時間をトラッキングし、モチベーションを高めることができます。"
      image="/assets/images/feature3.svg"
      imageAlt="First feature alt text"
    />
  </Section>
);

export { VerticalFeatures };
