import { createClient } from "@supabase/supabase-js";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "15");

    const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const key = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!url || !key) {
      return Response.json({ error: "Missing Supabase credentials" }, { status: 500 });
    }

    const supabase = createClient(url, key);

    // Calculate offset
    const offset = (page - 1) * limit;

    // Fetch questions with pagination
    const res = await supabase
      .from("questions")
      .select("id, title, body, created_at", { count: "exact" })
      .order("created_at", { ascending: false })
      .range(offset, offset + limit - 1);

    if (res.error) {
      throw res.error;
    }

    const questions = res.data || [];

    // Fetch answer counts for the returned question ids in one query
    const ids = questions.map((q: any) => q.id).filter(Boolean);
    let answersCountMap: Record<string | number, number> = {};

    if (ids.length > 0) {
      const ansRes = await supabase
        .from("answers")
        .select("question_id")
        .in("question_id", ids as any[]);

      if (!ansRes.error && Array.isArray(ansRes.data)) {
        for (const a of ansRes.data) {
          const key = a.question_id;
          answersCountMap[key] = (answersCountMap[key] || 0) + 1;
        }
      }
    }

    const questionsWithCounts = questions.map((q: any) => ({
      ...q,
      answersCount: answersCountMap[q.id] || 0,
    }));

    return Response.json({
      questions: questionsWithCounts,
      page,
      limit,
      total: res.count || 0,
    });
  } catch (error: any) {
    console.error("Error fetching paginated questions:", error);
    return Response.json(
      { error: error?.message || "Failed to fetch questions" },
      { status: 500 }
    );
  }
}
