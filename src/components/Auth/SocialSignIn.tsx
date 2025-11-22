"use client";
import React from "react";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";

const SocialSignIn = () => {
  const supabase = createClientComponentClient();

  const loginWithGoogle = async () => {
    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${location.origin}/auth/callback`,
      },
    });
  };

  const loginWithGithub = async () => {
    await supabase.auth.signInWithOAuth({
      provider: "github",
      options: {
        redirectTo: `${location.origin}/auth/callback`,
      },
    });
  };

  return (
    <div className="flex gap-4">
      <button
        onClick={loginWithGoogle}
        className="flex w-full items-center justify-center gap-2.5 rounded-lg p-3.5 hover:bg-primary/15 bg-primary hover:text-black text-white border border-primary"
      >
        Sign In with Google
      </button>

      <button
        onClick={loginWithGithub}
        className="flex w-full items-center justify-center gap-2.5 rounded-lg p-3.5 hover:bg-primary/15 bg-primary hover:text-black text-white border border-primary"
      >
        Sign In with GitHub
      </button>
    </div>
  );
};

export default SocialSignIn;
