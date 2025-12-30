import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

type Params = {
  params: Promise<{ id: string }>;
};

export async function GET(
  _req: Request,
  { params }: Params
) {
  try {
    // ✅ params must be awaited
    const { id } = await params;

    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    const { data, error } = await supabase
      .from("questions")
      .select("id, title, body, created_at, asker_id")
      .eq("id", id)
      .single();

    if (error || !data) {
      return NextResponse.json(
        { error: "Question not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(data);
  } catch (err) {
    console.error("GET /api/questions/[id] crash:", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
