"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";

/* TYPE-SAFE STRUCT */
type Experience = {
  id: string;
  company_id: string;
  year: number | null;
  hiring_role: string | null;
  process_overview: string | null;
  user: {
    full_name: string | null;
    current_role: string | null;
    company_id: string | null;
  } | null;
};

export default function CompanyOverviewPage() {
  const { slug } = useParams<{ slug: string }>();
  const router = useRouter();
  const supabase = createClientComponentClient();

  const [experiences, setExperiences] = useState<Experience[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!slug) return;

    const loadExperiences = async () => {
      const { data, error } = await supabase
        .from("company_experiences")
        .select(`
          id,
          company_id,
          year,
          hiring_role,
          process_overview,
          user:profiles (
            full_name,
            current_role,
            company_id
          )
        `)
        .eq("company_id", slug)
        .order("year", { ascending: false });

      if (error) {
        console.error("Fetch Error:", error);
      } else if (data) {
        // Supabase returns related rows as arrays (e.g. user: profiles[]).
        // Normalize the response so `user` is a single object or null to
        // match the `Experience` type.
        const normalized = (data as any[]).map((row) => ({
          id: row.id,
          company_id: row.company_id,
          year: row.year ?? null,
          hiring_role: row.hiring_role ?? null,
          process_overview: row.process_overview ?? null,
          user: Array.isArray(row.user) ? row.user[0] ?? null : row.user ?? null,
        })) as Experience[];

        setExperiences(normalized);
      }

      setLoading(false);
    };

    loadExperiences();
  }, [slug]);

  if (loading) {
    return <div className="p-6 text-lg">Loading interviews...</div>;
  }

  if (!experiences.length) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <h1 className="text-2xl font-bold capitalize">{slug}</h1>
        <p className="mt-4 text-gray-600">
          No interview experiences found yet.
        </p>
      </div>
    );
  }

  /* UNIQUE YEARS */
  const years: number[] = Array.from(
    new Set(
      experiences
        .map((exp) => exp.year)
        .filter((y): y is number => y !== null)
    )
  );

  return (
    <div className="max-w-5xl mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold capitalize mb-6">
        {slug} Interview Experiences
      </h1>

      {/* YEAR FILTER */}
      <div className="flex flex-wrap gap-3 mb-10">
        {years.map((year) => (
          <button
            key={year}
            onClick={() => router.push(`/companies/${slug}/${year}`)}
            className="px-4 py-2 border rounded-lg hover:bg-gray-100 transition"
          >
            {year}
          </button>
        ))}
      </div>

      {/* EXPERIENCE LIST */}
      <div className="space-y-6">
        {experiences.map((exp) => (
          <div
            key={exp.id}
            className="rounded-xl border bg-white p-6 shadow-sm hover:shadow-md transition"
          >
            {/* PERSON NAME */}
            <h3 className="text-xl font-semibold mb-1">
              {exp.user?.full_name || "Anonymous"}
            </h3>

            {/* CURRENT ROLE + COMPANY */}
            <p className="text-sm text-gray-500 mb-3">
              Working as{" "}
              <span className="font-semibold">
                {exp.user?.current_role || "Unknown role"}
              </span>{" "}
              at{" "}
              <span className="font-semibold">
                {exp.user?.company_id || "Unknown company"}
              </span>
            </p>

            {/* ROLE & EXPERIENCE */}
            <div className="space-y-1">
              <p>
                <span className="font-semibold">Hiring For:</span>{" "}
                {exp.hiring_role || "Not specified"}
              </p>

              {exp.process_overview && (
                <div className="mt-2">
                  <p className="font-semibold">Experience:</p>
                  <p className="text-gray-700 leading-7 whitespace-pre-line">
                    {exp.process_overview}
                  </p>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
