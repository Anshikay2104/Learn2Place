"use client";
import { useState } from "react";
import { supabase } from "@/utils/supabaseClient";

export default function SignUpPage() {
  const [role, setRole] = useState("");

  // --- Function to check whether email exists in the database ---
  const checkEmailAllowed = async (email: string) => {
    const { data, error } = await supabase
      .from("allowed_users") // your table containing allowed emails
      .select("email")
      .eq("email", email)
      .single();

    if (error || !data) {
      return false;
    }

    return true;
  };

  // -------------------------------------------------------------------
  // NORMAL EMAIL/PASSWORD SIGNUP
  // -------------------------------------------------------------------
  const handleEmailSignup = async (email: string, password: string) => {
    if (!role) {
      alert("Please select student or alumni.");
      return;
    }

    const exists = await checkEmailAllowed(email);
    if (!exists) {
      alert("Your email is not registered as an allowed user.");
      return;
    }

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { role },
      },
    });

    if (error) console.log(error);
  };

  // -------------------------------------------------------------------
  // GOOGLE SIGNUP
  // -------------------------------------------------------------------
  const signUpWithGoogle = async () => {
    if (!role) {
      alert("Please select student or alumni before signing up.");
      return;
    }

    // Store role temporarily (to save after Google login callback)
    localStorage.setItem("signup_role", role);

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
      <h1 className="text-2xl font-bold">Create Account</h1>

      {/* Role selection dropdown */}
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

      {/* Google Signup */}
      <button
        onClick={signUpWithGoogle}
        className="bg-blue-500 text-white px-6 py-2 rounded-lg"
      >
        Sign up with Google
      </button>
    </div>
  );
}
