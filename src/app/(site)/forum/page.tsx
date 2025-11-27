import Link from "next/link";
import AskQuestionForm from "./AskQuestionForm";
import { createSupabaseServerClient } from "@/utils/supabase/server";

export default async function ForumPage() {
  const supabase = createSupabaseServerClient();

  const { data: questions, error } = await supabase
    .from("questions")
    .select("id, title, created_at")
    .order("created_at", { ascending: false })
    .limit(20);

  if (error) {
    console.error(error);
  }

  return (
    <div className="min-h-screen bg-gray-50 px-6 pt-48">
      <div className="max-w-4xl mx-auto space-y-6">
        <h1 className="text-3xl font-bold">Forum</h1>

        {/* Ask question (client component) */}
        <AskQuestionForm />

        {/* List questions */}
        <div className="bg-white rounded-xl shadow p-4">
          <h2 className="text-lg font-semibold mb-3">All Questions</h2>
          <ul className="space-y-2">
            {questions?.map((q) => (
              <li key={q.id}>
                <Link
                  href={`/forum/${q.id}`}
                  className="text-indigo-600 hover:underline"
                >
                  {q.title}
                </Link>
              </li>
            ))}
            {!questions?.length && (
              <li className="text-sm text-gray-500">No questions yet.</li>
            )}
          </ul>
        </div>
      </div>
    </div>
  );
}
