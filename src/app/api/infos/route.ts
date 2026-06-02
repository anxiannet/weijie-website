import { NextResponse } from "next/server";
import { classifyInfo } from "@/lib/classifier/classifyInfo";
import { getSupabaseServiceClient, hasSupabaseEnv } from "@/lib/supabase/client";
import { ensureProfile } from "@/lib/supabase/profile";
import { getSupabaseCookieClient } from "@/lib/supabase/server";
import type { Place } from "@/types";

const allowedTypes = new Set([
  "note",
  "rental",
  "service",
  "business",
  "food",
  "event",
  "secondhand",
  "guide",
  "news",
  "question"
]);

type PublishBody = {
  title?: string;
  content?: string;
  contactText?: string;
  priceText?: string;
  locationText?: string;
  infoType?: string;
  channelSlug?: string;
  tags?: string[];
  imageUrls?: string[];
  location?: Place | null;
};

function normalizedLocation(location?: Place | null) {
  if (!location?.name) return null;
  return {
    name: location.name.trim(),
    address: location.address?.trim() || null,
    postal: location.postal?.trim() || null,
    lat: typeof location.lat === "number" ? location.lat : null,
    lng: typeof location.lng === "number" ? location.lng : null,
    source: location.source?.trim() || null,
    raw: location.raw ?? location
  };
}

export async function POST(request: Request) {
  const body = (await request.json()) as PublishBody;
  const title = body.title?.trim();
  const content = body.content?.trim();
  const location = normalizedLocation(body.location);

  if (!title || !content) {
    return NextResponse.json({ error: "标题和正文不能为空" }, { status: 400 });
  }

  const classified = classifyInfo({
    title,
    content,
    location_text: location?.name ?? body.locationText,
    price_text: body.priceText
  });

  const channelSlug = body.channelSlug || classified.channelSlug;
  const tagNames = (body.tags?.length ? body.tags : classified.tags)
    .map((tag) => tag.trim())
    .filter(Boolean);
  const infoType = allowedTypes.has(body.infoType ?? "") ? body.infoType! : classified.infoType;
  const imageUrls = (body.imageUrls ?? [])
    .map((url) => url.trim())
    .filter((url) => /^https?:\/\//.test(url))
    .slice(0, 6);

  if (!hasSupabaseEnv) {
    return NextResponse.json({
      id: `mock-${Date.now()}`,
      moderationStatus: "pending",
      mode: "mock"
    });
  }

  const authClient = getSupabaseCookieClient();
  const { data: authData, error: authError } = authClient
    ? await authClient.auth.getUser()
    : { data: { user: null }, error: null };

  if (authError || !authData.user) {
    return NextResponse.json({ error: "请先登录后再发布。" }, { status: 401 });
  }

  const supabase = getSupabaseServiceClient();
  if (!supabase) {
    return NextResponse.json({ error: "服务端 Supabase 配置不完整。" }, { status: 500 });
  }

  await ensureProfile(supabase, authData.user);

  const { data: channel, error: channelError } = await supabase
    .from("channels")
    .select("id")
    .eq("slug", channelSlug)
    .maybeSingle();

  if (channelError) {
    return NextResponse.json({ error: channelError.message }, { status: 500 });
  }

  if (!channel) {
    return NextResponse.json({ error: "频道不存在" }, { status: 400 });
  }

  const { data: createdInfo, error: infoError } = await supabase
    .from("infos")
    .insert({
      author_id: authData.user.id,
      channel_id: channel.id,
      title,
      content,
      info_type: infoType,
      contact_text: body.contactText?.trim() || null,
      price_text: body.priceText?.trim() || null,
      location_text: location?.name ?? body.locationText?.trim() ?? null,
      location_name: location?.name ?? null,
      location_address: location?.address ?? null,
      location_postal: location?.postal ?? null,
      location_lat: location?.lat ?? null,
      location_lng: location?.lng ?? null,
      location_source: location?.source ?? null,
      location_raw: location?.raw ?? null,
      source_type: "user",
      moderation_status: "pending",
      status: "published",
      cover_url: imageUrls[0] ?? null,
      images: imageUrls
    })
    .select("id, moderation_status")
    .single();

  if (infoError) {
    return NextResponse.json({ error: infoError.message }, { status: 500 });
  }

  await supabase.from("moderation_queue").insert({
    target_type: "info",
    target_id: createdInfo.id,
    reason: "user_publish",
    status: "pending"
  });

  if (tagNames.length) {
    const { data: matchedTags, error: tagError } = await supabase
      .from("tags")
      .select("id, name")
      .in("name", tagNames);

    if (tagError) {
      return NextResponse.json({ error: tagError.message }, { status: 500 });
    }

    const rows = (matchedTags ?? []).map((tag) => ({
      info_id: createdInfo.id,
      tag_id: tag.id
    }));

    if (rows.length) {
      const { error: infoTagsError } = await supabase.from("info_tags").insert(rows);
      if (infoTagsError) {
        return NextResponse.json({ error: infoTagsError.message }, { status: 500 });
      }
    }
  }

  return NextResponse.json({
    id: createdInfo.id,
    moderationStatus: createdInfo.moderation_status,
    mode: "supabase"
  });
}
