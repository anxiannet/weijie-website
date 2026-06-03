import { NextResponse } from "next/server";
import { hasSupabaseServiceEnv } from "@/lib/supabase/client";
import { joinGroup } from "@/lib/groups/joinGroup";

export async function POST(request: Request) {
  const body = await request.json();
  if (!body.groupId) return NextResponse.json({ error: "缺少群聊 ID。" }, { status: 400 });
  if (!hasSupabaseServiceEnv) return NextResponse.json({ mode: "mock" });
  try {
    const result = await joinGroup(body.groupId, body.message);
    return NextResponse.json({ result, mode: "supabase" });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "加入群聊失败。" }, { status: 400 });
  }
}
