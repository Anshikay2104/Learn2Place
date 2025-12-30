"use client";

import React, { useEffect, useState } from "react";
import { ThumbsUp } from "lucide-react";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";

/* ---------- Types ---------- */

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

type Props = {
  id: string;
};

/* ---------- Component ---------- */

export default function ForumThreadClient({ id }: Props) {
  const supabase = createClientComponentClient();

  const [question, setQuestion] = useState<Question | null>(null);
  const [answers, setAnswers] = useState<Answer[]>([]);
  const [reply, setReply] = useState("");
  const [loading, setLoading] = useState(true);

  /* ---------- Fetch Question + Answers ---------- */

  const fetchThread = async () => {
    setLoading(true);

    // Fetch question
    const qRes = await fetch(`/api/questions/${id}`);
    if (!qRes.ok) {
      setQuestion(null);
      setAnswers([]);
      setLoading(false);
      return;
    }
    setQuestion(await qRes.json());

    // Fetch answers
    const aRes = await fetch(`/api/questions/${id}/answers`);
    setAnswers(aRes.ok ? await aRes.json() : []);

    setLoading(false);
  };

  useEffect(() => {
    fetchThread();
  }, [id]);

  /* ---------- Post Answer ---------- */

  const handleReply = async () => {
    if (!reply.trim()) return;

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      alert("Please login to post an answer");
      return;
    }

    const res = await fetch(`/api/questions/${id}/answers`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        text: reply,
        responder_id: user.id,
      }),
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      alert(err.error || "Failed to post answer");
      return;
    }

    setReply("");
    fetchThread();
  };

  /* ---------- Upvote ---------- */

  const handleUpvote = async (answerId: string) => {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      alert("Login required to upvote");
      return;
    }

    const res = await fetch(`/api/answers/${answerId}/upvote`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ user_id: user.id }),
    });

    if (!res.ok) {
      alert("Failed to upvote");
      return;
    }

    fetchThread(); // refresh counts
  };

  /* ---------- States ---------- */

  if (loading) {
    return <div className="pt-40 text-center">Loading…</div>;
  }

  if (!question) {
    return <div className="pt-40 text-center">Question not found.</div>;
  }

  /* ---------- UI ---------- */

  return (
    <div className="min-h-screen bg-gray-50 px-6 pt-32">
      <div className="max-w-4xl mx-auto space-y-8">

        {/* Question */}
        <div className="bg-white border rounded-xl p-6">
          <h1 className="text-2xl font-bold text-gray-900">
            {question.title}
          </h1>
          <p className="mt-3 text-gray-700 whitespace-pre-line">
            {question.body}
          </p>
        </div>

        {/* Answers */}
        <div className="bg-white border rounded-xl p-6 space-y-4">
          <h2 className="text-lg font-semibold">
            Answers ({answers.length})
          </h2>

          {answers.map((a) => (
            <div
              key={a.id}
              className="flex justify-between items-start border rounded-lg p-4 bg-gray-50"
            >
              {/* Left */}
              <div>
                <p className="font-medium text-gray-900">
                  {a.author_name}
                </p>
                <p className="text-sm text-gray-500">
                  {a.author_role}
                </p>

                <p className="mt-2 text-gray-800">{a.body}</p>

                <p className="mt-2 text-xs text-gray-400">
                  {new Date(a.created_at).toLocaleString()}
                </p>
              </div>

              {/* Upvote */}
              <button
                onClick={() => handleUpvote(a.id)}
                className="flex items-center gap-1 text-indigo-600 hover:text-indigo-800"
                title="Upvote"
              >
                <ThumbsUp size={18} />
                <span className="text-sm font-medium">
                  {a.upvotes}
                </span>
              </button>
            </div>
          ))}

          {answers.length === 0 && (
            <p className="text-sm text-gray-500">
              No answers yet. Be the first to help ✨
            </p>
          )}
        </div>

        {/* Reply */}
        <div className="bg-white border rounded-xl p-6">
          <h3 className="font-semibold mb-2">Your Answer</h3>

          <textarea
            value={reply}
            onChange={(e) => setReply(e.target.value)}
            rows={4}
            className="w-full border rounded p-3"
            placeholder="Write your answer…"
          />

          <div className="flex justify-end mt-3">
            <button
              onClick={handleReply}
              className="bg-indigo-600 text-white px-5 py-2 rounded hover:bg-indigo-700"
            >
              Post Answer
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
