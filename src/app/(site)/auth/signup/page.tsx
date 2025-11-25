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

  /* ROLE SELECTION */
  const handleRoleSelect = (selectedRole: "alumni" | "student") => {
    setRole(selectedRole);

    if (selectedRole === "alumni") {
      setAlumniError("");
      setShowAlumniModal(true);
    }
  };

  /* VERIFY ALUMNI EMAIL */
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

    if (!role) {
      toast.error("Please select a role first.");
      setLoading(false);
      return;
    }

    const form = Object.fromEntries(new FormData(e.currentTarget).entries());
    const { name, email, password } = form as {
      name: string;
      email: string;
      password: string;
    };

    /* Alumni must use verified email */
    if (role === "alumni" && email.trim() !== alumniEmail.trim()) {
      toast.error("Use the same email you verified as alumni.");
      setLoading(false);
      return;
    }

    if (role === "alumni" && !alumniVerified) {
      toast.error("Verify alumni email first.");
      setLoading(false);
      return;
    }

    // 1) Create auth user
    const { data, error } = await supabase.auth.signUp({
      email,
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
      toast.error("User not created properly.");
      setLoading(false);
      return;
    }

    // 2) Create profile row WITH EMAIL ✔
    await supabase.from("profiles").insert({
      id: user.id,
      full_name: name,
      role,
      email, // 🔥 VERY IMPORTANT
      is_verified_alumni: role === "alumni" ? true : false,
    });

    toast.success("Account created. Verify your email.");
    router.push("/signin");
  };

  return (
    <div className="fixed inset-0 z-[9999] bg-black/50 flex items-center justify-center p-4 backdrop-blur-sm">
      
      {role === null && (
        <RoleSelectionModal onSelect={handleRoleSelect} onClose={() => router.push("/")}/>
      )}

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

      {(role === "student" || alumniVerified) && (
        <div className="bg-white w-full max-w-md rounded-2xl p-8 shadow-xl relative">
          <button className="absolute right-4 top-4" onClick={() => router.push("/")}>×</button>

          <div className="w-32 mx-auto mb-6"><Logo /></div>

          <SocialSignUp />

          <div className="text-center my-6 text-gray-500">OR</div>

          <form onSubmit={handleSubmit}>
            <input type="text" name="name" placeholder="Full Name" required className="w-full border p-3 rounded mb-3"/>

            <input
              type="email"
              name="email"
              placeholder="Email"
              required
              defaultValue={role === "alumni" ? alumniEmail : ""}
              disabled={role === "alumni"}   // lock alumni email
              className="w-full border p-3 rounded mb-3"
            />

            <input type="password" name="password" placeholder="Password" required className="w-full border p-3 rounded mb-6"/>

            <button className="w-full bg-primary text-white p-3 rounded flex justify-center">
              {loading ? <Loader /> : "Sign Up"}
            </button>
          </form>

          <p className="text-center mt-4">
            Already have an account?
            <Link href="/signin" className="text-primary ml-1">Sign In</Link>
          </p>
        </div>
      )}
    </div>
  );
};

export default SignUp;
