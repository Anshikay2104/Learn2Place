"use client";

import { useEffect, useState } from "react";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { useParams } from "next/navigation";
import { toast } from "react-hot-toast";
import { Bookmark } from "lucide-react";

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
  const info = subject ? SUBJECT_DETAILS[subject] : undefined;

  const [resources, setResources] = useState<any[]>([]);
  const [bookmarks, setBookmarks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Load resources + bookmarks
  useEffect(() => {
    const loadEverything = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();

        // LOAD RESOURCES
        const { data: resourceData } = await supabase
          .from("resources")
          .select("*")
          .eq("subject_id", subject)
          .order("created_at", { ascending: false });

        setResources(resourceData || []);

        // LOAD USER BOOKMARKS
        if (user) {
          const { data: bookmarkData } = await supabase
            .from("resource_bookmarks")
            .select("resource_id")
            .eq("user_id", user.id);

          setBookmarks(bookmarkData || []);
        }

      } catch (err) {
        console.error(err);
        toast.error("Failed to load content");
      } finally {
        setLoading(false);
      }
    };

    if (subject && info) loadEverything();
    else setLoading(false);
  }, [subject]);

  // Bookmark toggle function
  async function toggleBookmark(resourceId: string) {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return toast.error("Please login to bookmark");

    const isBookmarked = bookmarks.some((b) => b.resource_id === resourceId);

    if (isBookmarked) {
      // REMOVE bookmark
      await supabase
        .from("resource_bookmarks")
        .delete()
        .eq("user_id", user.id)
        .eq("resource_id", resourceId);

      setBookmarks((prev) => prev.filter((b) => b.resource_id !== resourceId));
      toast("Removed from bookmarks");
    } else {
      // ADD bookmark
      await supabase.from("resource_bookmarks").insert({
        user_id: user.id,
        resource_id: resourceId,
      });

      setBookmarks((prev) => [...prev, { resource_id: resourceId }]);
      toast.success("Bookmarked!");
    }
  }

  if (loading) return <p className="px-6 py-10">Loading…</p>;

  return (
    <div className="px-6 py-10 lg:px-20">
      {/* Banner Section */}
      <div className="mb-12">
        <img
          src={info?.banner ?? "/images/resources/default.jpg"}
          alt={info?.title ?? "Subject banner"}
          className="w-full h-64 object-cover rounded-xl shadow-lg"
        />
        <h1 className="text-4xl font-bold mt-6">{info?.title ?? "Subject"}</h1>
        <p className="text-lg text-gray-600 mt-2">{info?.desc ?? ""}</p>
      </div>

      {/* Resource Grid */}
      {resources.length === 0 ? (
        <p className="text-gray-500 text-lg">No resources added yet.</p>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {resources.map((res) => {
            const isBookmarked = bookmarks.some(
              (b) => b.resource_id === res.id
            );

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
            );
          })}
        </div>
      )}
    </div>
  );
}
