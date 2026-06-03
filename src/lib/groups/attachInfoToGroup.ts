import { requireCurrentUser, requireServiceClient } from "@/lib/messages/guards";

export async function attachInfoToGroup(groupId: string, infoId: string, currentUserId?: string) {
  const currentUser = currentUserId ? { id: currentUserId } : await requireCurrentUser();
  const supabase = requireServiceClient();
  const { data, error } = await supabase
    .from("group_infos")
    .upsert({ group_id: groupId, info_id: infoId, added_by: currentUser.id }, { onConflict: "group_id,info_id" })
    .select("*")
    .single();
  if (error) throw error;
  return data;
}
