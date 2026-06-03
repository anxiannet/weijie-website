import { AdminAccessDenied } from "@/components/AdminAccessDenied";
import { getAdminGroupDashboard } from "@/lib/data";
import { getAdminProfile } from "@/lib/supabase/server";

export default async function AdminGroupReportsPage() {
  const admin = await getAdminProfile();
  if (!admin) return <AdminAccessDenied />;
  const { reports } = await getAdminGroupDashboard();

  return (
    <div className="space-y-5 px-4 py-6 md:px-8">
      <header>
        <p className="text-sm font-semibold text-brand">后台管理</p>
        <h1 className="text-2xl font-bold">群聊举报</h1>
      </header>
      <section className="space-y-2">
        {reports.map((report) => (
          <div key={report.id} className="rounded-lg bg-white p-4 ring-1 ring-slate-100">
            <p className="font-semibold text-slate-900">{report.group?.title ?? report.group_id}</p>
            <p className="mt-1 text-sm leading-6 text-slate-600">{report.message?.body ?? "群聊举报"} </p>
            <p className="mt-2 text-xs text-slate-500">原因：{report.reason ?? "用户举报"} · 状态：{report.status}</p>
          </div>
        ))}
        {!reports.length ? <p className="rounded-lg bg-white p-4 text-sm text-slate-500 ring-1 ring-slate-100">暂无群聊举报。</p> : null}
      </section>
    </div>
  );
}
