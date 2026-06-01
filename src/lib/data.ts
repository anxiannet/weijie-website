import { channels, comments, infos, tags } from "@/data/mockData";

export async function getChannels() {
  return channels.sort((a, b) => a.sort_order - b.sort_order);
}

export async function getTags() {
  return tags;
}

export async function getFeaturedTags() {
  return tags.filter((tag) => tag.is_featured).slice(0, 10);
}

export async function getInfos() {
  return infos
    .filter((info) => info.status === "published" && info.moderation_status === "approved")
    .sort((a, b) => +new Date(b.created_at) - +new Date(a.created_at));
}

export async function getChannel(slug: string) {
  return channels.find((channel) => channel.slug === slug) ?? null;
}

export async function getChannelInfos(slug: string) {
  const channel = await getChannel(slug);
  if (!channel) return [];
  return (await getInfos()).filter((info) => info.channel_id === channel.id);
}

export async function getChannelTags(slug: string) {
  const channel = await getChannel(slug);
  if (!channel) return [];
  return tags.filter((tag) => tag.channel_id === channel.id);
}

export async function getTag(slug: string) {
  return tags.find((tag) => tag.slug === slug || tag.name.replace("#", "") === decodeURIComponent(slug)) ?? null;
}

export async function getTagInfos(slug: string) {
  const tag = await getTag(slug);
  if (!tag) return [];
  return (await getInfos()).filter((info) => info.tag_ids.includes(tag.id));
}

export async function getInfo(id: string) {
  return infos.find((info) => info.id === id) ?? null;
}

export async function getInfoComments(id: string) {
  return comments.filter((comment) => comment.info_id === id && comment.moderation_status === "approved");
}

export function channelById(id: string) {
  return channels.find((channel) => channel.id === id);
}

export function tagsByIds(ids: string[]) {
  return ids.map((id) => tags.find((tag) => tag.id === id)).filter(Boolean);
}

export async function searchAll(query: string) {
  const normalized = query.trim().toLowerCase();
  if (!normalized) return { tags: [], infos: [], channels: [] };
  return {
    tags: tags.filter((tag) => `${tag.name} ${tag.description}`.toLowerCase().includes(normalized)),
    infos: infos.filter((info) => `${info.title} ${info.content} ${info.location_text ?? ""}`.toLowerCase().includes(normalized)),
    channels: channels.filter((channel) => `${channel.name} ${channel.description}`.toLowerCase().includes(normalized))
  };
}
