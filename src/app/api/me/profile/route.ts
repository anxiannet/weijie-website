import { NextResponse } from "next/server";
import { getSupabaseServiceClient, hasSupabaseEnv } from "@/lib/supabase/client";
import { getSupabaseCookieClient } from "@/lib/supabase/server";

type ProfileBody = {
  nickname?: string;
  avatarUrl?: string;
  bio?: string;
  location?: string;
};

function clean(value: unknown, maxLength: number) {
  if (typeof value !== "string") return null;
  const trimmed = value.trim();
  if (!trimmed) return null;
  return trimmed.slice(0, maxLength);
}

export async function PATCH(request: Request) {
  if (!hasSupabaseEnv) {
    return NextResponse.json({ error: "未配置 Supabase，暂不能保存资料。" }, { status: 503 });
  }

  const authClient = getSupabaseCookieClient();
  const { data: authData, error: authError } = authClient
    ? await authClient.auth.getUser()
    : { data: { user: null }, error: null };

  if (authError || !authData.user) {
    return NextResponse.json({ error: "请先登录后再编辑资料。" }, { status: 401 });
  }

  const body = (await request.json()) as ProfileBody;
  const nickname = clean(body.nickname, 32);
  const avatarUrl = clean(body.avatarUrl, 500);
  const bio = clean(body.bio, 160);
  const location = clean(body.location, 40);

  if (!nickname) {
    return NextResponse.json({ error: "昵称不能为空。" }, { status: 400 });
  }

  if (avatarUrl && !/^https?:\/\//.test(avatarUrl)) {
    return NextResponse.json({ error: "头像地址需要以 http:// 或 https:// 开头。" }, { status: 400 });
  }

  const supabase = getSupabaseServiceClient();
  if (!supabase) {
    return NextResponse.json({ error: "服务端 Supabase 配置不完整。" }, { status: 500 });
  }

  const { data, error } = await supabase
    .from("profiles")
    .upsert({
      id: authData.user.id,
      nickname,
      avatar_url: avatarUrl,
      bio,
      location
    }, { onConflict: "id" })
    .select("id, nickname, avatar_url, bio, location, role")
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ profile: data });
}
