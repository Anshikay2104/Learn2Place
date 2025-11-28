"use client";

import { useEffect, useState } from "react";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

import RoleSelectionModal from "@/components/Auth/RoleSelectionModal";
import AlumniEmailModal from "@/components/Auth/AlumniEmailModal";
import { checkProfileExists } from "@/utils/checkProfileExists";

export default function AuthCallbackPage() {
  const supabase = createClientComponentClient();
  const router = useRouter();

  const [user, setUser] = useState<any>(null);
  const [showRoleModal, setShowRoleModal] = useState(false);

  const [alumniEmail, setAlumniEmail] = useState("");
  const [showAlumniModal, setShowAlumniModal] = useState(false);
  const [alumniError, setAlumniError] = useState("");
  const [alumniLoading, setAlumniLoading] = useState(false);

  const [loading, setLoading] = useState(true);

  // ✅ Helper: redirect safely after auth (currently not used, but okay to keep)
  const redirectAfterAuth = (fallbackRoute: string) => {
    const redirectTo = localStorage.getItem("redirectAfterAuth");

    if (redirectTo) {
      localStorage.removeItem("redirectAfterAuth");
      router.push(redirectTo);
    } else {
      router.push(fallbackRoute);
    }
  };

  useEffect(() => {
    const run = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session?.user) {
        toast.error("Authentication failed.");
        router.push("/auth/signin");
        return;
      }

      const currentUser = session.user;

      if (!currentUser.email) {
        toast.error("Google did not return an email.");
        await supabase.auth.signOut();
        router.push("/auth/signin");
        return;
      }

      const lowerEmail = currentUser.email.toLowerCase();
      setUser(currentUser);

      /* 1️⃣ CHECK IF PROFILE ALREADY EXISTS */
      const { exists, profile } = await checkProfileExists(
        supabase,
        lowerEmail
      );

      if (exists) {
        toast.success("Welcome back!");
        router.push(
          profile.role === "student" ? "/profile/studentprofile" : "/profile/alumniprofile"
        );
        return;
      }

      /* 2️⃣ GOOGLE SIGNUP FLOW */
      const signupMode = localStorage.getItem("signup_mode");

      if (signupMode === "true") {
        localStorage.removeItem("signup_mode");

        const selectedRole = localStorage.getItem("signup_role");
        const alumniVerified =
          localStorage.getItem("signup_alumni_verified") === "true";
        const verifiedAlumniEmail =
          localStorage.getItem("signup_alumni_email") || "";

        if (!selectedRole) {
          toast.error("Role selection missing. Please sign up again.");
          router.push("/auth/signup");
          return;
        }

        /* 2A — STUDENT EMAIL MUST BE INSTITUTIONAL */
        if (selectedRole === "student") {
          if (!lowerEmail.endsWith("@modyuniversity.ac.in")) {
            toast.error("Students must use @modyuniversity.ac.in email.");
            await supabase.auth.signOut();
            window.location.href =
              "/auth/signin?invalid_student_email=true";
            return;
          }
        }

        /* 2B — ALUMNI MUST MATCH VERIFIED EMAIL */
        if (selectedRole === "alumni") {
          if (!alumniVerified || !verifiedAlumniEmail) {
            toast.error("Please verify your alumni email again.");
            await supabase.auth.signOut();
            router.push("/auth/signup");
            return;
          }

          if (lowerEmail !== verifiedAlumniEmail.toLowerCase()) {
            toast.error(
              `Please sign in using your verified alumni email: ${verifiedAlumniEmail}`
            );
            await supabase.auth.signOut();
            router.push("/auth/signin");
            return;
          }
        }

        /* 3️⃣ CREATE PROFILE */
        await createProfile(
          currentUser,
          selectedRole as "student" | "alumni",
          selectedRole === "alumni"
        );
        return;
      }

      /* 4️⃣ NEW GOOGLE LOGIN — NO PROFILE — ASK ROLE */
      setShowRoleModal(true);
      setLoading(false);
    };

    run();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /* ================= ROLE SELECT ================= */
  const handleRoleSelect = async (selectedRole: "student" | "alumni") => {
    const email = user?.email?.toLowerCase() || "";

    /* STUDENT RULE — MUST MATCH DOMAIN */
    if (selectedRole === "student") {
      if (!email.endsWith("@modyuniversity.ac.in")) {
        toast.error("Use your institutional ID (@modyuniversity.ac.in).");
        await supabase.auth.signOut();
        router.push("/auth/signin");
        return;
      }

      await createProfile(user, "student", false);
      return;
    }

    /* ALUMNI → SHOW EMAIL VERIFICATION MODAL */
    setShowAlumniModal(true);
  };

  /* ================= VERIFY ALUMNI ================= */
  const verifyAlumni = async () => {
    setAlumniError("");

    if (!alumniEmail.trim()) {
      setAlumniError("Enter an email.");
      return;
    }

    if (alumniEmail.toLowerCase() !== user?.email?.toLowerCase()) {
      setAlumniError(`Use the same email you logged in with.`);
      return;
    }

    setAlumniLoading(true);

    const { data } = await supabase
      .from("alumni_verified_list")
      .select("*")
      .eq("Email", alumniEmail.trim())
      .maybeSingle();

    if (!data) {
      setAlumniError("Email is not listed as alumni.");
      setAlumniLoading(false);
      return;
    }

    toast.success("Alumni email verified!");
    setShowAlumniModal(false);
    await createProfile(user, "alumni", true);
  };

  /* ================= CREATE PROFILE ================= */
  const createProfile = async (
    currentUser: any,
    role: "student" | "alumni",
    alumniVerified: boolean
  ) => {
    await supabase.from("profiles").insert({
      id: currentUser.id,
      full_name: currentUser.user_metadata.full_name,
      email: currentUser.email,
      role,
      avatar_url: currentUser.user_metadata.avatar_url,
      is_verified_alumni: alumniVerified,
    });

    /* cleanup */
    localStorage.removeItem("signup_role");
    localStorage.removeItem("signup_alumni_verified");
    localStorage.removeItem("signup_alumni_email");

    toast.success("Profile created!");
    router.push(role === "student" ? "/profile/studentprofile" : "/profile/alumniprofile");
  };

  return (
    <div className="flex items-center justify-center min-h-screen text-xl font-semibold">
      {loading && "Processing..."}

      {showRoleModal && (
        <RoleSelectionModal onSelect={handleRoleSelect} onClose={() => {}} />
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
    </div>
  );
}
