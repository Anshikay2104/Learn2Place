"use client";
import React, { useState, useEffect } from "react";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { MessageCircle, ArrowUp, ArrowDown, Search, Tag, Plus, X, ChevronDown, ChevronUp } from "lucide-react";

type Question = {
  id: string;
  title: string;
  body: string;
  tags: string[];
  upvotes: number;
  answers: number;
  author: string;
  date: string;
  replies: Reply[];
};

type Reply = {
  id: string;
  author: string;
  text: string;
  upvotes: number;
  date: string;
};

export default function ForumPage() {
  const supabase = createClientComponentClient();

  const [searchQuery, setSearchQuery] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const [questions, setQuestions] = useState<Question[]>([
    {
      id: "1",
      title: "How do I prepare for on-campus technical interviews?",
      body: "I’m in my 3rd year and placements are starting soon. What topics should I focus on for software roles?",
      tags: ["interview", "placement", "dsa"],
      upvotes: 42,
      answers: 2,
      author: "Priya Sharma",
      date: "2 days ago",
      replies: [
        { id: "r1", author: "Aarushi Mehta", text: "Focus on DSA, OS, and basic DBMS. Practice LeetCode daily!", upvotes: 15, date: "1 day ago" },
        { id: "r2", author: "Neha Singh", text: "Also do mock interviews with friends. Confidence matters!", upvotes: 8, date: "20 hours ago" },
      ],
    },
  ]);

  const [newQuestion, setNewQuestion] = useState({ title: "", body: "", tags: "" });
  const [replyText, setReplyText] = useState<Record<string, string>>({});

  // Load questions from Supabase on mount
  useEffect(() => {
    const loadQuestions = async () => {
      try {
        const { data, error } = await supabase
          .from("forum_questions")
          .select("id, title, body, tags, upvotes, answers, author, created_at")
          .order("created_at", { ascending: false });

        if (error) {
          console.error("Error loading forum questions:", error);
          return;
        }

        if (data) {
          // Map DB rows to local Question shape
          const mapped = data.map((row: any) => ({
            id: String(row.id),
            title: row.title,
            body: row.body,
            tags: row.tags || [],
            upvotes: row.upvotes ?? 0,
            answers: row.answers ?? 0,
            author: row.author ?? "Anonymous",
            date: row.created_at ? new Date(row.created_at).toLocaleString() : "",
            replies: [],
          }));

          setQuestions(mapped as any);
        }
      } catch (err) {
        console.error(err);
      }
    };

    loadQuestions();
  }, []);

  const handleAskQuestion = () => {
    if (!newQuestion.title.trim() || !newQuestion.body.trim()) return;

    (async () => {
      try {
        // get current user to set author (if available)
        const {
          data: { user },
        } = await supabase.auth.getUser();

        const insertObj: any = {
          title: newQuestion.title,
          body: newQuestion.body,
          tags: newQuestion.tags ? newQuestion.tags.split(",").map((t) => t.trim()) : [],
          upvotes: 0,
          answers: 0,
          author: user?.email || user?.user_metadata?.name || "Anonymous",
        };

        const { data, error } = await supabase
          .from("forum_questions")
          .insert(insertObj)
          .select()
          .maybeSingle();

        if (error) {
          console.error("Error inserting question:", error);
          return;
        }

        // prepend new question to UI list
        const inserted = data;
        const newQ: Question = {
          id: String(inserted.id || Date.now()),
          title: inserted.title,
          body: inserted.body,
          tags: inserted.tags || [],
          upvotes: inserted.upvotes ?? 0,
          answers: inserted.answers ?? 0,
          author: inserted.author ?? "You",
          date: inserted.created_at ? new Date(inserted.created_at).toLocaleString() : "just now",
          replies: [],
        };

        setQuestions((prev) => [newQ, ...prev]);
        setShowModal(false);
        setNewQuestion({ title: "", body: "", tags: "" });
      } catch (err) {
        console.error(err);
      }
    })();
  };

  const handleReply = (id: string) => {
    if (!replyText[id]?.trim()) return;

    const updated = questions.map((q) =>
      q.id === id
        ? {
            ...q,
            replies: [
              ...q.replies,
              {
                id: Date.now().toString(),
                author: "You",
                text: replyText[id],
                upvotes: 0,
                date: "just now",
              },
            ],
            answers: q.answers + 1,
          }
        : q
    );
    setQuestions(updated);
    setReplyText((prev) => ({ ...prev, [id]: "" }));
  };

  const filtered = questions.filter(
    (q) =>
      q.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      q.tags.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div className="min-h-screen bg-gray-50 pt-24 px-6 lg:px-12">
      <div className="max-w-6xl mx-auto">
        {/* === HEADER === */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4 sm:mb-0">Student Forum</h1>
          <button
            onClick={() => setShowModal(true)}
            className="inline-flex items-center bg-indigo-600 text-white px-4 py-2 rounded-lg shadow hover:bg-indigo-700 transition"
          >
            <Plus className="w-4 h-4 mr-2" /> Ask a Question
          </button>
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

        {/* === QUESTIONS LIST === */}
        <div className="space-y-6">
          {filtered.map((q) => {
            const topReply =
              q.replies.length > 0 ? [...q.replies].sort((a, b) => b.upvotes - a.upvotes)[0] : null;

            return (
              <div key={q.id} className="bg-white shadow-md rounded-xl p-6 hover:shadow-lg transition">
                <div className="flex justify-between items-start">
                  <h2 className="text-xl font-semibold text-gray-900">{q.title}</h2>
                  <div className="flex flex-col items-center text-gray-600">
                    <ArrowUp className="w-4 h-4 cursor-pointer hover:text-indigo-600" />
                    <span className="font-bold text-gray-800">{q.upvotes}</span>
                    <ArrowDown className="w-4 h-4 cursor-pointer hover:text-indigo-600" />
                  </div>
                </div>

                <p className="text-gray-700 mt-3">{q.body}</p>

                <div className="mt-3 flex flex-wrap gap-2">
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
                  <span>
                    Asked by <strong>{q.author}</strong> • {q.date}
                  </span>
                  <span className="flex items-center">
                    <MessageCircle className="w-4 h-4 mr-1" /> {q.answers} answers
                  </span>
                </div>

                {/* === TOP ANSWER === */}
                {topReply && (
                  <div className="bg-indigo-50 mt-4 p-4 rounded-lg">
                    <p className="text-gray-800 italic">
                      “{topReply.text}”
                    </p>
                    <p className="text-sm text-gray-500 mt-1">
                      — {topReply.author} ({topReply.upvotes} votes)
                    </p>
                  </div>
                )}

                {/* === VIEW ALL REPLIES === */}
                {q.replies.length > 1 && (
                  <button
                    onClick={() => setExpandedId(expandedId === q.id ? null : q.id)}
                    className="mt-3 text-indigo-600 text-sm font-medium flex items-center hover:underline"
                  >
                    {expandedId === q.id ? (
                      <>
                        <ChevronUp className="w-4 h-4 mr-1" /> Hide replies
                      </>
                    ) : (
                      <>
                        <ChevronDown className="w-4 h-4 mr-1" /> View all replies
                      </>
                    )}
                  </button>
                )}

                {/* === REPLIES LIST === */}
                {expandedId === q.id && (
                  <div className="mt-3 space-y-3">
                    {q.replies.map((r) => (
                      <div key={r.id} className="bg-gray-50 p-3 rounded-lg">
                        <p className="text-gray-800">{r.text}</p>
                        <p className="text-sm text-gray-500 mt-1">
                          — {r.author} • {r.date}
                        </p>
                      </div>
                    ))}
                  </div>
                )}

                {/* === REPLY BOX === */}
                <div className="mt-4 flex items-start gap-2">
                  <textarea
                    rows={2}
                    placeholder="Write a reply..."
                    value={replyText[q.id] || ""}
                    onChange={(e) => setReplyText((prev) => ({ ...prev, [q.id]: e.target.value }))}
                    className="flex-1 border rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-400"
                  />
                  <button
                    onClick={() => handleReply(q.id)}
                    className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg"
                  >
                    Reply
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* === ASK QUESTION MODAL === */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex justify-center items-center z-50">
          <div className="bg-white rounded-xl shadow-lg p-6 w-full max-w-lg relative">
            <button
              onClick={() => setShowModal(false)}
              className="absolute top-3 right-3 text-gray-400 hover:text-gray-700"
            >
              <X className="w-5 h-5" />
            </button>
            <h2 className="text-2xl font-semibold mb-4">Ask a Question</h2>

            <input
              type="text"
              placeholder="Enter a clear title..."
              value={newQuestion.title}
              onChange={(e) =>
                setNewQuestion((prev) => ({ ...prev, title: e.target.value }))
              }
              className="w-full border rounded-lg px-3 py-2 mb-3 focus:ring-2 focus:ring-indigo-400"
            />
            <textarea
              rows={4}
              placeholder="Describe your question..."
              value={newQuestion.body}
              onChange={(e) =>
                setNewQuestion((prev) => ({ ...prev, body: e.target.value }))
              }
              className="w-full border rounded-lg px-3 py-2 mb-3 focus:ring-2 focus:ring-indigo-400"
            />
            <input
              type="text"
              placeholder="Tags (comma separated)"
              value={newQuestion.tags}
              onChange={(e) =>
                setNewQuestion((prev) => ({ ...prev, tags: e.target.value }))
              }
              className="w-full border rounded-lg px-3 py-2 mb-5 focus:ring-2 focus:ring-indigo-400"
            />
            <button
              onClick={handleAskQuestion}
              className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg"
            >
              Post Question
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
