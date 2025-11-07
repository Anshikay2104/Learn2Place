"use client";
import React, { useState } from "react";
import Image from "next/image";
import { 
  Bookmark, 
  BookOpen, 
  Moon, 
  Sun, 
  Settings, 
  LogOut, 
  UsersRound, 
  GraduationCap, 
  Sparkles, 
  User 
} from "lucide-react";

// --- DUMMY DATA ---
// (Later, replace this with dynamic user info fetched from backend)
const studentData = {
  id: "student101",
  name: "Aarushi Mehta",
  role: "Student",
  avatarUrl:
    "https://images.unsplash.com/photo-1607746882042-944635dfe10e?w=200&h=200&fit=crop&q=80",
  bio: "3rd Year Computer Science student. Passionate about AI, web development, and connecting with alumni mentors.",
  course: "B.Tech CSE",
  batch: "2026",
  bookmarks: [
    { id: 1, title: "Full Stack Roadmap", type: "PDF" },
    { id: 2, title: "React + Next.js Notes", type: "Link" },
    { id: 3, title: "DSA Problem Sheet", type: "PDF" },
  ],
  recentlyViewedAlumni: [
    {
      id: "al1",
      name: "Priya Sharma",
      role: "Software Engineer",
      company: "Microsoft",
      avatar:
        "https://images.unsplash.com/photo-1502685104226-ee32379fefbe?w=100&h=100&fit=crop&q=80",
    },
    {
      id: "al2",
      name: "Ritika Agarwal",
      role: "Data Scientist",
      company: "Google",
      avatar:
        "https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?w=100&h=100&fit=crop&q=80",
    },
  ],
};

export default function StudentProfilePage() {
  const [darkMode, setDarkMode] = useState(false);

  return (
    <div className={`${darkMode ? "bg-gray-900 text-white" : "bg-gray-50 text-gray-900"} min-h-screen pt-48 px-4 sm:px-6 lg:px-8 transition-all`}>
      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">

        {/* === LEFT COLUMN: STUDENT CARD === */}
        <aside className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 relative">
          <div className="flex flex-col items-center text-center">
            <Image
              src={studentData.avatarUrl}
              alt={studentData.name}
              width={120}
              height={120}
              className="rounded-full shadow-md mb-4"
            />
            <h1 className="text-2xl font-bold">{studentData.name}</h1>
            <span className="text-sm bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-200 px-3 py-1 rounded-full mt-2 font-semibold">
              {studentData.role}
            </span>
            <p className="mt-4 text-gray-600 dark:text-gray-300">{studentData.bio}</p>
          </div>

          <div className="mt-6 border-t border-gray-200 dark:border-gray-700 pt-4 space-y-3">
            <div className="flex items-center gap-3 text-gray-700 dark:text-gray-300">
              <GraduationCap className="w-5 h-5 text-blue-500" />
              <span>{studentData.course}</span>
            </div>
            <div className="flex items-center gap-3 text-gray-700 dark:text-gray-300">
              <Sparkles className="w-5 h-5 text-blue-500" />
              <span>Batch of {studentData.batch}</span>
            </div>
          </div>
        </aside>

        {/* === RIGHT COLUMN === */}
        <main className="lg:col-span-2 space-y-8">

          {/* --- Bookmarked Resources --- */}
          <section className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg">
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <Bookmark className="w-5 h-5 text-blue-500" /> Bookmarked Resources
            </h2>
            {studentData.bookmarks.length > 0 ? (
              <ul className="space-y-3">
                {studentData.bookmarks.map((res) => (
                  <li key={res.id} className="flex items-center justify-between bg-gray-50 dark:bg-gray-700 p-3 rounded-md">
                    <span className="font-medium">{res.title}</span>
                    <span className="text-xs font-semibold bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-300 px-2 py-0.5 rounded-full">{res.type}</span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-500">You haven't bookmarked anything yet.</p>
            )}
          </section>

          {/* --- Recently Viewed Alumni Posts --- */}
          <section className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg">
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <UsersRound className="w-5 h-5 text-blue-500" /> Recently Viewed Alumni
            </h2>
            <div className="grid sm:grid-cols-2 gap-4">
              {studentData.recentlyViewedAlumni.map((alumni) => (
                <div key={alumni.id} className="flex items-center bg-gray-50 dark:bg-gray-700 rounded-lg p-3 hover:shadow-md transition">
                  <Image
                    src={alumni.avatar}
                    alt={alumni.name}
                    width={56}
                    height={56}
                    className="rounded-full object-cover mr-4"
                  />
                  <div>
                    <h3 className="font-semibold">{alumni.name}</h3>
                    <p className="text-sm text-gray-500 dark:text-gray-300">{alumni.role} at {alumni.company}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* --- Settings --- */}
          <section className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg">
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <Settings className="w-5 h-5 text-blue-500" /> Settings
            </h2>
            <div className="space-y-4">
              {/* Theme Toggle */}
              <div className="flex items-center justify-between">
                <span>Theme</span>
                <button
                  onClick={() => setDarkMode(!darkMode)}
                  className="flex items-center gap-2 bg-gray-100 dark:bg-gray-700 px-4 py-2 rounded-full transition"
                >
                  {darkMode ? <Moon className="w-5 h-5 text-yellow-400" /> : <Sun className="w-5 h-5 text-yellow-500" />}
                  {darkMode ? "Dark Mode" : "Light Mode"}
                </button>
              </div>

              {/* Preferences */}
              <div className="flex items-center justify-between">
                <span>Preferences</span>
                <button className="bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-200 px-4 py-2 rounded-full hover:bg-blue-200 transition">
                  Edit Preferences
                </button>
              </div>

              {/* Logout */}
              <div className="flex items-center justify-between">
                <span>Logout</span>
                <button className="flex items-center gap-2 bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-200 px-4 py-2 rounded-full hover:bg-red-200 transition">
                  <LogOut className="w-5 h-5" /> Logout
                </button>
              </div>
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}
