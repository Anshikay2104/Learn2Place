// utils/getAvatarUrl.ts

export function getAvatarUrl(avatar_url: string | null | undefined) {
  console.log("RAW avatar_url from DB:", avatar_url);

  if (!avatar_url || avatar_url.trim() === "") {
    console.log("→ No avatar, using default");
    return "/default-avatar.png";
  }

  // Case 1: Google image OR full URL
  if (avatar_url.startsWith("http")) {
    console.log("→ Full URL returned");
    return avatar_url;
  }

  // Case 2: Stored in Supabase bucket (relative path)
  const FINAL = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/avatars/${avatar_url}`;

  console.log("→ Returning Supabase URL:", FINAL);

  return FINAL;
}
