import { requireCurrentUser, requireServiceClient } from "@/lib/messages/guards";

export async function getGroupMessages(groupId: string, currentUserId?: string) {
  const currentUser = currentUserId ? { id: currentUserId } : await requireCurrentUser();
  const supabase = requireServiceClient();
  const { data: membership, error: membershipError } = await supabase
    .from("group_members")
    .select("id")
    .eq("group_id", groupId)
    .eq("user_id", currentUser.id)
    .eq("status", "active")
    .maybeSingle();
  if (membershipError) throw membershipError;
  if (!membership) throw new Error("只有群成员可以查看群消息。");
  const { data, error } = await supabase
    .from("group_messages")
    .select("*, sender:profiles(*)")
    .eq("group_id", groupId)
    .is("deleted_at", null)
    .order("created_at", { ascending: true });
  if (error) throw error;
  return data ?? [];
}
