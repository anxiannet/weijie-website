import Link from "next/link";
import type { Conversation } from "@/types";

export function ConversationCard({ conversation, currentUserId }: { conversation: Conversation; currentUserId?: string | null }) {
  const other = conversation.publisher_id === currentUserId ? conversation.initiator : conversation.publisher;
  const unread = conversation.publisher_id === currentUserId ? conversation.publisher_unread_count : conversation.initiator_unread_count;
  return (
    <Link href={`/messages/${conversation.id}`} className="block rounded-lg bg-white p-4 shadow-sm ring-1 ring-slate-100">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="font-semibold text-slate-900">{other?.nickname ?? "维界用户"}</p>
          <p className="mt-1 truncate text-sm text-slate-500">{conversation.info?.title ?? "关联信息已不可见"}</p>
          <p className="mt-2 line-clamp-1 text-sm text-slate-600">{conversation.last_message ?? "还没有消息"}</p>
        </div>
        {unread > 0 ? <span className="rounded-full bg-brand px-2 py-0.5 text-xs font-semibold text-white">{unread}</span> : null}
      </div>
    </Link>
  );
}
