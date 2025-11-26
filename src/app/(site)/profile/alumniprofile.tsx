"use client";

import React from "react";
import Image from "next/image";
import {
  Briefcase,
  MapPin,
  MessageSquare,
  BookOpen,
  Edit,
  GraduationCap,
  Award,
  Link as LinkIcon,
} from "lucide-react";

// TEMPORARY — replace with Supabase fetch soon
const userData = {
  name: "Sarah Johnson",
  role: "Alumni",
  avatarUrl:
    "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=200&h=200&fit=crop&q=80",
  bio: "Software Engineer at TechCorp. Passionate about mentoring students.",
  course: "B.Tech Computer Science",
  gradYear: 2018,
  location: "San Francisco, CA",
  company: "TechCorp",
  currentJob: "Software Engineer",
  stats: {
    resources: 18,
    posts: 42,
    upvotes: 230,
  },
};

const userResources = [
  { id: 1, title: "DSA Notes", type: "PDF" },
  { id: 2, title: "System Design Guide", type: "Link" },
];

const userActivity = [
  { id: 1, type: "answered", text: "How to deploy Next.js app?" },
  { id: 2, type: "asked", text: "Best auth in 2025?" },
];

export default function AlumniProfile({ userId }: { userId: string }) {
  return (
    <div className="bg-gray-50 min-h-screen pt-48 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* LEFT CARD */}
        <aside className="bg-white rounded-lg shadow-lg p-6 relative">
          <button className="absolute top-4 right-4 text-gray-400 hover:text-indigo-600 transition-colors">
            <Edit className="w-5 h-5" />
          </button>

          <div className="flex flex-col items-center">
            <Image
              src={userData.avatarUrl}
              alt={userData.name}
              width={128}
              height={128}
              className="rounded-full object-cover mb-4 shadow-md"
            />

            <h1 className="text-2xl font-bold text-gray-900">
              {userData.name}
            </h1>

            <span className="px-3 py-1 mt-2 rounded-full text-sm font-semibold bg-indigo-100 text-indigo-800">
              Alumni
            </span>

            <p className="text-center text-gray-600 mt-4">{userData.bio}</p>
          </div>

          {/* DETAILS */}
          <div className="mt-6 border-t border-gray-200 pt-6">
            <h3 className="text-sm font-medium text-gray-500 uppercase">
              Details
            </h3>
            <ul className="mt-2 space-y-3">
              <li className="flex items-center text-gray-700">
                <GraduationCap className="w-5 h-5 mr-3 text-gray-400" />
                <span>{userData.course}</span>
              </li>

              <li className="flex items-center text-gray-700">
                <Award className="w-5 h-5 mr-3 text-gray-400" />
                <span>Class of {userData.gradYear}</span>
              </li>

              <li className="flex items-center text-gray-700">
                <MapPin className="w-5 h-5 mr-3 text-gray-400" />
                <span>{userData.location}</span>
              </li>

              <li className="flex items-center text-gray-700">
                <Briefcase className="w-5 h-5 mr-3 text-gray-400" />
                <span>
                  {userData.currentJob} at <strong>{userData.company}</strong>
                </span>
              </li>
            </ul>
          </div>
        </aside>

        {/* RIGHT COLUMN */}
        <main className="lg:col-span-2 space-y-8">
          {/* QUICK STATS */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <StatCard
              title="Resources Shared"
              value={userData.stats.resources}
              icon={BookOpen}
            />
            <StatCard
              title="Forum Posts"
              value={userData.stats.posts}
              icon={MessageSquare}
            />
            <StatCard
              title="Upvotes Received"
              value={userData.stats.upvotes}
              icon={Award}
            />
          </div>

          {/* SHARED RESOURCES */}
          <section className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">
              Shared Resources
            </h2>
            <ul className="space-y-4">
              {userResources.map((res) => (
                <li
                  key={res.id}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-md hover:bg-gray-100"
                >
                  <div className="flex items-center">
                    <LinkIcon className="w-5 h-5 mr-3 text-indigo-600" />
                    <span className="text-gray-800 font-medium">
                      {res.title}
                    </span>
                  </div>
                  <span className="text-xs font-semibold text-gray-500 bg-gray-200 px-2 py-0.5 rounded-full">
                    {res.type}
                  </span>
                </li>
              ))}
            </ul>
          </section>

          {/* FORUM ACTIVITY */}
          <section className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">
              Recent Forum Activity
            </h2>
            <ul className="space-y-4">
              {userActivity.map((act) => (
                <li key={act.id} className="flex items-start p-3">
                  <span
                    className={`mr-3 mt-1 px-2 py-0.5 rounded text-xs font-semibold ${
                      act.type === "answered"
                        ? "bg-green-100 text-green-800"
                        : "bg-blue-100 text-blue-800"
                    }`}
                  >
                    {act.type}
                  </span>
                  <p className="text-gray-700">{act.text}</p>
                </li>
              ))}
            </ul>
          </section>
        </main>
      </div>
    </div>
  );
}

function StatCard({
  title,
  value,
  icon: Icon,
}: {
  title: string;
  value: number;
  icon: React.ElementType;
}) {
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
