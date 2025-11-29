import AskQuestionForm from "./AskQuestionForm";
import QuestionCard from "./QuestionCard";
import { createClient } from "@supabase/supabase-js";

export default async function ForumPage() {
  // Use service-role key to bypass RLS and fetch all questions
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;

  let questions = [];
  let error = null;

  if (url && key) {
    const supabase = createClient(url, key);
    const res = await supabase
      .from("questions")
      .select("id, title, body, created_at")
      .order("created_at", { ascending: false })
      .limit(20);

    questions = res.data || [];
    error = res.error;
  }

  if (error) console.error("Forum page query error:", error);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-5xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold">Forum</h1>
            <p className="text-sm text-gray-500">Ask questions and learn from the community</p>
          </div>

          {/* Top-right button */}
          <a href="#ask" className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg">
            Post Question
          </a>
        </div>

        {/* Ask form */}
        <div id="ask">
          <AskQuestionForm />
        </div>

        {/* Questions list */}
        <div className="mt-8 space-y-4">
          {questions && questions.length > 0 ? (
            questions.map((q: any) => (
              <QuestionCard key={q.id} id={q.id} title={q.title} body={q.body} created_at={q.created_at} />
            ))
          ) : (
            <div className="text-sm text-gray-500">No questions yet.</div>
          )}
        </div>
      </div>
    </div>
  );
}
