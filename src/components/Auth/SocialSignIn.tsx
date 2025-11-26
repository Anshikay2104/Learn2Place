"use client";

import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";

const SocialSignUp = () => {
  const supabase = createClientComponentClient();

  const signInWithProvider = async (provider: "google" | "github") => {
    await supabase.auth.signInWithOAuth({
      provider,
      options: {
        redirectTo: `${location.origin}/auth/callback`,
        queryParams: {
          prompt: "select_account", // 🔥 ALWAYS show account chooser
        },
      },
    });
  };

  return (
    <div className="flex flex-col gap-3 mb-6">
      <button
        onClick={() => signInWithProvider("google")}
        className="w-full flex items-center justify-center gap-2.5 rounded-lg p-3.5 bg-primary text-white border border-primary"
      >
        Continue with Google
      </button>

      <button
        onClick={() => signInWithProvider("github")}
        className="w-full flex items-center justify-center gap-2.5 rounded-lg p-3.5 bg-primary text-white border border-primary"
      >
        Continue with GitHub
      </button>
    </div>
  );
};

export default SocialSignUp;
