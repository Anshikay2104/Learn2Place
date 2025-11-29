import { NextResponse } from "next/server";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";

type CompanyExperience = {
  hiring_role: string | null;
  process_overview: string | null;
  rounds: unknown | null;
  tips: string | null;
};

export async function POST(req: Request) {
  try {
    const { companyId, year } = await req.json();

    if (!companyId) {
      return NextResponse.json(
        { error: "companyId is required" },
        { status: 400 }
      );
    }

    const supabase = createServerComponentClient({ cookies });

    // ✅ Fetch data from YOUR table
    let query = supabase
      .from("company_experiences")
      .select("hiring_role, process_overview, rounds, tips")
      .eq("company_id", companyId);

    if (year) {
      query = query.eq("year", year);
    }

    const { data, error } = await query;

    if (error) {
      console.error("Supabase error:", error);
      return NextResponse.json(
        { error: "Failed to fetch experiences" },
        { status: 500 }
      );
    }

    if (!data || data.length === 0) {
      return NextResponse.json({
        summary: "No interview experiences are available for this company and year.",
      });
    }

    const experiences = data as CompanyExperience[];

    // ✅ Build compact text for Gemini (avoid token explosion)
    const combinedText = experiences
      .map((e, i) => {
        return `
Experience ${i + 1}
Role: ${e.hiring_role ?? "N/A"}
Overview: ${e.process_overview ?? "N/A"}
Rounds: ${JSON.stringify(e.rounds) ?? "N/A"}
Tips: ${e.tips ?? "N/A"}
`;
      })
      .join("\n\n")
      .slice(0, 6000);

    const prompt = `
You are helping students prepare for interviews.

Based on the interview experiences below, generate a clear, structured summary with:

- Common hiring roles
- Interview structure (rounds & format)
- Overall difficulty
- Key preparation tips

Use concise bullet points. Keep it helpful and student-friendly.

${combinedText}
`;

    // ✅ VERIFIED WORKING GEMINI CALL (from your ListModels output)
    const geminiRes = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [{ text: prompt }],
            },
          ],
        }),
      }
    );

    const geminiData = await geminiRes.json();

    if (!geminiData?.candidates?.length) {
      console.error("Gemini error response:", geminiData);
      return NextResponse.json({
        summary: "AI could not generate a summary at this time.",
      });
    }

    const summary =
      geminiData.candidates[0].content.parts[0].text;

    return NextResponse.json({
      summary: summary.trim(),
    });
  } catch (err) {
    console.error("Summarize route error:", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
