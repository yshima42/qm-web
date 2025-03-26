import {
    Users,
    MessageSquare,
    TimerReset,
  } from 'lucide-react'; // 仮アイコン
  import { Card, CardContent, CardHeader, CardTitle } from '@quitmate/ui';
  
  const features = [
    {
      title: '同じ依存に特化したコミュニティ',
      icon: Users,
      description: 'アルコールやギャンブル、たばこなど、悩みに合わせて自分に合った仲間とつながれます。',
    },
    {
      title: '投稿で経験を共有・支え合い',
      icon: MessageSquare,
      description: '感じたこと、苦しかったことを投稿でき、共感や応援の声が届きます。',
    },
    {
      title: '離脱時間を記録して可視化',
      icon: TimerReset,
      description: 'やめ続けている時間を記録することで、小さな成功体験を積み重ねられます。',
    },
  ];
  
  export const Features = () => {
    return (
      <section className="py-20 px-6 bg-white">
        <h2 className="text-3xl md:text-4xl font-semibold text-center mb-12 text-gray-800">
          QuitMateの3つの特徴
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {features.map(({ title, icon: Icon, description }) => (
            <Card key={title} className="h-full border-none shadow-md hover:shadow-lg transition-shadow bg-white">
              <CardHeader className="flex items-center gap-4">
                <div className="text-[#2E6C28] p-2">
                  <Icon size={40} strokeWidth={1.5} />
                </div>
                <CardTitle className="text-gray-800">{title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">{description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>
    );
  };
  