"use client";

import React, { useState } from "react";
import AskQuestionForm from "./AskQuestionForm";

export default function ForumClient() {
  const [showModal, setShowModal] = useState(false);

  return (
    <>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold">Forum</h1>
          <p className="text-sm text-gray-500">Ask questions and learn from the community</p>
        </div>

        <div>
          <button
            type="button"
            onClick={() => setShowModal(true)}
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg"
          >
            Post Question
          </button>
        </div>
      </div>

      {showModal && (
        <div role="dialog" aria-modal="true" className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="w-full max-w-2xl rounded-lg bg-white p-6 shadow-lg">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Ask a Question</h3>
              <button aria-label="close modal" onClick={() => setShowModal(false)} className="text-gray-500 hover:text-gray-700">✕</button>
            </div>

            <AskQuestionForm onClose={() => setShowModal(false)} />
          </div>
        </div>
      )}
    </>
  );
}
