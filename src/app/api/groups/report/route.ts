import { NextResponse } from "next/server";
import { hasSupabaseServiceEnv } from "@/lib/supabase/client";
import { reportGroupMessage } from "@/lib/groups/reportGroupMessage";

export async function POST(request: Request) {
  const body = await request.json();
  if (!body.groupId) return NextResponse.json({ error: "缺少群聊 ID。" }, { status: 400 });
  if (!hasSupabaseServiceEnv) return NextResponse.json({ mode: "mock" });
  try {
    const report = await reportGroupMessage(body.groupId, body.messageId, body.reason);
    return NextResponse.json({ report, mode: "supabase" });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "举报群聊失败。" }, { status: 400 });
  }
}
