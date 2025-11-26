"use client";

import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";

const SocialSignUp = () => {
  const supabase = createClientComponentClient();

  const signInWithGoogle = async () => {
    const role = localStorage.getItem("signup_role");
    const verified = localStorage.getItem("signup_alumni_verified");
    const alumniEmail = localStorage.getItem("signup_alumni_email");

    if (!role) {
      alert("Please select a role first.");
      return;
    }

    // Alumni must verify before Google OAuth
    if (role === "alumni" && verified !== "true") {
      alert("Please verify your alumni email first.");
      return;
    }

    // Mark that this is a Google-based signup flow
    localStorage.setItem("signup_mode", "true");

    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${location.origin}/auth/callback`,
        queryParams: { prompt: "select_account" },
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
