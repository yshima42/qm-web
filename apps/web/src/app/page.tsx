import { redirect } from "next/navigation";
import { getDefaultCommunityPath } from "@/lib/utils/page-helpers";

export default async function Home() {
  const defaultPath = await getDefaultCommunityPath();
  redirect(defaultPath);
}
