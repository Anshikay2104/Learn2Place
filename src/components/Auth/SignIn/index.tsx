"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";

import Logo from "@/components/Layout/Header/Logo";
import SocialSignIn from "../SocialSignIn";
import Loader from "@/components/Common/Loader";

export default function SignInModal() {
  const router = useRouter();
  const supabase = createClientComponentClient();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const loginUser = async (e: any) => {
    e.preventDefault();
    setLoading(true);
    setErrorMessage("");

    const { data, error } = await supabase.auth.signInWithPassword({ email, password });

    if (error || !data?.user) {
      setErrorMessage("Invalid email or password");
      setLoading(false);
      return;
    }

    const user = data.user;

    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", user.id)
      .single();

    if (profileError || !profile) {
      setErrorMessage("Profile missing. Please sign up.");
      await supabase.auth.signOut();
      setLoading(false);
      return;
    }

    let role = profile.role?.toLowerCase().trim();
    const isVerified = profile.is_verified_alumni === true;

    if (role === "student") {
      toast.success("Welcome Student!");
      router.push("/profile/studentprofile");
    } else if (role === "alumni") {
      toast.success("Welcome Alumni!");
      router.push("/profile/alumniprofile");
    } else if (isVerified) {
      toast.success("Welcome Verified Alumni!");
      router.push("/profile/alumniprofile");
    } else {
      setErrorMessage("Your account is missing a valid role.");
    }

    setLoading(false);
  };

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-[99999] p-4">
      <div className="bg-white rounded-2xl p-8 w-full max-w-md shadow-xl relative">
        <button className="absolute right-4 top-4 text-xl" onClick={() => router.push("/")}>✕</button>
        <div className="flex justify-center mb-6"><Logo /></div>
        <SocialSignIn />
        <div className="text-center my-6 text-gray-500 text-sm">OR</div>
        <form onSubmit={loginUser} className="flex flex-col gap-4">
          <input type="email" placeholder="Email" required className="border px-5 py-3 rounded-md" onChange={(e) => setEmail(e.target.value)} />
          <input type="password" placeholder="Password" required className="border px-5 py-3 rounded-md" onChange={(e) => setPassword(e.target.value)} />
          {errorMessage && (<p className="text-red-600 text-sm text-center">{errorMessage}</p>)}
          <button className="bg-primary text-white py-3 rounded-md flex justify-center">{loading ? <Loader /> : "Sign In"}</button>
        </form>
        <p className="text-center mt-4">Don’t have an account? <span className="text-primary ml-1 cursor-pointer" onClick={() => router.push("/auth/signup")}>Sign Up</span></p>
      </div>
    </div>
  );
}
