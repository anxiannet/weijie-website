import { getSupabaseServiceClient } from "@/lib/supabase/client";
import { getSupabaseCookieClient } from "@/lib/supabase/server";

export function assertBody(body: string) {
  const value = body.trim();
  if (!value) throw new Error("消息不能为空。");
  if (value.length > 1000) throw new Error("单条消息最多 1000 字。");
  return value;
}

export async function requireCurrentUser() {
  const authClient = getSupabaseCookieClient();
  if (!authClient) return { id: "profile-demo" };
  const { data, error } = await authClient.auth.getUser();
  if (error || !data.user) throw new Error("请先登录。");
  return data.user;
}

export function requireServiceClient() {
  const supabase = getSupabaseServiceClient();
  if (!supabase) throw new Error("服务端 Supabase 配置不完整。");
  return supabase;
}

export async function assertPrivateSendRate(userId: string) {
  const supabase = getSupabaseServiceClient();
  if (!supabase) return;
  const { data, error } = await supabase.rpc("private_minute_message_count", { target_user_id: userId });
  if (error) throw error;
  if ((data ?? 0) >= 5) throw new Error("发送太频繁，请稍后再试。");
}

export async function assertPrivateContactRate(userId: string) {
  const supabase = getSupabaseServiceClient();
  if (!supabase) return;
  const { data, error } = await supabase.rpc("private_daily_contact_count", { target_user_id: userId });
  if (error) throw error;
  if ((data ?? 0) >= 20) throw new Error("今天主动联系的信息较多，请明天再试。");
}

export async function assertGroupCreateRate(userId: string) {
  const supabase = getSupabaseServiceClient();
  if (!supabase) return;
  const { data, error } = await supabase.rpc("group_daily_create_count", { target_user_id: userId });
  if (error) throw error;
  if ((data ?? 0) >= 5) throw new Error("今天创建的群聊较多，请明天再试。");
}

export async function assertGroupSendRate(userId: string) {
  const supabase = getSupabaseServiceClient();
  if (!supabase) return;
  const { data, error } = await supabase.rpc("group_minute_message_count", { target_user_id: userId });
  if (error) throw error;
  if ((data ?? 0) >= 10) throw new Error("群消息发送太频繁，请稍后再试。");
}
