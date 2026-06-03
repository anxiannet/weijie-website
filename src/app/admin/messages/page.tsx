import { AdminAccessDenied } from "@/components/AdminAccessDenied";
import { getAdminMessageDashboard } from "@/lib/data";
import { getAdminProfile } from "@/lib/supabase/server";

export default async function AdminMessagesPage() {
  const admin = await getAdminProfile();
  if (!admin) return <AdminAccessDenied />;
  const dashboard = await getAdminMessageDashboard();

  return (
    <div className="space-y-5 px-4 py-6 md:px-8">
      <header>
        <p className="text-sm font-semibold text-brand">后台管理</p>
        <h1 className="text-2xl font-bold">私信管理</h1>
      </header>
      <section className="grid gap-3 md:grid-cols-2">
        <div className="rounded-lg bg-white p-4 ring-1 ring-slate-100">
          <h2 className="font-semibold">最近私信</h2>
          <div className="mt-3 space-y-2">
            {dashboard.recentMessages.map((message) => <p key={message.id} className="text-sm leading-6 text-slate-600">{message.body}</p>)}
          </div>
        </div>
        <div className="rounded-lg bg-white p-4 ring-1 ring-slate-100">
          <h2 className="font-semibold">被举报消息</h2>
          <div className="mt-3 space-y-2">
            {dashboard.reports.map((report) => <p key={report.id} className="text-sm text-slate-600">{report.reason ?? "用户举报"} · {report.status}</p>)}
            {!dashboard.reports.length ? <p className="text-sm text-slate-500">暂无举报。</p> : null}
          </div>
        </div>
      </section>
      <section className="grid gap-3 md:grid-cols-2">
        <div className="rounded-lg bg-white p-4 ring-1 ring-slate-100">
          <h2 className="font-semibold">高频私信用户</h2>
          {dashboard.frequentUsers.map((row) => <p key={row.user_id} className="mt-2 text-sm text-slate-600">{row.user_id} · {row.count} 条</p>)}
        </div>
        <div className="rounded-lg bg-white p-4 ring-1 ring-slate-100">
          <h2 className="font-semibold">被拉黑次数较多用户</h2>
          {dashboard.blockedUsers.map((row) => <p key={row.blocked_id} className="mt-2 text-sm text-slate-600">{row.blocked_id} · {row.count} 次</p>)}
        </div>
      </section>
    </div>
  );
}
