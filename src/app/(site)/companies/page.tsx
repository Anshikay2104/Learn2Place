"use client";

import { useEffect, useState } from "react";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import ReactMarkdown from "react-markdown";

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

  // ✅ PER-COMPANY STATES
  const [selectedYears, setSelectedYears] = useState<Record<string, string>>(
    {}
  );
  const [summaryLoadingId, setSummaryLoadingId] = useState<string | null>(null);
  const [summary, setSummary] = useState("");
  const [summaryOpen, setSummaryOpen] = useState(false);

  useEffect(() => {
    const loadCompanies = async () => {
      setLoading(true);

      const { data: companiesData } = await supabase
        .from("companies")
        .select("id, name, slug, logo_url, website")
        .order("name");

      const list = companiesData || [];
        // normalize logo URLs: support full URLs, public /images paths, Clearbit fallback, and Supabase storage paths
        const bucket = process.env.NEXT_PUBLIC_SUPABASE_STORAGE_BUCKET || "company-logos";

        const normalized = await Promise.all(
          (list || []).map(async (c: any) => {
            let logo = c.logo_url;

            if (logo) {
              // already an absolute URL
              if (/^https?:\/\//i.test(logo) || logo.startsWith("/")) {
                return { ...c, logo_url: logo };
              }

              // treat as a Supabase storage path/key and try to get public URL
              try {
                // getPublicUrl returns { data: { publicUrl } }
                const resp = supabase.storage.from(bucket).getPublicUrl(logo);
                const pub = resp?.data?.publicUrl;

                if (pub) {
                  return { ...c, logo_url: pub };
                }
              } catch (err) {
                console.warn("Failed to resolve storage public url for", logo, err);
              }
            }

            // fallback to Clearbit if website exists, otherwise use UI avatar
            if (c.website) {
              try {
                const hostname = new URL(c.website).hostname;
                return { ...c, logo_url: `https://logo.clearbit.com/${hostname}` };
              } catch (e) {
                // invalid website
              }
            }

            return { ...c, logo_url: `https://ui-avatars.com/api/?name=${encodeURIComponent(c.name)}` };
          })
        );

        setCompanies(normalized);

      const ids = normalized.map((c) => c.slug || c.id);

      const { data: yearRows } = await supabase
        .from("company_experiences")
        .select("company_id, year")
        .in("company_id", ids);

      const map: Record<string, number[]> = {};

      (yearRows || []).forEach((row) => {
        if (!map[row.company_id]) map[row.company_id] = [];
        if (row.year && !map[row.company_id].includes(row.year)) {
          map[row.company_id].push(row.year);
        }
      });

      Object.keys(map).forEach((key) =>
        map[key].sort((a, b) => b - a)
      );

      setYearsMap(map);
      setLoading(false);
    };

    loadCompanies();
  }, []);

  const filtered = companies.filter((c) =>
    c.name.toLowerCase().includes(search.toLowerCase())
  );

  // ✅ PER-COMPANY SUMMARIZE HANDLER
  const handleSummarize = async (companyId: string) => {
    const year = selectedYears[companyId];

    if (!year) {
      alert("Please select a year first!");
      return;
    }

    setSummaryLoadingId(companyId);

    try {
      const res = await fetch("/companies/summarize", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          companyId,
          year: Number(year),
        }),
      });

      const data = await res.json();
      setSummary(data.summary || "No summary available.");
      setSummaryOpen(true);
    } catch {
      alert("Failed to generate summary");
    } finally {
      setSummaryLoadingId(null);
    }
  };

  if (loading) {
    return <div className="text-center py-20 text-lg">Loading...</div>;
  }

  return (
    <div className="px-6 py-12 lg:px-20 max-w-7xl mx-auto">
      <h1 className="text-4xl font-bold mb-10">Companies</h1>

      {/* Search */}
      <div className="mb-10">
        <input
          type="text"
          placeholder="Search companies..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full sm:w-96 border px-5 py-3 rounded-2xl"
        />
      </div>

      {/* Grid */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-10">
        {filtered.map((c) => {
          const id = c.slug || c.id;
          const years = yearsMap[id] || [];

          const logo =
            c.logo_url ||
            (c.website
              ? `https://logo.clearbit.com/${new URL(c.website).hostname}`
              : `https://ui-avatars.com/api/?name=${encodeURIComponent(c.name)}`);

          return (
            <div
              key={id}
              className="bg-white rounded-2xl shadow-md border p-7"
            >
              <div className="flex flex-col items-center mb-5">
                <img
                  src={logo}
                  className="w-20 h-20 object-contain mb-4 rounded-xl border"
                  alt={c.name}
                  onError={(e) => {
                    // fallback to ui-avatars if logo fails to load
                    const target = e.currentTarget as HTMLImageElement;
                    const fallback = `https://ui-avatars.com/api/?name=${encodeURIComponent(c.name)}`;
                    if (target.src !== fallback) target.src = fallback;
                  }}
                />
                <h2 className="text-xl font-semibold">{c.name}</h2>
                <p className="text-gray-500 text-sm">
                  {years.length
                    ? `${years.length} experience${years.length > 1 ? "s" : ""}`
                    : "No experiences yet"}
                </p>
              </div>

              <p className="text-gray-600 text-sm text-center mb-6">
                Explore interview experiences and alumni insights.
              </p>

              {/* Year selector */}
              <select
                value={selectedYears[id] || ""}
                onChange={(e) =>
                  setSelectedYears((prev) => ({
                    ...prev,
                    [id]: e.target.value,
                  }))
                }
                className="w-full border px-4 py-3 rounded-xl mb-5 bg-gray-50"
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
                    const year = selectedYears[id];
                    if (!year) return alert("Select a year first!");
                    window.location.href = `/companies/${id}/${year}`;
                  }}
                  className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-3 rounded-xl"
                >
                  Show Experience
                </button>

                <button
                  onClick={() => handleSummarize(id)}
                  disabled={summaryLoadingId === id}
                  className="flex-1 bg-gray-200 hover:bg-gray-300 px-4 py-3 rounded-xl disabled:opacity-60"
                >
                  {summaryLoadingId === id ? "Summarizing..." : "Summarize"}
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Summary Modal */}
      {summaryOpen && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-6 max-w-2xl w-full shadow-xl">
            <h3 className="text-lg font-semibold mb-4">
              Interview Summary
            </h3>

            <div className="text-sm text-gray-700 leading-relaxed whitespace-pre-line">
              <ReactMarkdown>
                {summary}
              </ReactMarkdown>
            </div>


            <button
              onClick={() => setSummaryOpen(false)}
              className="mt-6 text-indigo-600 font-medium"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
