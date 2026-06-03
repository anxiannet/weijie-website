import { assertGroupCreateRate, requireCurrentUser, requireServiceClient } from "@/lib/messages/guards";

type CreateGroupChatInput = {
  title: string;
  description?: string;
  tagId?: string | null;
  channelId?: string | null;
  creatorId?: string;
  initialInfoIds?: string[];
  groupType?: "tag" | "event" | "rental" | "interest" | "temporary" | "general";
};

export async function createGroupChat(input: CreateGroupChatInput) {
  const currentUser = input.creatorId ? { id: input.creatorId } : await requireCurrentUser();
  const title = input.title.trim();
  if (!title) throw new Error("群聊标题不能为空。");
  await assertGroupCreateRate(currentUser.id);
  const supabase = requireServiceClient();

  const { data: group, error } = await supabase
    .from("group_chats")
    .insert({
      title,
      description: input.description?.trim() || null,
      tag_id: input.tagId ?? null,
      channel_id: input.channelId ?? null,
      creator_id: currentUser.id,
      group_type: input.groupType ?? "tag",
      join_policy: "open",
      member_count: 1
    })
    .select("*")
    .single();
  if (error) throw error;

  const { error: memberError } = await supabase
    .from("group_members")
    .insert({ group_id: group.id, user_id: currentUser.id, member_role: "owner", status: "active" });
  if (memberError) throw memberError;

  const infoRows = Array.from(new Set(input.initialInfoIds ?? [])).map((infoId) => ({
    group_id: group.id,
    info_id: infoId,
    added_by: currentUser.id
  }));
  if (infoRows.length) {
    const { error: infoError } = await supabase.from("group_infos").insert(infoRows);
    if (infoError) throw infoError;
  }

  return group;
}
