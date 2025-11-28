"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { getAvatarUrl } from "@/utils/getAvatarUrl";

export default function ProfileAvatar() {
  const supabase = createClientComponentClient();
  const [avatar, setAvatar] = useState<string | null>(null);
  const [initials, setInitials] = useState("");

  useEffect(() => {
    async function load() {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) return;

      const { data: profile } = await supabase
        .from("profiles")
        .select("full_name, avatar_url")
        .eq("id", user.id)
        .single();

      // ==== Avatar URL ====
      if (profile?.avatar_url) {
        setAvatar(getAvatarUrl(profile.avatar_url));
      }

      // ==== INITIALS (safe version) ====
      const nameSource = profile?.full_name || user.email || "U";

      const parts = nameSource
        .trim()
        .split(/\s+/)
        .filter(Boolean);

      let initial = "";

      if (parts.length === 1) {
        initial = parts[0][0];
      } else {
        initial = parts[0][0] + parts[1][0];
      }

      setInitials(initial.toUpperCase());
    }

    load();
  }, []);

  if (avatar) {
    return (
      <Image
        src={avatar}
        width={40}
        height={40}
        className="rounded-full cursor-pointer"
        alt="Avatar"
      />
    );
  }

  return (
    <div className="w-10 h-10 rounded-full bg-purple-600 text-white flex items-center justify-center font-semibold">
      {initials}
    </div>
  );
}
