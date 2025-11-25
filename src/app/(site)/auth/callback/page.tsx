"use client";

import { useEffect } from "react";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

export default function AuthCallbackPage() {
  const supabase = createClientComponentClient();
  const router = useRouter();

  useEffect(() => {
    const run = async () => {
      const { data: { session } } = await supabase.auth.getSession();

      if (!session?.user) {
        toast.error("Authentication failed");
        return router.push("/signin");
      }

      const user = session.user;

      // Check if profile exists
      const { data: profile } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .maybeSingle();

      // NEW USER → go to onboarding
      if (!profile) {
        return router.push(`/auth/onboarding?email=${user.email}`);
      }

      // EXISTING USER → UPDATE PROFILE FIELDS (optional syncing)
      await supabase
        .from("profiles")
        .update({
          email: user.email,  
          full_name: user.user_metadata.full_name || profile.full_name,
          avatar_url: user.user_metadata.avatar_url || profile.avatar_url,
          updated_at: new Date(),
        })
        .eq("id", user.id);

      // Now redirect based on role
      if (profile.role === "student") return router.push("/stuProfile");
      if (profile.role === "alumni") return router.push("/profile");

      toast.error("Invalid profile role");
      await supabase.auth.signOut();
      router.push("/signin");
    };

    run();
  }, []);

  return (
    <div className="flex items-center justify-center min-h-screen text-xl">
      Processing sign-in...
    </div>
  );
}
