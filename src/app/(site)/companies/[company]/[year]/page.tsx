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
  id: string; // UUID
  hiring_role: string | null;
  process_overview: string | null;
  tips?: string | null;
  created_at: string;
  profiles: Profile | null;
};

type Props = { params: { company: string; year: string } };

export default async function ExperiencePage({ params }: Props) {
  const { company, year } = params;

  const { data: experiences, error } = await supabase
    .from("company_experiences")
    .select(`
      id,
      hiring_role,
      process_overview,
      tips,
      created_at,
      profiles:profiles!company_experiences_user_id_fkey (
        full_name,
        avatar_url
      )
    `)
    .eq("company_id", company)
    .eq("year", Number(year))     // FIXED
    .order("created_at", { ascending: false });

  if (error) {
    console.error(error);
  }

  const experiencesList = experiences as ExperienceRow[] | null;

  return (
    <div className="max-w-3xl mx-auto py-10 px-4">
      <h1 className="text-3xl font-bold mb-6">
        Interview Experiences – {year}
      </h1>

      {experiencesList?.map((exp, index) => {
  const isEven = index % 2 === 0;

  return (
    <div
      key={exp.id}
      className={`
        p-8 rounded-2xl shadow-md border
        mb-10 transition-all hover:shadow-xl
        ${isEven ? "bg-[#F3F5FF] border-indigo-200" : "bg-[#EEF9FF] border-blue-200"}
      `}
    >
      {/* Header */}
      <div className="flex items-center gap-5 mb-6">
        <img
          src={exp.profiles?.avatar_url || "/default-avatar.png"}
          className="w-16 h-16 rounded-full border-2 border-white shadow-md object-cover"
          alt={exp.profiles?.full_name || "Avatar"}
        />

        <div>
          <h2 className="text-2xl font-semibold text-[#1A1A1A]">
            {exp.profiles?.full_name || "Anonymous"}
          </h2>
          <p className="text-gray-600 text-lg">{exp.hiring_role}</p>
        </div>
      </div>

      {/* Experience text */}
      <p className="text-gray-800 text-lg leading-8 whitespace-pre-wrap pl-1">
        {exp.process_overview}
      </p>

      {/* Tips box */}
      {exp.tips && (
        <div className="mt-6 p-5 bg-white rounded-xl border-l-4 border-indigo-600 shadow-sm">
          <strong className="text-indigo-700">Tips:</strong>{" "}
          <span className="text-gray-700">{exp.tips}</span>
        </div>
      )}
    </div>
  );
})}

    </div>
  );
}
