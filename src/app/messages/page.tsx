import Link from "next/link";
import { ConversationCard } from "@/components/ConversationCard";
import { getMyConversations } from "@/lib/data";
import { getCurrentUser } from "@/lib/supabase/server";

export default async function MessagesPage() {
  const [user, conversations] = await Promise.all([getCurrentUser(), getMyConversations()]);

  if (!user && !conversations.length) {
    return (
      <div className="mx-auto max-w-md space-y-4 px-4 py-12 text-center">
        <h1 className="text-2xl font-bold">我的私信</h1>
        <p className="text-sm leading-6 text-slate-500">登录后可以查看与发布者或咨询者的私信。</p>
        <Link href="/login" className="inline-flex rounded-full bg-brand px-4 py-2 text-sm font-semibold text-white">去登录</Link>
      </div>
    );
  }

  return (
    <div className="space-y-4 px-4 py-6 md:px-8">
      <header>
        <h1 className="text-2xl font-bold">我的私信</h1>
        <p className="mt-1 text-sm text-slate-500">围绕具体信息的一对一沟通。</p>
      </header>
      {conversations.length ? conversations.map((conversation) => (
        <ConversationCard key={conversation.id} conversation={conversation} currentUserId={user?.id ?? "profile-demo"} />
      )) : <p className="rounded-lg bg-white p-4 text-sm text-slate-500 ring-1 ring-slate-100">还没有私信。</p>}
    </div>
  );
}
