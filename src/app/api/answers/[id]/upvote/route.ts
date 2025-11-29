// app/api/answers/[id]/upvote/route.ts
import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";

type Params = { params: { id: string } };

export async function POST(_req: NextRequest, { params }: Params) {
  const supabase = createRouteHandlerClient({ cookies });

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  const answerId = params.id;

  // Check if user has already upvoted this answer
  const { data: existing, error: checkError } = await supabase
    .from("answer_upvotes")
    .select("id")
    .eq("answer_id", answerId)
    .eq("user_id", user.id)
    .maybeSingle();

  if (checkError) {
    console.error(checkError);
    return NextResponse.json({ error: checkError.message }, { status: 500 });
  }

  if (existing) {
    // User already upvoted, so remove the upvote (toggle off)
    const { error: deleteError } = await supabase
      .from("answer_upvotes")
      .delete()
      .eq("answer_id", answerId)
      .eq("user_id", user.id);

    if (deleteError) {
      console.error(deleteError);
      return NextResponse.json({ error: deleteError.message }, { status: 500 });
    }

    return NextResponse.json({ status: "removed" });
  } else {
    // User has not upvoted, so add the upvote (toggle on)
    const { error: insertError } = await supabase
      .from("answer_upvotes")
      .insert({
        answer_id: answerId,
        user_id: user.id,
      });

    if (insertError) {
      console.error(insertError);
      return NextResponse.json({ error: insertError.message }, { status: 500 });
    }

    return NextResponse.json({ status: "added" });
  }
}
