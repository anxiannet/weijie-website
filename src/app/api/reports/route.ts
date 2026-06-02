import { NextResponse } from "next/server";
import { getSupabaseServiceClient, hasSupabaseEnv } from "@/lib/supabase/client";
import { ensureProfile } from "@/lib/supabase/profile";
import { getSupabaseCookieClient } from "@/lib/supabase/server";

type ReportBody = {
  targetType?: "info" | "comment" | "profile" | "tag";
  targetId?: string;
  reason?: string;
};

export async function POST(request: Request) {
  const body = (await request.json()) as ReportBody;
  if (!body.targetType || !body.targetId) {
    return NextResponse.json({ error: "举报目标无效" }, { status: 400 });
  }

  if (!hasSupabaseEnv) return NextResponse.json({ reported: true, mode: "mock" });

  const authClient = getSupabaseCookieClient();
  const { data: authData, error: authError } = authClient
    ? await authClient.auth.getUser()
    : { data: { user: null }, error: null };

  if (authError || !authData.user) {
    return NextResponse.json({ error: "请先登录后再举报。" }, { status: 401 });
  }

  const supabase = getSupabaseServiceClient();
  if (!supabase) return NextResponse.json({ error: "服务端 Supabase 配置不完整。" }, { status: 500 });

  await ensureProfile(supabase, authData.user);
  const { error } = await supabase.from("reports").insert({
    reporter_id: authData.user.id,
    target_type: body.targetType,
    target_id: body.targetId,
    reason: body.reason?.trim() || null,
    status: "pending"
  });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  await supabase.from("moderation_queue").insert({
    target_type: body.targetType,
    target_id: body.targetId,
    reason: body.reason?.trim() || "report",
    status: "pending"
  });

  return NextResponse.json({ reported: true, mode: "supabase" });
}
