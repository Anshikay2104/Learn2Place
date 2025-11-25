"use client";
import React, { useEffect } from "react";
import Logo from "@/components/Layout/Header/Logo";

interface Props {
  onSelect: (role: "student" | "alumni") => void;
  onClose: () => void;
}

const RoleSelectionModal = ({ onSelect, onClose }: Props) => {

  // Prevent background scrolling while modal is open
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "auto";
    };
  }, []);

  return (
    <div
      className="fixed inset-0 z-[9999] bg-black/50 backdrop-blur-sm flex items-center justify-center"
    >
      <div className="bg-white rounded-2xl shadow-xl p-10 w-full max-w-md relative animate-fadeIn">

        {/* Close Button */}
        <button
          className="absolute right-4 top-4 text-gray-600 hover:text-black text-2xl"
          onClick={onClose}
        >
          &times;
        </button>

        <div className="flex justify-center mb-6">
          <Logo />
        </div>

        <h2 className="text-2xl font-semibold text-center mb-8 text-black">
          Select Your Role
        </h2>

        <button
          onClick={() => onSelect("student")}
          className="w-full bg-primary text-white py-4 rounded-xl text-lg font-semibold mb-4 hover:bg-primary/90"
        >
          I am a Student
        </button>

        <button
          onClick={() => onSelect("alumni")}
          className="w-full border border-primary text-primary py-4 rounded-xl text-lg font-semibold hover:bg-primary hover:text-white transition"
        >
          I am an Alumni
        </button>
      </div>
    </div>
  );
};

export default RoleSelectionModal;
