import type { GroupMessage } from "@/types";

export function GroupMessageBubble({ message, currentUserId }: { message: GroupMessage; currentUserId?: string | null }) {
  const mine = message.sender_id === currentUserId || (!currentUserId && message.sender_id === "profile-demo");
  return (
    <div className={`flex ${mine ? "justify-end" : "justify-start"}`}>
      <div className={`max-w-[84%] rounded-lg px-3 py-2 text-sm leading-6 ${mine ? "bg-brand text-white" : "bg-white text-slate-700 ring-1 ring-slate-100"}`}>
        {!mine ? <p className="mb-1 text-xs font-semibold text-brand">{message.sender?.nickname ?? "群成员"}</p> : null}
        {message.body}
      </div>
    </div>
  );
}
