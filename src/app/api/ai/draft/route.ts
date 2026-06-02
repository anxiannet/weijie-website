import { NextResponse } from "next/server";
import { generateInfoDraft } from "@/lib/ai/generateInfoDraft";
import { getSupabaseServiceClient, hasSupabaseEnv } from "@/lib/supabase/client";
import { getAdminProfile } from "@/lib/supabase/server";

export async function POST(request: Request) {
  const body = await request.json();
  const channelName = body.channel ?? "生活";
  const tagName = body.tag ?? "#新加坡生活";
  const draft = await generateInfoDraft({
    channel: channelName,
    tag: tagName,
    topicText: body.topicText ?? ""
  });

  if (!hasSupabaseEnv) {
    return NextResponse.json({ ...draft, mode: "mock" });
  }

  const admin = await getAdminProfile();
  if (!admin) return NextResponse.json({ error: "需要管理员权限" }, { status: 403 });

  const supabase = getSupabaseServiceClient();
  if (!supabase) return NextResponse.json({ error: "服务端 Supabase 配置不完整。" }, { status: 500 });

  const [{ data: channel }, { data: tag }] = await Promise.all([
    supabase.from("channels").select("id").eq("name", channelName).maybeSingle(),
    supabase.from("tags").select("id").eq("name", tagName).maybeSingle()
  ]);

  const { data, error } = await supabase
    .from("ai_drafts")
    .insert({
      channel_id: channel?.id ?? null,
      tag_id: tag?.id ?? null,
      title: draft.title,
      content: draft.content,
      prompt: body.topicText ?? "",
      draft_type: "info",
      status: "reviewing"
    })
    .select("id")
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json({ ...draft, id: data.id, mode: "supabase" });
}
