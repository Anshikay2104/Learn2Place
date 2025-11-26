import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";

import AlumniProfile from "./alumniprofile";
import StudentProfile from "./studentprofile";

export const dynamic = "force-dynamic";

export default async function ProfileRouterPage() {
  const supabase = createServerComponentClient({ cookies });

  // Get logged-in user
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user)
    return (
      <div className="pt-48 text-center text-lg">
        Please log in to view your profile.
      </div>
    );

  // Fetch user profile
  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  if (!profile) {
    return (
      <div className="pt-48 text-center text-lg">
        Profile not found in database.
      </div>
    );
  }

  // STUDENT
  if (profile.role === "student") {
    return <StudentProfile userId={user.id} />;
  }

  // ALUMNI
  if (profile.role === "alumni") {
    return <AlumniProfile userId={user.id} />;
  }

  // DEFAULT → student
  return <StudentProfile userId={user.id} />;
}
