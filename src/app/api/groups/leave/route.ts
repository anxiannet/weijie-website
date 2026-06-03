import { NextResponse } from "next/server";
import { hasSupabaseServiceEnv } from "@/lib/supabase/client";
import { leaveGroup } from "@/lib/groups/leaveGroup";

export async function POST(request: Request) {
  const body = await request.json();
  if (!body.groupId) return NextResponse.json({ error: "缺少群聊 ID。" }, { status: 400 });
  if (!hasSupabaseServiceEnv) return NextResponse.json({ mode: "mock" });
  try {
    await leaveGroup(body.groupId);
    return NextResponse.json({ mode: "supabase" });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "退出群聊失败。" }, { status: 400 });
  }
}
