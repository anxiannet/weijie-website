import { getChannels, getTags } from "@/lib/data";

export default async function AdminTagsPage() {
  const [channels, tags] = await Promise.all([getChannels(), getTags()]);
  return (
    <div className="space-y-5 px-4 py-6 md:px-8">
      <header className="flex items-end justify-between gap-3">
        <div>
          <p className="text-sm font-semibold text-brand">后台</p>
          <h1 className="mt-1 text-3xl font-bold">标签管理</h1>
        </div>
        <button className="rounded-full bg-brand px-4 py-2 text-sm font-semibold text-white">新增标签</button>
      </header>
      <section className="overflow-hidden rounded-lg bg-white shadow-sm ring-1 ring-slate-100">
        {tags.map((tag) => {
          const channel = channels.find((item) => item.id === tag.channel_id);
          return (
            <div key={tag.id} className="grid gap-2 border-b border-slate-100 p-4 text-sm md:grid-cols-[1fr_1fr_100px_140px]">
              <span className="font-semibold">{tag.name}</span>
              <span className="text-slate-500">{channel?.name}</span>
              <span>{tag.info_count} 条</span>
              <span className={tag.info_count > 100 ? "font-medium text-amber-700" : "text-slate-400"}>{tag.info_count > 100 ? "建议升级专题" : "可继续观察"}</span>
            </div>
          );
        })}
      </section>
    </div>
  );
}
