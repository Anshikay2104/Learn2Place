// app/api/questions/[id]/answers/route.ts
import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { createClient } from "@supabase/supabase-js";

// context.params can be a Promise in Next.js types; resolve it to get id
type Params = { params: { id: string } | Promise<{ id: string }> };

export async function GET(_req: NextRequest, context: Params) {
  const supabase = createRouteHandlerClient({ cookies });

  const resolvedParams = await context.params;
  const questionId = resolvedParams.id;

  const { data, error } = await supabase
    .from("answers")
    .select(
      `
      id,
      body,
      created_at,
      responder_id,
      profiles!answers_responder_id_fkey(full_name, role)
    `
    )
    .eq("question_id", questionId)
    .order("created_at", { ascending: true });

  if (error) {
    console.error(error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  // Fetch upvote counts for all answers in one query
  const answerIds = (data || []).map((a: any) => a.id);
  const upvoteCounts: Record<string, number> = {};

  if (answerIds.length > 0) {
    const { data: upvotes, error: upvoteError } = await supabase
      .from("answer_upvotes")
      .select("answer_id");

    if (!upvoteError && upvotes) {
      for (const uv of upvotes) {
        upvoteCounts[uv.answer_id] = (upvoteCounts[uv.answer_id] || 0) + 1;
      }
    }
  }

  const formatted = (data || []).map((a: any) => ({
    id: a.id,
    body: a.body,
    created_at: a.created_at,
    responder_id: a.responder_id,
    author_name: a.profiles?.full_name ?? "Unknown",
    author_role: a.profiles?.role ?? "",
    upvotes: upvoteCounts[a.id] || 0,
  }));

  return NextResponse.json(formatted);
}

export async function POST(req: NextRequest, context: Params) {
  const supabase = createRouteHandlerClient({ cookies });

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const resolvedParams = await context.params;
  const questionId = resolvedParams.id;

  // Allow anonymous answers: do not require authentication
  const responderId = user ? user.id : null;

  const body = await req.json();
  const { text } = body;

  let data: any = null;
  let error: any = null;

  if (responderId !== null) {
    const res = await supabase
      .from("answers")
      .insert({ question_id: questionId, responder_id: responderId, body: text })
      .select()
      .single();
    data = res.data;
    error = res.error;
  } else {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
    if (!url || !key) {
      console.error("Missing SUPABASE_SERVICE_ROLE_KEY for anonymous inserts");
      return NextResponse.json(
        { error: "Server not configured to accept anonymous answers" },
        { status: 500 }
      );
    }

    // Use service-role key which bypasses RLS
    const svc = createClient(url, key);
    const res = await svc
      .from("answers")
      .insert({ question_id: questionId, responder_id: null, body: text })
      .select()
      .single();
    data = res.data;
    error = res.error;
  }

  if (error) {
    console.error("Answer insert error:", error);
    return NextResponse.json({ error: error.message }, { status: 400 });
  }

  return NextResponse.json(data, { status: 201 });
}
