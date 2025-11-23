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

  // Alumni modal states
  const [alumniEmail, setAlumniEmail] = useState("");
  const [alumniVerified, setAlumniVerified] = useState(false);
  const [showAlumniModal, setShowAlumniModal] = useState(false);
  const [alumniError, setAlumniError] = useState("");
  const [alumniLoading, setAlumniLoading] = useState(false);

  /* ----------------------- ROLE SELECTION ----------------------- */
  const handleRoleSelect = (selectedRole: "alumni" | "student") => {
    setRole(selectedRole);

    if (selectedRole === "alumni") {
      setAlumniError("");
      setShowAlumniModal(true);
    }
  };

  /* ---------------------- ALUMNI VERIFICATION ---------------------- */
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

      toast.success("Email verified as alumni!");
      setAlumniVerified(true);
      setShowAlumniModal(false);

    } catch (err) {
      setAlumniError("Something went wrong. Try again.");
    } finally {
      setAlumniLoading(false);
    }
  };

  /* ------------------------- FINAL SIGNUP ------------------------- */
  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setLoading(true);

    if (role === "alumni" && !alumniVerified) {
      toast.error("Please verify your alumni email first.");
      setLoading(false);
      return;
    }

    const form = Object.fromEntries(new FormData(e.currentTarget).entries());
    const { name, email, password }: any = form;

    try {
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
        return;
      }

      toast.success("Account created! Check your email.");
      router.push("/signin");

    } catch {
      toast.error("Signup failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* ROLE SELECTION POPUP — only one box */}
      {role === null && <RoleSelectionModal onSelect={handleRoleSelect} />}

      {/* ALUMNI EMAIL VERIFICATION */}
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

      {/* Hide logo when role selection modal is open */}
      {role !== null && (
        <div className="mb-10 text-center mx-auto inline-block max-w-[160px]">
          <Logo />
        </div>
      )}

      {/* Show Social + Form only after role chosen */}
      {(role === "student" || alumniVerified) && (
        <>
          <SocialSignUp />

          <span className="relative my-6 block text-center">
            <span className="relative z-10 inline-block px-3 text-base text-white">
              OR
            </span>
          </span>

          <form onSubmit={handleSubmit} className="mt-2">
            <div className="mb-5">
              <input
                type="text"
                placeholder="Full Name"
                name="name"
                required
                className="w-full rounded-md border bg-transparent px-5 py-3 text-white placeholder-gray-400"
              />
            </div>

            <div className="mb-5">
              <input
                type="email"
                placeholder="Email"
                name="email"
                required
                className="w-full rounded-md border bg-transparent px-5 py-3 text-white placeholder-gray-400"
              />
            </div>

            <div className="mb-5">
              <input
                type="password"
                placeholder="Password"
                name="password"
                required
                className="w-full rounded-md border bg-transparent px-5 py-3 text-white placeholder-gray-400"
              />
            </div>

            <button
              type="submit"
              className="w-full bg-primary py-3 rounded-lg flex justify-center items-center disabled:opacity-60"
              disabled={loading}
            >
              {loading ? <Loader /> : "Sign Up"}
            </button>
          </form>

          <p className="text-white text-base mt-4">
            Already have an account?
            <Link href="/signin" className="text-primary ml-2">
              Sign In
            </Link>
          </p>
        </>
      )}
    </>
  );
};

export default SignUp;
