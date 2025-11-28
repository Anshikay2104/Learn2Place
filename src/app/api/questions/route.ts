// app/api/questions/route.ts
import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { createClient } from "@supabase/supabase-js";

export async function GET(_req: NextRequest) {
  const supabase = createRouteHandlerClient({ cookies });

  // Try to get data with regular client first
  let { data, error } = await supabase
    .from("questions")
    .select("id, title, body, created_at, asker_id");

  // If RLS error, try with service-role to bypass RLS
  if (error && error.code === "42501") {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
    if (url && key) {
      const svc = createClient(url, key);
      const res = await svc.from("questions").select("id, title, body, created_at, asker_id");
      data = res.data;
      error = res.error;
    }
  }

  if (error) {
    console.error("Questions GET error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data || []);
}

export async function POST(req: NextRequest) {
  const supabase = createRouteHandlerClient({ cookies });

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError) {
    console.error(userError);
  }

  // Allow anonymous posts: if there's no authenticated user, set asker_id to null
  const askerId = user ? user.id : null;

  const body = await req.json();
  const { title, description } = body; // description = question body text

  let data: any = null;
  let error: any = null;

  if (askerId !== null) {
    // authenticated user — use route handler client (respects auth cookies / RLS)
    const res = await supabase
      .from("questions")
      .insert({ title, body: description, asker_id: askerId })
      .select()
      .single();
    data = res.data;
    error = res.error;
  } else {
    // anonymous — RLS often blocks anonymous inserts. Use server-side service role client.
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
    if (!url || !key) {
      console.error("Missing SUPABASE_SERVICE_ROLE_KEY for anonymous inserts");
      return NextResponse.json(
        { error: "Server not configured to accept anonymous posts" },
        { status: 500 }
      );
    }

    const svc = createClient(url, key);
    const res = await svc
      .from("questions")
      .insert({ title, body: description, asker_id: null })
      .select()
      .single();
    data = res.data;
    error = res.error;
  }

  if (error) {
    console.error("Question POST error:", error);
    return NextResponse.json({ error: error.message }, { status: 400 });
  }

  return NextResponse.json(data, { status: 201 });
}
