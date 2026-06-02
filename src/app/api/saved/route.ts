import { NextResponse } from "next/server";
import { getSupabaseServiceClient, hasSupabaseEnv } from "@/lib/supabase/client";
import { ensureProfile } from "@/lib/supabase/profile";
import { getSupabaseCookieClient } from "@/lib/supabase/server";

type SaveBody = {
  targetType?: "info" | "tag";
  targetId?: string;
};

async function getUser() {
  const supabase = getSupabaseCookieClient();
  if (!supabase) return null;
  const { data, error } = await supabase.auth.getUser();
  if (error) return null;
  return data.user;
}

export async function POST(request: Request) {
  const body = (await request.json()) as SaveBody;
  if ((body.targetType !== "info" && body.targetType !== "tag") || !body.targetId) {
    return NextResponse.json({ error: "收藏目标无效" }, { status: 400 });
  }

  if (!hasSupabaseEnv) return NextResponse.json({ saved: true, mode: "mock" });

  const user = await getUser();
  if (!user) return NextResponse.json({ error: "请先登录后再收藏。" }, { status: 401 });

  const supabase = getSupabaseServiceClient();
  if (!supabase) return NextResponse.json({ error: "服务端 Supabase 配置不完整。" }, { status: 500 });

  await ensureProfile(supabase, user);
  const { error } = await supabase.from("saved_items").upsert({
    user_id: user.id,
    target_type: body.targetType,
    target_id: body.targetId
  }, { onConflict: "user_id,target_type,target_id" });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ saved: true, mode: "supabase" });
}

export async function DELETE(request: Request) {
  const body = (await request.json()) as SaveBody;
  if ((body.targetType !== "info" && body.targetType !== "tag") || !body.targetId) {
    return NextResponse.json({ error: "收藏目标无效" }, { status: 400 });
  }

  if (!hasSupabaseEnv) return NextResponse.json({ saved: false, mode: "mock" });

  const user = await getUser();
  if (!user) return NextResponse.json({ error: "请先登录后再取消收藏。" }, { status: 401 });

  const supabase = getSupabaseServiceClient();
  if (!supabase) return NextResponse.json({ error: "服务端 Supabase 配置不完整。" }, { status: 500 });

  const { error } = await supabase
    .from("saved_items")
    .delete()
    .eq("user_id", user.id)
    .eq("target_type", body.targetType)
    .eq("target_id", body.targetId);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ saved: false, mode: "supabase" });
}
