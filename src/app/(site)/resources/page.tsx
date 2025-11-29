"use client";

import Link from "next/link";
import { Plus } from "lucide-react";

const SUBJECTS = [
  {
    id: "dsa",
    title: "Data Structures & Algorithms",
    desc: "Master DSA concepts, patterns, and interview problems.",
    img: "/images/resources/dsa.jpg",
  },
  {
    id: "cn",
    title: "Computer Networks",
    desc: "Understand networking protocols, OSI model, and real-world communication.",
    img: "/images/resources/network.jpg",
  },
  {
    id: "os",
    title: "Operating Systems",
    desc: "Learn process management, memory scheduling, and system architecture.",
    img: "/images/resources/os.jpg",
  },
  {
    id: "oops",
    title: "Object Oriented Programming (OOPs)",
    desc: "Grasp pillars of OOP — inheritance, polymorphism, encapsulation.",
    img: "/images/resources/oops.jpg",
  },
  {
    id: "dbms",
    title: "Database Management Systems (DBMS)",
    desc: "Normalization, ACID properties, indexing, SQL queries.",
    img: "/images/resources/dbms.jpg",
  },
  {
    id: "sd",
    title: "System Design",
    desc: "Design scalable systems, databases, and architecture patterns.",
    img: "/images/resources/sys.jpg",
  },
];

export default function ResourcesPage() {
  return (
    <div className="px-6 py-10 lg:px-24">
      <h1 className="text-4xl font-bold mb-10 text-center">Learning Resources</h1>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-10">
        {SUBJECTS.map((sub) => (
          <div
            key={sub.id}
            className="bg-white rounded-2xl shadow-md hover:shadow-xl transition border"
          >
            {/* Subject Image */}
            <Link href={`/resources/${sub.id}`}>
              <img
                src={sub.img}
                alt={sub.title}
                className="w-full h-48 object-cover rounded-t-2xl cursor-pointer"
              />
            </Link>

            <div className="p-5">
              {/* Title */}
              <Link href={`/resources/${sub.id}`}>
                <h2 className="text-xl font-semibold mb-2 cursor-pointer">
                  {sub.title}
                </h2>
              </Link>

              {/* Description */}
              <p className="text-gray-600 text-sm mb-4">{sub.desc}</p>

              {/* Add Resource Button */}
              <Link
                href={`/resources/${sub.id}/add`}
                className="w-full flex items-center justify-center gap-2 
                bg-gradient-to-r from-indigo-500 to-purple-500 
                text-white text-sm font-medium py-2 rounded-lg shadow 
                hover:scale-105 transition"
              >
                <Plus className="w-4 h-4" />
                Add Resource
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
