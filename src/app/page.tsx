import { ChevronDown, Menu, Search } from "lucide-react";
import { InfoCard } from "@/components/InfoCard";
import { PageViewTracker } from "@/components/PageViewTracker";
import { getChannels, getInfos } from "@/lib/data";
import Link from "next/link";

export default async function HomePage({ searchParams }: { searchParams: { channel?: string } }) {
  const [channels, allInfos] = await Promise.all([getChannels(), getInfos()]);
  const activeChannel = channels.find((channel) => channel.slug === searchParams.channel);
  const infos = activeChannel ? allInfos.filter((info) => info.channel_id === activeChannel.id) : allInfos;
  const topTabs = ["关注", "发现", "附近"];

  return (
    <div className="min-h-screen bg-slate-50">
      <PageViewTracker path="/" targetType="home" />
      <header className="sticky top-0 z-40 border-b border-slate-100 bg-white/95 backdrop-blur">
        <div className="mx-auto max-w-5xl px-4 pt-4 md:px-8">
          <div className="flex h-11 items-center justify-between">
            <Link href="/search" className="grid h-10 w-10 place-items-center rounded-full text-slate-800" aria-label="频道">
              <Menu className="h-7 w-7" />
            </Link>
            <div className="flex items-center gap-8 text-lg font-semibold text-slate-400">
              {topTabs.map((tab) => (
                <span key={tab} className={tab === "发现" ? "relative text-slate-950" : ""}>
                  {tab}
                  {tab === "关注" && <span className="absolute -right-4 -top-2 grid h-5 w-5 place-items-center rounded-full bg-brand text-xs text-white">1</span>}
                  {tab === "发现" && <span className="absolute -bottom-2 left-1/2 h-1 w-8 -translate-x-1/2 rounded-full bg-brand" />}
                </span>
              ))}
            </div>
            <Link href="/search" className="grid h-10 w-10 place-items-center rounded-full text-slate-800" aria-label="搜索">
              <Search className="h-7 w-7" />
            </Link>
          </div>
          <nav className="scrollbar-none mt-4 flex snap-x gap-7 overflow-x-auto whitespace-nowrap pb-3 text-base text-slate-500">
            <Link href="/" className={!activeChannel ? "snap-start font-semibold text-slate-950" : "snap-start font-medium"}>
              推荐
            </Link>
            {channels.map((channel) => (
              <Link
                key={channel.id}
                href={`/?channel=${channel.slug}`}
                className={activeChannel?.id === channel.id ? "snap-start font-semibold text-slate-950" : "snap-start font-medium"}
              >
                {channel.name}
              </Link>
            ))}
            <span className="inline-flex items-center gap-1 font-medium">
              更多
              <ChevronDown className="h-4 w-4" />
            </span>
          </nav>
        </div>
      </header>
      <div className="mx-auto max-w-5xl px-2 py-3 md:px-8">
        <section>
          <div className="columns-2 gap-2 space-y-2 md:columns-3 md:gap-4 md:space-y-4">
            {infos.map((info) => <InfoCard key={info.id} info={info} />)}
          </div>
        </section>
      </div>
    </div>
  );
}
