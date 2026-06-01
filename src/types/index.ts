export type Role = "user" | "admin" | "creator";
export type InfoType = "note" | "rental" | "service" | "business" | "food" | "event" | "secondhand" | "guide" | "news" | "question";
export type ModerationStatus = "pending" | "approved" | "rejected";

export type Profile = {
  id: string;
  nickname: string | null;
  avatar_url?: string | null;
  bio?: string | null;
  location?: string | null;
  role: Role;
};

export type Channel = {
  id: string;
  name: string;
  slug: string;
  description: string;
  icon?: string;
  sort_order: number;
};

export type Tag = {
  id: string;
  name: string;
  slug: string;
  channel_id: string;
  description?: string;
  info_count: number;
  is_featured: boolean;
};

export type Info = {
  id: string;
  author_id?: string | null;
  channel_id: string;
  title: string;
  content: string;
  info_type: InfoType;
  cover_url?: string | null;
  images: string[];
  contact_text?: string | null;
  price_text?: string | null;
  location_text?: string | null;
  source_type: "user" | "admin" | "ai";
  is_ai_generated: boolean;
  moderation_status: ModerationStatus;
  status: "published" | "hidden" | "draft";
  created_at: string;
  tag_ids: string[];
  channel?: Channel;
  tags?: Tag[];
};

export type Comment = {
  id: string;
  info_id: string;
  author_id?: string | null;
  content: string;
  moderation_status: ModerationStatus;
  created_at: string;
};

export type AIDraft = {
  id: string;
  channel_id: string;
  tag_id: string;
  title: string;
  content: string;
  prompt?: string;
  draft_type: "info" | "tag_description" | "channel_seed";
  status: "draft" | "reviewing" | "published" | "rejected";
};
