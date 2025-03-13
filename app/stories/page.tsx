import { createClient } from "@/utils/supabase/server";
import { Tables } from "@/lib/types";

type Story = Tables<"stories">;
export default async function Page() {
  const supabase = await createClient();
  const { data: stories } = (await supabase
    .from("stories")
    .select()
    // .limit(10));
    .limit(10)) as { data: Story[] };

  return (
    <div>
      <h1>Stories</h1>
      <ul>
        {stories.map((story) => (
          <li key={story.id}>{story.content}</li>
        ))}
      </ul>
    </div>
  );
}
