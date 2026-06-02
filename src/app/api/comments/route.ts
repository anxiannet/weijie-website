import { NextResponse } from "next/server";
import { getSupabaseServiceClient, hasSupabaseEnv } from "@/lib/supabase/client";
import { ensureProfile } from "@/lib/supabase/profile";
import { getSupabaseCookieClient } from "@/lib/supabase/server";

type CommentBody = {
  infoId?: string;
  content?: string;
};

export async function POST(request: Request) {
  const body = (await request.json()) as CommentBody;
  const content = body.content?.trim();

  if (!body.infoId || !content) {
    return NextResponse.json({ error: "评论内容不能为空" }, { status: 400 });
  }

  if (!hasSupabaseEnv) {
    return NextResponse.json({
      id: `mock-comment-${Date.now()}`,
      moderationStatus: "pending",
      mode: "mock"
    });
  }

  const authClient = getSupabaseCookieClient();
  const { data: authData, error: authError } = authClient
    ? await authClient.auth.getUser()
    : { data: { user: null }, error: null };

  if (authError || !authData.user) {
    return NextResponse.json({ error: "请先登录后再评论。" }, { status: 401 });
  }

  const supabase = getSupabaseServiceClient();
  if (!supabase) return NextResponse.json({ error: "服务端 Supabase 配置不完整。" }, { status: 500 });

  await ensureProfile(supabase, authData.user);
  const { data, error } = await supabase
    .from("comments")
    .insert({
      info_id: body.infoId,
      author_id: authData.user.id,
      content,
      moderation_status: "pending"
    })
    .select("id, moderation_status")
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  await supabase.from("moderation_queue").insert({
    target_type: "comment",
    target_id: data.id,
    reason: "user_comment",
    status: "pending"
  });

  return NextResponse.json({
    id: data.id,
    moderationStatus: data.moderation_status,
    mode: "supabase"
  });
}
