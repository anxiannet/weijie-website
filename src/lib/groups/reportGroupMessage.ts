import { requireCurrentUser, requireServiceClient } from "@/lib/messages/guards";

export async function reportGroupMessage(groupId: string, messageId?: string | null, reason?: string, currentUserId?: string) {
  const currentUser = currentUserId ? { id: currentUserId } : await requireCurrentUser();
  const supabase = requireServiceClient();
  const { data, error } = await supabase
    .from("group_reports")
    .insert({ group_id: groupId, message_id: messageId ?? null, reporter_id: currentUser.id, reason: reason?.trim() || "用户举报" })
    .select("*")
    .single();
  if (error) throw error;
  return data;
}
