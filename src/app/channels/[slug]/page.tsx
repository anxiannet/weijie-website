import { notFound } from "next/navigation";
import { InfoCard } from "@/components/InfoCard";
import { PageViewTracker } from "@/components/PageViewTracker";
import { TagBadge } from "@/components/TagBadge";
import { getChannel, getChannelInfos, getChannelTags } from "@/lib/data";

export default async function ChannelPage({ params }: { params: { slug: string } }) {
  const [channel, tags, infos] = await Promise.all([getChannel(params.slug), getChannelTags(params.slug), getChannelInfos(params.slug)]);
  if (!channel) notFound();

  return (
    <div className="space-y-5 px-4 py-6 md:px-8">
      <PageViewTracker path={`/channels/${params.slug}`} targetType="channel" targetId={channel.id} />
      <header className="rounded-lg bg-white p-5 shadow-sm ring-1 ring-slate-100">
        <p className="text-sm font-semibold text-brand">频道</p>
        <h1 className="mt-1 text-3xl font-bold">{channel.name}</h1>
        <p className="mt-2 leading-7 text-slate-600">{channel.description}</p>
      </header>
      <section className="flex flex-wrap gap-2">
        {tags.map((tag) => <TagBadge key={tag.id} tag={tag} />)}
      </section>
      <section className="columns-2 gap-3 space-y-3 md:columns-3">
        {infos.map((info) => <InfoCard key={info.id} info={info} />)}
      </section>
    </div>
  );
}
