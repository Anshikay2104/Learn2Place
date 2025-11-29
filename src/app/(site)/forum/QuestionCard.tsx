import Link from "next/link";
import { MessageCircle } from "lucide-react";

type Props = {
  id?: string | number;
  title?: string;
  body?: string;
  created_at?: string;
  answersCount?: number;
};

function formatDateConsistent(iso?: string) {
  if (!iso) return "recently";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "recently";

  const day = String(d.getDate()).padStart(2, "0");
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const year = d.getFullYear();

  let hours = d.getHours();
  const minutes = String(d.getMinutes()).padStart(2, "0");
  const seconds = String(d.getSeconds()).padStart(2, "0");
  const ampm = hours >= 12 ? "pm" : "am";
  hours = hours % 12 || 12;
  const hourStr = String(hours).padStart(2, "0");

  return `${day}/${month}/${year}, ${hourStr}:${minutes}:${seconds} ${ampm}`;
}

export default function QuestionCard({
  id,
  title,
  body,
  created_at,
  answersCount = 0,
}: Props) {
  return (
    <div className="bg-white rounded-xl border shadow-sm p-5 hover:shadow-md transition">
      <div className="flex-1">
        <Link href={`/forum/${id ?? "1"}`}>
          <h2 className="text-lg font-semibold text-indigo-700 hover:underline">{title ?? "How to prepare for Amazon SDE internship?"}</h2>
        </Link>

        <p className="text-sm text-gray-600 mt-2 line-clamp-2">{body ?? "I'm in my 2nd year and want guidance on DSA, projects, and resume…"}</p>

        <div className="flex justify-between items-center mt-4 text-xs text-gray-500">
          <div className="flex gap-2">
            <span className="bg-indigo-50 text-indigo-600 px-2 py-0.5 rounded">#general</span>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1">
              <MessageCircle size={16} />
              <span>{answersCount} {answersCount === 1 ? "reply" : "replies"}</span>
            </div>
            <span>{formatDateConsistent(created_at)}</span>
            <Link href={`/forum/${id ?? "1"}`} className="ml-2 inline-flex items-center px-3 py-1.5 bg-indigo-600 text-white rounded text-xs hover:bg-indigo-700">
              View / Reply
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
