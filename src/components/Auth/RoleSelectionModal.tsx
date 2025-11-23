"use client";

import Logo from "@/components/Layout/Header/Logo";

interface RoleSelectionModalProps {
  onSelect: (role: "alumni" | "student") => void;
}

export default function RoleSelectionModal({ onSelect }: RoleSelectionModalProps) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center z-[200]">

      <div className="bg-white w-[460px] rounded-3xl p-10 shadow-2xl text-center transform scale-105">

        {/* LOGO */}
        <div className="mx-auto mb-6 w-[180px]">
          <Logo />
        </div>

        <h2 className="text-3xl font-bold text-gray-900 mb-6">
          Select Your Role
        </h2>

        <div className="flex flex-col gap-5">
          <button
            onClick={() => onSelect("student")}
            className="w-full py-3 rounded-xl bg-[#6C63FF] text-white text-lg font-semibold hover:bg-[#5850d4] transition"
          >
            I am a Student
          </button>

          <button
            onClick={() => onSelect("alumni")}
            className="w-full py-3 rounded-xl border border-gray-300 text-lg font-semibold text-gray-800 hover:bg-gray-100 transition"
          >
            I am an Alumni
          </button>
        </div>
      </div>
    </div>
  );
}
