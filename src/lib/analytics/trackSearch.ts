import { getSupabaseBrowserClient } from "@/lib/supabase/client";

type TrackSearchInput = {
  query: string;
  normalized_query?: string;
  matched_tag_id?: string;
  matched_channel_id?: string;
  result_count: number;
  user_id?: string | null;
};

export async function trackSearch(input: TrackSearchInput) {
  const supabase = getSupabaseBrowserClient();
  if (!supabase) {
    console.info("[mock analytics] search", input);
    return;
  }

  await supabase.from("search_logs").insert({
    user_id: input.user_id ?? null,
    query: input.query,
    normalized_query: input.normalized_query ?? input.query.trim().toLowerCase(),
    matched_tag_id: input.matched_tag_id,
    matched_channel_id: input.matched_channel_id,
    result_count: input.result_count
  });
}
