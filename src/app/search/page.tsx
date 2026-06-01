import Link from "next/link";
import { EmptyState } from "@/components/EmptyState";
import { InfoCard } from "@/components/InfoCard";
import { PageViewTracker } from "@/components/PageViewTracker";
import { SearchBar } from "@/components/SearchBar";
import { SearchLogger } from "@/components/SearchLogger";
import { TagBadge } from "@/components/TagBadge";
import { searchAll } from "@/lib/data";

export default async function SearchPage({ searchParams }: { searchParams: { q?: string } }) {
  const query = searchParams.q ?? "";
  const result = await searchAll(query);
  const count = result.tags.length + result.infos.length + result.channels.length;

  return (
    <div className="space-y-5 px-4 py-6 md:px-8">
      <PageViewTracker path="/search" targetType="search" />
      <SearchLogger query={query} resultCount={count} matchedTagId={result.tags[0]?.id} matchedChannelId={result.channels[0]?.id} />
      <SearchBar defaultValue={query} />
      {!query ? <EmptyState title="搜索新加坡生活信息" description="可以搜 NTU租房、蒸饺、机场接送、陪诊、银行开户。" /> : (
        <>
          <section className="space-y-3">
            <h2 className="font-semibold">标签</h2>
            <div className="flex flex-wrap gap-2">{result.tags.map((tag) => <TagBadge key={tag.id} tag={tag} />)}</div>
          </section>
          <section className="space-y-3">
            <h2 className="font-semibold">信息</h2>
            {result.infos.length ? <div className="columns-2 gap-3 space-y-3 md:columns-3">{result.infos.map((info) => <InfoCard key={info.id} info={info} />)}</div> : null}
          </section>
          <section className="space-y-3">
            <h2 className="font-semibold">频道</h2>
            <div className="grid gap-2 md:grid-cols-3">{result.channels.map((channel) => <Link key={channel.id} href={`/channels/${channel.slug}`} className="rounded-lg bg-white p-4 shadow-sm ring-1 ring-slate-100">{channel.name}</Link>)}</div>
          </section>
          {count === 0 && <EmptyState title="没有找到结果" description="已记录无结果搜索，后台可据此发现真实需求。" />}
        </>
      )}
    </div>
  );
}
