"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";

export default function AskQuestionForm({ onClose }: { onClose?: () => void }) {
  const router = useRouter();
  const supabase = createClientComponentClient();

  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!title.trim() || !body.trim()) {
      setErrorMessage("Please provide a title and description.");
      return;
    }

    setSubmitting(true);

    try {
      // 🔑 GET LOGGED-IN USER
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        setErrorMessage("Please login to post a question.");
        setSubmitting(false);
        return;
      }

      // 🔥 POST QUESTION WITH user_id
      const res = await fetch("/api/questions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          description: body,
          user_id: user.id, // ✅ REQUIRED
        }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data?.error || "Failed to post question");
      }

      const created = await res.json().catch(() => null);

      // Reset form
      setTitle("");
      setBody("");

      // Redirect to question thread if ID returned
      if (created && typeof created.id === "string") {
  router.push(`/forum/${created.id}`);
} else {
  router.refresh();
}


      // Close modal if provided
      if (onClose) onClose();
    } catch (err: any) {
      console.error(err);
      setErrorMessage(err?.message || "Failed to post question");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow p-6 mb-6">
      <h2 className="text-lg font-semibold mb-4">Ask a Question</h2>

      <form onSubmit={handleSubmit} className="space-y-3">
        {errorMessage && (
          <p className="text-sm text-red-600">{errorMessage}</p>
        )}

        <input
          type="text"
          placeholder="Question title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          disabled={submitting}
          className="w-full border rounded-lg px-3 py-2"
        />

        <textarea
          rows={4}
          placeholder="Describe your question..."
          value={body}
          onChange={(e) => setBody(e.target.value)}
          disabled={submitting}
          className="w-full border rounded-lg px-3 py-2"
        />

        <button
          type="submit"
          disabled={submitting}
          className="bg-indigo-600 text-white px-4 py-2 rounded-lg disabled:opacity-60"
        >
          {submitting ? "Posting..." : "Post Question"}
        </button>
      </form>
    </div>
  );
}
