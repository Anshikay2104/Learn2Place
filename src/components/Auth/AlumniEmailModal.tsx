"use client";

interface AlumniEmailModalProps {
  email: string;
  setEmail: (email: string) => void;
  onVerify: () => void;
  onClose: () => void;
  error: string;
  loading: boolean;
}

export default function AlumniEmailModal({
  email,
  setEmail,
  onVerify,
  onClose,
  error,
  loading,
}: AlumniEmailModalProps) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center z-[300]">

      {/* MAIN MODAL */}
      <div className="bg-white w-[460px] rounded-3xl p-10 shadow-2xl text-center transform scale-105">

        <h2 className="text-2xl font-bold text-gray-900 mb-4">
          Verify Alumni Email
        </h2>

        <p className="text-gray-600 mb-6">
          Enter your registered alumni email to continue.
        </p>

        {/* EMAIL INPUT */}
        <input
          type="email"
          placeholder="Enter alumni email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full border border-gray-300 px-4 py-3 rounded-lg mb-3 focus:outline-none focus:ring-2 focus:ring-[#6C63FF]"
        />

        {/* ERROR */}
        {error && (
          <p className="text-red-600 text-sm mb-3">{error}</p>
        )}

        {/* VERIFY BUTTON */}
        <button
          onClick={onVerify}
          disabled={loading}
          className="w-full bg-[#6C63FF] text-white py-3 rounded-xl text-lg font-semibold hover:bg-[#5850d4] disabled:opacity-50 transition mb-4"
        >
          {loading ? "Verifying..." : "Verify Email"}
        </button>

        {/* CLOSE BUTTON */}
        <button
          onClick={onClose}
          className="w-full py-3 rounded-xl border border-gray-400 text-gray-700 font-medium hover:bg-gray-100 transition"
        >
          Cancel
        </button>

      </div>
    </div>
  );
}
