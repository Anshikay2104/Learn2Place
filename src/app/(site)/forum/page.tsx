"use client";
import React, { useState } from "react";
import { MessageCircle, ArrowUp, ArrowDown, Search, Tag, Plus } from "lucide-react";
import Link from "next/link";

type Question = {
  id: string;
  title: string;
  body: string;
  tags: string[];
  upvotes: number;
  answers: number;
  author: string;
  date: string;
};

const dummyQuestions: Question[] = [
  {
    id: "1",
    title: "How do I prepare for on-campus technical interviews?",
    body: "I’m in my 3rd year and placements are starting soon. What topics should I focus on for software roles?",
    tags: ["interview", "placement", "dsa"],
    upvotes: 42,
    answers: 8,
    author: "Priya Sharma",
    date: "2 days ago",
  },
  {
    id: "2",
    title: "Best resources to learn React with TypeScript?",
    body: "I’ve worked with basic React before, but I’m new to TypeScript. Any good tutorials or project ideas?",
    tags: ["react", "typescript", "frontend"],
    upvotes: 28,
    answers: 5,
    author: "Neha Patel",
    date: "1 week ago",
  },
  {
    id: "3",
    title: "How to get started with research internships?",
    body: "Are there any platforms or professors open for collaboration during summer?",
    tags: ["research", "internship", "college-life"],
    upvotes: 19,
    answers: 3,
    author: "Aditi Verma",
    date: "4 days ago",
  },
];

export default function ForumPage() {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredQuestions = dummyQuestions.filter(
    (q) =>
      q.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      q.tags.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-6 lg:px-12">
      <div className="max-w-6xl mx-auto">
        {/* === HEADER === */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4 sm:mb-0">
            Student Q&A Forum
          </h1>
          <Link
            href="/forum/ask"
            className="inline-flex items-center bg-indigo-600 text-white px-4 py-2 rounded-lg shadow hover:bg-indigo-700 transition"
          >
            <Plus className="w-4 h-4 mr-2" /> Ask a Question
          </Link>
        </div>

        {/* === SEARCH BAR === */}
        <div className="relative mb-10">
          <Search className="absolute left-3 top-3 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Search questions or tags..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-white shadow rounded-lg py-3 pl-10 pr-4 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          {/* === QUESTIONS LIST === */}
          <div className="lg:col-span-2 space-y-6">
            {filteredQuestions.map((q) => (
              <div
                key={q.id}
                className="bg-white shadow-md rounded-xl p-6 hover:shadow-lg transition"
              >
                <div className="flex justify-between items-start">
                  <h2 className="text-xl font-semibold text-gray-900 hover:text-indigo-600 cursor-pointer">
                    {q.title}
                  </h2>
                  <div className="flex flex-col items-center text-gray-600">
                    <ArrowUp className="w-4 h-4 cursor-pointer hover:text-indigo-600" />
                    <span className="font-bold text-gray-800">{q.upvotes}</span>
                    <ArrowDown className="w-4 h-4 cursor-pointer hover:text-indigo-600" />
                  </div>
                </div>

                <p className="text-gray-700 mt-3">{q.body}</p>

                <div className="mt-4 flex flex-wrap gap-2">
                  {q.tags.map((tag) => (
                    <span
                      key={tag}
                      className="flex items-center bg-indigo-50 text-indigo-700 text-sm font-medium px-3 py-1 rounded-full"
                    >
                      <Tag className="w-3 h-3 mr-1" /> {tag}
                    </span>
                  ))}
                </div>

                <div className="mt-4 flex items-center justify-between text-sm text-gray-500">
                  <span>Asked by <strong>{q.author}</strong> • {q.date}</span>
                  <span className="flex items-center">
                    <MessageCircle className="w-4 h-4 mr-1" /> {q.answers} answers
                  </span>
                </div>
              </div>
            ))}

            {filteredQuestions.length === 0 && (
              <p className="text-gray-500 text-center mt-10">
                No questions found for “{searchQuery}”
              </p>
            )}
          </div>

          {/* === SIDEBAR === */}
          <aside className="space-y-8">
            {/* Trending Tags */}
            <div className="bg-white rounded-xl shadow p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">
                🔥 Trending Tags
              </h3>
              <div className="flex flex-wrap gap-2">
                {["placement", "react", "internship", "resume", "webdev", "ai"].map(
                  (tag) => (
                    <span
                      key={tag}
                      className="bg-gray-100 hover:bg-indigo-100 text-gray-700 hover:text-indigo-700 text-sm px-3 py-1 rounded-full cursor-pointer transition"
                    >
                      #{tag}
                    </span>
                  )
                )}
              </div>
            </div>

            {/* Top Contributors */}
            <div className="bg-white rounded-xl shadow p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">
                🏆 Top Contributors
              </h3>
              <ul className="space-y-3 text-gray-700">
                <li>👩‍💻 <strong>Riya Singh</strong> — 134 answers</li>
                <li>🧠 <strong>Tanisha Mehta</strong> — 97 answers</li>
                <li>👩‍🔬 <strong>Shruti Desai</strong> — 81 answers</li>
              </ul>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
