"use client";

import { useEffect, useState } from "react";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { useParams } from "next/navigation";
import Link from "next/link";
import { toast } from "react-hot-toast";
import { Bookmark, Plus } from "lucide-react";

const SUBJECT_DETAILS: Record<string, any> = {
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
  const { subject } = useParams() as { subject: string };
  const info = SUBJECT_DETAILS[subject];

  const [resources, setResources] = useState<any[]>([]);
  const [bookmarks, setBookmarks] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  // -----------------------------------------------------------
  // LOAD RESOURCES + USER BOOKMARKS
  // -----------------------------------------------------------
  useEffect(() => {
    async function loadPage() {
      try {
        const { data: { user } } = await supabase.auth.getUser();

        // Fetch resources
        const { data: res } = await supabase
          .from("resources")
          .select("*")
          .eq("subject_id", subject)
          .order("created_at", { ascending: false });

        setResources(res || []);

        // Fetch bookmarks
        if (user) {
          const { data: bm } = await supabase
            .from("resource_bookmarks")
            .select("resource_id")
            .eq("user_id", user.id);

          setBookmarks(bm?.map((x) => x.resource_id) || []);
        }
      } catch (err) {
        console.error(err);
        toast.error("Something went wrong");
      } finally {
        setLoading(false);
      }
    }

    loadPage();
  }, [subject]);

  // -----------------------------------------------------------
  // TOGGLE BOOKMARK
  // -----------------------------------------------------------
  async function toggleBookmark(resourceId: string) {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return toast.error("Please login to bookmark");

    const already = bookmarks.includes(resourceId);

    if (already) {
      await supabase
        .from("resource_bookmarks")
        .delete()
        .eq("user_id", user.id)
        .eq("resource_id", resourceId);

      setBookmarks((prev) => prev.filter((id) => id !== resourceId));
      toast("Removed from bookmarks");
    } else {
      await supabase.from("resource_bookmarks").insert({
        user_id: user.id,
        resource_id: resourceId,
      });

      setBookmarks((prev) => [...prev, resourceId]);
      toast.success("Bookmarked!");
    }
  }

  // -----------------------------------------------------------
  // UI
  // -----------------------------------------------------------
  if (loading) return <div className="px-6 py-10">Loading…</div>;

  return (
    <div className="px-6 py-10 lg:px-20">

      {/* Banner Section */}
      <div className="mb-12">
        <img
          src={info?.banner}
          alt={info?.title}
          className="w-full h-64 object-cover rounded-xl shadow-lg"
        />

        <div className="flex items-center justify-between mt-6">
          <div>
            <h1 className="text-4xl font-bold">{info?.title}</h1>
            <p className="text-lg text-gray-600 mt-2">{info?.desc}</p>
          </div>

          {/* ADD RESOURCE BUTTON (always visible) */}
          <Link
            href={`/resources/${subject}/add`}
            className="px-5 py-2 bg-gradient-to-r from-indigo-500 to-purple-500 
                       text-white rounded-lg shadow hover:scale-105 transition flex items-center gap-2"
          >
            <Plus className="w-5 h-5" />
            Add Resource
          </Link>
        </div>
      </div>

      {/* Resource Grid */}
      {resources.length === 0 ? (
        <p className="text-gray-500 text-lg">No resources added yet.</p>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {resources.map((res) => {
            const isBookmarked = bookmarks.includes(res.id);

            return (
              <div
                key={res.id}
                className="bg-white border rounded-2xl shadow-md p-5 hover:shadow-lg transition relative"
              >
                {/* Bookmark Button */}
                <button
                  onClick={() => toggleBookmark(res.id)}
                  className="absolute top-4 right-4"
                >
                  <Bookmark
                    className={`w-6 h-6 ${
                      isBookmarked
                        ? "text-purple-600 fill-purple-600"
                        : "text-gray-400"
                    }`}
                  />
                </button>

                {/* Resource Title */}
                <h3 className="font-semibold text-lg mb-2">{res.title}</h3>

                {/* File / Link */}
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

                {/* Upload Date */}
                <p className="text-xs text-gray-500 mt-3">
                  Uploaded on {new Date(res.created_at).toLocaleDateString()}
                </p>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
