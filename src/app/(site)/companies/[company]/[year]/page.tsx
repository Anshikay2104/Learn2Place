import { createClient } from "@supabase/supabase-js";

export const dynamic = "force-dynamic";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

type Profile = {
  full_name: string | null;
  avatar_url?: string | null;
};

type ExperienceRow = {
  id: number;
  hiring_role: string | null;
  process_overview: string | null;
  tips?: string | null;
  created_at: string;
  profiles: Profile[] | null;
};

type Props = { params: { company: string; year: string } };

export default async function ExperiencePage({ params }: Props) {
  
  const { company, year } = params;

  const { data: experiences } = await supabase
    .from("company_experiences")
    .select(`
      id,
      hiring_role,
      process_overview,
      tips,
      created_at,
      profiles (
        full_name,
        avatar_url
      )
    `)
    .eq("company_id", company)
    .eq("year", year)
    .order("created_at", { ascending: false });

  const experiencesList = experiences as ExperienceRow[] | null;

  return (
    <div className="max-w-3xl mx-auto py-10 px-4">
      <h1 className="text-3xl font-bold mb-6">
        Interview Experiences – {year}
      </h1>

      {experiencesList?.map((exp) => (
        <div
          key={exp.id}
          className="border rounded-xl p-6 mb-6 shadow-sm bg-white"
        >
          <div className="flex items-center gap-4 mb-4">
            <img
              src={exp.profiles?.[0]?.avatar_url || "/default-avatar.png"}
              className="w-14 h-14 rounded-full border object-cover"
              alt={exp.profiles?.[0]?.full_name || "Avatar"}
            />
            <div>
              <h2 className="text-xl font-semibold">
                {exp.profiles?.[0]?.full_name || "Anonymous"}
              </h2>
              <p className="text-gray-600">{exp.hiring_role}</p>
            </div>
          </div>

          <p className="text-gray-800 leading-7 whitespace-pre-wrap">
            {exp.process_overview}
          </p>

          {exp.tips && (
            <div className="mt-4 p-4 bg-blue-50 border-l-4 border-blue-500 rounded text-sm">
              <strong>Tips:</strong> {exp.tips}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
