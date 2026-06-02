import type { User } from "@supabase/supabase-js";
import type { getSupabaseServiceClient } from "@/lib/supabase/client";

type ServiceClient = NonNullable<ReturnType<typeof getSupabaseServiceClient>>;

export async function ensureProfile(supabase: ServiceClient, user: User) {
  await supabase.from("profiles").upsert({
    id: user.id,
    nickname: user.email?.split("@")[0] ?? "维界用户"
  }, { onConflict: "id" });
}
