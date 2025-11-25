"use client";

import Link from "next/link";

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
          <Link key={sub.id} href={`/resources/${sub.id}`}>
            <div className="bg-white rounded-2xl shadow-md hover:shadow-xl transition cursor-pointer border">
              <img
                src={sub.img}
                alt={sub.title}
                className="w-full h-48 object-cover rounded-t-2xl"
              />

              <div className="p-5">
                <h2 className="text-xl font-semibold mb-2">{sub.title}</h2>
                <p className="text-gray-600 text-sm">{sub.desc}</p>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
