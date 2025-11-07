"use client";

import React from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";

interface ResourceCategory {
  name: string;
  icon: string;
  description: string;
}

const categories: ResourceCategory[] = [
  {
    name: "Data Structures & Algorithms",
    icon: "/images/resources/dsa.jpg",
    description: "Master DSA concepts, patterns, and interview problems.",
  },
  {
    name: "Computer Networks",
    icon: "/images/resources/network.jpg",
    description: "Understand networking protocols, OSI model, and real-world communication.",
  },
  {
    name: "Operating Systems",
    icon: "/images/resources/os.jpg",
    description: "Learn process management, memory, scheduling, and system architecture.",
  },
  {
    name: "Object Oriented Programming (OOPs)",
    icon: "/images/resources/oops.jpg",
    description: "Grasp key principles — inheritance, polymorphism, encapsulation, abstraction.",
  },
];

const ResourcesPage: React.FC = () => {
  const router = useRouter();

  const handleNavigate = (topic: string) => {
    const slug = topic.toLowerCase().replace(/[^a-z0-9]+/g, "-");
    router.push(`/resources/${slug}`);
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 to-gray-100 py-12 px-6 md:px-20">
      <h1 className="text-4xl font-bold text-center mb-12 text-gray-800">
        Explore Learning Resources
      </h1>

      <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
        {categories.map((cat) => (
          <div
            key={cat.name}
            onClick={() => handleNavigate(cat.name)}
            className="cursor-pointer bg-white rounded-2xl shadow-md hover:shadow-xl hover:-translate-y-1 transition-all duration-300 p-6 border border-gray-200 flex flex-col items-center text-center"
          >
            {/* Image fills the card width */}
            <div className="relative w-full h-40 mb-4 rounded-lg overflow-hidden">
              <Image
                src={cat.icon}
                alt={cat.name}
                fill
                className="object-cover"
              />
            </div>

            <h2 className="text-xl font-semibold text-gray-800 mb-2">
              {cat.name}
            </h2>
            <p className="text-sm text-gray-600">{cat.description}</p>
          </div>
        ))}
      </div>
    </main>
  );
};

export default ResourcesPage;
