"use client";

import { useEffect, useState } from "react";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { UsersRound, Bookmark, LogOut, Edit } from "lucide-react";
import EditProfileModal from "@/components/Profile/EditProfileModal";

export default function StudentProfilePage() {
  const supabase = createClientComponentClient();

  const [authUser, setAuthUser] = useState<any>(null);
  const [profile, setProfile] = useState<any>(null);
  const [bookmarkedResources, setBookmarkedResources] = useState<any[]>([]);
  const [recentAlumni, setRecentAlumni] = useState<any[]>([]);
  const [showEdit, setShowEdit] = useState(false);

  useEffect(() => {
    async function load() {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      setAuthUser(user);
      if (!user) return;

      // PROFILE
      const { data: profileData } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .single();

      setProfile(profileData);

      // BOOKMARKED RESOURCES
      const { data: bookmarkData } = await supabase
        .from("resource_bookmarks")
        .select("resource:resource_id(*)")
        .eq("user_id", user.id);

      setBookmarkedResources((bookmarkData || []).map((b) => b.resource));

      // FETCH ONLY TOP 3 MOST RECENT ALUMNI
      const { data: alumniList } = await supabase
        .from("profiles")
        .select("id, full_name, current_role, company_id, passing_year")
        .eq("role", "alumni")
        .order("updated_at", { ascending: false })
        .limit(3);   // 🔥 TOP 3 ONLY

      setRecentAlumni(alumniList || []);
    }

    load();
  }, []);

  if (!authUser || !profile) {
    return (
      <div className="pt-48 text-center text-xl font-semibold">
        Loading…
      </div>
    );
  }

  // Initials
  function getInitials(name?: string, email?: string) {
    if (name) return name.split(" ").map((w) => w[0]).join("").toUpperCase();
    return email?.charAt(0)?.toUpperCase() || "U";
  }

  const initials = getInitials(profile.full_name, authUser.email);
  const avatarGradient = "bg-gradient-to-r from-indigo-500 to-purple-500";

  // LOGOUT
  async function handleLogout() {
    await supabase.auth.signOut();
    window.location.href = "/auth/signin";
  }

  return (
    <>
      {showEdit && (
        <EditProfileModal
          user={authUser}
          profile={profile}
          onClose={() => setShowEdit(false)}
        />
      )}

      <div className="bg-gray-50 min-h-screen pt-40 md:pt-48 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-14">

          {/* LEFT SIDE */}
          <aside className="bg-white rounded-3xl shadow-xl p-10 pb-16 relative flex flex-col items-center">
            <button
              onClick={() => setShowEdit(true)}
              className="absolute top-6 right-6 text-gray-400 hover:text-indigo-600 transition"
            >
              <Edit className="w-6 h-6" />
            </button>

            <div
              className={`w-32 h-32 rounded-full flex items-center justify-center 
                text-4xl font-extrabold text-white shadow-lg ${avatarGradient}`}
            >
              {initials}
            </div>

            <h1 className="mt-5 text-2xl font-extrabold text-center text-gray-900">
              {profile.full_name}
            </h1>

            <span className="mt-2 px-4 py-1 rounded-full bg-indigo-100 text-indigo-700 text-sm font-medium">
              Student
            </span>

            <p className="mt-5 text-center text-gray-600">
              {profile.bio || "No bio added yet."}
            </p>

            <p className="mt-2 text-center text-gray-500 text-sm">
              Batch of {profile.passing_year || "N/A"}
            </p>
          </aside>

          {/* RIGHT SIDE */}
          <main className="lg:col-span-2 space-y-14">

            {/* BOOKMARKED RESOURCES */}
            <section className="bg-white rounded-3xl shadow-xl p-10">
              <h2 className="text-xl font-bold flex items-center gap-3 text-gray-900 mb-6">
                <Bookmark className="w-6 h-6 text-indigo-600" />
                Bookmarked Resources
              </h2>

              {bookmarkedResources.length === 0 ? (
                <p className="text-gray-600">No bookmarked resources yet.</p>
              ) : (
                <ul className="space-y-4">
                  {bookmarkedResources.map((res) => (
                    <li
                      key={res.id}
                      className="p-4 bg-gray-50 border rounded-xl shadow-sm hover:shadow-md transition"
                    >
                      <p className="font-semibold text-gray-900">
                        {res.title}
                      </p>
                      {res.description && (
                        <p className="text-sm text-gray-600 mt-1">
                          {res.description}
                        </p>
                      )}
                    </li>
                  ))}
                </ul>
              )}
            </section>

            {/* TOP 3 ALUMNI */}
            <section className="bg-white rounded-3xl shadow-xl p-10">
              <h2 className="text-xl font-bold flex items-center gap-3 text-gray-900 mb-6">
                <UsersRound className="w-6 h-6 text-indigo-600" />
                Recently Viewed Alumni
              </h2>

              {recentAlumni.length === 0 ? (
                <p className="text-gray-600">No alumni found.</p>
              ) : (
                <ul className="space-y-6">
                  {recentAlumni.map((item) => (
                    <li
                      key={item.id}
                      className="flex items-center gap-4 p-4 bg-gray-50 border rounded-xl shadow-sm hover:shadow-md transition"
                    >
                      <div className="w-12 h-12 rounded-full bg-indigo-600 flex items-center justify-center text-white font-bold">
                        {getInitials(item.full_name)}
                      </div>

                      <div>
                        <p className="font-semibold text-gray-900">
                          {item.full_name}
                        </p>

                        <p className="text-sm text-gray-500">
                          {item.current_role || "Working"} at{" "}
                          <span className="font-medium">
                            {item.company_id || "Unknown Company"}
                          </span>
                        </p>

                        <p className="text-xs text-gray-400">
                          Batch of {item.passing_year || "N/A"}
                        </p>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </section>

            {/* LOGOUT */}
            <div className="flex justify-center mt-4">
              <button
                onClick={handleLogout}
                className="w-80 py-4 flex items-center justify-center gap-3 
                text-white font-semibold text-lg rounded-2xl
                bg-gradient-to-r from-indigo-500 to-purple-500 shadow-lg hover:scale-105 transition"
              >
                <LogOut className="w-6 h-6 text-white" />
                Logout
              </button>
            </div>

          </main>
        </div>
      </div>
    </>
  );
}
