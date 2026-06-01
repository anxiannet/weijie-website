import { getSupabaseBrowserClient } from "@/lib/supabase/client";

type TrackPageViewInput = {
  path: string;
  target_type?: string;
  target_id?: string;
  referrer?: string;
  user_id?: string | null;
};

export async function trackPageView(input: TrackPageViewInput) {
  const supabase = getSupabaseBrowserClient();
  if (!supabase) {
    console.info("[mock analytics] page_view", input);
    return;
  }

  await supabase.from("page_views").insert({
    user_id: input.user_id ?? null,
    path: input.path,
    target_type: input.target_type,
    target_id: input.target_id,
    referrer: input.referrer
  });
}
