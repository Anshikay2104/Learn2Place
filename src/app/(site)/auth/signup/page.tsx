"use client";

import { useEffect, useState } from "react";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";

export default function SignUpPage() {
  const supabase = createClientComponentClient();
  const [role, setRole] = useState("");

  const signUpWithGoogle = async () => {
    console.log("Google signup clicked");

    if (!role) {
      alert("Please select student or alumni before signing up.");
      return;
    }

    localStorage.setItem("signup_role", role);

    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: "http://localhost:3000/auth/callback",
      },
    });

    if (error) {
      console.error("OAuth error:", error);
    }
  };

  return (
    <div className="flex flex-col gap-4 p-6">
      <h1 className="text-2xl font-bold">Create Account</h1>

      <label className="font-semibold">Sign up as</label>
      <select
        value={role}
        onChange={(e) => setRole(e.target.value)}
        className="border p-2 rounded-lg"
      >
        <option value="">Select...</option>
        <option value="student">Student</option>
        <option value="alumni">Alumni</option>
      </select>

      <button
        onClick={signUpWithGoogle}
        className="bg-blue-500 text-white px-6 py-2 rounded-lg"
      >
        Sign up with Google
      </button>
    </div>
  );
}
