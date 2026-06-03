import { assertBody, assertGroupSendRate, requireCurrentUser, requireServiceClient } from "@/lib/messages/guards";

export async function sendGroupMessage(groupId: string, body: string, currentUserId?: string) {
  const currentUser = currentUserId ? { id: currentUserId } : await requireCurrentUser();
  const value = assertBody(body);
  await assertGroupSendRate(currentUser.id);
  const supabase = requireServiceClient();

  const { data: membership, error: membershipError } = await supabase
    .from("group_members")
    .select("id")
    .eq("group_id", groupId)
    .eq("user_id", currentUser.id)
    .eq("status", "active")
    .maybeSingle();
  if (membershipError) throw membershipError;
  if (!membership) throw new Error("只有群成员可以发群消息。");

  const { data: group, error: groupError } = await supabase.from("group_chats").select("status, message_count").eq("id", groupId).maybeSingle();
  if (groupError) throw groupError;
  if (!group || group.status !== "active") throw new Error("群聊已关闭。");

  const { data, error } = await supabase
    .from("group_messages")
    .insert({ group_id: groupId, sender_id: currentUser.id, body: value })
    .select("*")
    .single();
  if (error) throw error;
  await supabase.from("group_chats").update({ message_count: (group.message_count ?? 0) + 1 }).eq("id", groupId);
  return data;
}
