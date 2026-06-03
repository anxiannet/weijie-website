import { requireCurrentUser, requireServiceClient } from "@/lib/messages/guards";

export async function leaveGroup(groupId: string, currentUserId?: string) {
  const currentUser = currentUserId ? { id: currentUserId } : await requireCurrentUser();
  const supabase = requireServiceClient();
  const { error } = await supabase
    .from("group_members")
    .update({ status: "left" })
    .eq("group_id", groupId)
    .eq("user_id", currentUser.id)
    .neq("member_role", "owner");
  if (error) throw error;
}
