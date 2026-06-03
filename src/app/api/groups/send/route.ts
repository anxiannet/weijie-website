import { NextResponse } from "next/server";
import { hasSupabaseServiceEnv } from "@/lib/supabase/client";
import { sendGroupMessage } from "@/lib/groups/sendGroupMessage";

export async function POST(request: Request) {
  const body = await request.json();
  if (!body.groupId || typeof body.body !== "string") return NextResponse.json({ error: "缺少群聊或消息内容。" }, { status: 400 });
  if (!hasSupabaseServiceEnv) return NextResponse.json({ id: `mock-group-message-${Date.now()}`, mode: "mock" });
  try {
    const message = await sendGroupMessage(body.groupId, body.body);
    return NextResponse.json({ message, mode: "supabase" });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "发送群消息失败。" }, { status: 400 });
  }
}
