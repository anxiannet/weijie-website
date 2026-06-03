import type { User } from "@supabase/supabase-js";
import type { getSupabaseServiceClient } from "@/lib/supabase/client";

type ServiceClient = NonNullable<ReturnType<typeof getSupabaseServiceClient>>;

export async function ensureProfile(supabase: ServiceClient, user: User) {
  const { data } = await supabase
    .from("profiles")
    .select("id")
    .eq("id", user.id)
    .maybeSingle();

  if (data) return;

  await supabase.from("profiles").insert({
    id: user.id,
    nickname: user.email?.split("@")[0] ?? "维界用户"
  });
}
