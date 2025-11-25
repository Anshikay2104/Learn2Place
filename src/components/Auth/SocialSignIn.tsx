"use client";

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

  return (
    <button
      onClick={loginWithGoogle}
      className="w-full bg-primary text-white py-3 rounded-lg"
    >
      Sign In with Google
    </button>
  );
};

export default SocialSignIn;
