"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { useState, useEffect } from "react";

import Logo from "@/components/Layout/Header/Logo";
import Loader from "@/components/Common/Loader";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";

import RoleSelectionModal from "@/components/Auth/RoleSelectionModal";
import AlumniEmailModal from "@/components/Auth/AlumniEmailModal";
import SocialSignUp from "@/components/Auth/SocialSignUp";
import { checkProfileExists } from "@/utils/checkProfileExists";
import { isInstitutionalEmail } from "@/utils/checkStudentInstitutionalEmail";
import { useSearchParams } from "next/navigation";



const SignUp = () => {
  
  const router = useRouter();
  const supabase = createClientComponentClient();

  const [role, setRole] = useState<"alumni" | "student" | null>(null);
  const [loading, setLoading] = useState(false);

  // Alumni verification
  const [alumniEmail, setAlumniEmail] = useState("");
  const [alumniVerified, setAlumniVerified] = useState(false);
  const [showAlumniModal, setShowAlumniModal] = useState(false);
  const [alumniError, setAlumniError] = useState("");
  const [alumniLoading, setAlumniLoading] = useState(false);

  const [inlineError, setInlineError] = useState<string | null>(null);

  const searchParams = useSearchParams();

useEffect(() => {
  const error = searchParams.get("error");
  if (error) {
    const decoded = decodeURIComponent(error);
    setInlineError(decoded);
    toast.error(decoded);

    // If the callback redirected here due to student email domain, pre-select student
    // so the inline banner is visible and user can correct their email.
    const lower = decoded.toLowerCase();
    if (lower.includes("institutional") || lower.includes("@modyuniversity")) {
      setRole("student");
      localStorage.setItem("signup_role", "student");
      setShowAlumniModal(false);
    }
  }
}, [searchParams]);


  // ✅ SHOW SIGNUP ERROR FROM AUTH CALLBACK (ONE TIME)
useEffect(() => {
  const error = localStorage.getItem("signup_error");

  if (error) {
    toast.error(error);
    localStorage.removeItem("signup_error");
  }
}, []);


  /* ---------------- ROLE SELECT ---------------- */
  const handleRoleSelect = (selectedRole: "alumni" | "student") => {
    setRole(selectedRole);

    localStorage.setItem("signup_role", selectedRole);

    if (selectedRole === "alumni") {
      setAlumniError("");
      setShowAlumniModal(true);
    }
  };

  /* ---------------- VERIFY ALUMNI EMAIL ---------------- */
  const verifyAlumni = async () => {
    setAlumniError("");

    if (!alumniEmail.trim()) {
      setAlumniError("Please enter an email.");
      return;
    }
    

    setAlumniLoading(true);

    try {
      const { data } = await supabase
        .from("alumni_verified_list")
        .select("Email")
        .eq("Email", alumniEmail.trim())
        .single();

      if (!data) {
        setAlumniError("This email is not recognized as alumni as it is not registered in our CDC verified list.");
        return;
      }

      toast.success("Alumni email verified!");

      setAlumniVerified(true);

      localStorage.setItem("signup_alumni_verified", "true");
      localStorage.setItem("signup_alumni_email", alumniEmail.trim());

      setShowAlumniModal(false);
    } finally {
      setAlumniLoading(false);
    }
  };

  /* ---------------- SUBMIT SIGNUP ---------------- */
  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setLoading(true);

    if (!role) {
      toast.error("Please select a role first.");
      setLoading(false);
      return;
    }

    const form = Object.fromEntries(new FormData(e.currentTarget).entries());
    const { name, email, password } = form as any;

    const lowerEmail = email.trim().toLowerCase();

    /* 1️⃣ STUDENT EMAIL DOMAIN CHECK */
    if (role === "student" && !isInstitutionalEmail(lowerEmail)) {
      const msg = "Students must sign up using their institutional email (@modyuniversity.ac.in).";
      setInlineError(msg);
      toast.error(msg);
      setLoading(false);
      return;
    }


    /* 2️⃣ UNIQUE PROFILE CHECK */
    const { exists } = await checkProfileExists(supabase, lowerEmail);
    if (exists) {
      toast.error("This email is already registered. Please sign in.");
      setLoading(false);
      return;
    }

    /* 3️⃣ ALUMNI STRICT RULE */
    if (role === "alumni") {
      if (!alumniVerified) {
        toast.error("Please verify your alumni email.");
        setLoading(false);
        return;
      }

      if (lowerEmail !== alumniEmail.trim().toLowerCase()) {
        toast.error(`Use your verified alumni email: ${alumniEmail}`);
        setLoading(false);
        return;
      }
    }

    /* 4️⃣ CREATE AUTH USER */
    const { data, error } = await supabase.auth.signUp({
      email: lowerEmail,
      password,
      options: {
        data: { full_name: name, role },
        emailRedirectTo: `${window.location.origin}/auth/callback`,
      },
    });

    if (error) {
      toast.error(error.message);
      setLoading(false);
      return;
    }

    const user = data.user;
    if (!user) {
      toast.error("Something went wrong.");
      setLoading(false);
      return;
    }

    /* 5️⃣ CREATE PROFILE */
    await supabase.from("profiles").insert({
      id: user.id,
      full_name: name,
      role,
      email: lowerEmail,
      is_verified_alumni: role === "alumni",
    });

    toast.success("Account created! Check your email to verify.");
    router.push("/auth/signin");
  };

  return (
    <div className="fixed inset-0 z-[9999] bg-black/50 flex items-center justify-center p-4 backdrop-blur-sm">
      {role === null && (
        <RoleSelectionModal
          onSelect={handleRoleSelect}
          onClose={() => router.push("/")}
        />
      )}

      {showAlumniModal && (
        <AlumniEmailModal
          email={alumniEmail}
          setEmail={setAlumniEmail}
          onVerify={verifyAlumni}
          error={alumniError}
          loading={alumniLoading}
          onClose={() => setShowAlumniModal(false)}
        />
      )}

      {(role === "student" || alumniVerified) && (
        <div className="bg-white w-full max-w-md rounded-2xl p-8 shadow-xl relative animate-fadeIn">
          {inlineError && (
            <div className="mb-4 rounded-lg border border-red-300 bg-red-50 px-4 py-3 text-sm text-red-700 flex items-start gap-2">
              <span className="text-lg leading-none">⚠️</span>
              <div className="flex-1">
                <p className="font-semibold">Signup error</p>
                <p>{inlineError}</p>
              </div>
              <button
                onClick={() => setInlineError(null)}
                className="text-red-500 hover:text-red-700 font-bold"
              >
                ×
              </button>
            </div>
          )}

          <button
            className="absolute right-4 top-4 text-gray-600 text-2xl hover:text-black"
            onClick={() => router.push("/")}
          >
            ×
          </button>

          <div className="w-32 mx-auto mb-6">
            <Logo />
          </div>

          <SocialSignUp />

          <div className="text-center my-6 text-gray-500">OR</div>

          <form onSubmit={handleSubmit}>
            <input
              type="text"
              name="name"
              placeholder="Full Name"
              required
              className="w-full border px-4 py-3 rounded-lg mb-3"
            />

            <input
              type="email"
              name="email"
              placeholder="Email"
              required
              defaultValue={role === "alumni" ? alumniEmail : ""}
              disabled={role === "alumni"}
              className="w-full border px-4 py-3 rounded-lg mb-3"
            />

            <input
              type="password"
              name="password"
              placeholder="Password"
              required
              className="w-full border px-4 py-3 rounded-lg mb-6"
            />

            <button className="w-full bg-primary text-white py-3 rounded-lg flex justify-center">
              {loading ? <Loader /> : "Sign Up"}
            </button>
          </form>

          <p className="text-center mt-4 text-gray-700">
            Already have an account?
            <Link href="/auth/signin" className="text-primary ml-1">
              Sign In
            </Link>
          </p>
        </div>
      )}
    </div>
  );
};

export default SignUp;
