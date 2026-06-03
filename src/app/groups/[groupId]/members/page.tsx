import { notFound } from "next/navigation";
import Link from "next/link";
import { GroupMemberList } from "@/components/GroupMemberList";
import { GroupSettingsPanel } from "@/components/GroupSettingsPanel";
import { getGroup, getGroupMembers } from "@/lib/data";

export default async function GroupMembersPage({ params }: { params: { groupId: string } }) {
  const [group, members] = await Promise.all([getGroup(params.groupId), getGroupMembers(params.groupId)]);
  if (!group) notFound();
  return (
    <div className="space-y-5 px-4 py-6 md:px-8">
      <header>
        <Link href={`/groups/${group.id}`} className="text-sm font-semibold text-brand">返回群聊</Link>
        <h1 className="mt-3 text-2xl font-bold">群成员</h1>
        <p className="mt-1 text-sm text-slate-500">{group.title}</p>
      </header>
      <GroupSettingsPanel group={group} />
      <GroupMemberList members={members} canManage />
    </div>
  );
}
