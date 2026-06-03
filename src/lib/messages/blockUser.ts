import { requireCurrentUser, requireServiceClient } from "@/lib/messages/guards";

export async function blockUser(blockedId: string, reason?: string, currentUserId?: string) {
  const currentUser = currentUserId ? { id: currentUserId } : await requireCurrentUser();
  if (blockedId === currentUser.id) throw new Error("不能拉黑自己。");
  const supabase = requireServiceClient();
  const { data, error } = await supabase
    .from("blocked_users")
    .upsert({ blocker_id: currentUser.id, blocked_id: blockedId, reason: reason?.trim() || null }, { onConflict: "blocker_id,blocked_id" })
    .select("*")
    .single();
  if (error) throw error;
  return data;
}
