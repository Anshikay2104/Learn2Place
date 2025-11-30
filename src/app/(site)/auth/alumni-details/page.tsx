"use client";

import { useEffect, useState } from "react";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

export default function AlumniDetailsPage() {
  const supabase = createClientComponentClient();
  const router = useRouter();

  const [passingYear, setPassingYear] = useState("");
  const [currentRole, setCurrentRole] = useState("");
  const [currentCompany, setCurrentCompany] = useState("");

  const [companies, setCompanies] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  // ----------------------------------------------------
  // Load companies for the dropdown
  // ----------------------------------------------------
  useEffect(() => {
    async function loadCompanies() {
      const { data, error } = await supabase
        .from("companies")
        .select("slug, name")
        .order("name", { ascending: true });

      if (error) {
        console.log("Company fetch error:", error);
      } else if (data) {
        setCompanies(data);
      }
    }

    loadCompanies();
  }, []);

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setLoading(true);

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      toast.error("Session expired. Please sign in again.");
      router.push("/auth/signin");
      return;
    }

    // STRICT RULE: company_id must match companies.slug
    const { error } = await supabase
      .from("profiles")
      .update({
        passing_year: Number(passingYear),
        current_role: currentRole,
        company_id: currentCompany, // <-- SAVE SLUG HERE
        updated_at: new Date(),
      })
      .eq("id", user.id);

    setLoading(false);

    if (error) {
      console.log("UPDATE ERROR:", error);
      toast.error("Failed to save details.");
      return;
    }

    toast.success("Details saved!");
    router.push("/profile/alumniprofile");
  };

  return (
    <div className="min-h-screen flex items-center justify-center">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md p-6 border rounded-lg shadow-md bg-white"
      >
        <h2 className="text-2xl font-bold mb-4">Alumni Details</h2>

        {/* PASSING YEAR */}
        <label className="block mb-2 font-medium">Passing Out Year</label>
        <input
          type="number"
          value={passingYear}
          onChange={(e) => setPassingYear(e.target.value)}
          className="w-full p-2 border rounded mb-4"
          placeholder="2020"
          required
        />

        {/* CURRENT ROLE */}
        <label className="block mb-2 font-medium">Current Role</label>
        <input
          type="text"
          value={currentRole}
          onChange={(e) => setCurrentRole(e.target.value)}
          className="w-full p-2 border rounded mb-4"
          placeholder="Software Engineer"
          required
        />

        {/* COMPANY DROPDOWN */}
        <label className="block mb-2 font-medium">Current Company</label>
        <select
          value={currentCompany}
          onChange={(e) => setCurrentCompany(e.target.value)}
          className="w-full p-2 border rounded mb-4"
          required
        >
          <option value="">Select Company</option>
          {companies.map((c) => (
            <option key={c.slug} value={c.slug}>
              {c.name}
            </option>
          ))}
        </select>

        <button
          type="submit"
          disabled={loading}
          className="w-full mt-4 bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
        >
          {loading ? "Saving..." : "Submit"}
        </button>
      </form>
    </div>
  );
}
