export type Role = "user" | "admin" | "creator";
export type InfoType = "note" | "rental" | "service" | "business" | "food" | "event" | "secondhand" | "guide" | "news" | "question";
export type ModerationStatus = "pending" | "approved" | "rejected";
export type ContactVisibility = "public" | "login_required" | "verified_only" | "private";
export type GroupType = "tag" | "event" | "rental" | "interest" | "temporary" | "general";
export type GroupJoinPolicy = "open" | "approval_required" | "invite_only" | "closed";
export type GroupMemberRole = "owner" | "admin" | "member";
export type GroupMemberStatus = "active" | "pending" | "removed" | "left" | "banned";

export type Place = {
  id?: string;
  query?: string | null;
  name: string;
  address: string;
  postal?: string | null;
  lat?: number | null;
  lng?: number | null;
  source?: string | null;
  category?: string | null;
  raw?: unknown;
};

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
  contact_visibility?: ContactVisibility;
  contact_note?: string | null;
  allow_messages?: boolean;
  price_text?: string | null;
  location_text?: string | null;
  location_name?: string | null;
  location_address?: string | null;
  location_postal?: string | null;
  location_lat?: number | null;
  location_lng?: number | null;
  location_source?: string | null;
  location_raw?: unknown;
  source_type: "user" | "admin" | "ai";
  is_ai_generated: boolean;
  moderation_status: ModerationStatus;
  status: "published" | "hidden" | "draft";
  created_at: string;
  tag_ids: string[];
  channel?: Channel;
  tags?: Tag[];
};

export type Conversation = {
  id: string;
  info_id: string | null;
  publisher_id: string | null;
  initiator_id: string | null;
  last_message?: string | null;
  last_message_at?: string | null;
  publisher_unread_count: number;
  initiator_unread_count: number;
  created_at: string;
  updated_at?: string;
  info?: Info | null;
  publisher?: Profile | null;
  initiator?: Profile | null;
};

export type Message = {
  id: string;
  conversation_id: string;
  sender_id: string | null;
  receiver_id: string | null;
  body: string;
  message_type: "text" | string;
  created_at: string;
  read_at?: string | null;
};

export type BlockedUser = {
  id: string;
  blocker_id: string | null;
  blocked_id: string | null;
  reason?: string | null;
  created_at: string;
};

export type MessageReport = {
  id: string;
  message_id: string | null;
  reporter_id: string | null;
  reason?: string | null;
  status: "pending" | "handled" | "dismissed";
  created_at: string;
  message?: Message | null;
};

export type GroupChat = {
  id: string;
  title: string;
  description?: string | null;
  cover_url?: string | null;
  group_type: GroupType;
  tag_id?: string | null;
  channel_id?: string | null;
  creator_id?: string | null;
  join_policy: GroupJoinPolicy;
  status: "active" | "closed" | "archived";
  member_count: number;
  message_count: number;
  created_at: string;
  updated_at?: string;
  tag?: Tag | null;
  channel?: Channel | null;
  infos?: Info[];
  my_membership?: GroupMember | null;
};

export type GroupInfo = {
  id: string;
  group_id: string | null;
  info_id: string | null;
  added_by?: string | null;
  created_at: string;
  info?: Info | null;
};

export type GroupMember = {
  id: string;
  group_id: string;
  user_id: string;
  member_role: GroupMemberRole;
  status: GroupMemberStatus;
  joined_at: string;
  last_read_at?: string | null;
  muted: boolean;
  profile?: Profile | null;
};

export type GroupMessage = {
  id: string;
  group_id: string;
  sender_id: string | null;
  body: string;
  message_type: "text" | string;
  created_at: string;
  deleted_at?: string | null;
  sender?: Profile | null;
};

export type GroupReport = {
  id: string;
  group_id: string | null;
  message_id?: string | null;
  reporter_id?: string | null;
  reason?: string | null;
  status: "pending" | "handled" | "dismissed";
  created_at: string;
  group?: GroupChat | null;
  message?: GroupMessage | null;
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
