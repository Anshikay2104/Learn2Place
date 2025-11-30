"use client";

import React, { useEffect, useState } from "react";
import { ThumbsUp } from "lucide-react";

type Answer = {
  id: string;
  body: string;
  created_at: string;
  author_name: string;
  author_role: string;
  upvotes: number;
};

type Question = {
  id: string;
  title: string;
  body: string;
};

type Props = { id: string };

export default function ForumThreadClient({ id }: Props) {
  const [question, setQuestion] = useState<Question | null>(null);
  const [answers, setAnswers] = useState<Answer[]>([]);
  const [reply, setReply] = useState("");
  const [loading, setLoading] = useState(true);
  const [upvoting, setUpvoting] = useState<string | null>(null);
  const [userUpvotes, setUserUpvotes] = useState<Set<string>>(new Set());

  const fetchThread = async () => {
    setLoading(true);

    // question
    const qRes = await fetch(`/api/questions?id=${id}`);
    const qData = await qRes.json();

    // our GET /api/questions returns list, filter one
    const q = (qData as Question[]).find((q) => q.id === id) ?? qData;

    setQuestion(q);

    // answers
    const aRes = await fetch(`/api/questions/${id}/answers`);
    const aData = await aRes.json();

    setAnswers(aData);
    setLoading(false);
  };

  useEffect(() => {
    fetchThread();
  }, [id]);

  const handleReply = async () => {
    if (!reply.trim()) return;

    const res = await fetch(`/api/questions/${id}/answers`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text: reply }),
    });

    if (!res.ok) {
      alert("Failed to post answer");
      return;
    }

    setReply("");
    fetchThread();
  };

  const handleUpvote = async (answerId: string) => {
    setUpvoting(answerId);
    try {
      const res = await fetch(`/api/answers/${answerId}/upvote`, {
        method: "POST",
      });

      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        alert(errData.error || "Failed to upvote");
        setUpvoting(null);
        return;
      }

      const result = await res.json();

      // Update local upvote tracking
      const newUpvotes = new Set(userUpvotes);
      if (result.status === "added") {
        newUpvotes.add(answerId);
      } else if (result.status === "removed") {
        newUpvotes.delete(answerId);
      }
      setUserUpvotes(newUpvotes);

      // Refresh thread data
      fetchThread();
    } catch (err) {
      console.error("Upvote error:", err);
      alert("Failed to upvote answer");
    } finally {
      setUpvoting(null);
    }
  };

  if (loading) {
    return <div className="pt-48 text-center">Loading...</div>;
  }

  if (!question) {
    return <div className="pt-48 text-center">Question not found.</div>;
  }

  return (
  <div className="min-h-screen bg-gradient-to-b from-indigo-50 via-white to-white px-6 pt-36">
    <div className="max-w-4xl mx-auto space-y-8">

      {/* Question Card */}
      <div className="bg-white border border-indigo-100 rounded-2xl shadow-sm p-8">
        <span className="inline-block mb-3 text-xs font-semibold text-indigo-600 bg-indigo-50 px-3 py-1 rounded-full">
          Question
        </span>

        <h1 className="text-3xl font-bold text-gray-900">
          {question.title}
        </h1>

        <p className="mt-4 text-gray-700 leading-relaxed whitespace-pre-line">
          {question.body}
        </p>
      </div>

      {/* Answers Section */}
      <section className="bg-white border rounded-2xl shadow-sm p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-5">
          Answers <span className="text-gray-400">({answers.length})</span>
        </h2>

        <div className="space-y-4">
          {answers.map((a) => (
            <div
              key={a.id}
              className="flex gap-4 border rounded-xl p-5 bg-gray-50 hover:bg-white transition"
            >
              {/* Avatar */}
              <div className="w-10 h-10 rounded-full bg-indigo-600 text-white flex items-center justify-center font-semibold">
                {a.author_name[0]}
              </div>

              {/* Content */}
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <p className="font-medium text-gray-800">
                    {a.author_name}
                  </p>
                  <span className="text-xs px-2 py-0.5 rounded-full bg-indigo-100 text-indigo-700">
                    {a.author_role}
                  </span>
                </div>

                <p className="mt-2 text-gray-700">{a.body}</p>

                <p className="mt-2 text-xs text-gray-400">
                  {new Date(a.created_at).toLocaleString()}
                </p>
              </div>

              {/* Upvote */}
              <button
                onClick={() => handleUpvote(a.id)}
                disabled={upvoting === a.id}
                className={`flex items-center gap-1 px-3 py-2 h-fit rounded-full border text-sm transition
                  ${
                    userUpvotes.has(a.id)
                      ? "bg-indigo-600 text-white border-indigo-600"
                      : "bg-white hover:bg-indigo-50"
                  }
                  ${upvoting === a.id && "opacity-50 cursor-not-allowed"}
                `}
              >
                <ThumbsUp size={14} /> {a.upvotes}
              </button>
            </div>
          ))}

          {answers.length === 0 && (
            <p className="text-sm text-gray-500 text-center py-6">
              No answers yet. Be the first to help ✨
            </p>
          )}
        </div>
      </section>

      {/* Reply Section */}
      <section className="bg-white border rounded-2xl shadow-sm p-6">
        <h2 className="text-xl font-semibold mb-3">Your Answer</h2>

        <textarea
          value={reply}
          onChange={(e) => setReply(e.target.value)}
          rows={4}
          placeholder="Share your experience or advice..."
          className="w-full border rounded-xl px-4 py-3 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
        />

        <div className="flex justify-end mt-4">
          <button
            onClick={handleReply}
            className="bg-indigo-600 text-white px-6 py-2 rounded-xl font-medium hover:bg-indigo-700 transition"
          >
            Post Answer
          </button>
        </div>
      </section>

    </div>
  </div>
);

}
