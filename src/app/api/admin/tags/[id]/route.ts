import { NextResponse } from "next/server";
import { getSupabaseServiceClient, hasSupabaseEnv } from "@/lib/supabase/client";
import { getAdminProfile } from "@/lib/supabase/server";

type TagPatchBody = {
  isFeatured?: boolean;
};

export async function PATCH(request: Request, { params }: { params: { id: string } }) {
  const body = (await request.json()) as TagPatchBody;

  if (typeof body.isFeatured !== "boolean") {
    return NextResponse.json({ error: "标签状态无效" }, { status: 400 });
  }

  if (!hasSupabaseEnv) {
    return NextResponse.json({ id: params.id, isFeatured: body.isFeatured, mode: "mock" });
  }

  const admin = await getAdminProfile();
  if (!admin) return NextResponse.json({ error: "需要管理员权限" }, { status: 403 });

  const supabase = getSupabaseServiceClient();
  if (!supabase) return NextResponse.json({ error: "服务端 Supabase 配置不完整。" }, { status: 500 });

  const { data, error } = await supabase
    .from("tags")
    .update({ is_featured: body.isFeatured })
    .eq("id", params.id)
    .select("id, is_featured")
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ id: data.id, isFeatured: data.is_featured, mode: "supabase" });
}
