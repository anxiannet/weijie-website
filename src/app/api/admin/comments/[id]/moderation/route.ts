import { NextResponse } from "next/server";
import { getSupabaseServiceClient, hasSupabaseEnv } from "@/lib/supabase/client";
import { getAdminProfile } from "@/lib/supabase/server";

type ModerationBody = {
  moderationStatus?: "approved" | "rejected";
};

export async function PATCH(request: Request, { params }: { params: { id: string } }) {
  const body = (await request.json()) as ModerationBody;

  if (body.moderationStatus !== "approved" && body.moderationStatus !== "rejected") {
    return NextResponse.json({ error: "审核状态无效" }, { status: 400 });
  }

  if (!hasSupabaseEnv) {
    return NextResponse.json({ id: params.id, moderationStatus: body.moderationStatus, mode: "mock" });
  }

  const admin = await getAdminProfile();
  if (!admin) return NextResponse.json({ error: "需要管理员权限" }, { status: 403 });

  const supabase = getSupabaseServiceClient();
  if (!supabase) return NextResponse.json({ error: "服务端 Supabase 配置不完整。" }, { status: 500 });

  const { data, error } = await supabase
    .from("comments")
    .update({ moderation_status: body.moderationStatus })
    .eq("id", params.id)
    .select("id, moderation_status")
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  await supabase.from("moderation_queue").insert({
    target_type: "comment",
    target_id: params.id,
    reason: "admin_review",
    status: body.moderationStatus,
    reviewer_id: admin.id,
    reviewed_at: new Date().toISOString()
  });

  return NextResponse.json({ id: data.id, moderationStatus: data.moderation_status, mode: "supabase" });
}
