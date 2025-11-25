"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { useState } from "react";

import Logo from "@/components/Layout/Header/Logo";
import Loader from "@/components/Common/Loader";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";

import RoleSelectionModal from "@/components/Auth/RoleSelectionModal";
import AlumniEmailModal from "@/components/Auth/AlumniEmailModal";
import SocialSignUp from "@/components/Auth/SocialSignUp";

const SignUp = () => {
  const router = useRouter();
  const supabase = createClientComponentClient();

  const [role, setRole] = useState<"alumni" | "student" | null>(null);
  const [loading, setLoading] = useState(false);

  // Alumni modal
  const [alumniEmail, setAlumniEmail] = useState("");
  const [alumniVerified, setAlumniVerified] = useState(false);
  const [showAlumniModal, setShowAlumniModal] = useState(false);
  const [alumniError, setAlumniError] = useState("");
  const [alumniLoading, setAlumniLoading] = useState(false);

  /* ROLE SELECTION HANDLER */
  const handleRoleSelect = (selectedRole: "alumni" | "student") => {
    setRole(selectedRole);
    if (selectedRole === "alumni") setShowAlumniModal(true);
  };

  /* VERIFY ALUMNI */
  const verifyAlumni = async () => {
    setAlumniError("");

    if (!alumniEmail.trim()) {
      setAlumniError("Please enter an email.");
      return;
    }

    setAlumniLoading(true);

    try {
      const { data, error } = await supabase
        .from("alumni_verified_list")
        .select("Email")
        .eq("Email", alumniEmail.trim())
        .single();

      if (error || !data) {
        setAlumniError("This email is not recognized as alumni.");
        return;
      }

      toast.success("Email verified!");
      setAlumniVerified(true);
      setShowAlumniModal(false);

    } finally {
      setAlumniLoading(false);
    }
  };

  /* FINAL SIGNUP */
  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setLoading(true);

    if (role === "alumni" && !alumniVerified) {
      toast.error("Verify alumni email first.");
      setLoading(false);
      return;
    }

    const form = Object.fromEntries(new FormData(e.currentTarget).entries());
    const { name, email, password }: any = form;

    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { name, role },
        emailRedirectTo: `${location.origin}/auth/callback`,
      },
    });

    if (error) {
      toast.error(error.message);
      setLoading(false);
      return;
    }

    toast.success("Account created! Check your email.");
    router.push("/");
  };

  return (
    <>
      {/* Role Modal */}
      {role === null && (
        <RoleSelectionModal
          onSelect={handleRoleSelect}
          onClose={() => router.push("/")}
        />
      )}

      {/* Alumni Modal */}
      {showAlumniModal && (
        <AlumniEmailModal
          email={alumniEmail}
          setEmail={setAlumniEmail}
          onVerify={verifyAlumni}
          onClose={() => setShowAlumniModal(false)}
          error={alumniError}
          loading={alumniLoading}
        />
      )}

      {/* Signup Form */}
      {(role === "student" || alumniVerified) && (
        <>
          <div className="mb-10 text-center mx-auto inline-block max-w-[160px]">
            <Logo />
          </div>

          <SocialSignUp />

          <div className="my-6 text-center text-black">OR</div>

          <form onSubmit={handleSubmit}>
            <input
              type="text"
              placeholder="Full Name"
              name="name"
              required
              className="w-full border px-5 py-3 rounded-md mb-5"
            />

            <input
              type="email"
              placeholder="Email"
              name="email"
              required
              className="w-full border px-5 py-3 rounded-md mb-5"
            />

            <input
              type="password"
              placeholder="Password"
              name="password"
              required
              className="w-full border px-5 py-3 rounded-md mb-5"
            />

            <button
              className="bg-primary w-full py-3 rounded-lg text-white flex justify-center"
            >
              {loading ? <Loader /> : "Sign Up"}
            </button>
          </form>

          <p className="text-black text-center mt-4">
            Already have an account?
            <span
              className="text-primary ml-2 cursor-pointer"
              onClick={() => router.push("/signin")}
            >
              Sign In
            </span>
          </p>
        </>
      )}
    </>
  );
};

export default SignUp;
