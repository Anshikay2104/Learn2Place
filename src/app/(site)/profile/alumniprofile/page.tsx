"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";

import {
  Briefcase,
  MapPin,
  MessageSquare,
  BookOpen,
  Edit,
  GraduationCap,
  Award,
} from "lucide-react";

import EditProfileModal from "@/components/Profile/EditProfileModal";

// ==============================================================
//                   ALUMNI PROFILE PAGE (FULLY WORKING)
// ==============================================================

export default function AlumniProfilePage() {
  const supabase = createClientComponentClient();

  const [authUser, setAuthUser] = useState<any>(null);
  const [profile, setProfile] = useState<any>(null);
  const [showEdit, setShowEdit] = useState(false);

  const [stats, setStats] = useState({
    resources: 0,
    posts: 0,
    upvotes: 0,
  });

  const [resources, setResources] = useState<any[]>([]);
  const [activity, setActivity] = useState({
    questions: [],
    answers: [],
  });

  // ==============================================================
  // Fetch profile + stats + activity
  // ==============================================================
  useEffect(() => {
    async function loadPage() {
      const { data: { user } } = await supabase.auth.getUser();
      setAuthUser(user);

      if (!user) return;

      // 👉 Load Profile
      const { data: profileData } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .single();

      setProfile(profileData);

      // 👉 Load Resources Count
      const { count: resourcesCount } = await supabase
        .from("resources")
        .select("*", { count: "exact", head: true })
        .eq("user_id", user.id);

      // 👉 Load Forum Question Count
      const { count: postsCount } = await supabase
        .from("forum_questions")
        .select("*", { count: "exact", head: true })
        .eq("user_id", user.id);

      // 👉 Load IDs of user’s questions + answers
      const { data: userQuestions } = await supabase
        .from("forum_questions")
        .select("id")
        .eq("user_id", user.id);

      const { data: userAnswers } = await supabase
        .from("forum_answers")
        .select("id")
        .eq("user_id", user.id);

      const questionIds = userQuestions?.map((q) => q.id) || [];
      const answerIds = userAnswers?.map((a) => a.id) || [];

      // 👉 Upvotes on questions
      const { count: qUpvotes } = await supabase
        .from("votes")
        .select("*", { count: "exact", head: true })
        .eq("vote", 1)
        .eq("target_type", "question")
        .in("target_id", questionIds);

      // 👉 Upvotes on answers
      const { count: aUpvotes } = await supabase
        .from("votes")
        .select("*", { count: "exact", head: true })
        .eq("vote", 1)
        .eq("target_type", "answer")
        .in("target_id", answerIds);

      // 👉 Save Stats
      setStats({
        resources: resourcesCount || 0,
        posts: postsCount || 0,
        upvotes: (qUpvotes || 0) + (aUpvotes || 0),
      });

      // 👉 Load Shared Resources
      const { data: userResources } = await supabase
        .from("resources")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      setResources(userResources || []);

      // 👉 Load Recent Activity
      const { data: recentQ } = await supabase
        .from("forum_questions")
        .select("id, title, created_at")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false })
        .limit(5);

      const { data: recentA } = await supabase
        .from("forum_answers")
        .select("id, body, created_at, question_id")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false })
        .limit(5);

      // setActivity({
      //   questions: recentQ || [],
      //   answers: recentA || [],
      // });
    }

    loadPage();
  }, []);

  if (!authUser || !profile) {
    return (
      <div className="pt-48 text-center text-xl font-semibold">
        Loading Profile...
      </div>
    );
  }

  // SAFE INITIALS
  function getInitials(name: any, email: any) {
    if (typeof name === "string" && name.trim().length > 0) {
      return name
        .trim()
        .split(/\s+/)
        .map((w: string) => w[0])
        .join("")
        .toUpperCase();
    }
    if (typeof email === "string" && email.includes("@")) {
      return email[0].toUpperCase();
    }
    return "U";
  }

  const initials = getInitials(profile.full_name, authUser.email);

  // LOGOUT
  async function handleLogout() {
    await supabase.auth.signOut();
    window.location.href = "/auth/signin";
  }

  return (
    <>
      {/* EDIT PROFILE MODAL */}
      {showEdit && (
        <EditProfileModal
          user={authUser}
          profile={profile}
          onClose={() => {
            setShowEdit(false);
            window.location.reload();
          }}
        />
      )}

      {/* MAIN LAYOUT */}
      <div className="bg-gray-50 min-h-screen pt-48 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">

          {/* LEFT PROFILE CARD */}
          <aside className="bg-white rounded-lg shadow-lg p-6 relative">
            <button
              onClick={() => setShowEdit(true)}
              className="absolute top-4 right-4 text-gray-400 hover:text-indigo-600 transition"
            >
              <Edit className="w-5 h-5" />
            </button>

            <div className="flex flex-col items-center">
              <div className="w-32 h-32 rounded-full bg-indigo-600 text-white flex items-center justify-center text-4xl font-bold mb-4">
                {initials}
              </div>

              <h1 className="text-2xl font-bold text-gray-900">
                {profile.full_name}
              </h1>

              <span className="px-3 py-1 mt-2 rounded-full text-sm font-semibold bg-indigo-100 text-indigo-800">
                Alumni
              </span>

              <p className="text-center text-gray-600 mt-4">
                {profile.bio || "No bio added."}
              </p>
            </div>

            {/* DETAILS */}
            <div className="mt-6 border-t border-gray-200 pt-6">
              <h3 className="text-sm font-medium text-gray-500 uppercase">
                Details
              </h3>

              <ul className="mt-2 space-y-3">
                <li className="flex items-center text-gray-700">
                  <GraduationCap className="w-5 h-5 mr-3 text-gray-400" />
                  <span>B.Tech Computer Science</span>
                </li>

                <li className="flex items-center text-gray-700">
                  <Award className="w-5 h-5 mr-3 text-gray-400" />
                  <span>Class of {profile.passing_year || "N/A"}</span>
                </li>

                <li className="flex items-center text-gray-700">
                  <MapPin className="w-5 h-5 mr-3 text-gray-400" />
                  <span>{profile.location || "Location not set"}</span>
                </li>

                <li className="flex items-center text-gray-700">
                  <Briefcase className="w-5 h-5 mr-3 text-gray-400" />
                  <span>
                    {profile.currentJob || "Job not added"} at{" "}
                    <strong>{profile.company_id || "Company not added"}</strong>
                  </span>
                </li>
              </ul>
            </div>
          </aside>

          {/* RIGHT SIDE CONTENT */}
          <main className="lg:col-span-2 space-y-8">
            {/* STATS */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <StatCard title="Resources Shared" value={stats.resources} icon={BookOpen} />
              <StatCard title="Forum Posts" value={stats.posts} icon={MessageSquare} />
              <StatCard title="Upvotes Received" value={stats.upvotes} icon={Award} />
            </div>

            {/* SHARED RESOURCES */}
            <section className="bg-white rounded-lg shadow-lg p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Shared Resources</h2>

              {resources.length === 0 ? (
                <p>No resources shared yet.</p>
              ) : (
                <ul className="space-y-4">
                  {resources.map((res) => (
                    <li key={res.id} className="p-4 border rounded-lg">
                      <p className="font-semibold">{res.title}</p>
                      <p className="text-gray-600 text-sm">{res.description}</p>
                    </li>
                  ))}
                </ul>
              )}
            </section>

            {/* ACTIVITY */}
            <section className="bg-white rounded-lg shadow-lg p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Recent Forum Activity</h2>

              {activity.questions.length === 0 && activity.answers.length === 0 ? (
                <p>No activity yet.</p>
              ) : (
                <div className="space-y-4">
                  {/* QUESTIONS */}
                  {activity.questions.map((q: any) => (
                    <div key={q.id} className="p-4 border rounded-lg">
                      <p className="font-semibold">{q.title}</p>
                      <p className="text-gray-500 text-sm">{new Date(q.created_at).toLocaleString()}</p>
                    </div>
                  ))}

                  {/* ANSWERS */}
                  {activity.answers.map((a: any) => (
                    <div key={a.id} className="p-4 border rounded-lg">
                      <p className="font-medium">Answered a question</p>
                      <p className="text-gray-600 text-sm">{a.body.slice(0, 120)}...</p>
                    </div>
                  ))}
                </div>
              )}
            </section>

            {/* LOGOUT */}
            <button
              onClick={handleLogout}
              className="w-full bg-red-600 hover:bg-red-700 text-white py-3 rounded-xl text-lg font-medium shadow-md"
            >
              Logout
            </button>
          </main>
        </div>
      </div>
    </>
  );
}

// ==============================================================
//   STAT CARD COMPONENT
// ==============================================================
type StatCardProps = {
  title: string;
  value: number;
  icon: React.ElementType;
};

function StatCard({ title, value, icon: Icon }: StatCardProps) {
  return (
    <div className="bg-white rounded-lg shadow-lg p-5 flex items-center">
      <div className="bg-indigo-100 p-3 rounded-full mr-4">
        <Icon className="w-6 h-6 text-indigo-600" />
      </div>

      <div>
        <p className="text-sm font-medium text-gray-500">{title}</p>
        <p className="text-2xl font-bold text-gray-900">{value}</p>
      </div>
    </div>
  );
}
