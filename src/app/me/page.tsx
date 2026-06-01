import { InfoCard } from "@/components/InfoCard";
import { getInfos } from "@/lib/data";

export default async function MePage() {
  const infos = (await getInfos()).slice(0, 4);
  return (
    <div className="space-y-5 px-4 py-6 md:px-8">
      <section className="rounded-lg bg-white p-5 shadow-sm ring-1 ring-slate-100">
        <h1 className="text-2xl font-bold">我的</h1>
        <p className="mt-2 text-slate-600">当前为 mock 用户。连接 Supabase Auth 后展示真实资料、收藏和评论。</p>
      </section>
      <h2 className="font-semibold">我的信息</h2>
      <div className="columns-2 gap-3 space-y-3 md:columns-3">{infos.map((info) => <InfoCard key={info.id} info={info} />)}</div>
      <h2 className="font-semibold">我的收藏</h2>
      <p className="rounded-lg bg-white p-4 text-sm text-slate-500 ring-1 ring-slate-100">收藏会写入 saved_items，仅本人可见。</p>
      <h2 className="font-semibold">我的评论</h2>
      <p className="rounded-lg bg-white p-4 text-sm text-slate-500 ring-1 ring-slate-100">评论会显示审核通过内容。</p>
    </div>
  );
}
