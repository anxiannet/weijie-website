import { notFound } from "next/navigation";
import { EmptyState } from "@/components/EmptyState";
import { InfoCard } from "@/components/InfoCard";
import { PageViewTracker } from "@/components/PageViewTracker";
import { getTag, getTagInfos } from "@/lib/data";

export default async function TagPage({ params }: { params: { slug: string } }) {
  const [tag, infos] = await Promise.all([getTag(params.slug), getTagInfos(params.slug)]);
  if (!tag) notFound();

  return (
    <div className="space-y-5 px-4 py-6 md:px-8">
      <PageViewTracker path={`/tags/${params.slug}`} targetType="tag" targetId={tag.id} />
      <header className="rounded-lg bg-white p-5 shadow-sm ring-1 ring-slate-100">
        <p className="text-sm font-semibold text-brand">标签</p>
        <h1 className="mt-1 text-3xl font-bold">{tag.name}</h1>
        <p className="mt-2 leading-7 text-slate-600">{tag.description}</p>
        <p className="mt-3 text-sm font-medium text-brand">{infos.length} 条信息</p>
      </header>
      {infos.length ? (
        <section className="columns-2 gap-3 space-y-3 md:columns-3">
          {infos.map((info) => <InfoCard key={info.id} info={info} />)}
        </section>
      ) : <EmptyState title="暂无信息" description="这个标签未来内容多了，可以升级成专题或工具。" />}
    </div>
  );
}
