import type { Message } from "@/types";

export function MessageBubble({ message, currentUserId }: { message: Message; currentUserId?: string | null }) {
  const mine = message.sender_id === currentUserId || (!currentUserId && message.sender_id === "profile-demo");
  return (
    <div className={`flex ${mine ? "justify-end" : "justify-start"}`}>
      <div className={`max-w-[82%] rounded-lg px-3 py-2 text-sm leading-6 ${mine ? "bg-brand text-white" : "bg-white text-slate-700 ring-1 ring-slate-100"}`}>
        {message.body}
      </div>
    </div>
  );
}
