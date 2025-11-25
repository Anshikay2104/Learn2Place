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
  slug: string;
};

export default function AddExperienceForm({ userId }: AddExperienceFormProps) {
  const supabase = createClientComponentClient();
  const router = useRouter();

  const [companies, setCompanies] = useState<Company[]>([]);
  const [loading, setLoading] = useState(false);

  const [resourceLinks, setResourceLinks] = useState<string[]>([""]);
  const [resourceFiles, setResourceFiles] = useState<File[]>([]);
  const [selectedCompany, setSelectedCompany] = useState("");
  const [showOther, setShowOther] = useState(false);

  useEffect(() => {
    const fetchCompanies = async () => {
      const { data } = await supabase.from("companies").select("id, name, slug");
      setCompanies((data as Company[]) || []);
    };
    fetchCompanies();
  }, []);

  // Generate slug from name
  const generateSlug = (name: string) =>
    name
      .toLowerCase()
      .trim()
      .replace(/\s+/g, "-")
      .replace(/[^a-z0-9-]/g, "");

  // Guess domain from company name
  const guessDomain = (name: string) =>
    name.toLowerCase().replace(/[^a-z0-9]/g, "") + ".com";

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    const form = new FormData(e.target as HTMLFormElement);
    let companySlug = form.get("company_select") as string;

    /** ------------------------------------------
     *  1️⃣ IF "OTHER" → CREATE A NEW COMPANY FIRST
     * ------------------------------------------ */
    if (companySlug === "other") {
      const newName = form.get("new_company_name") as string;
      const slug = generateSlug(newName);

      // Auto-generate expected domain
      const domain = guessDomain(newName);

      // Auto-generate logo using Clearbit
      const logoUrl = `https://logo.clearbit.com/${domain}`;

      const { error: compErr } = await supabase.from("companies").insert({
        id: slug,              // important: id = slug
        slug,
        name: newName,
        website: `https://${domain}`,
        logo_url: logoUrl,     // automatically assigned
        created_by: userId,
      });

      if (compErr) {
        console.error(compErr);
        alert("Error creating new company");
        setLoading(false);
        return;
      }

      companySlug = slug; // use new slug
    }

    /** ------------------------------------------
     *  2️⃣ INSERT EXPERIENCE WITH companySlug
     * ------------------------------------------ */
    const { data: experience, error: expErr } = await supabase
      .from("company_experiences")
      .insert({
        company_id: companySlug,
        user_id: userId,
        year: Number(form.get("year")),
        hiring_role: form.get("hiring_role"),
        process_overview: form.get("process_overview"),
        tips: form.get("tips"),
      })
      .select()
      .single();

    if (expErr) {
      alert("Error submitting experience");
      setLoading(false);
      return;
    }

    const experienceId = experience.id;

    /** ------------------------------------------
     *  3️⃣ UPLOAD FILE RESOURCES
     * ------------------------------------------ */
    for (const file of resourceFiles) {
      const filePath = `${experienceId}/${Date.now()}-${file.name}`;

      const { error: uploadErr } = await supabase.storage
        .from("experience-resources")
        .upload(filePath, file);

      if (uploadErr) {
        console.error(uploadErr);
        continue;
      }

      const publicUrl = supabase.storage
        .from("experience-resources")
        .getPublicUrl(filePath).data.publicUrl;

      await supabase.from("resources").insert({
        user_id: userId,
        subject_id: form.get("subject_id"),
        title: file.name,
        resource_type: "file",
        file_path: publicUrl,
        url: null,
        experience_id: experienceId,
      });
    }

    /** ------------------------------------------
     *  4️⃣ INSERT LINK RESOURCES
     * ------------------------------------------ */
    for (const link of resourceLinks) {
      if (!link.trim()) continue;

      await supabase.from("resources").insert({
        user_id: userId,
        subject_id: form.get("subject_id"),
        title: "Reference Link",
        resource_type: "link",
        url: link,
        file_path: null,
        experience_id: experienceId,
      });
    }

    setLoading(false);

    /** ------------------------------------------
     *  5️⃣ REDIRECT TO EXPERIENCE PAGE
     * ------------------------------------------ */
    router.push(`/companies/${companySlug}/${form.get("year")}`);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white shadow-lg rounded-2xl p-8 space-y-6 border"
    >
      {/* Company */}
      <div>
        <label className="block font-medium mb-2">Company</label>

        <select
          name="company_select"
          required
          className="w-full border px-4 py-3 rounded-xl"
          onChange={(e) => {
            setSelectedCompany(e.target.value);
            setShowOther(e.target.value === "other");
          }}
        >
          <option value="">Select a company</option>

          {companies.map((c) => (
            <option key={c.slug} value={c.slug}>
              {c.name}
            </option>
          ))}

          <option value="other">Other (Add new)</option>
        </select>

        {showOther && (
          <input
            type="text"
            name="new_company_name"
            placeholder="Enter company name"
            className="w-full border px-4 py-3 rounded-xl mt-3"
            required
          />
        )}
      </div>

      {/* Year */}
      <div>
        <label className="block font-medium mb-2">Year</label>
        <input
          type="number"
          name="year"
          required
          placeholder="2024"
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
        <textarea
          name="tips"
          rows={3}
          className="w-full border px-4 py-3 rounded-xl"
        />
      </div>

      {/* Resource Category */}
      <div>
        <label className="block font-medium mb-2">Resource Category</label>
        <select name="subject_id" required className="w-full border px-4 py-3 rounded-xl">
          <option value="">Select category</option>
          <option value="dsa">Data Structures & Algorithms</option>
          <option value="cn">Computer Networks</option>
          <option value="os">Operating Systems</option>
          <option value="oops">OOPs</option>
          <option value="dbms">DBMS</option>
          <option value="sd">System Design</option>
        </select>
      </div>

      {/* Resource Links */}
      <div>
        <label className="block font-medium mb-2">Resource Links</label>
        {resourceLinks.map((link, idx) => (
          <input
            key={idx}
            type="text"
            value={link}
            placeholder="https://example.com"
            onChange={(e) => {
              const updated = [...resourceLinks];
              updated[idx] = e.target.value;
              setResourceLinks(updated);
            }}
            className="w-full border px-4 py-3 rounded-xl mb-2"
          />
        ))}

        <button
          type="button"
          className="text-indigo-600 underline"
          onClick={() => setResourceLinks([...resourceLinks, ""])}
        >
          + Add another link
        </button>
      </div>

      {/* Resource Files */}
      <div>
        <label className="block font-medium mb-2">Upload Resource Files</label>
        <input
          type="file"
          multiple
          onChange={(e) => setResourceFiles(Array.from(e.target.files || []))}
          className="w-full border px-4 py-3 rounded-xl"
        />
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
