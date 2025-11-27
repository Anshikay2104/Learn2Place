"use client";

import React, { useEffect, useState } from "react";
import { createSupabaseBrowserClient } from "@/utils/supabase/client";
import { useRouter } from "next/navigation";
import type { User } from "@supabase/supabase-js";

const supabase = createSupabaseBrowserClient();

export default function AskQuestionForm() {
  const [user, setUser] = useState<User | null>(null);
  const [userLoaded, setUserLoaded] = useState(false);

  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const router = useRouter();

  useEffect(() => {
    // Load current user from Supabase (OAuth session)
    supabase.auth.getUser().then(({ data: { user } }) => {
      setUser(user ?? null);
      setUserLoaded(true);
    });
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      alert("Please sign in with Google first.");
      return;
    }

    if (!title.trim() || !body.trim()) return;

    setSubmitting(true);

    const { error } = await supabase.from("questions").insert({
      title,
      body,
      asker_id: user.id, // must match profiles.id
    });

    setSubmitting(false);

    if (error) {
      alert("Failed to post question: " + error.message);
      return;
    }

    setTitle("");
    setBody("");
    // refresh the server component list of questions
    router.refresh();
  };

  if (!userLoaded) {
    return (
      <div className="p-4 bg-white rounded-xl shadow text-sm text-gray-500">
        Checking login status...
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow p-4 mb-6">
      <h2 className="text-lg font-semibold mb-2">Ask a Question</h2>

      {!user && (
        <p className="text-sm text-red-600 mb-3">
          Please sign in with Google to ask or answer questions.
        </p>
      )}

      <form onSubmit={handleSubmit} className="space-y-3">
        <input
          type="text"
          placeholder="Question title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          disabled={!user || submitting}
          className="w-full border rounded-lg px-3 py-2"
        />

        <textarea
          rows={4}
          placeholder="Describe your question..."
          value={body}
          onChange={(e) => setBody(e.target.value)}
          disabled={!user || submitting}
          className="w-full border rounded-lg px-3 py-2"
        />

        <button
          type="submit"
          disabled={!user || submitting}
          className="bg-indigo-600 text-white px-4 py-2 rounded-lg disabled:opacity-60"
        >
          {submitting ? "Posting..." : "Post Question"}
        </button>

        <p className="mt-2 text-xs text-gray-500">
          Only users with <code>role = "student"</code> in the <code>profiles</code> table
          can post questions (enforced by RLS).
        </p>
      </form>
    </div>
  );
}
