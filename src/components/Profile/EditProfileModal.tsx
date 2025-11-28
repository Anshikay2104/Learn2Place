"use client";

import { useState } from "react";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";

interface EditProfileModalProps {
  user: any;
  profile: any;
  onClose: () => void;
}

export default function EditProfileModal({ user, profile, onClose }: EditProfileModalProps) {
  const supabase = createClientComponentClient();

  const [form, setForm] = useState({
    full_name: profile.full_name || "",
    bio: profile.bio || "",
    passing_year: profile.passing_year || "",
    company_id: profile.company_id || "",
  });

  const [saving, setSaving] = useState(false);

  const handleChange = (e: any) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSaveProfile = async () => {
    setSaving(true);

    const passing_year_value =
      form.passing_year === "" ? null : Number(form.passing_year);

    const { error } = await supabase
      .from("profiles")
      .update({
        full_name: form.full_name,
        bio: form.bio,
        passing_year: passing_year_value,
        company_id: profile.role === "alumni" ? form.company_id : null,
        updated_at: new Date(),
      })
      .eq("id", user.id);

    setSaving(false);

    if (error) {
      alert("Error updating profile");
      console.error(error);
      return;
    }

    alert("Profile updated successfully!");
    onClose();
    window.location.reload();
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-[9999] p-4">
      <div className="bg-white rounded-xl p-6 w-full max-w-lg shadow-lg">

        <h2 className="text-xl font-semibold mb-4">Edit Profile</h2>

        {/* FULL NAME */}
        <label className="block mb-1 text-sm font-medium">Full Name</label>
        <input
          name="full_name"
          value={form.full_name}
          onChange={handleChange}
          className="w-full border p-2 rounded mb-4"
        />

        {/* BIO */}
        <label className="block mb-1 text-sm font-medium">Bio</label>
        <textarea
          name="bio"
          value={form.bio}
          onChange={handleChange}
          className="w-full border p-2 rounded mb-4"
          rows={3}
        />

        {/* PASSING YEAR */}
        <label className="block mb-1 text-sm font-medium">Passing Year</label>
        <input
          type="number"
          name="passing_year"
          value={form.passing_year}
          onChange={handleChange}
          className="w-full border p-2 rounded mb-4"
        />

        {/* COMPANY (ALUMNI ONLY) */}
        {profile.role === "alumni" && (
          <>
            <label className="block mb-1 text-sm font-medium">Company</label>
            <input
              name="company_id"
              value={form.company_id}
              onChange={handleChange}
              className="w-full border p-2 rounded mb-4"
            />
          </>
        )}

        {/* ACTION BUTTONS */}
        <div className="flex justify-end gap-3 mt-4">
          <button onClick={onClose} className="px-4 py-2 border rounded">
            Cancel
          </button>

          <button
            onClick={handleSaveProfile}
            className="px-4 py-2 bg-blue-600 text-white rounded"
          >
            {saving ? "Saving..." : "Save Changes"}
          </button>
        </div>

      </div>
    </div>
  );
}
