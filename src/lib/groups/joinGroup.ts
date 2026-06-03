import { requireCurrentUser, requireServiceClient } from "@/lib/messages/guards";

export async function joinGroup(groupId: string, message?: string, currentUserId?: string) {
  const currentUser = currentUserId ? { id: currentUserId } : await requireCurrentUser();
  const supabase = requireServiceClient();
  const { data: group, error } = await supabase.from("group_chats").select("*").eq("id", groupId).maybeSingle();
  if (error) throw error;
  if (!group || group.status !== "active") throw new Error("群聊不可加入。");

  const { data: blockedStatus, error: memberError } = await supabase
    .from("group_members")
    .select("status")
    .eq("group_id", groupId)
    .eq("user_id", currentUser.id)
    .in("status", ["removed", "banned"])
    .maybeSingle();
  if (memberError) throw memberError;
  if (blockedStatus) throw new Error("你暂时不能重新加入这个群聊。");

  if (group.join_policy === "open") {
    const { data, error: upsertError } = await supabase
      .from("group_members")
      .upsert({ group_id: groupId, user_id: currentUser.id, status: "active", member_role: "member" }, { onConflict: "group_id,user_id" })
      .select("*")
      .single();
    if (upsertError) throw upsertError;
    await supabase.from("group_chats").update({ member_count: (group.member_count ?? 0) + 1 }).eq("id", groupId);
    return data;
  }

  if (group.join_policy === "approval_required") {
    const { data, error: requestError } = await supabase
      .from("group_join_requests")
      .insert({ group_id: groupId, requester_id: currentUser.id, message: message?.trim() || null })
      .select("*")
      .single();
    if (requestError) throw requestError;
    return data;
  }

  throw new Error("这个群聊暂不开放加入。");
}
