import { NextResponse } from "next/server";
import { getSupabaseServiceClient, hasSupabaseEnv } from "@/lib/supabase/client";
import { getAdminProfile } from "@/lib/supabase/server";

type TagBody = {
  name?: string;
  slug?: string;
  channelId?: string;
  description?: string;
};

function normalizeSlug(value: string) {
  return value
    .trim()
    .toLowerCase()
    .replace(/^#/, "")
    .replace(/[^a-z0-9\u4e00-\u9fa5]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export async function POST(request: Request) {
  const body = (await request.json()) as TagBody;
  const name = body.name?.trim();
  const channelId = body.channelId;

  if (!name || !channelId) {
    return NextResponse.json({ error: "标签名和频道不能为空" }, { status: 400 });
  }

  if (!hasSupabaseEnv) {
    return NextResponse.json({ id: `mock-tag-${Date.now()}`, mode: "mock" });
  }

  const admin = await getAdminProfile();
  if (!admin) return NextResponse.json({ error: "需要管理员权限" }, { status: 403 });

  const supabase = getSupabaseServiceClient();
  if (!supabase) return NextResponse.json({ error: "服务端 Supabase 配置不完整。" }, { status: 500 });

  const { data, error } = await supabase
    .from("tags")
    .insert({
      name: name.startsWith("#") ? name : `#${name}`,
      slug: normalizeSlug(body.slug || name),
      channel_id: channelId,
      description: body.description?.trim() || null,
      info_count: 0,
      is_featured: false
    })
    .select("id")
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ id: data.id, mode: "supabase" });
}
