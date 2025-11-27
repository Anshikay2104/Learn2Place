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
  id: string;
  hiring_role: string | null;
  process_overview: string | null;
  tips?: string | null;
  created_at: string;
  profiles: Profile | null;
};

type Props = {
  params: { slug: string; year: string };
};

export default async function ExperiencePage({ params }: Props) {
  const { slug, year } = params;

  // Fetch matching company by slug
  const { data: companyData, error: companyError } = await supabase
    .from("companies")
    .select("name, logo_url")
    .eq("slug", slug)
    .single();

  if (companyError || !companyData) {
    return (
      <div className="max-w-3xl mx-auto py-20 px-4 text-center">
        <h1 className="text-2xl font-semibold">Company Not Found</h1>
      </div>
    );
  }

  // Fetch experiences for this company + year
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
    .eq("company_id", slug) // slug = company identifier
    .eq("year", Number(year))
    .order("created_at", { ascending: false });

  const experiencesList = experiences as ExperienceRow[] | null;

  return (
    <div className="max-w-4xl mx-auto py-10 px-4">
      {/* Header */}
      <div className="flex items-center gap-4 mb-10">
        {companyData.logo_url && (
          <img
            src={companyData.logo_url}
            alt={companyData.name}
            className="w-16 h-16 rounded-xl object-cover border shadow-sm"
          />
        )}

        <div>
          <h1 className="text-3xl font-bold">{companyData.name}</h1>
          <p className="text-lg text-gray-600">Interview Experiences – {year}</p>
        </div>
      </div>

      {/* No Experience Found */}
      {experiencesList?.length === 0 && (
        <p className="text-gray-600 text-lg">
          No experiences added for {companyData.name} in {year}.
        </p>
      )}

      {/* Experience Cards */}
      {experiencesList?.map((exp, index) => {
        const isEven = index % 2 === 0;

        return (
          <div
            key={exp.id}
            className={`
              p-8 rounded-2xl shadow-md border mb-10 transition-all hover:shadow-xl
              ${isEven ? "bg-[#F3F5FF] border-indigo-200" : "bg-[#EEF9FF] border-blue-200"}
            `}
          >
            {/* User Info */}
            <div className="flex items-center gap-5 mb-6">
              <img
                src={exp.profiles?.avatar_url || "/default-avatar.png"}
                className="w-16 h-16 rounded-full border-2 border-white shadow-sm object-cover"
                alt={exp.profiles?.full_name || "Avatar"}
              />

              <div>
                <h2 className="text-2xl font-semibold">
                  {exp.profiles?.full_name || "Anonymous User"}
                </h2>
                <p className="text-gray-600 text-lg">{exp.hiring_role}</p>
              </div>
            </div>

            {/* Experience Description */}
            <p className="text-gray-800 text-lg leading-8 whitespace-pre-wrap mb-6">
              {exp.process_overview}
            </p>

            {/* Tips */}
            {exp.tips && (
              <div className="p-5 bg-white rounded-xl border-l-4 border-indigo-600 shadow-sm">
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