import ForumClient from "./ForumClient";
import QuestionCard from "./QuestionCard";
import { createClient } from "@supabase/supabase-js";

export const dynamic = "force-dynamic";

interface Question {
  id: string;
  title: string;
  body: string;
  created_at: string;
}

export default async function ForumPage() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;

  let questions: Question[] = [];

  if (url && key) {
    try {
      const supabase = createClient(url, key);
      const res = await supabase
        .from("questions")
        .select("id, title, body, created_at")
        .order("created_at", { ascending: false })
        .limit(20);

      questions = res.data || [];
    } catch (err: any) {
      console.error("Forum: failed to fetch questions (skipping):", err?.message || err);
      questions = [];
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-5xl mx-auto px-4 py-8">
        <ForumClient />

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
import ForumClient from "./ForumClient";
import ForumPagination from "./ForumPagination";
import { createClient } from "@supabase/supabase-js";

interface Question {
  id: string;
  title: string;
  body: string;
  created_at: string;
  answersCount?: number;
}

export default async function ForumPage() {
  // Use service-role key to bypass RLS and fetch all questions
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;

  let questions: Question[] = [];
    let totalCount = 0;

  if (url && key) {
      try {
        const supabase = createClient(url, key);
        const res = await supabase
          .from("questions")
          .select("id, title, body, created_at")
          .order("created_at", { ascending: false })
          .limit(20);

        questions = res.data || [];
      } catch (err: any) {
        // Avoid noisy build logs by logging a concise message
        console.error("Forum: failed to fetch questions (skipping):", err?.message || err);
        questions = [];
      }
  }

    const error = null; // Placeholder for error handling if needed

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-5xl mx-auto px-4 py-8">
        {/* Header */}


        {/* Header + client UI (modal open) */}
        <ForumClient />

        {/* Pagination with questions */}
        <ForumPagination initialQuestions={questions} totalCount={totalCount} />
      </div>
    </div>
  );
}
