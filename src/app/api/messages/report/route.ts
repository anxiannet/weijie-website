import { NextResponse } from "next/server";
import { hasSupabaseServiceEnv } from "@/lib/supabase/client";
import { reportMessage } from "@/lib/messages/reportMessage";

export async function POST(request: Request) {
  const body = await request.json();
  if (!body.messageId) return NextResponse.json({ error: "缺少消息 ID。" }, { status: 400 });
  if (!hasSupabaseServiceEnv) return NextResponse.json({ mode: "mock" });
  try {
    const report = await reportMessage(body.messageId, body.reason);
    return NextResponse.json({ report, mode: "supabase" });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "举报失败。" }, { status: 400 });
  }
}
