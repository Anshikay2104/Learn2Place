"use client";

import React, { useState } from "react";
import Image from "next/image";

interface Experience {
  person: string;
  photo: string;
  companyLogo: string;
  description: string;
}

interface Props {
  experiences: Experience[];
}

export const ExperienceCards: React.FC<Props> = ({ experiences }) => {
  const [modalContent, setModalContent] = useState<string | null>(null);

  return (
    <>
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {experiences.map((exp, idx) => (
          <div
            key={idx}
            className="bg-white p-5 rounded-2xl shadow-md relative hover:shadow-lg transition-all duration-300"
          >
            {/* Person Photo */}
            <div className="relative w-24 h-24 rounded-full overflow-hidden mx-auto">
              <Image src={exp.photo} alt={exp.person} fill className="object-cover" />
            </div>

            {/* Company Logo */}
            <div className="absolute top-3 right-3 w-12 h-12 rounded-full overflow-hidden border-2 border-white shadow">
              <Image src={exp.companyLogo} alt="Company Logo" fill className="object-contain" />
            </div>

            {/* Person Name */}
            <h3 className="mt-4 text-lg font-semibold text-gray-800 text-center">{exp.person}</h3>

            {/* Description */}
            <p className="mt-2 text-gray-600 text-sm line-clamp-3">{exp.description}</p>

            {/* Read More Button */}
            <button
              className="mt-3 text-blue-600 hover:text-blue-800 text-sm font-medium"
              onClick={() => setModalContent(exp.description)}
            >
              Read More
            </button>
          </div>
        ))}
      </div>

      {/* Modal */}
      {modalContent && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-2xl max-w-lg w-full relative">
            <button
              className="absolute top-3 right-3 text-gray-500 hover:text-gray-800"
              onClick={() => setModalContent(null)}
            >
              ✕
            </button>
            <h2 className="text-xl font-bold mb-4">Experience Details</h2>
            <p className="text-gray-700">{modalContent}</p>
          </div>
        </div>
      )}
    </>
  );
};
