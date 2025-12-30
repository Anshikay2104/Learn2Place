import ForumClient from "./ForumClient";
import ForumPagination from "./ForumPagination";
import { createClient } from "@supabase/supabase-js";

export const dynamic = "force-dynamic";

interface Question {
  id: string;
  title: string;
  body: string;
  created_at: string;
  answersCount?: number;
}

export default async function ForumPage() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;

  let questions: Question[] = [];
  let totalCount = 0;

  if (url && key) {
    try {
      const supabase = createClient(url, key);

      // fetch questions
      const { data, count, error } = await supabase
        .from("questions")
        .select("id, title, body, created_at", { count: "exact" })
        .order("created_at", { ascending: false })
        .limit(20);

      if (!error) {
        questions = data || [];
        totalCount = count || 0;
      }
    } catch (err: any) {
      console.error(
        "Forum: failed to fetch questions:",
        err?.message || err
      );
      questions = [];
      totalCount = 0;
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-5xl mx-auto px-4 py-8">
        {/* Client-side UI (ask question modal, etc.) */}
        <ForumClient />

        {/* Questions + pagination */}
        <ForumPagination
          initialQuestions={questions}
          totalCount={totalCount}
        />
      </div>
    </div>
  );
}
