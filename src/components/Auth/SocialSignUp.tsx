"use client";

import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";

const SocialSignUp = () => {
  const supabase = createClientComponentClient();

  const signInWithGoogle = async () => {
    const role = localStorage.getItem("signup_role");
    const verified = localStorage.getItem("signup_alumni_verified");

    if (!role) {
      alert("Please select a role first.");
      return;
    }

    if (role === "alumni" && verified !== "true") {
      alert("Please verify your alumni email first.");
      return;
    }

    // Mark as signup mode so callback knows this is a signup
    localStorage.setItem("signup_mode", "true");

    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${location.origin}/auth/callback`,
      },
    });
  };

  return (
    <button
      onClick={signInWithGoogle}
      className="w-full flex items-center justify-center gap-2.5 rounded-lg p-3.5 bg-primary text-white border border-primary"
    >
      Continue with Google
    </button>
  );
};

export default SocialSignUp;
