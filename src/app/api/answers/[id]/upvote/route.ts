import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";

export async function POST(
  _req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const { id: answerId } = await context.params;

  const supabase = createRouteHandlerClient({ cookies });

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  // Check if already upvoted
  const { data: existing, error: checkError } = await supabase
    .from("answer_upvotes")
    .select("id")
    .eq("answer_id", answerId)
    .eq("user_id", user.id)
    .maybeSingle();

  if (checkError) {
    return NextResponse.json({ error: checkError.message }, { status: 500 });
  }

  // Toggle off
  if (existing) {
    const { error } = await supabase
      .from("answer_upvotes")
      .delete()
      .eq("answer_id", answerId)
      .eq("user_id", user.id);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ status: "removed" });
  }

  // Toggle on
  const { error } = await supabase.from("answer_upvotes").insert({
    answer_id: answerId,
    user_id: user.id,
  });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ status: "added" });
}
