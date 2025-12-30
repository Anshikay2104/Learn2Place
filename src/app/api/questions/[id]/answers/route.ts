import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

type Params = {
  params: Promise<{ id: string }>;
};

/* ---------- GET answers ---------- */

export async function GET(_req: NextRequest, { params }: Params) {
  const { id } = await params;

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  // answers + profile
  const { data: answers, error } = await supabase
    .from("answers")
    .select(
      `
      id,
      body,
      created_at,
      profiles!answers_responder_id_fkey (
        full_name,
        role
      )
    `
    )
    .eq("question_id", id)
    .order("created_at", { ascending: true });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  // upvote counts
  const answerIds = answers.map((a: any) => a.id);

  let upvoteCounts: Record<string, number> = {};

  if (answerIds.length > 0) {
    const { data: upvotes } = await supabase
      .from("answer_upvotes")
      .select("answer_id")
      .in("answer_id", answerIds);

    upvotes?.forEach((u) => {
      upvoteCounts[u.answer_id] =
        (upvoteCounts[u.answer_id] || 0) + 1;
    });
  }

  return NextResponse.json(
    answers.map((a: any) => ({
      id: a.id,
      body: a.body,
      created_at: a.created_at,
      author_name: a.profiles?.full_name ?? "Unknown",
      author_role: a.profiles?.role ?? "",
      upvotes: upvoteCounts[a.id] || 0,
    }))
  );
}

/* ---------- POST answer (LOGIN REQUIRED) ---------- */

export async function POST(req: NextRequest, { params }: Params) {
  const { id } = await params;
  const body = await req.json();

  const text = body.text?.trim();
  const responderId = body.responder_id;

  if (!text || !responderId) {
    return NextResponse.json(
      { error: "Login required to post answer" },
      { status: 401 }
    );
  }

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  const { data, error } = await supabase
    .from("answers")
    .insert({
      question_id: id,
      responder_id: responderId,
      body: text,
    })
    .select()
    .single();

  if (error) {
    console.error("Insert error:", error);
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }

  return NextResponse.json(data, { status: 201 });
}
