"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";

import Logo from "@/components/Layout/Header/Logo";
import SocialSignIn from "../SocialSignIn";
import Loader from "@/components/Common/Loader";

const SignInModal = () => {
  const router = useRouter();
  const supabase = createClientComponentClient();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  // -----------------------------------
  // SIGN IN + PROFILE CHECK LOGIC
  // -----------------------------------
  const loginUser = async (e: any) => {
    e.preventDefault();
    setLoading(true);
    setErrorMessage("");

    let data, error;

    // 1️⃣ LOGIN WITH SUPABASE AUTH
    try {
      const result = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      data = result.data;
      error = result.error;
    } catch (err) {
      setErrorMessage("Invalid email or password.");
      setLoading(false);
      return;
    }

    if (error) {
      setErrorMessage("Invalid email or password.");
      setLoading(false);
      return;
    }

    const user = data?.user;
    if (!user) {
      setErrorMessage("Something went wrong.");
      setLoading(false);
      return;
    }

    // 2️⃣ CHECK PROFILE EXISTS
    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", user.id)
      .single();

    if (profileError || !profile) {
      await supabase.auth.signOut();
      setErrorMessage("Account not found. Please sign up first.");
      setLoading(false);
      return;
    }

    // 3️⃣ REDIRECT BASED ON ROLE
    if (profile.role === "student") {
      toast.success("Welcome Student!");
      router.push("/stuProfile");
    } else if (profile.role === "alumni") {
      toast.success("Welcome Alumni!");
      router.push("/profile");
    } else {
      setErrorMessage("Invalid account role.");
      await supabase.auth.signOut();
    }

    setLoading(false);
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[9999] p-4">
      <div className="bg-white rounded-2xl p-8 w-full max-w-md shadow-xl relative">

        {/* CLOSE BUTTON */}
        <button
          className="absolute right-4 top-4 text-gray-600 hover:text-black text-xl"
          onClick={() => router.push("/")}
        >
          ✕
        </button>

        {/* LOGO */}
        <div className="flex justify-center mb-6">
          <Logo />
        </div>

        {/* GOOGLE/GITHUB LOGIN */}
        <SocialSignIn />

        {/* OR DIVIDER */}
        <div className="text-center my-6 text-gray-500 text-sm">OR</div>

        {/* FORM */}
        <form onSubmit={loginUser} className="flex flex-col gap-4">

          <input
            type="email"
            placeholder="Email"
            required
            className="w-full border px-5 py-3 rounded-md"
            onChange={(e) => setEmail(e.target.value)}
          />

          <input
            type="password"
            placeholder="Password"
            required
            className="w-full border px-5 py-3 rounded-md"
            onChange={(e) => setPassword(e.target.value)}
          />

          {/* ERROR MESSAGE SHOWN ON SCREEN */}
          {errorMessage && (
            <p className="text-red-600 text-sm text-center -mt-2">
              {errorMessage}
            </p>
          )}

          <button
            type="submit"
            className="bg-primary w-full py-3 rounded-md text-white font-semibold flex items-center justify-center"
          >
            {loading ? <Loader /> : "Sign In"}
          </button>
        </form>

        <p className="text-center text-sm text-gray-600 mt-4">
          Don’t have an account?
          <span
            className="text-primary font-semibold cursor-pointer ml-1"
            onClick={() => router.push("/auth/signup")}
          >
            Sign Up
          </span>
        </p>
      </div>
    </div>
  );
};

export default SignInModal;
4