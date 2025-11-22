"use client";
import React from "react";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";

const SocialSignUp = () => {
  const supabase = createClientComponentClient();

  const signUpWithGoogle = async () => {
    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${location.origin}/auth/callback`,
      },
    });
  };

  const signUpWithGithub = async () => {
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
        onClick={signUpWithGoogle}
        className="flex w-full items-center justify-center gap-2.5 rounded-lg p-3.5 hover:bg-primary/15 bg-primary hover:text-black text-white border border-primary"
      >
        Sign Up with Google
      </button>

      <button
        onClick={signUpWithGithub}
        className="flex w-full items-center justify-center gap-2.5 rounded-lg p-3.5 hover:bg-primary/15 bg-primary hover:text-black text-white border border-primary"
      >
        Sign Up with GitHub
      </button>
    </div>
  );
};

export default SocialSignUp;
