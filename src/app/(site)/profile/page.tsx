"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";

export default function ProfilePage() {
  const router = useRouter();
  const supabase = createClientComponentClient();

  useEffect(() => {
    const loadProfile = async () => {
      // 1️⃣ Get user
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        router.replace("/auth/signin");
        return;
      }

      // 2️⃣ Always fetch a *fresh* profile (no cache)
      const { data: profile, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .maybeSingle();

      if (!profile || error) {
        router.replace("/auth/signin");
        return;
      }

      console.log("🔥 LOADED PROFILE:", profile);

      // 3️⃣ Route by role
      const role = profile.role?.toLowerCase();
      const isVerifiedAlumni = profile.is_verified_alumni === true;

      if (role === "student") {
        router.replace("/profile/studentprofile");
        return;
      }

      if (role === "alumni" || isVerifiedAlumni) {
        router.replace("/profile/alumniprofile");
        return;
      }

      // Fallback if unknown role
      router.replace("/");
    };

    loadProfile();
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center text-lg font-semibold">
      Loading profile...
    </div>
  );
}
