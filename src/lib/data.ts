import { unstable_noStore as noStore } from "next/cache";
import { channels, comments, infos, tags } from "@/data/mockData";
import { getSupabaseServerClient, getSupabaseServiceClient } from "@/lib/supabase/client";
import { getSupabaseCookieClient } from "@/lib/supabase/server";
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
  const supabase = getSupabaseCookieClient();

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

export async function getPendingComments() {
  noStore();
  const supabase = getSupabaseCookieClient();

  if (!supabase) {
    return comments
      .slice(0, 3)
      .map((comment) => ({ ...comment, moderation_status: "pending" as const }));
  }

  try {
    const { data, error } = await supabase
      .from("comments")
      .select("*")
      .eq("moderation_status", "pending")
      .order("created_at", { ascending: false });

    if (error) throw error;
    return (data ?? []) as Comment[];
  } catch (error) {
    warnAndFallback("pending comments", error);
    return [];
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

export async function getMyInfos() {
  noStore();
  const supabase = getSupabaseCookieClient();
  if (!supabase) return infos.slice(0, 4).map(withMockRelations);

  try {
    const { data: authData, error: authError } = await supabase.auth.getUser();
    if (authError || !authData.user) return [];

    const { data, error } = await supabase
      .from("infos")
      .select("*, info_tags(tag_id, tags(*)), channels(*)")
      .eq("author_id", authData.user.id)
      .order("created_at", { ascending: false });

    if (error) throw error;
    return ((data ?? []) as InfoRow[]).map(mapInfo);
  } catch (error) {
    warnAndFallback("my infos", error);
    return [];
  }
}

export async function getMySavedInfos() {
  noStore();
  const supabase = getSupabaseCookieClient();
  if (!supabase) return infos.slice(4, 8).map(withMockRelations);

  try {
    const { data: authData, error: authError } = await supabase.auth.getUser();
    if (authError || !authData.user) return [];

    const { data: savedRows, error: savedError } = await supabase
      .from("saved_items")
      .select("target_id")
      .eq("user_id", authData.user.id)
      .eq("target_type", "info")
      .order("created_at", { ascending: false });

    if (savedError) throw savedError;
    const ids = (savedRows ?? []).map((item) => item.target_id as string);
    if (!ids.length) return [];

    const { data, error } = await supabase
      .from("infos")
      .select("*, info_tags(tag_id, tags(*)), channels(*)")
      .in("id", ids);

    if (error) throw error;
    const ordered = new Map(((data ?? []) as InfoRow[]).map((row) => [row.id, mapInfo(row)]));
    return ids.map((id) => ordered.get(id)).filter(Boolean) as Info[];
  } catch (error) {
    warnAndFallback("my saved infos", error);
    return [];
  }
}

export async function getMyComments() {
  noStore();
  const supabase = getSupabaseCookieClient();
  if (!supabase) return comments.slice(0, 4);

  try {
    const { data: authData, error: authError } = await supabase.auth.getUser();
    if (authError || !authData.user) return [];

    const { data, error } = await supabase
      .from("comments")
      .select("*")
      .eq("author_id", authData.user.id)
      .order("created_at", { ascending: false })
      .limit(20);

    if (error) throw error;
    return (data ?? []) as Comment[];
  } catch (error) {
    warnAndFallback("my comments", error);
    return [];
  }
}

export async function isInfoSavedByCurrentUser(infoId: string) {
  noStore();
  const supabase = getSupabaseCookieClient();
  if (!supabase) return false;

  const { data: authData, error: authError } = await supabase.auth.getUser();
  if (authError || !authData.user) return false;

  const { data } = await supabase
    .from("saved_items")
    .select("id")
    .eq("user_id", authData.user.id)
    .eq("target_type", "info")
    .eq("target_id", infoId)
    .maybeSingle();

  return Boolean(data);
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
      infos: infos.filter((info) => `${info.title} ${info.content} ${info.location_text ?? ""} ${info.location_name ?? ""} ${info.location_address ?? ""}`.toLowerCase().includes(normalized)),
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
      infos: infos.filter((info) => `${info.title} ${info.content} ${info.location_text ?? ""} ${info.location_name ?? ""} ${info.location_address ?? ""}`.toLowerCase().includes(normalized)),
      channels: channels.filter((channel) => `${channel.name} ${channel.description}`.toLowerCase().includes(normalized))
    };
  }
}

function topCounts<T extends string>(items: T[], limit = 8) {
  const counts = new Map<T, number>();
  items.forEach((item) => counts.set(item, (counts.get(item) ?? 0) + 1));
  return Array.from(counts.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, limit)
    .map(([name, value]) => ({ name, value }));
}

export async function getAdminAnalytics() {
  noStore();
  const supabase = getSupabaseCookieClient();
  if (!supabase) {
    return {
      stats: {
        pageViews: 1280,
        searches: 246,
        pendingInfos: 6,
        pendingComments: 3,
        aiDrafts: 4,
        noResultSearches: 11
      },
      searchRows: [{ name: "NTU租房", value: 88 }, { name: "蒸饺", value: 58 }, { name: "陪诊", value: 36 }],
      noResultRows: [{ name: "月嫂", value: 7 }, { name: "宠物寄养", value: 5 }, { name: "中文心理咨询", value: 4 }],
      channelRows: channels.slice(0, 6).map((channel, index) => ({ name: channel.name, value: 420 - index * 38 })),
      tagRows: tags.slice(0, 8).map((tag) => ({ name: tag.name, value: tag.info_count * 23 + 10 })),
      infoRows: infos.slice(0, 6).map((info, index) => ({ name: info.title, value: 180 - index * 17 })),
      typeRows: topCounts(infos.map((info) => info.info_type))
    };
  }

  try {
    const [searchResult, viewResult, pendingInfoResult, pendingCommentResult, aiDraftResult] = await Promise.all([
      supabase.from("search_logs").select("query, normalized_query, result_count").order("created_at", { ascending: false }).limit(500),
      supabase.from("page_views").select("path, target_type, target_id").order("created_at", { ascending: false }).limit(500),
      supabase.from("infos").select("id", { count: "exact", head: true }).eq("moderation_status", "pending"),
      supabase.from("comments").select("id", { count: "exact", head: true }).eq("moderation_status", "pending"),
      supabase.from("ai_drafts").select("id", { count: "exact", head: true }).in("status", ["draft", "reviewing"])
    ]);

    if (searchResult.error) throw searchResult.error;
    if (viewResult.error) throw viewResult.error;
    if (pendingInfoResult.error) throw pendingInfoResult.error;
    if (pendingCommentResult.error) throw pendingCommentResult.error;
    if (aiDraftResult.error) throw aiDraftResult.error;

    const searches = searchResult.data ?? [];
    const views = viewResult.data ?? [];
    const allInfos = await getInfos();
    const allTags = await getTags();
    const allChannels = await getChannels();
    const infoById = new Map(allInfos.map((info) => [info.id, info.title]));
    const tagById = new Map(allTags.map((tag) => [tag.id, tag.name]));
    const channelByIdMap = new Map(allChannels.map((channel) => [channel.id, channel.name]));

    return {
      stats: {
        pageViews: views.length,
        searches: searches.length,
        pendingInfos: pendingInfoResult.count ?? 0,
        pendingComments: pendingCommentResult.count ?? 0,
        aiDrafts: aiDraftResult.count ?? 0,
        noResultSearches: searches.filter((row) => row.result_count === 0).length
      },
      searchRows: topCounts(searches.map((row) => row.normalized_query || row.query).filter(Boolean) as string[]),
      noResultRows: topCounts(searches.filter((row) => row.result_count === 0).map((row) => row.normalized_query || row.query).filter(Boolean) as string[]),
      channelRows: topCounts(views.filter((row) => row.target_type === "channel" && row.target_id).map((row) => channelByIdMap.get(row.target_id as string) ?? row.path)),
      tagRows: topCounts(views.filter((row) => row.target_type === "tag" && row.target_id).map((row) => tagById.get(row.target_id as string) ?? row.path)),
      infoRows: topCounts(views.filter((row) => row.target_type === "info" && row.target_id).map((row) => infoById.get(row.target_id as string) ?? row.path)),
      typeRows: topCounts(allInfos.map((info) => info.info_type))
    };
  } catch (error) {
    warnAndFallback("admin analytics", error);
    return {
      stats: { pageViews: 0, searches: 0, pendingInfos: 0, pendingComments: 0, aiDrafts: 0, noResultSearches: 0 },
      searchRows: [],
      noResultRows: [],
      channelRows: [],
      tagRows: [],
      infoRows: [],
      typeRows: []
    };
  }
}
