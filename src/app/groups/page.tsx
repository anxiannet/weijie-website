import { GroupCard } from "@/components/GroupCard";
import { getChannels, getGroups, getMyGroups, getTags } from "@/lib/data";

export default async function GroupsPage({ searchParams }: { searchParams?: { channel?: string; tag?: string } }) {
  const [channels, tags] = await Promise.all([getChannels(), getTags()]);
  const channel = channels.find((item) => item.slug === searchParams?.channel);
  const tag = tags.find((item) => item.slug === searchParams?.tag);
  const [groups, myGroups] = await Promise.all([
    getGroups({ channelId: channel?.id, tagId: tag?.id }),
    getMyGroups()
  ]);

  return (
    <div className="space-y-5 px-4 py-6 md:px-8">
      <header>
        <h1 className="text-2xl font-bold">群聊</h1>
        <p className="mt-1 text-sm text-slate-500">适合活动、合租、拼车、团购等多人沟通。</p>
      </header>
      <section className="flex gap-2 overflow-x-auto pb-1">
        {channels.slice(0, 8).map((item) => <a key={item.id} href={`/groups?channel=${item.slug}`} className="shrink-0 rounded-full bg-white px-3 py-1.5 text-sm ring-1 ring-slate-100">{item.name}</a>)}
      </section>
      {myGroups.length ? (
        <section className="space-y-3">
          <h2 className="font-semibold">我加入的群聊</h2>
          <div className="grid gap-3 md:grid-cols-2">{myGroups.map((group) => <GroupCard key={group.id} group={group} />)}</div>
        </section>
      ) : null}
      <section className="space-y-3">
        <h2 className="font-semibold">推荐群聊</h2>
        <div className="grid gap-3 md:grid-cols-2">{groups.map((group) => <GroupCard key={group.id} group={group} />)}</div>
      </section>
    </div>
  );
}
