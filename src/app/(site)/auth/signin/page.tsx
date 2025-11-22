"use client";
import { supabase } from "@/utils/supabaseClient";

export default function SignInPage() {
  const signInWithGoogle = async () => {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    });

    if (error) console.error(error);
  };

  return (
    <div className="flex flex-col gap-4 p-6">
      <h1 className="text-2xl font-bold">Sign In</h1>

      <button
        onClick={signInWithGoogle}
        className="bg-red-500 text-white px-6 py-2 rounded-lg"
      >
        Continue with Google
      </button>
    </div>
  );
}
