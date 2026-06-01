import { ChannelCard } from "@/components/ChannelCard";
import { InfoCard } from "@/components/InfoCard";
import { PageViewTracker } from "@/components/PageViewTracker";
import { SearchBar } from "@/components/SearchBar";
import { TagBadge } from "@/components/TagBadge";
import { getChannels, getFeaturedTags, getInfos } from "@/lib/data";

export default async function HomePage() {
  const [channels, featuredTags, infos] = await Promise.all([getChannels(), getFeaturedTags(), getInfos()]);

  return (
    <div className="space-y-6 px-4 py-5 md:px-8">
      <PageViewTracker path="/" targetType="home" />
      <header className="space-y-3 pt-3">
        <p className="text-sm font-semibold text-brand">维界 Weijie</p>
        <h1 className="text-3xl font-bold tracking-normal text-slate-950 md:text-5xl">维界</h1>
        <div className="max-w-2xl space-y-1 text-slate-700">
          <p className="text-lg font-semibold">打破信息壁垒，解决现实问题。</p>
          <p className="leading-7">帮助新加坡华人更快找到答案、资源和靠谱的人。</p>
        </div>
      </header>
      <SearchBar />
      <section className="flex gap-3 overflow-x-auto pb-1 scrollbar-none">
        {channels.slice(0, 10).map((channel) => <ChannelCard key={channel.id} channel={channel} />)}
      </section>
      <section className="space-y-3">
        <h2 className="text-lg font-semibold">热门标签</h2>
        <div className="flex flex-wrap gap-2">
          {featuredTags.map((tag) => <TagBadge key={tag.id} tag={tag} />)}
        </div>
      </section>
      <section className="space-y-3">
        <h2 className="text-lg font-semibold">推荐信息</h2>
        <div className="columns-2 gap-3 space-y-3 md:columns-3">
          {infos.map((info) => <InfoCard key={info.id} info={info} />)}
        </div>
      </section>
    </div>
  );
}
