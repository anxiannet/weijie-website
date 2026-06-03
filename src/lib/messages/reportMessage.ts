import { requireCurrentUser, requireServiceClient } from "@/lib/messages/guards";

export async function reportMessage(messageId: string, reason?: string, currentUserId?: string) {
  const currentUser = currentUserId ? { id: currentUserId } : await requireCurrentUser();
  const supabase = requireServiceClient();
  const { data, error } = await supabase
    .from("message_reports")
    .insert({ message_id: messageId, reporter_id: currentUser.id, reason: reason?.trim() || "用户举报" })
    .select("*")
    .single();
  if (error) throw error;
  return data;
}
