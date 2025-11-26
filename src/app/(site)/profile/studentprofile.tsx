"use client";

import React, { useState } from "react";
import Image from "next/image";
import {
  Bookmark,
  UsersRound,
  GraduationCap,
  Sparkles,
  Moon,
  Sun,
  Settings,
  LogOut,
} from "lucide-react";

// TEMP Data (replace later with Supabase)
const studentData = {
  name: "Aarushi Mehta",
  role: "Student",
  avatarUrl:
    "https://images.unsplash.com/photo-1607746882042-944635dfe10e?w=200&h=200&fit=crop&q=80",
  bio: "3rd Year Computer Science student passionate about AI and web development.",
  course: "B.Tech CSE",
  batch: 2026,
  bookmarks: [
    { id: 1, title: "Full Stack Roadmap", type: "PDF" },
    { id: 2, title: "React Notes", type: "Link" },
  ],
  recentlyViewedAlumni: [
    {
      id: "1",
      name: "Priya Sharma",
      role: "Software Engineer",
      company: "Microsoft",
      avatar:
        "https://images.unsplash.com/photo-1502685104226-ee32379fefbe?w=100&h=100&fit=crop&q=80",
    },
  ],
};

export default function StudentProfile({ userId }: { userId: string }) {
  const [darkMode, setDarkMode] = useState(false);

  return (
    <div
      className={`${
        darkMode ? "bg-gray-900 text-white" : "bg-gray-50 text-gray-900"
      } min-h-screen pt-48 px-4 sm:px-6 lg:px-8 transition-all`}
    >
      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* LEFT CARD */}
        <aside className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
          <div className="flex flex-col items-center text-center">
            <Image
              src={studentData.avatarUrl}
              alt={studentData.name}
              width={120}
              height={120}
              className="rounded-full mb-4"
            />
            <h1 className="text-2xl font-bold">{studentData.name}</h1>
            <span className="text-sm bg-blue-100 text-blue-700 px-3 py-1 rounded-full mt-2">
              Student
            </span>
            <p className="mt-4 text-gray-600 dark:text-gray-300">
              {studentData.bio}
            </p>
          </div>

          <div className="mt-6 border-t pt-4 space-y-3">
            <div className="flex items-center gap-3">
              <GraduationCap className="w-5 h-5 text-blue-500" />
              <span>{studentData.course}</span>
            </div>
            <div className="flex items-center gap-3">
              <Sparkles className="w-5 h-5 text-blue-500" />
              <span>Batch of {studentData.batch}</span>
            </div>
          </div>
        </aside>

        {/* RIGHT COLUMN */}
        <main className="lg:col-span-2 space-y-8">
          {/* BOOKMARKS */}
          <section className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg">
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <Bookmark className="w-5 h-5 text-blue-500" /> Bookmarked
              Resources
            </h2>

            <ul className="space-y-3">
              {studentData.bookmarks.map((res) => (
                <li
                  key={res.id}
                  className="flex items-center justify-between bg-gray-50 dark:bg-gray-700 p-3 rounded-md"
                >
                  <span className="font-medium">{res.title}</span>
                  <span className="text-xs bg-gray-200 dark:bg-gray-600 px-2 py-0.5 rounded-full">
                    {res.type}
                  </span>
                </li>
              ))}
            </ul>
          </section>

          {/* RECENT ALUMNI */}
          <section className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg">
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <UsersRound className="w-5 h-5 text-blue-500" /> Recently Viewed
              Alumni
            </h2>

            <div className="grid sm:grid-cols-2 gap-4">
              {studentData.recentlyViewedAlumni.map((alumni) => (
                <div
                  key={alumni.id}
                  className="flex items-center bg-gray-50 dark:bg-gray-700 p-3 rounded-lg"
                >
                  <Image
                    src={alumni.avatar}
                    alt={alumni.name}
                    width={56}
                    height={56}
                    className="rounded-full mr-4"
                  />
                  <div>
                    <h3 className="font-semibold">{alumni.name}</h3>
                    <p className="text-sm">
                      {alumni.role} at {alumni.company}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* SETTINGS */}
          <section className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg">
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <Settings className="w-5 h-5 text-blue-500" /> Settings
            </h2>

            <div className="space-y-4">
              <button
                onClick={() => setDarkMode(!darkMode)}
                className="flex items-center gap-2 bg-gray-100 dark:bg-gray-700 px-4 py-2 rounded-full"
              >
                {darkMode ? (
                  <Moon className="w-5 h-5" />
                ) : (
                  <Sun className="w-5 h-5" />
                )}
                Toggle Theme
              </button>

              <button className="flex items-center gap-2 bg-red-100 text-red-700 px-4 py-2 rounded-full">
                <LogOut className="w-5 h-5" /> Logout
              </button>
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}
