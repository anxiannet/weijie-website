import { NextResponse } from "next/server";
import { classifyInfo } from "@/lib/classifier/classifyInfo";
import { getSupabaseServiceClient } from "@/lib/supabase/client";

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
};

export async function POST(request: Request) {
  const body = (await request.json()) as PublishBody;
  const title = body.title?.trim();
  const content = body.content?.trim();

  if (!title || !content) {
    return NextResponse.json({ error: "标题和正文不能为空" }, { status: 400 });
  }

  const classified = classifyInfo({
    title,
    content,
    location_text: body.locationText,
    price_text: body.priceText
  });

  const channelSlug = body.channelSlug || classified.channelSlug;
  const tagNames = (body.tags?.length ? body.tags : classified.tags)
    .map((tag) => tag.trim())
    .filter(Boolean);
  const infoType = allowedTypes.has(body.infoType ?? "") ? body.infoType! : classified.infoType;

  const supabase = getSupabaseServiceClient();
  if (!supabase) {
    return NextResponse.json({
      id: `mock-${Date.now()}`,
      moderationStatus: "pending",
      mode: "mock"
    });
  }

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
      channel_id: channel.id,
      title,
      content,
      info_type: infoType,
      contact_text: body.contactText?.trim() || null,
      price_text: body.priceText?.trim() || null,
      location_text: body.locationText?.trim() || null,
      source_type: "user",
      moderation_status: "pending",
      status: "published",
      images: []
    })
    .select("id, moderation_status")
    .single();

  if (infoError) {
    return NextResponse.json({ error: infoError.message }, { status: 500 });
  }

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
