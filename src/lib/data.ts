import { unstable_noStore as noStore } from "next/cache";
import { channels, comments, infos, tags } from "@/data/mockData";
import { getSupabaseServerClient, getSupabaseServiceClient } from "@/lib/supabase/client";
import type { Channel, Comment, Info, Tag } from "@/types";

type InfoRow = Omit<Info, "tag_ids" | "channel" | "tags"> & {
  info_tags?: Array<{ tag_id: string | null; tags?: Tag | null }>;
  channels?: Channel | null;
};

let cachedChannels: Channel[] = channels;
let cachedTags: Tag[] = tags;
let cachedInfos: Info[] = infos;

function warnAndFallback(scope: string, error: unknown) {
  console.warn(`[supabase fallback] ${scope}`, error);
}

function mapInfo(row: InfoRow): Info {
  const infoTags = row.info_tags ?? [];
  return {
    ...row,
    images: row.images ?? [],
    tag_ids: infoTags.map((item) => item.tag_id).filter(Boolean) as string[],
    channel: row.channels ?? undefined,
    tags: infoTags.map((item) => item.tags).filter(Boolean) as Tag[]
  };
}

function withMockRelations(info: Info): Info {
  return {
    ...info,
    channel: channels.find((channel) => channel.id === info.channel_id),
    tags: info.tag_ids.map((id) => tags.find((tag) => tag.id === id)).filter(Boolean) as Tag[]
  };
}

async function fetchChannelsFromDb() {
  const supabase = getSupabaseServerClient();
  if (!supabase) return null;
  const { data, error } = await supabase
    .from("channels")
    .select("*")
    .order("sort_order", { ascending: true });
  if (error) throw error;
  cachedChannels = (data ?? []) as Channel[];
  return cachedChannels;
}

async function fetchTagsFromDb() {
  const supabase = getSupabaseServerClient();
  if (!supabase) return null;
  const { data, error } = await supabase
    .from("tags")
    .select("*")
    .order("info_count", { ascending: false });
  if (error) throw error;
  cachedTags = (data ?? []) as Tag[];
  return cachedTags;
}

async function fetchInfosFromDb() {
  const supabase = getSupabaseServerClient();
  if (!supabase) return null;
  const { data, error } = await supabase
    .from("infos")
    .select("*, info_tags(tag_id, tags(*)), channels(*)")
    .eq("moderation_status", "approved")
    .eq("status", "published")
    .order("created_at", { ascending: false });
  if (error) throw error;
  cachedInfos = ((data ?? []) as InfoRow[]).map(mapInfo);
  return cachedInfos;
}

export async function getChannels() {
  noStore();
  try {
    return (await fetchChannelsFromDb()) ?? channels.sort((a, b) => a.sort_order - b.sort_order);
  } catch (error) {
    warnAndFallback("channels", error);
    return channels.sort((a, b) => a.sort_order - b.sort_order);
  }
}

export async function getTags() {
  noStore();
  try {
    return (await fetchTagsFromDb()) ?? tags;
  } catch (error) {
    warnAndFallback("tags", error);
    return tags;
  }
}

export async function getFeaturedTags() {
  noStore();
  try {
    const dbTags = await fetchTagsFromDb();
    return (dbTags ?? tags).filter((tag) => tag.is_featured).slice(0, 10);
  } catch (error) {
    warnAndFallback("featured tags", error);
    return tags.filter((tag) => tag.is_featured).slice(0, 10);
  }
}

export async function getInfos() {
  noStore();
  try {
    return (await fetchInfosFromDb()) ?? infos
      .filter((info) => info.status === "published" && info.moderation_status === "approved")
      .sort((a, b) => +new Date(b.created_at) - +new Date(a.created_at))
      .map(withMockRelations);
  } catch (error) {
    warnAndFallback("infos", error);
    return infos
      .filter((info) => info.status === "published" && info.moderation_status === "approved")
      .sort((a, b) => +new Date(b.created_at) - +new Date(a.created_at))
      .map(withMockRelations);
  }
}

export async function getPendingInfos() {
  noStore();
  const supabase = getSupabaseServiceClient();

  if (!supabase) {
    return infos
      .slice(0, 6)
      .map((info) => withMockRelations({ ...info, moderation_status: "pending" }));
  }

  try {
    const { data, error } = await supabase
      .from("infos")
      .select("*, info_tags(tag_id, tags(*)), channels(*)")
      .eq("moderation_status", "pending")
      .order("created_at", { ascending: false });

    if (error) throw error;
    return ((data ?? []) as InfoRow[]).map(mapInfo);
  } catch (error) {
    warnAndFallback("pending infos", error);
    return infos
      .slice(0, 6)
      .map((info) => withMockRelations({ ...info, moderation_status: "pending" }));
  }
}

export async function getChannel(slug: string) {
  noStore();
  const supabase = getSupabaseServerClient();
  if (!supabase) return channels.find((channel) => channel.slug === slug) ?? null;

  try {
    const { data, error } = await supabase.from("channels").select("*").eq("slug", slug).maybeSingle();
    if (error) throw error;
    return (data as Channel | null) ?? null;
  } catch (error) {
    warnAndFallback("channel", error);
    return channels.find((channel) => channel.slug === slug) ?? null;
  }
}

export async function getChannelInfos(slug: string) {
  noStore();
  const channel = await getChannel(slug);
  if (!channel) return [];
  return (await getInfos()).filter((info) => info.channel_id === channel.id);
}

export async function getChannelTags(slug: string) {
  noStore();
  const channel = await getChannel(slug);
  if (!channel) return [];
  const allTags = await getTags();
  return allTags.filter((tag) => tag.channel_id === channel.id);
}

export async function getTag(slug: string) {
  noStore();
  const decoded = decodeURIComponent(slug);
  const supabase = getSupabaseServerClient();
  if (!supabase) return tags.find((tag) => tag.slug === slug || tag.name.replace("#", "") === decoded) ?? null;

  try {
    const { data, error } = await supabase
      .from("tags")
      .select("*")
      .or(`slug.eq.${slug},name.eq.#${decoded},name.eq.${decoded}`)
      .maybeSingle();
    if (error) throw error;
    return (data as Tag | null) ?? null;
  } catch (error) {
    warnAndFallback("tag", error);
    return tags.find((tag) => tag.slug === slug || tag.name.replace("#", "") === decoded) ?? null;
  }
}

export async function getTagInfos(slug: string) {
  noStore();
  const tag = await getTag(slug);
  if (!tag) return [];
  return (await getInfos()).filter((info) => info.tag_ids.includes(tag.id));
}

export async function getInfo(id: string) {
  noStore();
  const supabase = getSupabaseServerClient();
  if (!supabase) {
    const info = infos.find((item) => item.id === id);
    return info ? withMockRelations(info) : null;
  }

  try {
    const { data, error } = await supabase
      .from("infos")
      .select("*, info_tags(tag_id, tags(*)), channels(*)")
      .eq("id", id)
      .maybeSingle();
    if (error) throw error;
    return data ? mapInfo(data as InfoRow) : null;
  } catch (error) {
    warnAndFallback("info", error);
    const info = infos.find((item) => item.id === id);
    return info ? withMockRelations(info) : null;
  }
}

export async function getInfoComments(id: string) {
  noStore();
  const supabase = getSupabaseServerClient();
  if (!supabase) return comments.filter((comment) => comment.info_id === id && comment.moderation_status === "approved");

  try {
    const { data, error } = await supabase
      .from("comments")
      .select("*")
      .eq("info_id", id)
      .eq("moderation_status", "approved")
      .order("created_at", { ascending: true });
    if (error) throw error;
    return (data ?? []) as Comment[];
  } catch (error) {
    warnAndFallback("comments", error);
    return comments.filter((comment) => comment.info_id === id && comment.moderation_status === "approved");
  }
}

export function channelById(id: string) {
  return cachedChannels.find((channel) => channel.id === id) ?? channels.find((channel) => channel.id === id);
}

export function tagsByIds(ids: string[]) {
  return ids.map((id) => cachedTags.find((tag) => tag.id === id) ?? tags.find((tag) => tag.id === id)).filter(Boolean);
}

export async function searchAll(query: string) {
  noStore();
  const normalized = query.trim().toLowerCase();
  if (!normalized) return { tags: [], infos: [], channels: [] };
  const supabase = getSupabaseServerClient();
  if (!supabase) {
    return {
      tags: tags.filter((tag) => `${tag.name} ${tag.description}`.toLowerCase().includes(normalized)),
      infos: infos.filter((info) => `${info.title} ${info.content} ${info.location_text ?? ""}`.toLowerCase().includes(normalized)),
      channels: channels.filter((channel) => `${channel.name} ${channel.description}`.toLowerCase().includes(normalized))
    };
  }

  try {
    const pattern = `%${query.trim()}%`;
    const [tagResult, infoResult, channelResult] = await Promise.all([
      supabase.from("tags").select("*").or(`name.ilike.${pattern},description.ilike.${pattern}`).limit(20),
      supabase
        .from("infos")
        .select("*, info_tags(tag_id, tags(*)), channels(*)")
        .eq("moderation_status", "approved")
        .eq("status", "published")
        .or(`title.ilike.${pattern},content.ilike.${pattern},location_text.ilike.${pattern}`)
        .limit(40),
      supabase.from("channels").select("*").or(`name.ilike.${pattern},description.ilike.${pattern}`).limit(20)
    ]);

    if (tagResult.error) throw tagResult.error;
    if (infoResult.error) throw infoResult.error;
    if (channelResult.error) throw channelResult.error;

    return {
      tags: (tagResult.data ?? []) as Tag[],
      infos: ((infoResult.data ?? []) as InfoRow[]).map(mapInfo),
      channels: (channelResult.data ?? []) as Channel[]
    };
  } catch (error) {
    warnAndFallback("search", error);
    return {
      tags: tags.filter((tag) => `${tag.name} ${tag.description}`.toLowerCase().includes(normalized)),
      infos: infos.filter((info) => `${info.title} ${info.content} ${info.location_text ?? ""}`.toLowerCase().includes(normalized)),
      channels: channels.filter((channel) => `${channel.name} ${channel.description}`.toLowerCase().includes(normalized))
    };
  }
}
