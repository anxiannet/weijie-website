import { requireCurrentUser, requireServiceClient } from "@/lib/messages/guards";
import type { GroupMemberRole, GroupMemberStatus } from "@/types";

export async function manageGroupMember(groupId: string, userId: string, values: { memberRole?: GroupMemberRole; status?: GroupMemberStatus }, currentUserId?: string) {
  await (currentUserId ? Promise.resolve({ id: currentUserId }) : requireCurrentUser());
  const supabase = requireServiceClient();
  const patch: Record<string, string> = {};
  if (values.memberRole) patch.member_role = values.memberRole;
  if (values.status) patch.status = values.status;
  const { data, error } = await supabase
    .from("group_members")
    .update(patch)
    .eq("group_id", groupId)
    .eq("user_id", userId)
    .select("*")
    .single();
  if (error) throw error;
  return data;
}
