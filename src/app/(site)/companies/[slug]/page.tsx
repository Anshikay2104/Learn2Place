"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";

/* ✅ TYPE SAFE */
type CompanyExperience = {
  id: string;
  company_id: string;
  year: number | null;
  hiring_role: string | null;
  process_overview: string | null;
};

export default function CompanyOverviewPage() {
  const { slug } = useParams<{ slug: string }>();
  const router = useRouter();
  const supabase = createClientComponentClient();

  const [experiences, setExperiences] = useState<CompanyExperience[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!slug) return;

    const loadExperiences = async () => {
      const { data, error } = await supabase
        .from("company_experiences")
        .select(
          "id, company_id, year, hiring_role, process_overview"
        )
        .eq("company_id", slug)
        .order("year", { ascending: false });

      if (!error && data) {
        setExperiences(data);
      }

      setLoading(false);
    };

    loadExperiences();
  }, [slug]);

  if (loading) {
    return (
      <div className="p-6 text-lg">Loading interviews...</div>
    );
  }

  if (!experiences.length) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <h1 className="text-2xl font-bold capitalize">
          {slug}
        </h1>
        <p className="mt-4 text-gray-600">
          No interview experiences found yet.
        </p>
      </div>
    );
  }

  /* ✅ UNIQUE YEARS — SAFE */
  const years: number[] = Array.from(
    new Set(
      experiences
        .map((e) => e.year)
        .filter((year): year is number => year !== null)
    )
  );

  return (
    <div className="max-w-5xl mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold capitalize mb-6">
        {slug} Interview Experiences
      </h1>

      {/* ✅ YEAR FILTER */}
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

      {/* ✅ EXPERIENCE LIST */}
      <div className="space-y-6">
        {experiences.map((exp) => (
          <div
            key={exp.id}
            className="border rounded-xl p-5 shadow-sm hover:shadow transition"
          >
            <h3 className="text-lg font-semibold">
              {exp.hiring_role || "Role not specified"}
            </h3>

            {exp.year && (
              <p className="text-sm text-gray-500">
                Year: {exp.year}
              </p>
            )}

            {exp.process_overview && (
              <p className="mt-3 text-gray-700">
                {exp.process_overview.slice(0, 250)}...
              </p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
