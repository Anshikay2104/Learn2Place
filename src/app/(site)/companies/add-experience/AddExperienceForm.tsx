"use client";

import { useState, useEffect } from "react";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { useRouter } from "next/navigation";

type AddExperienceFormProps = {
  userId: string;
};

type Company = {
  id: string;
  name: string;
};

export default function AddExperienceForm({ userId }: AddExperienceFormProps) {
  const supabase = createClientComponentClient();
  const router = useRouter();

  const [companies, setCompanies] = useState<Company[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchCompanies = async () => {
      const { data } = await supabase.from("companies").select("id, name");
      setCompanies((data as Company[]) || []);
    };
    fetchCompanies();
  }, []);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    const form = new FormData(e.target as HTMLFormElement);

    const { error } = await supabase.from("company_experiences").insert({
      company_id: form.get("company_id"),
      user_id: userId,
      year: Number(form.get("year")),
      hiring_role: form.get("hiring_role"),
      process_overview: form.get("process_overview"),
      tips: form.get("tips"),
    });

    setLoading(false);

    if (!error) {
      router.push(`/companies/${form.get("company_id")}/${form.get("year")}`);
    } else {
      alert("Error submitting experience");
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white shadow-lg rounded-2xl p-8 space-y-6 border"
    >
      {/* Company */}
      <div>
        <label className="block font-medium mb-2">Company</label>
        <select name="company_id" required className="w-full border px-4 py-3 rounded-xl">
          <option value="">Select a company</option>
          {companies.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </select>
      </div>

      {/* Year */}
      <div>
        <label className="block font-medium mb-2">Year</label>
        <input
          type="number"
          name="year"
          required
          placeholder="2023"
          className="w-full border px-4 py-3 rounded-xl"
        />
      </div>

      {/* Role */}
      <div>
        <label className="block font-medium mb-2">Hiring Role</label>
        <input
          name="hiring_role"
          required
          placeholder="Software Engineer"
          className="w-full border px-4 py-3 rounded-xl"
        />
      </div>

      {/* Experience */}
      <div>
        <label className="block font-medium mb-2">Experience Overview</label>
        <textarea
          name="process_overview"
          required
          rows={6}
          className="w-full border px-4 py-3 rounded-xl"
        />
      </div>

      {/* Tips */}
      <div>
        <label className="block font-medium mb-2">Tips (optional)</label>
        <textarea name="tips" rows={3} className="w-full border px-4 py-3 rounded-xl" />
      </div>

      {/* Submit */}
      <button
        type="submit"
        disabled={loading}
        className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-4 rounded-xl text-lg shadow-md transition"
      >
        {loading ? "Publishing..." : "Publish Experience"}
      </button>
    </form>
  );
}
