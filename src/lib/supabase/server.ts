import { cookies } from "next/headers";
import { createServerClient, type CookieOptions } from "@supabase/ssr";
import { hasSupabaseEnv } from "@/lib/supabase/client";
import type { Profile } from "@/types";

export function getSupabaseCookieClient() {
  if (!hasSupabaseEnv) return null;

  const cookieStore = cookies();

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet: { name: string; value: string; options: CookieOptions }[]) {
          try {
            cookiesToSet.forEach(({ name, value, options }) => {
              cookieStore.set(name, value, options);
            });
          } catch {
            // Server Components cannot write cookies; middleware refreshes sessions.
          }
        }
      }
    }
  );
}

export async function getCurrentUser() {
  const supabase = getSupabaseCookieClient();
  if (!supabase) return null;

  const { data, error } = await supabase.auth.getUser();
  if (error) return null;
  return data.user;
}

export async function getCurrentProfile() {
  const supabase = getSupabaseCookieClient();
  if (!supabase) return null;

  const { data: authData, error: authError } = await supabase.auth.getUser();
  if (authError || !authData.user) return null;

  const { data, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", authData.user.id)
    .maybeSingle();

  if (error) return null;
  return data as Profile | null;
}

export async function getAdminProfile() {
  const profile = await getCurrentProfile();
  return profile?.role === "admin" ? profile : null;
}
