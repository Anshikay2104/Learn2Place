import { SupabaseClient } from "@supabase/supabase-js";

export const checkProfileExists = async (
  supabase: SupabaseClient,
  email: string
) => {
  if (!email) return { exists: false, profile: null };

  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("email", email.toLowerCase())
    .maybeSingle();

  return {
    exists: !!profile,
    profile: profile || null,
  };
};
