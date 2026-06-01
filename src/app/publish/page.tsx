import { PublishForm } from "@/components/PublishForm";
import { getChannels, getTags } from "@/lib/data";

export default async function PublishPage() {
  const [channels, tags] = await Promise.all([getChannels(), getTags()]);
  return (
    <div className="space-y-5 px-4 py-6 md:px-8">
      <header>
        <p className="text-sm font-semibold text-brand">发布信息</p>
        <h1 className="mt-1 text-3xl font-bold">把有用的信息放到维界</h1>
      </header>
      <PublishForm channels={channels} tags={tags} />
    </div>
  );
}
