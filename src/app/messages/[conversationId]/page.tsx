import { notFound } from "next/navigation";
import Link from "next/link";
import { BlockUserButton } from "@/components/BlockUserButton";
import { MessageBubble } from "@/components/MessageBubble";
import { MessageInput } from "@/components/MessageInput";
import { RelatedInfoCard } from "@/components/RelatedInfoCard";
import { ReportMessageButton } from "@/components/ReportMessageButton";
import { getConversation, getConversationMessages } from "@/lib/data";
import { getCurrentUser } from "@/lib/supabase/server";

export default async function ConversationPage({ params }: { params: { conversationId: string } }) {
  const [user, conversation, messages] = await Promise.all([
    getCurrentUser(),
    getConversation(params.conversationId),
    getConversationMessages(params.conversationId)
  ]);
  if (!conversation) notFound();
  const currentUserId = user?.id ?? "profile-demo";
  const other = conversation.publisher_id === currentUserId ? conversation.initiator : conversation.publisher;

  return (
    <div className="space-y-4 px-4 py-6 md:px-8">
      <header className="space-y-3">
        <Link href="/messages" className="text-sm font-semibold text-brand">返回私信</Link>
        <div className="flex items-center justify-between gap-3">
          <div>
            <h1 className="text-2xl font-bold">{other?.nickname ?? "维界用户"}</h1>
            <p className="text-sm text-slate-500">请保持礼貌沟通，必要时可举报或拉黑。</p>
          </div>
          <BlockUserButton userId={other?.id} />
        </div>
      </header>
      {conversation.info ? <RelatedInfoCard info={conversation.info} /> : null}
      <section className="space-y-2 rounded-lg bg-slate-50 p-3">
        {messages.map((message) => <MessageBubble key={message.id} message={message} currentUserId={currentUserId} />)}
      </section>
      {messages.at(-1) ? <ReportMessageButton messageId={messages.at(-1)?.id} /> : null}
      <MessageInput conversationId={conversation.id} />
    </div>
  );
}
