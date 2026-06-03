import { notFound } from "next/navigation";
import Link from "next/link";
import { GroupChatBox } from "@/components/GroupChatBox";
import { GroupRelatedInfos } from "@/components/GroupRelatedInfos";
import { GroupReportButton } from "@/components/GroupReportButton";
import { JoinGroupButton } from "@/components/JoinGroupButton";
import { getGroup, getGroupMessagesForPage } from "@/lib/data";
import { getCurrentUser } from "@/lib/supabase/server";

export default async function GroupPage({ params }: { params: { groupId: string } }) {
  const [user, group, messages] = await Promise.all([
    getCurrentUser(),
    getGroup(params.groupId),
    getGroupMessagesForPage(params.groupId)
  ]);
  if (!group) notFound();

  return (
    <div className="space-y-5 px-4 py-6 md:px-8">
      <header className="space-y-3">
        <Link href="/groups" className="text-sm font-semibold text-brand">返回群聊</Link>
        <div className="flex items-start justify-between gap-3">
          <div>
            <h1 className="text-2xl font-bold">{group.title}</h1>
            <p className="mt-1 text-sm leading-6 text-slate-500">{group.description}</p>
            <p className="mt-2 text-sm font-medium text-brand">{group.member_count} 人 · {group.message_count} 条消息</p>
          </div>
          <JoinGroupButton groupId={group.id} />
        </div>
      </header>
      <div className="flex gap-2">
        <Link href={`/groups/${group.id}/members`} className="rounded-full border border-slate-200 px-3 py-1.5 text-xs font-semibold text-slate-600">成员</Link>
        <GroupReportButton groupId={group.id} />
      </div>
      {group.infos?.length ? <GroupRelatedInfos infos={group.infos} /> : null}
      <GroupChatBox groupId={group.id} messages={messages} currentUserId={user?.id ?? "profile-demo"} />
    </div>
  );
}
