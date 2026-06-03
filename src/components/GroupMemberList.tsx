import type { GroupMember } from "@/types";

export function GroupMemberList({ members, canManage = false }: { members: GroupMember[]; canManage?: boolean }) {
  return (
    <section className="space-y-2">
      {members.map((member) => (
        <div key={member.id} className="flex items-center justify-between rounded-lg bg-white p-3 text-sm ring-1 ring-slate-100">
          <div>
            <p className="font-semibold text-slate-900">{member.profile?.nickname ?? member.user_id}</p>
            <p className="text-xs text-slate-500">{member.member_role} · {member.status}</p>
          </div>
          {canManage && member.member_role !== "owner" ? <span className="text-xs font-medium text-brand">可管理</span> : null}
        </div>
      ))}
    </section>
  );
}
