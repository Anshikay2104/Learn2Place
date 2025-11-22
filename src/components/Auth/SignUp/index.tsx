"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import SocialSignUp from "../SocialSignUp";
import Logo from "@/components/Layout/Header/Logo";
import { useState } from "react";
import Loader from "@/components/Common/Loader";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";

const SignUp = () => {
  const router = useRouter();
  const supabase = createClientComponentClient();

  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setLoading(true);

    const data = new FormData(e.currentTarget);
    const form = Object.fromEntries(data.entries());

    const { name, email, password }: any = form;

    // ---- SUPABASE SIGNUP ----
    const { data: signupData, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { name }, // store name in user_metadata
        emailRedirectTo: "http://localhost:3000/auth/callback",
      },
    });

    if (error) {
      toast.error(error.message);
      setLoading(false);
      return;
    }

    toast.success("Account created! Check your email for verification.");
    setLoading(false);
    router.push("/signin");
  };

  return (
    <>
      <div className="mb-10 text-center mx-auto inline-block max-w-[160px]">
        <Logo />
      </div>

      <SocialSignUp />

      <span className="z-1 relative my-8 block text-center before:content-[''] before:absolute before:h-px before:w-40% before:bg-black/60 before:left-0 before:top-3 after:content-[''] after:absolute after:h-px after:w-40% after:bg-black/60 after:top-3 after:right-0">
        <span className="relative z-10 inline-block px-3 text-base text-black">
          OR
        </span>
      </span>

      <form onSubmit={handleSubmit}>
        <div className="mb-[22px]">
          <input
            type="text"
            placeholder="Name"
            name="name"
            required
            className="w-full rounded-md border border-black/20 bg-transparent px-5 py-3 text-base text-white placeholder:text-grey focus:border-primary"
          />
        </div>

        <div className="mb-[22px]">
          <input
            type="email"
            placeholder="Email"
            name="email"
            required
            className="w-full rounded-md border border-black/20 bg-transparent px-5 py-3 text-base text-white placeholder:text-grey focus:border-primary"
          />
        </div>

        <div className="mb-[22px]">
          <input
            type="password"
            placeholder="Password"
            name="password"
            required
            className="w-full rounded-md border border-black/20 bg-transparent px-5 py-3 text-base text-white placeholder:text-grey focus:border-primary"
          />
        </div>

        <div className="mb-9">
          <button
            type="submit"
            className="flex w-full items-center text-18 font-medium justify-center rounded-md bg-primary px-5 py-3 border border-primary hover:bg-transparent hover:text-primary"
          >
            Sign Up {loading && <Loader />}
          </button>
        </div>
      </form>

      <p className="text-body-secondary mb-4 text-white text-base">
        By creating an account you agree to our{" "}
        <a href="/#" className="text-primary hover:underline">
          Privacy
        </a>{" "}
        and{" "}
        <a href="/#" className="text-primary hover:underline">
          Policy
        </a>
      </p>

      <p className="text-white text-base">
        Already have an account?
        <Link href="/signin" className="pl-2 text-primary hover:underline">
          Sign In
        </Link>
      </p>
    </>
  );
};

export default SignUp;
