import { requireCurrentUser, requireServiceClient } from "@/lib/messages/guards";

export async function markConversationRead(conversationId: string, currentUserId?: string) {
  const currentUser = currentUserId ? { id: currentUserId } : await requireCurrentUser();
  const supabase = requireServiceClient();
  const { data: conversation, error } = await supabase.from("conversations").select("*").eq("id", conversationId).maybeSingle();
  if (error) throw error;
  if (!conversation) throw new Error("私信会话不存在。");
  const patch = conversation.publisher_id === currentUser.id
    ? { publisher_unread_count: 0 }
    : conversation.initiator_id === currentUser.id
      ? { initiator_unread_count: 0 }
      : null;
  if (!patch) throw new Error("你不在这个私信会话中。");
  const { error: updateError } = await supabase.from("conversations").update(patch).eq("id", conversationId);
  if (updateError) throw updateError;
}
