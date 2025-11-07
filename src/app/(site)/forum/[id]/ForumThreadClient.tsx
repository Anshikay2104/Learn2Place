"use client";

import React, { useState } from "react";

type Props = { id: string };

export default function ForumThreadClient({ id }: Props) {
  const [messages, setMessages] = useState([
    { author: "Priya Sharma", text: "Focus on DSA, OS, and DBMS basics." },
  ]);
  const [reply, setReply] = useState("");

  const handleReply = () => {
    if (reply.trim()) {
      setMessages([...messages, { author: "You", text: reply }]);
      setReply("");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 px-6 pt-48">
      <div className="max-w-4xl mx-auto bg-white shadow-lg rounded-xl p-6">
        <h1 className="text-2xl font-bold mb-4 text-gray-900">
          Discussion for Question #{id}
        </h1>

        <div className="space-y-3">
          {messages.map((m, i) => (
            <div key={i} className="border rounded-lg p-3 bg-gray-50">
              <p className="text-sm text-gray-600">
                <strong>{m.author}</strong>:
              </p>
              <p>{m.text}</p>
            </div>
          ))}
        </div>

        <div className="mt-6">
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
        </div>
      </div>
    </div>
  );
}
