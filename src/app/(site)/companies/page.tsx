"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";

type Company = {
  id: string;
  name: string;
  slug: string | null;
  logo_url: string | null;
  website: string | null;
};

export default function CompaniesPage() {
  const supabase = createClientComponentClient();
  const [companies, setCompanies] = useState<Company[]>([]);
  const [yearsMap, setYearsMap] = useState<Record<string, number[]>>({});
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [selectedYear, setSelectedYear] = useState<string>("");

  useEffect(() => {
    const loadCompanies = async () => {
      setLoading(true);

      // Fetch companies
      const { data: companiesData } = await supabase
        .from("companies")
        .select("id, name, slug, logo_url, website")
        .order("name", { ascending: true });

      const list = companiesData || [];
      setCompanies(list);

      // Fetch year mapping
      const ids = list.map((c) => c.slug || c.id);

      const { data: yearRows } = await supabase
        .from("company_experiences")
        .select("company_id, year")
        .in("company_id", ids);

      const map: Record<string, number[]> = {};

      (yearRows || []).forEach((row) => {
        if (!map[row.company_id]) map[row.company_id] = [];
        if (row.year && !map[row.company_id].includes(row.year))
          map[row.company_id].push(row.year);
      });

      // Sort years descending
      Object.keys(map).forEach((key) =>
        map[key].sort((a, b) => b - a)
      );

      setYearsMap(map);
      setLoading(false);
    };

    loadCompanies();
  }, []);

  if (loading) {
    return <div className="text-center py-20 text-lg">Loading...</div>;
  }

  const filtered = companies.filter((c) =>
    c.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="px-6 py-12 lg:px-20 max-w-7xl mx-auto">
      <h1 className="text-4xl font-bold mb-10 text-midnight_text">
        Companies
      </h1>

      {/* SEARCH BAR */}
      <div className="mb-10">
        <input
          type="text"
          placeholder="Search companies..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full sm:w-96 border px-5 py-3 rounded-2xl shadow-sm focus:outline-blue-400"
        />
      </div>

      {/* GRID */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-10">
        {filtered.map((c) => {
          const id = c.slug || c.id;
          const years = yearsMap[id] || [];

          // Logo handling (Clearbit → fallback)
          const logo =
                c.logo_url ||
                (c.website ? `https://logo.clearbit.com/${new URL(c.website).hostname}` : null) ||
                `https://ui-avatars.com/api/?name=${encodeURIComponent(c.name)}&background=random`;


          return (
            <div
              key={id}
              className="bg-white rounded-2xl shadow-md border p-7 hover:shadow-xl transition-all duration-200"
            >
              {/* Logo + Name */}
              <div className="flex flex-col items-center mb-5">
                <img
                  src={logo}
                  className="w-20 h-20 object-contain mb-4 rounded-xl border bg-white"
                  alt={c.name}
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = `https://ui-avatars.com/api/?name=${encodeURIComponent(
                      c.name
                    )}&background=random`;
                  }}
                />

                <h2 className="text-xl font-semibold text-center">
                  {c.name}
                </h2>

                <p className="text-gray-500 text-sm mt-1">
                  {years.length
                    ? `${years.length} experienc${
                        years.length === 1 ? "e" : "es"
                      }`
                    : "No experiences yet"}
                </p>
              </div>

              {/* Description */}
              <p className="text-gray-600 text-sm text-center mb-6">
                Explore interview experiences and alumni insights for{" "}
                {c.name}.
              </p>

              {/* Year Selector */}
              <select
                className="w-full border px-4 py-3 rounded-xl mb-5 bg-gray-50 hover:bg-gray-100 cursor-pointer"
                value={selectedYear}
                onChange={(e) => setSelectedYear(e.target.value)}
                >
                <option value="">Select Year</option>
                {years.map((y) => (
                    <option key={y} value={y}>
                    {y}
                    </option>
                ))}
               </select>

              {/* Buttons */}
            <div className="flex gap-3">
            <button
                onClick={() => {
                if (!selectedYear) return alert("Please select a year first!");
                window.location.href = `/companies/${id}/${selectedYear}`;
                }}
                className="flex-1 text-center bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-3 rounded-xl font-medium transition"
            >
                Show Experience
            </button>

            <button
                onClick={() => {
                if (!selectedYear) return alert("Please select a year first!");
                window.location.href = `/companies/${id}/${selectedYear}/summaries`;
                }}
                className="flex-1 text-center bg-gray-200 hover:bg-gray-300 text-gray-800 px-4 py-3 rounded-xl font-medium transition"
            >
                Summarize
            </button>
            </div>
            </div>
          );
        })}
      </div>

      {filtered.length === 0 && (
        <p className="text-gray-600 text-lg text-center mt-20">
          No companies match your search.
        </p>
      )}
    </div>
  );
}
