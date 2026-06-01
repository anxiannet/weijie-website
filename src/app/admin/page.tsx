import Link from "next/link";
import { AdminStatCard } from "@/components/AdminStatCard";
import { AnalyticsTable } from "@/components/AnalyticsTable";
import { getFeaturedTags, getInfos } from "@/lib/data";

export default async function AdminPage() {
  const [infos, tags] = await Promise.all([getInfos(), getFeaturedTags()]);
  return (
    <div className="space-y-5 px-4 py-6 md:px-8">
      <header className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="text-sm font-semibold text-brand">后台</p>
          <h1 className="mt-1 text-3xl font-bold">仪表盘</h1>
        </div>
        <div className="flex gap-2 text-sm">
          <Link href="/admin/moderation" className="rounded-full bg-brand px-3 py-2 font-medium text-white">审核</Link>
          <Link href="/admin/analytics" className="rounded-full bg-white px-3 py-2 font-medium ring-1 ring-slate-200">数据</Link>
          <Link href="/admin/tags" className="rounded-full bg-white px-3 py-2 font-medium ring-1 ring-slate-200">标签</Link>
          <Link href="/admin/ai" className="rounded-full bg-white px-3 py-2 font-medium ring-1 ring-slate-200">AI</Link>
        </div>
      </header>
      <section className="grid grid-cols-2 gap-3 md:grid-cols-4">
        <AdminStatCard label="今日访问量" value={1280} />
        <AdminStatCard label="今日搜索数" value={246} />
        <AdminStatCard label="今日发布数" value={18} />
        <AdminStatCard label="待审核信息" value={6} />
        <AdminStatCard label="待审核评论" value={3} />
        <AdminStatCard label="AI草稿数量" value={4} />
        <AdminStatCard label="无结果搜索" value={11} />
        <AdminStatCard label="推荐信息" value={infos.length} />
      </section>
      <div className="grid gap-4 md:grid-cols-2">
        <AnalyticsTable title="热门搜索词" rows={[{ name: "NTU租房", value: 88 }, { name: "机场接送", value: 42 }, { name: "银行开户", value: 39 }]} />
        <AnalyticsTable title="热门标签" rows={tags.slice(0, 5).map((tag) => ({ name: tag.name, value: tag.info_count }))} />
        <AnalyticsTable title="无结果搜索词" rows={[{ name: "Jurong月嫂", value: 7 }, { name: "PR材料翻译", value: 4 }, { name: "宠物寄养", value: 3 }]} />
      </div>
    </div>
  );
}
