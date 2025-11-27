// app/api/questions/[id]/answers/route.ts
import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";

type Params = { params: { id: string } };

export async function GET(_req: NextRequest, { params }: Params) {
  const supabase = createRouteHandlerClient({ cookies });

  const { data, error } = await supabase
    .from("answers")
    .select(
      `
      id,
      body,
      created_at,
      responder_id,
      profiles!inner(full_name, role),
      answer_upvotes(count)
    `
    )
    .eq("question_id", params.id)
    .order("created_at", { ascending: true });

  if (error) {
    console.error(error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  const formatted = (data || []).map((a: any) => ({
    id: a.id,
    body: a.body,
    created_at: a.created_at,
    responder_id: a.responder_id,
    author_name: a.profiles?.full_name ?? "Unknown",
    author_role: a.profiles?.role ?? "",
    upvotes: a.answer_upvotes?.[0]?.count ?? 0,
  }));

  return NextResponse.json(formatted);
}

export async function POST(req: NextRequest, { params }: Params) {
  const supabase = createRouteHandlerClient({ cookies });

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  const body = await req.json();
  const { text } = body;

  const { data, error } = await supabase
    .from("answers")
    .insert({
      question_id: params.id,
      responder_id: user.id,
      body: text,
    })
    .select()
    .single();

  if (error) {
    console.error(error);
    return NextResponse.json({ error: error.message }, { status: 400 });
  }

  return NextResponse.json(data, { status: 201 });
}
