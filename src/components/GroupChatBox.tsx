import { GroupMessageBubble } from "@/components/GroupMessageBubble";
import { GroupMessageInput } from "@/components/GroupMessageInput";
import type { GroupMessage } from "@/types";

export function GroupChatBox({ groupId, messages, currentUserId }: { groupId: string; messages: GroupMessage[]; currentUserId?: string | null }) {
  return (
    <section className="space-y-3">
      <h2 className="font-semibold">群消息</h2>
      <div className="space-y-2 rounded-lg bg-slate-50 p-3">
        {messages.length ? messages.map((message) => <GroupMessageBubble key={message.id} message={message} currentUserId={currentUserId} />) : <p className="text-sm text-slate-500">还没有群消息。</p>}
      </div>
      <GroupMessageInput groupId={groupId} />
    </section>
  );
}
