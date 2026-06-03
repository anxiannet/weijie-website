import { NextResponse } from "next/server";
import { hasSupabaseServiceEnv } from "@/lib/supabase/client";
import { createGroupChat } from "@/lib/groups/createGroupChat";

export async function POST(request: Request) {
  const body = await request.json();
  if (!body.title) return NextResponse.json({ error: "群聊标题不能为空。" }, { status: 400 });
  if (!hasSupabaseServiceEnv) return NextResponse.json({ id: `mock-group-${Date.now()}`, mode: "mock" });
  try {
    const group = await createGroupChat({
      title: body.title,
      description: body.description,
      tagId: body.tagId,
      channelId: body.channelId,
      initialInfoIds: body.initialInfoIds,
      groupType: body.groupType
    });
    return NextResponse.json({ group, mode: "supabase" });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "创建群聊失败。" }, { status: 400 });
  }
}
