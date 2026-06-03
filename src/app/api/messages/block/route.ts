import { NextResponse } from "next/server";
import { hasSupabaseServiceEnv } from "@/lib/supabase/client";
import { blockUser } from "@/lib/messages/blockUser";

export async function POST(request: Request) {
  const body = await request.json();
  if (!body.blockedId) return NextResponse.json({ error: "缺少用户 ID。" }, { status: 400 });
  if (!hasSupabaseServiceEnv) return NextResponse.json({ mode: "mock" });
  try {
    const row = await blockUser(body.blockedId, body.reason);
    return NextResponse.json({ row, mode: "supabase" });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "拉黑失败。" }, { status: 400 });
  }
}
