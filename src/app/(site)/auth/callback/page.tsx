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
        toast.error("Google did not return an email. Try again.");
        await supabase.auth.signOut();
        router.push("/auth/signin");
        return;
      }

      const lowerEmail = currentUser.email.toLowerCase();

      setUser(currentUser);

      /* 1️⃣ DOES PROFILE ALREADY EXIST? */
      const { exists, profile } = await checkProfileExists(
        supabase,
        lowerEmail
      );
      if (exists) {
        toast.success("Welcome back!");
        router.push(profile.role === "student" ? "/stuProfile" : "/profile");
        return;
      }

      /* 2️⃣ IS THIS GOOGLE SIGNUP FLOW? */
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

        /* 2A — Alumni special rules */
        if (selectedRole === "alumni") {
          if (!alumniVerified || !verifiedAlumniEmail) {
            toast.error("Please verify alumni email again.");
            await supabase.auth.signOut();
            router.push("/auth/signup");
            return;
          }

          if (lowerEmail !== verifiedAlumniEmail.toLowerCase()) {
            toast.error(
              `You must sign in with your verified alumni email: ${verifiedAlumniEmail}`
            );

            await supabase.auth.signOut();
            window.location.href = `/auth/signin?mismatch=${encodeURIComponent(
              verifiedAlumniEmail
            )}`;
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

      /* 4️⃣ NEW GOOGLE LOGIN → Show role modal */
      setShowRoleModal(true);
      setLoading(false);
    };

    run();
  }, []);

  /* ROLE SELECTED */
  const handleRoleSelect = async (selectedRole: "student" | "alumni") => {
    if (selectedRole === "alumni") {
      setShowAlumniModal(true);
    } else {
      await createProfile(user, selectedRole, false);
    }
  };

  /* VERIFY ALUMNI EMAIL */
  const verifyAlumni = async () => {
    setAlumniError("");

    if (!alumniEmail.trim()) {
      setAlumniError("Enter an email.");
      return;
    }

    if (!user?.email) {
      setAlumniError("Google did not return an email.");
      return;
    }

    if (
      alumniEmail.trim().toLowerCase() !==
      user.email.trim().toLowerCase()
    ) {
      setAlumniError(`Use the same email you logged in with: ${user.email}`);
      return;
    }

    setAlumniLoading(true);

    const { data } = await supabase
      .from("alumni_verified_list")
      .select("*")
      .eq("Email", alumniEmail.trim())
      .maybeSingle();

    if (!data) {
      setAlumniError("Email not listed as alumni.");
      setAlumniLoading(false);
      return;
    }

    toast.success("Alumni verified!");
    setShowAlumniModal(false);

    await createProfile(user, "alumni", true);
  };

  /* CREATE PROFILE */
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

    /* CLEANUP */
    localStorage.removeItem("signup_role");
    localStorage.removeItem("signup_alumni_verified");
    localStorage.removeItem("signup_alumni_email");

    toast.success("Profile created!");

    router.push(role === "student" ? "/stuProfile" : "/profile");
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
