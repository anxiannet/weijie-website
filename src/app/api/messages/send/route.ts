import { NextResponse } from "next/server";
import { hasSupabaseServiceEnv } from "@/lib/supabase/client";
import { sendMessage } from "@/lib/messages/sendMessage";

export async function POST(request: Request) {
  const body = await request.json();
  if (!body.conversationId || typeof body.body !== "string") {
    return NextResponse.json({ error: "缺少会话或消息内容。" }, { status: 400 });
  }
  if (!hasSupabaseServiceEnv) return NextResponse.json({ id: `mock-message-${Date.now()}`, mode: "mock" });
  try {
    const message = await sendMessage(body.conversationId, body.body);
    return NextResponse.json({ message, mode: "supabase" });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "发送失败。" }, { status: 400 });
  }
}
