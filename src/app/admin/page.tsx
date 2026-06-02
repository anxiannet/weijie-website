import Link from "next/link";
import { AdminAccessDenied } from "@/components/AdminAccessDenied";
import { AdminStatCard } from "@/components/AdminStatCard";
import { AnalyticsTable } from "@/components/AnalyticsTable";
import { getAdminAnalytics, getFeaturedTags, getInfos } from "@/lib/data";
import { getAdminProfile } from "@/lib/supabase/server";

export default async function AdminPage() {
  const admin = await getAdminProfile();
  if (!admin) return <AdminAccessDenied />;

  const [infos, tags, analytics] = await Promise.all([getInfos(), getFeaturedTags(), getAdminAnalytics()]);
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
        <AdminStatCard label="近期访问量" value={analytics.stats.pageViews} />
        <AdminStatCard label="近期搜索数" value={analytics.stats.searches} />
        <AdminStatCard label="已发布信息" value={infos.length} />
        <AdminStatCard label="待审核信息" value={analytics.stats.pendingInfos} />
        <AdminStatCard label="待审核评论" value={analytics.stats.pendingComments} />
        <AdminStatCard label="AI草稿数量" value={analytics.stats.aiDrafts} />
        <AdminStatCard label="无结果搜索" value={analytics.stats.noResultSearches} />
        <AdminStatCard label="推荐信息" value={infos.length} />
      </section>
      <div className="grid gap-4 md:grid-cols-2">
        <AnalyticsTable title="热门搜索词" rows={analytics.searchRows} />
        <AnalyticsTable title="热门标签" rows={tags.slice(0, 5).map((tag) => ({ name: tag.name, value: tag.info_count }))} />
        <AnalyticsTable title="无结果搜索词" rows={analytics.noResultRows} />
      </div>
    </div>
  );
}
