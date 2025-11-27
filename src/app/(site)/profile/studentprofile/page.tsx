"use client";

import { useEffect, useState } from "react";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { UsersRound, Bookmark, Settings, LogOut, Edit } from "lucide-react";
import EditProfileModal from "@/components/Profile/EditProfileModal";
import { getAvatarColor } from "@/utils/getAvatarColor";

export default function StudentProfilePage() {
  const supabase = createClientComponentClient();

  const [authUser, setAuthUser] = useState<any>(null);
  const [profile, setProfile] = useState<any>(null);
  const [showEdit, setShowEdit] = useState(false);

  // ------------------------------------
  // Load Profile
  // ------------------------------------
  useEffect(() => {
    async function load() {
      const { data: { user } } = await supabase.auth.getUser();
      setAuthUser(user);

      if (!user) return;

      const { data } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .single();

      setProfile(data);
    }
    load();
  }, []);

  if (!authUser || !profile) {
    return <div className="pt-48 text-center text-xl font-semibold">Loading…</div>;
  }

  // ------------------------------------
  // Extract initials safely
  // ------------------------------------
  function getInitials(name?: string, email?: string) {
    if (typeof name === "string" && name.trim().length > 0) {
      return name
        .trim()
        .split(/\s+/)
        .map((w) => w[0])
        .join("")
        .toUpperCase();
    }
    if (typeof email === "string" && email.includes("@")) {
      return email[0].toUpperCase();
    }
    return "U";
  }

  const initials = getInitials(profile.full_name, authUser.email);
  const avatarColor = getAvatarColor(authUser.id); // same color everywhere

  // ------------------------------------
  // Logout
  // ------------------------------------
  async function handleLogout() {
    await supabase.auth.signOut();
    window.location.href = "/auth/signin";
  }

  // ------------------------------------
  // UI
  // ------------------------------------
  return (
    <>
      {showEdit && (
        <EditProfileModal
          user={authUser}
          profile={profile}
          onClose={() => setShowEdit(false)}
        />
      )}

      <div className="bg-gray-50 min-h-screen pt-48 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">

          {/* LEFT PROFILE CARD */}
          <aside className="bg-white rounded-xl shadow-lg p-6 relative">
            
            {/* Edit Button */}
            <button
              onClick={() => setShowEdit(true)}
              className="absolute top-4 right-4 text-gray-400 hover:text-indigo-600 transition"
            >
              <Edit className="w-5 h-5" />
            </button>

            {/* Avatar Initials */}
            <div
              className={`w-32 h-32 rounded-full flex items-center justify-center text-4xl font-bold mx-auto mb-4 text-white shadow ${avatarColor}`}
            >
              {initials}
            </div>

            <h1 className="text-2xl font-bold text-center">
              {profile.full_name}
            </h1>

            <p className="text-sm text-center text-blue-700 bg-blue-100 px-3 py-1 rounded-full mt-2 inline-block mx-auto">
              Student
            </p>

            <p className="mt-4 text-center text-gray-700">
              {profile.bio || "No bio added yet."}
            </p>
          </aside>

          {/* RIGHT CONTENT */}
          <main className="lg:col-span-2 space-y-8">

            {/* Bookmarked Resources */}
            <section className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition">
              <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <Bookmark className="w-5 h-5 text-blue-500" />
                Bookmarked Resources
              </h2>
              <p className="text-gray-600">No bookmarks yet.</p>
            </section>

            {/* Recently Viewed Alumni */}
            <section className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition">
              <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <UsersRound className="w-5 h-5 text-blue-500" />
                Recently Viewed Alumni
              </h2>
              <p className="text-gray-600">No recently viewed alumni.</p>
            </section>

            {/* Settings */}
            <section className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition">
              <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <Settings className="w-5 h-5 text-blue-500" /> Settings
              </h2>

              <button
                onClick={handleLogout}
                className="w-full bg-red-600 hover:bg-red-700 text-white py-3 rounded-xl text-lg font-medium shadow-md transition"
              >
                Logout
              </button>
            </section>
          </main>

        </div>
      </div>
    </>
  );
}
