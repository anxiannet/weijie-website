import { NextResponse } from "next/server";
import { hasSupabaseServiceEnv } from "@/lib/supabase/client";
import { getOrCreateConversation } from "@/lib/messages/getOrCreateConversation";

export async function POST(request: Request) {
  const body = await request.json();
  if (!body.infoId) return NextResponse.json({ error: "缺少信息 ID。" }, { status: 400 });
  if (!hasSupabaseServiceEnv) {
    return NextResponse.json({ id: "conversation-1", mode: "mock" });
  }
  try {
    const conversation = await getOrCreateConversation(body.infoId);
    return NextResponse.json({ id: conversation.id, conversation, mode: "supabase" });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "创建私信失败。" }, { status: 400 });
  }
}
