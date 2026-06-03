import { assertBody, assertPrivateSendRate, requireCurrentUser, requireServiceClient } from "@/lib/messages/guards";

export async function sendMessage(conversationId: string, body: string, currentUserId?: string) {
  const currentUser = currentUserId ? { id: currentUserId } : await requireCurrentUser();
  const value = assertBody(body);
  await assertPrivateSendRate(currentUser.id);
  const supabase = requireServiceClient();

  const { data: conversation, error: conversationError } = await supabase
    .from("conversations")
    .select("*")
    .eq("id", conversationId)
    .maybeSingle();
  if (conversationError) throw conversationError;
  if (!conversation) throw new Error("私信会话不存在。");

  const isPublisher = conversation.publisher_id === currentUser.id;
  const isInitiator = conversation.initiator_id === currentUser.id;
  if (!isPublisher && !isInitiator) throw new Error("你不在这个私信会话中。");
  const receiverId = isPublisher ? conversation.initiator_id : conversation.publisher_id;
  if (!receiverId) throw new Error("接收方不存在。");

  const { data: blocked, error: blockedError } = await supabase
    .from("blocked_users")
    .select("id")
    .eq("blocker_id", receiverId)
    .eq("blocked_id", currentUser.id)
    .maybeSingle();
  if (blockedError) throw blockedError;
  if (blocked) throw new Error("对方已停止接收你的私信。");

  const { data: message, error } = await supabase
    .from("messages")
    .insert({
      conversation_id: conversationId,
      sender_id: currentUser.id,
      receiver_id: receiverId,
      body: value
    })
    .select("*")
    .single();
  if (error) throw error;

  const unreadPatch = isPublisher
    ? { initiator_unread_count: (conversation.initiator_unread_count ?? 0) + 1 }
    : { publisher_unread_count: (conversation.publisher_unread_count ?? 0) + 1 };

  const { error: updateError } = await supabase
    .from("conversations")
    .update({
      last_message: value,
      last_message_at: new Date().toISOString(),
      ...unreadPatch
    })
    .eq("id", conversationId);
  if (updateError) throw updateError;

  return message;
}
