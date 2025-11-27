"use client";

import React, { useEffect, useState } from "react";

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
    const res = await fetch(`/api/answers/${answerId}/upvote`, {
      method: "POST",
    });

    if (!res.ok) {
      alert("Failed to upvote");
      return;
    }

    fetchThread();
  };

  if (loading) {
    return <div className="pt-48 text-center">Loading...</div>;
  }

  if (!question) {
    return <div className="pt-48 text-center">Question not found.</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 px-6 pt-48">
      <div className="max-w-4xl mx-auto bg-white shadow-lg rounded-xl p-6 space-y-6">
        <header>
          <h1 className="text-2xl font-bold text-gray-900">
            {question.title}
          </h1>
          <p className="mt-2 text-gray-700 whitespace-pre-line">
            {question.body}
          </p>
        </header>

        <section>
          <h2 className="text-lg font-semibold mb-3">
            Answers ({answers.length})
          </h2>
          <div className="space-y-3">
            {answers.map((a) => (
              <div
                key={a.id}
                className="border rounded-lg p-3 bg-gray-50 flex justify-between gap-4"
              >
                <div>
                  <p className="text-sm text-gray-600 mb-1">
                    <strong>{a.author_name}</strong>{" "}
                    <span className="text-xs text-gray-500">
                      ({a.author_role})
                    </span>
                  </p>
                  <p>{a.body}</p>
                </div>
                <button
                  onClick={() => handleUpvote(a.id)}
                  className="self-start text-sm px-3 py-1 rounded-full border hover:bg-gray-100"
                >
                  👍 {a.upvotes}
                </button>
              </div>
            ))}

            {answers.length === 0 && (
              <p className="text-sm text-gray-500">
                No answers yet. Be the first to reply!
              </p>
            )}
          </div>
        </section>

        <section>
          <h2 className="text-lg font-semibold mb-2">Your Answer</h2>
          <textarea
            value={reply}
            onChange={(e) => setReply(e.target.value)}
            rows={3}
            placeholder="Write a reply..."
            className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500"
          />
          <button
            onClick={handleReply}
            className="mt-3 bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700"
          >
            Reply
          </button>
        </section>
      </div>
    </div>
  );
}
