import Link from "next/link";
import { ArrowUp } from "lucide-react";

type Props = {
  id?: string | number;
  title?: string;
  body?: string;
  created_at?: string;
  upvotes?: number;
  answersCount?: number;
};

export default function QuestionCard({
  id,
  title,
  body,
  created_at,
  upvotes = 12,
  answersCount = 2,
}: Props) {
  return (
    <div className="bg-white rounded-xl border shadow-sm p-5 hover:shadow-md transition">
      <div className="flex gap-6">
        <div className="flex flex-col items-center text-gray-500">
          <ArrowUp size={18} />
          <span className="font-semibold text-gray-900">{upvotes}</span>
        </div>

        <div className="flex-1">
          <Link href={`/forum/${id ?? "1"}`}>
            <h2 className="text-lg font-semibold text-indigo-700 hover:underline">{title ?? "How to prepare for Amazon SDE internship?"}</h2>
          </Link>

          <p className="text-sm text-gray-600 mt-1 line-clamp-2">{body ?? "I’m in my 2nd year and want guidance on DSA, projects, and resume…"}</p>

          <div className="flex justify-between items-center mt-3 text-xs text-gray-500">
            <div className="flex gap-2">
              <span className="bg-indigo-50 text-indigo-600 px-2 py-0.5 rounded">#amazon</span>
              <span className="bg-indigo-50 text-indigo-600 px-2 py-0.5 rounded">#internship</span>
            </div>
            <div className="flex items-center gap-3">
              <span>{answersCount} answers • {created_at ? new Date(created_at).toLocaleString() : "1 day ago"}</span>
              <Link href={`/forum/${id ?? "1"}`} className="ml-2 inline-flex items-center px-3 py-1.5 bg-indigo-600 text-white rounded text-xs hover:bg-indigo-700">View / Reply</Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
