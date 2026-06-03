import { assertPrivateContactRate, requireCurrentUser, requireServiceClient } from "@/lib/messages/guards";

export async function getOrCreateConversation(infoId: string, currentUserId?: string) {
  const currentUser = currentUserId ? { id: currentUserId } : await requireCurrentUser();
  const supabase = requireServiceClient();

  const { data: info, error: infoError } = await supabase
    .from("infos")
    .select("id, author_id, allow_messages")
    .eq("id", infoId)
    .maybeSingle();
  if (infoError) throw infoError;
  if (!info?.author_id) throw new Error("信息不存在或没有发布者。");
  if (info.author_id === currentUser.id) throw new Error("不能给自己发布的信息发私信。");
  if (info.allow_messages === false) throw new Error("发布者暂未开放私信。");

  const { data: existing, error: existingError } = await supabase
    .from("conversations")
    .select("*")
    .eq("info_id", infoId)
    .eq("initiator_id", currentUser.id)
    .maybeSingle();
  if (existingError) throw existingError;
  if (existing) return existing;

  await assertPrivateContactRate(currentUser.id);

  const { data, error } = await supabase
    .from("conversations")
    .insert({
      info_id: infoId,
      publisher_id: info.author_id,
      initiator_id: currentUser.id
    })
    .select("*")
    .single();
  if (error) throw error;
  return data;
}
