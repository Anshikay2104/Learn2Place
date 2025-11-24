"use client";

import { useEffect, useState } from "react";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { useParams } from "next/navigation";
import Link from "next/link";

const SUBJECT_DETAILS: any = {
  dsa: {
    title: "Data Structures & Algorithms",
    banner: "/images/resources/dsa.jpg",
    desc: "Master DSA for interviews and competitive programming.",
  },
  cn: {
    title: "Computer Networks",
    banner: "/images/resources/network.jpg",
    desc: "Understand networking protocols, OSI model, and communication.",
  },
  os: {
    title: "Operating Systems",
    banner: "/images/resources/os.jpg",
    desc: "Learn process management, memory management, and scheduling.",
  },
  oops: {
    title: "Object Oriented Programming",
    banner: "/images/resources/oops.jpg",
    desc: "Master abstraction, inheritance, polymorphism, encapsulation.",
  },
  dbms: {
    title: "Database Management Systems",
    banner: "/images/resources/dbms.jpg",
    desc: "Normalization, ACID properties, indexing and SQL queries.",
  },
  sd: {
    title: "System Design",
    banner: "/images/resources/sys.jpg",
    desc: "Scalable systems, databases, and distributed architecture.",
  },
};

export default function SubjectPage() {
  const supabase = createClientComponentClient();
  const { subject } = useParams() as { subject?: string };
  const info = subject ? (SUBJECT_DETAILS as Record<string, any>)[subject] : undefined;

  const [resources, setResources] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadResources = async () => {
      const { data } = await supabase
        .from("resources")
        .select("*")
        .eq("subject_id", subject)
        .order("created_at", { ascending: false });

      setResources(data || []);
      setLoading(false);
    };

    loadResources();
  }, [subject]);

  return (
    <div className="px-6 py-10 lg:px-20">
      {/* Banner Section */}
      <div className="mb-12">
        <img
          src={info.banner}
          className="w-full h-64 object-cover rounded-xl shadow-lg"
        />
        <h1 className="text-4xl font-bold mt-6">{info.title}</h1>
        <p className="text-lg text-gray-600 mt-2">{info.desc}</p>
      </div>

      {/* Resource Grid */}
      {loading ? (
        <p>Loading resources...</p>
      ) : resources.length === 0 ? (
        <p className="text-gray-500 text-lg">No resources added yet.</p>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {resources.map((res: any) => (
            <div
              key={res.id}
              className="bg-white border rounded-2xl shadow-md p-5 hover:shadow-lg transition"
            >
              <h3 className="font-semibold text-lg mb-2">{res.title}</h3>

              {res.resource_type === "file" ? (
                <a
                  href={res.file_path}
                  target="_blank"
                  className="text-blue-600 underline text-sm"
                >
                  📄 Download File
                </a>
              ) : (
                <a
                  href={res.url}
                  target="_blank"
                  className="text-green-600 underline text-sm"
                >
                  🔗 Open Link
                </a>
              )}

              <p className="text-xs text-gray-500 mt-3">
                Uploaded on {new Date(res.created_at).toLocaleDateString()}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
