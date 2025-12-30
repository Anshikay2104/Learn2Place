import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

type Params = {
  params: Promise<{ id: string }>;
};

export async function POST(req: Request, { params }: Params) {
  const { id: answerId } = await params;
  const body = await req.json();

  const userId = body.user_id;

  if (!answerId || !userId) {
    return NextResponse.json(
      { error: "Missing answerId or userId" },
      { status: 400 }
    );
  }

  // ✅ SAME STYLE AS POST QUESTION
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  // Check if already upvoted
  const { data: existing } = await supabase
    .from("answer_upvotes")
    .select("id")
    .eq("answer_id", answerId)
    .eq("user_id", userId)
    .maybeSingle();

  // Toggle
  if (existing) {
    await supabase
      .from("answer_upvotes")
      .delete()
      .eq("answer_id", answerId)
      .eq("user_id", userId);

    return NextResponse.json({ status: "removed" });
  }

  await supabase.from("answer_upvotes").insert({
    answer_id: answerId,
    user_id: userId,
  });

  return NextResponse.json({ status: "added" });
}
