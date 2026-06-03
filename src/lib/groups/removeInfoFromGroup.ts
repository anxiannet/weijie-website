import { requireCurrentUser, requireServiceClient } from "@/lib/messages/guards";

export async function removeInfoFromGroup(groupId: string, infoId: string, currentUserId?: string) {
  if (!currentUserId) await requireCurrentUser();
  const supabase = requireServiceClient();
  const { error } = await supabase.from("group_infos").delete().eq("group_id", groupId).eq("info_id", infoId);
  if (error) throw error;
}
