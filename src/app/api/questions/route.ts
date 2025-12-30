// app/api/questions/route.ts
import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

/* =======================
   GET QUESTIONS
======================= */
export async function GET() {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  const { data, error } = await supabase
    .from("questions")
    .select("id, title, body, created_at, asker_id")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Questions GET error:", error);
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }

  return NextResponse.json(data || []);
}

/* =======================
   POST QUESTION
======================= */
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { title, description, user_id } = body;

    if (!title || !description || !user_id) {
      return NextResponse.json(
        { error: "title, description and user_id are required" },
        { status: 400 }
      );
    }

    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    // 🔑 MUST MATCH DB COLUMN: asker_id
    const { data, error } = await supabase
      .from("questions")
      .insert({
        title,
        body: description,
        asker_id: user_id,
      })
      .select()
      .single();

    if (error) {
      console.error("Question POST error:", error);
      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json(data, { status: 201 });
  } catch (err) {
    console.error("POST /api/questions crash:", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
