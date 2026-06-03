import { NextResponse } from "next/server";
import { hasSupabaseServiceEnv } from "@/lib/supabase/client";
import { markConversationRead } from "@/lib/messages/markConversationRead";

export async function POST(request: Request) {
  const body = await request.json();
  if (!body.conversationId) return NextResponse.json({ error: "缺少会话 ID。" }, { status: 400 });
  if (!hasSupabaseServiceEnv) return NextResponse.json({ mode: "mock" });
  try {
    await markConversationRead(body.conversationId);
    return NextResponse.json({ mode: "supabase" });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "标记已读失败。" }, { status: 400 });
  }
}
