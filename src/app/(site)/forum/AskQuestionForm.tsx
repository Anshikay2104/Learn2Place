"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";

export default function AskQuestionForm({ onClose }: { onClose?: () => void }) {
  const router = useRouter();

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
      const url = new URL("/api/questions", window.location.href).toString();
      console.log("Posting question to", url);

      const res = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, description: body }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        console.error("POST /api/questions failed", res.status, data);
        throw new Error(data?.error || "Failed to post question");
      }

      const created = await res.json().catch(() => null);
      console.log("Question posted successfully", created);
      setTitle("");
      setBody("");
      // If API returned created question id, navigate to its thread so user can reply immediately
      if (created && (created.id || created.data?.id)) {
        const id = created.id ?? created.data?.id;
        router.push(`/forum/${id}`);
      } else {
        router.refresh();
      }

      // close the modal if parent provided a closer
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
