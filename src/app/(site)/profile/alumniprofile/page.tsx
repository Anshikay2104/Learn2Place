"use client";

import { useEffect, useState } from "react";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";

import {
  Briefcase,
  MessageSquare,
  BookOpen,
  Edit,
  GraduationCap,
  Award,
  LogOut,
} from "lucide-react";

import EditProfileModal from "@/components/Profile/EditProfileModal";

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
    questions: [] as any[],
    answers: [] as any[],
  });

  useEffect(() => {
    async function loadPage() {
      const { data: { user } } = await supabase.auth.getUser();
      setAuthUser(user);
      if (!user) return;

      // ------- LOAD PROFILE -------
      const { data: profileData } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .single();

      setProfile(profileData);

      // ------- RESOURCES -------
      const { count: resourcesCount } = await supabase
        .from("resources")
        .select("*", { count: "exact", head: true })
        .eq("user_id", user.id);

      // ------- QUESTIONS -------
      const { count: questionCount } = await supabase
        .from("questions")
        .select("*", { count: "exact", head: true })
        .eq("asker_id", user.id);

      // ------- ANSWERS -------
      const { count: answerCount } = await supabase
        .from("answers")
        .select("*", { count: "exact", head: true })
        .eq("responder_id", user.id);

      // ------- UPVOTES -------
      const { data: userQuestions } = await supabase
        .from("questions")
        .select("id")
        .eq("asker_id", user.id);

      const { data: userAnswers } = await supabase
        .from("answers")
        .select("id")
        .eq("responder_id", user.id);

      const questionIds = userQuestions?.map(q => q.id) || [];
      const answerIds = userAnswers?.map(a => a.id) || [];

      const { count: qUpvotes } = await supabase
        .from("votes")
        .select("*", { count: "exact", head: true })
        .eq("target_type", "question")
        .eq("vote", 1)
        .in("target_id", questionIds);

      const { count: aUpvotes } = await supabase
        .from("votes")
        .select("*", { count: "exact", head: true })
        .eq("target_type", "answer")
        .eq("vote", 1)
        .in("target_id", answerIds);

      setStats({
        resources: resourcesCount || 0,
        posts: (questionCount || 0) + (answerCount || 0),
        upvotes: (qUpvotes || 0) + (aUpvotes || 0),
      });

      // ------- RESOURCES LIST -------
      const { data: userResources } = await supabase
        .from("resources")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      setResources(userResources || []);

      // ------- ACTIVITY -------
      const { data: recentQ } = await supabase
        .from("questions")
        .select("*")
        .eq("asker_id", user.id)
        .order("created_at", { ascending: false })
        .limit(5);

      const { data: recentA } = await supabase
        .from("answers")
        .select("*")
        .eq("responder_id", user.id)
        .order("created_at", { ascending: false })
        .limit(5);

      setActivity({
        questions: recentQ || [],
        answers: recentA || [],
      });
    }

    loadPage();
  }, []);

  if (!authUser || !profile) {
    return (
      <div className="pt-40 md:pt-48 text-center text-xl font-semibold text-gray-600">
        Loading Profile...
      </div>
    );
  }

  function getInitials(name: string, email: string) {
    if (name) return name.split(" ").map(w => w[0]).join("").toUpperCase();
    return email?.charAt(0).toUpperCase() || "U";
  }

  const initials = getInitials(profile.full_name, authUser.email);

  async function handleLogout() {
    await supabase.auth.signOut();
    window.location.href = "/auth/signin";
  }

  return (
    <div className="bg-gray-50 min-h-screen pt-40 md:pt-48 px-4 sm:px-6 lg:px-8">
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

      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-14">

        {/* LEFT CARD ====================================================== */}
        <aside className="bg-white rounded-3xl shadow-xl p-8 relative">
          <button
            onClick={() => setShowEdit(true)}
            className="absolute top-5 right-5 text-gray-400 hover:text-indigo-600 transition"
          >
            <Edit className="w-6 h-6" />
          </button>

          <div className="flex flex-col items-center">
            <div className="w-32 h-32 rounded-full bg-indigo-600 text-white flex items-center justify-center text-4xl font-extrabold shadow-lg">
              {initials}
            </div>

            <h1 className="mt-5 text-2xl font-extrabold text-gray-900">
              {profile.full_name}
            </h1>

            <span className="mt-3 px-4 py-1 rounded-full bg-indigo-100 text-indigo-700 font-semibold text-sm">
              Alumni
            </span>

            <p className="mt-4 text-gray-600 text-center leading-relaxed">
              {profile.bio || "No bio added."}
            </p>
          </div>

          <div className="mt-8 pt-6 border-t border-gray-200">
            <h3 className="text-sm font-semibold text-gray-500 tracking-wide">DETAILS</h3>

            <ul className="mt-4 space-y-4 text-gray-700">
              <li className="flex items-center">
                <GraduationCap className="w-5 h-5 mr-3 text-gray-400" />
                <span>Class of {profile.passing_year || "N/A"}</span>
              </li>

              <li className="flex items-center">
                <Briefcase className="w-5 h-5 mr-3 text-gray-400" />
                <span>
                  {profile.current_role || "Role not added"} at{" "}
                  <strong>{profile.company_id || "Company not added"}</strong>
                </span>
              </li>
            </ul>
          </div>
        </aside>

        {/* RIGHT CONTENT ================================================== */}
        <main className="lg:col-span-2 space-y-10">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <StatCard title="Resources Shared" value={stats.resources} icon={BookOpen} />
            <StatCard title="Forum Posts" value={stats.posts} icon={MessageSquare} />
            <StatCard title="Upvotes Received" value={stats.upvotes} icon={Award} />
          </div>

          {/* Shared Resources */}
          <section className="bg-white rounded-3xl shadow-xl p-8">
            <h2 className="text-xl font-bold text-gray-900 mb-6">Shared Resources</h2>

            {resources.length === 0 ? (
              <p className="text-gray-500">No resources shared yet.</p>
            ) : (
              <ul className="space-y-4">
                {resources.map((res) => (
                  <li
                    key={res.id}
                    className="p-4 bg-gray-50 rounded-xl border hover:shadow-md transition"
                  >
                    <p className="font-semibold text-gray-900">{res.title}</p>
                    {res.description && (
                      <p className="text-gray-600 text-sm mt-1">{res.description}</p>
                    )}
                  </li>
                ))}
              </ul>
            )}
          </section>

          {/* Activity */}
          <section className="bg-white rounded-3xl shadow-xl p-8">
            <h2 className="text-xl font-bold text-gray-900 mb-6">Recent Forum Activity</h2>

            {activity.questions.length === 0 && activity.answers.length === 0 ? (
              <p className="text-gray-500">No activity yet.</p>
            ) : (
              <div className="space-y-5">
                {activity.questions.map((q) => (
                  <div
                    key={q.id}
                    className="p-4 bg-gray-50 border rounded-xl hover:shadow-md transition"
                  >
                    <p className="font-semibold">{q.title}</p>
                    <p className="text-gray-500 text-sm">
                      {new Date(q.created_at).toLocaleString()}
                    </p>
                  </div>
                ))}

                {activity.answers.map((a) => (
                  <div
                    key={a.id}
                    className="p-4 bg-gray-50 border rounded-xl hover:shadow-md transition"
                  >
                    <p className="font-medium text-indigo-700">Answered a question</p>
                    <p className="text-gray-600 text-sm">{(a.body || "").slice(0, 100)}...</p>
                  </div>
                ))}
              </div>
            )}
          </section>

          {/* LOGOUT */}
          <div className="flex justify-center">
            <button
              onClick={handleLogout}
              className="w-72 py-4 flex items-center justify-center gap-3 
                         text-white font-semibold text-lg rounded-2xl
                         bg-gradient-to-r from-indigo-500 to-purple-500
                         shadow-lg hover:scale-105 transition"
            >
              <LogOut className="w-6 h-6 text-white" />
              Logout
            </button>
          </div>
        </main>
      </div>
    </div>
  );
}

function StatCard({ title, value, icon: Icon }) {
  return (
    <div className="bg-white rounded-3xl shadow-xl p-6 flex items-center gap-4 hover:shadow-2xl transition">
      <div className="bg-indigo-100 p-4 rounded-full">
        <Icon className="w-7 h-7 text-indigo-600" />
      </div>

      <div>
        <p className="text-sm text-gray-500 font-medium">{title}</p>
        <p className="text-3xl font-bold text-gray-900">{value}</p>
      </div>
    </div>
  );
}
