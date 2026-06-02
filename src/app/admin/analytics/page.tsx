import { AdminAccessDenied } from "@/components/AdminAccessDenied";
import { AnalyticsTable } from "@/components/AnalyticsTable";
import { getAdminAnalytics } from "@/lib/data";
import { getAdminProfile } from "@/lib/supabase/server";

export default async function AnalyticsPage() {
  const admin = await getAdminProfile();
  if (!admin) return <AdminAccessDenied />;

  const analytics = await getAdminAnalytics();
  return (
    <div className="space-y-5 px-4 py-6 md:px-8">
      <header>
        <p className="text-sm font-semibold text-brand">后台</p>
        <h1 className="mt-1 text-3xl font-bold">数据监控</h1>
      </header>
      <div className="grid gap-4 md:grid-cols-2">
        <AnalyticsTable title="搜索词排行" rows={analytics.searchRows} />
        <AnalyticsTable title="无结果搜索排行" rows={analytics.noResultRows} />
        <AnalyticsTable title="频道访问排行" rows={analytics.channelRows} />
        <AnalyticsTable title="标签访问排行" rows={analytics.tagRows} />
        <AnalyticsTable title="信息访问排行" rows={analytics.infoRows} />
        <AnalyticsTable title="热门发布类型" rows={analytics.typeRows} />
      </div>
    </div>
  );
}
