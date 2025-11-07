// app/(site)/resources/[topic]/page.tsx

import React from "react";
import Link from "next/link";

interface Resource {
  title: string;
  type: "Article" | "Video" | "PDF";
  link: string;
}

// Resources data
const allResources: Record<string, Resource[]> = {
  "data-structures-algorithms": [
    {
      title: "Striver’s DSA Sheet",
      type: "Article",
      link: "https://takeuforward.org/interview-experience/strivers-sde-sheet-topics-covered/",
    },
    {
      title: "NeetCode Roadmap",
      type: "Video",
      link: "https://www.youtube.com/@NeetCode",
    },
  ],
  "computer-networks": [
    {
      title: "GeeksforGeeks Networking Tutorials",
      type: "Article",
      link: "https://www.geeksforgeeks.org/computer-network-tutorials/",
    },
    {
      title: "Computer Networking Crash Course",
      type: "Video",
      link: "https://youtu.be/qiQR5rTSshw",
    },
  ],
  "operating-systems": [
    {
      title: "Operating System Concepts (Silberschatz Book)",
      type: "PDF",
      link: "#",
    },
    {
      title: "OS Basics - Neso Academy",
      type: "Video",
      link: "https://youtu.be/KeLiQXqVgMI",
    },
  ],
  "object-oriented-programming-oops": [
    {
      title: "OOPs Explained in Java",
      type: "Article",
      link: "https://www.javatpoint.com/java-oops-concepts",
    },
    {
      title: "OOP in Python - FreeCodeCamp",
      type: "Video",
      link: "https://youtu.be/JeznW_7DlB0",
    },
  ],
};

// Normalize topic strings (remove trailing hyphens)
const normalizeTopic = (topic: string) => topic.replace(/-+$/, "");

// Static params for all topics
export async function generateStaticParams() {
  return Object.keys(allResources).map((topic) => ({ topic }));
}

interface PageProps {
  params: { topic: string };
}

export default function ResourceDetailPage({ params }: PageProps) {
  const normalizedTopic = normalizeTopic(params.topic);
  const resources = allResources[normalizedTopic] || [];

  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 to-gray-100 py-12 px-6 md:px-20">
      <h1 className="text-4xl font-bold text-center mb-10 text-gray-800 capitalize">
        {normalizedTopic.replace(/-/g, " ")}
      </h1>

      {resources.length > 0 ? (
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {resources.map((res, index) => (
            <div
              key={index}
              className="bg-white p-6 rounded-2xl shadow-md hover:shadow-lg transition-all duration-300 border border-gray-200"
            >
              <h3 className="text-lg font-semibold text-gray-800 mb-2">{res.title}</h3>
              <p className="text-sm text-gray-500 mb-4">{res.type}</p>
              <Link
                href={res.link}
                target="_blank"
                className="text-blue-600 hover:text-blue-800 text-sm font-medium"
              >
                Open Resource →
              </Link>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-center text-gray-600">No resources available yet.</p>
      )}
    </main>
  );
}
