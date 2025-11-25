"use client";
import React from "react";

interface Props {
  email: string;
  setEmail: (email: string) => void;
  onVerify: () => void;
  onClose: () => void;
  error: string;
  loading: boolean;
}

const AlumniEmailModal = ({
  email,
  setEmail,
  onVerify,
  onClose,
  error,
  loading,
}: Props) => {
  return (
    <div className="fixed inset-0 z-[9999] bg-black/50 flex items-center justify-center backdrop-blur-sm">
      <div className="bg-white p-8 w-full max-w-md rounded-2xl shadow-xl relative animate-fadeIn">

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute right-4 top-4 text-gray-700 hover:text-black text-2xl"
        >
          &times;
        </button>

        <h2 className="text-2xl font-semibold text-center text-black mb-4">
          Verify Alumni Email
        </h2>

        <p className="text-gray-600 text-center mb-6">
          Please enter your registered alumni email to continue.
        </p>

        <input
          type="email"
          placeholder="Enter alumni email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full border rounded-lg px-4 py-3 text-black mb-2 focus:outline-none"
        />

        {error && <p className="text-red-500 text-sm mb-3">{error}</p>}

        <button
          onClick={onVerify}
          disabled={loading}
          className="w-full bg-primary text-white py-3 rounded-lg hover:bg-primary/90"
        >
          {loading ? "Verifying..." : "Verify Email"}
        </button>
      </div>
    </div>
  );
};

export default AlumniEmailModal;
