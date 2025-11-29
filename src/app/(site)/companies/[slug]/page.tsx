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
        .select("id, company_id, year, hiring_role, process_overview")
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

  /* ✅ UNIQUE YEARS */
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
            className="rounded-xl border bg-white p-6 shadow-sm hover:shadow-md transition"
          >
            {/* ✅ Person Name */}
            <h3 className="text-xl font-semibold mb-1">Anonymous</h3>

            {/* ✅ Current Company */}
            <p className="text-sm text-gray-500 mb-2">
              Current Company:{" "}
              <span className="font-medium">Current</span>
            </p>

            {/* ✅ Role + Experience (Grouped) */}
            <div className="space-y-1">
              <p>
                <span className="font-semibold">Role:</span>{" "}
                {exp.hiring_role || "Not specified"}
              </p>

              {exp.process_overview && (
                <div>
                  <p className="font-semibold">Experience:</p>
                  <p className="text-gray-700 leading-7">
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
