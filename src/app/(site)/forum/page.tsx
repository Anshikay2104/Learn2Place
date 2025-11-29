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
  let error = null;

  if (url && key) {
    const supabase = createClient(url, key);
    const res = await supabase
      .from("questions")
      .select("id, title, body, created_at", { count: "exact" })
      .order("created_at", { ascending: false })
      .range(0, 14);

    const fetched = res.data || [];

    // fetch answer counts for the initial page
    const ids = fetched.map((q: any) => q.id).filter(Boolean);
    const answersCountMap: Record<string | number, number> = {};

    if (ids.length > 0) {
      const ansRes = await supabase
        .from("answers")
        .select("question_id")
        .in("question_id", ids as any[]);

      if (!ansRes.error && Array.isArray(ansRes.data)) {
        for (const a of ansRes.data) {
          answersCountMap[a.question_id] = (answersCountMap[a.question_id] || 0) + 1;
        }
      }
    }

    questions = fetched.map((q: any) => ({ ...q, answersCount: answersCountMap[q.id] || 0 }));
    totalCount = res.count || 0;
    error = res.error;
  }

  if (error) console.error("Forum page query error:", error);

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
