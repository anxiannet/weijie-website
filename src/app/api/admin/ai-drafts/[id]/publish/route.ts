import { NextResponse } from "next/server";
import { getSupabaseServiceClient, hasSupabaseEnv } from "@/lib/supabase/client";
import { getAdminProfile } from "@/lib/supabase/server";

export async function POST(_request: Request, { params }: { params: { id: string } }) {
  if (!hasSupabaseEnv) {
    return NextResponse.json({ id: `mock-info-${Date.now()}`, mode: "mock" });
  }

  const admin = await getAdminProfile();
  if (!admin) return NextResponse.json({ error: "需要管理员权限" }, { status: 403 });

  const supabase = getSupabaseServiceClient();
  if (!supabase) return NextResponse.json({ error: "服务端 Supabase 配置不完整。" }, { status: 500 });

  const { data: draft, error: draftError } = await supabase
    .from("ai_drafts")
    .select("*")
    .eq("id", params.id)
    .maybeSingle();

  if (draftError) return NextResponse.json({ error: draftError.message }, { status: 500 });
  if (!draft) return NextResponse.json({ error: "AI 草稿不存在" }, { status: 404 });

  const { data: info, error: infoError } = await supabase
    .from("infos")
    .insert({
      channel_id: draft.channel_id,
      title: draft.title,
      content: draft.content,
      info_type: "guide",
      source_type: "ai",
      is_ai_generated: true,
      moderation_status: "approved",
      status: "published"
    })
    .select("id")
    .single();

  if (infoError) return NextResponse.json({ error: infoError.message }, { status: 500 });

  if (draft.tag_id) {
    const { error: tagError } = await supabase.from("info_tags").insert({
      info_id: info.id,
      tag_id: draft.tag_id
    });
    if (tagError) return NextResponse.json({ error: tagError.message }, { status: 500 });
  }

  const { error: updateError } = await supabase
    .from("ai_drafts")
    .update({ status: "published" })
    .eq("id", params.id);

  if (updateError) return NextResponse.json({ error: updateError.message }, { status: 500 });

  return NextResponse.json({ id: info.id, mode: "supabase" });
}
