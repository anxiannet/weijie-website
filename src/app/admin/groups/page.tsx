import Link from "next/link";
import { AdminAccessDenied } from "@/components/AdminAccessDenied";
import { getAdminGroupDashboard } from "@/lib/data";
import { getAdminProfile } from "@/lib/supabase/server";

export default async function AdminGroupsPage() {
  const admin = await getAdminProfile();
  if (!admin) return <AdminAccessDenied />;
  const { groups, reports } = await getAdminGroupDashboard();

  return (
    <div className="space-y-5 px-4 py-6 md:px-8">
      <header className="flex items-center justify-between gap-3">
        <div>
          <p className="text-sm font-semibold text-brand">后台管理</p>
          <h1 className="text-2xl font-bold">群聊管理</h1>
        </div>
        <Link href="/groups" className="rounded-full bg-brand px-4 py-2 text-sm font-semibold text-white">创建群聊</Link>
      </header>
      <section className="grid gap-3 md:grid-cols-4">
        <div className="rounded-lg bg-white p-4 ring-1 ring-slate-100"><p className="text-sm text-slate-500">全部群聊</p><p className="mt-1 text-2xl font-bold">{groups.length}</p></div>
        <div className="rounded-lg bg-white p-4 ring-1 ring-slate-100"><p className="text-sm text-slate-500">活跃群聊</p><p className="mt-1 text-2xl font-bold">{groups.filter((group) => group.status === "active").length}</p></div>
        <div className="rounded-lg bg-white p-4 ring-1 ring-slate-100"><p className="text-sm text-slate-500">关闭群聊</p><p className="mt-1 text-2xl font-bold">{groups.filter((group) => group.status === "closed").length}</p></div>
        <div className="rounded-lg bg-white p-4 ring-1 ring-slate-100"><p className="text-sm text-slate-500">被举报群聊</p><p className="mt-1 text-2xl font-bold">{reports.length}</p></div>
      </section>
      <section className="space-y-2">
        {groups.map((group) => (
          <div key={group.id} className="rounded-lg bg-white p-4 ring-1 ring-slate-100">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="font-semibold text-slate-900">{group.title}</p>
                <p className="mt-1 text-sm text-slate-500">{group.status} · {group.member_count} 人 · {group.message_count} 条消息 · {group.infos?.length ?? 0} 条关联信息</p>
              </div>
              <Link href={`/groups/${group.id}/members`} className="rounded-full border border-slate-200 px-3 py-1.5 text-xs font-semibold text-slate-600">查看成员</Link>
            </div>
          </div>
        ))}
      </section>
    </div>
  );
}
