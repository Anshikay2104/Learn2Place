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

  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);

  const [showRoleModal, setShowRoleModal] = useState(false);
  const [showAlumniModal, setShowAlumniModal] = useState(false);

  const [alumniEmail, setAlumniEmail] = useState("");
  const [alumniError, setAlumniError] = useState("");
  const [alumniLoading, setAlumniLoading] = useState(false);

  // ==================================================
  // INITIAL AUTH CHECK
  // ==================================================
  useEffect(() => {
    async function init() {
      const { data: { session } } = await supabase.auth.getSession();

      // ❌ No valid session → force redirect
      if (!session?.user) {
        toast.error("Authentication failed.");
        router.push("/auth/signin");
        return;
      }

      const currentUser = session.user;

      // ❌ Google returned no email
      if (!currentUser.email) {
        toast.error("Google did not return an email.");
        await supabase.auth.signOut();
        router.push("/auth/signin");
        return;
      }

      const email = currentUser.email.toLowerCase();
      setUser(currentUser);

      // ==================================================
      // 1️⃣ CHECK IF PROFILE ALREADY EXISTS
      // ==================================================
      const { exists, profile } = await checkProfileExists(supabase, email);

      if (exists) {
        toast.success("Welcome back!");

        router.push(
          profile.role === "student"
            ? "/profile/studentprofile"
            : "/profile/alumniprofile"
        );
        return;
      }

      // ==================================================
      // 2️⃣ NEW GOOGLE SIGNUP FLOW
      // ==================================================
      const signupMode = localStorage.getItem("signup_mode");

      if (signupMode === "true") {
        localStorage.removeItem("signup_mode");

        const role = localStorage.getItem("signup_role");
        const alumniVerified =
          localStorage.getItem("signup_alumni_verified") === "true";
        const verifiedAlumniEmail =
          localStorage.getItem("signup_alumni_email") || "";

        if (!role) {
          toast.error("Role not selected. Please try again.");
          await supabase.auth.signOut();
          router.push("/auth/signup");
          return;
        }

        // -------------------------------
        // 2A — STUDENT SIGNUP VALIDATION
        // -------------------------------
        if (role === "student") {
          if (!email.endsWith("@modyuniversity.ac.in")) {
            const msg = encodeURIComponent(
              "Students must sign up using their institutional email (@modyuniversity.ac.in)."
            );

            await supabase.auth.signOut();
            router.push(`/auth/signup?error=${msg}`);
            return;
          }

          return createProfile(currentUser, "student", false);
        }

        // -------------------------------
        // 2B — ALUMNI SIGNUP VALIDATION
        // -------------------------------
        if (role === "alumni") {
          if (!alumniVerified || !verifiedAlumniEmail) {
            toast.error("Please verify your alumni email again.");
            await supabase.auth.signOut();
            router.push("/auth/signup");
            return;
          }

          if (email !== verifiedAlumniEmail.toLowerCase()) {
            toast.error(
              `Please sign in using your verified alumni email: ${verifiedAlumniEmail}`
            );
            await supabase.auth.signOut();
            router.push("/auth/signin");
            return;
          }

          return createProfile(currentUser, "alumni", true);
        }
      }

      // ==================================================
      // 3️⃣ BRAND NEW GOOGLE USER → SHOW ROLE SELECTION
      // ==================================================
      setShowRoleModal(true);
      setLoading(false);
    }

    init();
  }, []);

  // ==================================================
  // HANDLE ROLE SELECTION POPUP
  // ==================================================
  const handleRoleSelect = async (role: "student" | "alumni") => {
    const email = user?.email?.toLowerCase() || "";

    if (role === "student") {
      if (!email.endsWith("@modyuniversity.ac.in")) {
        const msg = encodeURIComponent(
          "Students must sign up using their institutional email (@modyuniversity.ac.in)."
        );

        await supabase.auth.signOut();
        router.push(`/auth/signup?error=${msg}`);
        return;
      }

      return createProfile(user, "student", false);
    }

    // Alumni → ask for verification
    setShowAlumniModal(true);
  };

  // ==================================================
  // VERIFY ALUMNI EMAIL
  // ==================================================
  const verifyAlumni = async () => {
    setAlumniError("");

    if (!alumniEmail.trim()) {
      setAlumniError("Enter your alumni email.");
      return;
    }

    if (alumniEmail.toLowerCase() !== user?.email?.toLowerCase()) {
      setAlumniError("Use the same email you logged in with.");
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

    toast.success("Alumni verified!");
    setShowAlumniModal(false);

    return createProfile(user, "alumni", true);
  };

  // ==================================================
  // PROFILE CREATION
  // ==================================================
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

    localStorage.removeItem("signup_role");
    localStorage.removeItem("signup_alumni_verified");
    localStorage.removeItem("signup_alumni_email");

    toast.success("Profile created!");

    router.push(
      role === "student"
        ? "/profile/studentprofile"
        : "/auth/alumni-details"
    );
  };

  // ==================================================
  // UI
  // ==================================================
  return (
    <div className="flex items-center justify-center min-h-screen text-xl font-semibold">
      {loading && "Processing..."}

      {showRoleModal && (
        <RoleSelectionModal
          onSelect={handleRoleSelect}
          onClose={() => {}}
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
    </div>
  );
}
