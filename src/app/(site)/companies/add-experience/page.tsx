export const dynamic = "force-dynamic";

import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import AddExperienceForm from "./AddExperienceForm";
import Link from "next/link";

export default async function AddExperiencePage() {
  const supabase = createServerComponentClient({ cookies });

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return (
      <div className="p-10 text-center">
        <p className="text-xl">You must be logged in.</p>
        <Link href="/auth/signin" className="text-blue-600 underline">
          Sign In
        </Link>
      </div>
    );
  }

  // Fetch profile (use maybeSingle to avoid error when profile row does not exist)
  const { data: profile } = await supabase
    .from("profiles")
    .select("role, is_verified_alumni")
    .eq("id", user.id)
    .maybeSingle();

  if (!(profile?.role === "alumni" && profile?.is_verified_alumni)) {
    return (
      <div className="p-10 text-center">
        <p className="text-xl">Only verified alumni can post experiences.</p>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto p-10">
      <h1 className="text-3xl font-bold mb-8">Share Your Interview Experience</h1>
      <AddExperienceForm userId={user.id} />
    </div>
  );
}
