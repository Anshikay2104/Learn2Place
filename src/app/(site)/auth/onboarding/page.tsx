"use client";

export const dynamic = "force-dynamic";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import toast from "react-hot-toast";

import RoleSelectionModal from "@/components/Auth/RoleSelectionModal";
import AlumniEmailModal from "@/components/Auth/AlumniEmailModal";
import Loader from "@/components/Common/Loader";

export default function OnboardingPage() {
  const router = useRouter();
  const supabase = createClientComponentClient();

  const [emailFromCallback, setEmailFromCallback] = useState<string | null>(null);

  useEffect(() => {
    try {
      const params = new URLSearchParams(window.location.search);
      const email = params.get("email");
      setEmailFromCallback(email);
    } catch (e) {
      setEmailFromCallback(null);
    }
  }, []);

  const [role, setRole] = useState<"student" | "alumni" | null>(null);
  const [loading, setLoading] = useState(false);

  // Alumni-related
  const [alumniEmail, setAlumniEmail] = useState(emailFromCallback || "");
  const [alumniModal, setAlumniModal] = useState(false);
  const [alumniError, setAlumniError] = useState("");
  const [alumniLoading, setAlumniLoading] = useState(false);

  useEffect(() => {
    if (!emailFromCallback) {
      toast.error("Invalid login session");
      router.push("/signin");
    }
  }, [emailFromCallback]);

  const handleRoleSelect = (selectedRole: "student" | "alumni") => {
    setRole(selectedRole);
    if (selectedRole === "alumni") setAlumniModal(true);
    else createStudentProfile();
  };

  const createStudentProfile = async () => {
    setLoading(true);

    const { data: { session } } = await supabase.auth.getSession();
    const user = session?.user;
    if (!user) return router.push("/signin");

    await supabase.from("profiles").insert({
      id: user.id,
      email: emailFromCallback,
      full_name: user.user_metadata.full_name || "",
      role: "student",
      is_verified_alumni: false
    });

    toast.success("Welcome Student!");
    router.push("/studentprofile");
  };

  const verifyAlumni = async () => {
    setAlumniError("");
    setAlumniLoading(true);

    const { data, error } = await supabase
      .from("alumni_verified_list")
      .select("Email")
      .eq("Email", alumniEmail.trim())
      .single();

    setAlumniLoading(false);

    if (error || !data) {
      setAlumniError("Email not found in alumni list");
      return;
    }

    setAlumniModal(false);
    createAlumniProfile();
  };

  const createAlumniProfile = async () => {
    setLoading(true);

    const { data: { session } } = await supabase.auth.getSession();
    const user = session?.user;
    if (!user) return router.push("/signin");

    await supabase.from("profiles").insert({
      id: user.id,
      email: alumniEmail.trim(),
      full_name: user.user_metadata.full_name || "",
      role: "alumni",
      is_verified_alumni: true
    });

    toast.success("Welcome Alumni!");
    router.push("/profile");
  };

  return (
    <>
      {role === null && (
        <RoleSelectionModal
          onSelect={handleRoleSelect}
          onClose={() => router.push("/")}
        />
      )}

      {alumniModal && (
        <AlumniEmailModal
          email={alumniEmail}
          setEmail={setAlumniEmail}
          onVerify={verifyAlumni}
          loading={alumniLoading}
          error={alumniError}
          onClose={() => setAlumniModal(false)}
   // important for locking Google email
        />
      )}

      {loading && (
        <div className="flex items-center justify-center min-h-screen">
          <Loader />
        </div>
      )}
    </>
  );
}
