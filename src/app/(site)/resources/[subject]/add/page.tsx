"use client";

import { useState, useEffect } from "react";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { useParams, useRouter } from "next/navigation";
import { toast } from "react-hot-toast";

export default function AddResourcePage() {
  const supabase = createClientComponentClient();
  const router = useRouter();
  const { subject } = useParams() as { subject: string };

  const [user, setUser] = useState<any>(null);

  const [title, setTitle] = useState("");
  const [desc, setDesc] = useState("");
  const [type, setType] = useState("link"); // link | file
  const [file, setFile] = useState<any>(null);
  const [url, setUrl] = useState("");

  useEffect(() => {
    async function loadUser() {
      const { data } = await supabase.auth.getUser();
      setUser(data.user);

      if (!data.user) {
        toast.error("You must be logged in.");
        router.push("/auth/signin");
      }
    }
    loadUser();
  }, []);

  // ----------------------------------------------------------
  // HANDLE FILE UPLOAD
  // ----------------------------------------------------------
  async function uploadFile(resourceId: string) {
    if (!file) return null;

    const ext = file.name.split(".").pop();
    const filePath = `resource_files/${resourceId}.${ext}`;

    const { error: uploadError } = await supabase.storage
      .from("resources")
      .upload(filePath, file);

    if (uploadError) {
      console.error(uploadError);
      toast.error("File upload failed");
      return null;
    }

    // get signed URL
    const { data: publicUrlData } = supabase.storage
      .from("resources")
      .getPublicUrl(filePath);

    return publicUrlData.publicUrl;
  }

  // ----------------------------------------------------------
  // SUBMIT FORM
  // ----------------------------------------------------------
  async function handleSubmit(e: any) {
    e.preventDefault();

    if (!title.trim()) return toast.error("Title is required.");

    try {
      // Step 1 — Create resource entry
      const { data, error } = await supabase
        .from("resources")
        .insert({
          title,
          description: desc,
          subject_id: subject,
          resource_type: type === "file" ? "file" : "link",
          url: type === "link" ? url : null,
          file_path: null,
          user_id: user.id,
        })
        .select()
        .single();

      if (error) throw error;

      let fileUrl = null;

      // Step 2 — Upload File (if type = file)
      if (type === "file") {
        fileUrl = await uploadFile(data.id);

        if (fileUrl) {
          // Update record with file path
          await supabase
            .from("resources")
            .update({ file_path: fileUrl })
            .eq("id", data.id);
        }
      }

      toast.success("Resource added!");
      router.push(`/resources/${subject}`);

    } catch (err: any) {
      console.error(err);
      toast.error("Failed to add resource.");
    }
  }

  return (
    <div className="max-w-3xl mx-auto px-6 pt-32 pb-20">
      <h1 className="text-3xl font-bold mb-6">Add New Resource</h1>

      <form onSubmit={handleSubmit} className="space-y-6 bg-white p-8 shadow-lg rounded-2xl">

        {/* Title */}
        <div>
          <label className="block text-gray-700 font-medium mb-2">Resource Title</label>
          <input
            type="text"
            className="w-full border px-4 py-2 rounded-lg"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>

        {/* Description */}
        <div>
          <label className="block text-gray-700 font-medium mb-2">Description (optional)</label>
          <textarea
            className="w-full border px-4 py-2 rounded-lg"
            rows={3}
            value={desc}
            onChange={(e) => setDesc(e.target.value)}
          />
        </div>

        {/* Type Selection */}
        <div>
          <label className="block text-gray-700 font-medium mb-2">Resource Type</label>
          <select
            className="w-full border px-4 py-2 rounded-lg"
            value={type}
            onChange={(e) => setType(e.target.value)}
          >
            <option value="link">Link</option>
            <option value="file">File</option>
          </select>
        </div>

        {/* Link OR File */}
        {type === "link" ? (
          <div>
            <label className="block text-gray-700 font-medium mb-2">Resource URL</label>
            <input
              type="url"
              className="w-full border px-4 py-2 rounded-lg"
              placeholder="https://example.com/resource"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              required
            />
          </div>
        ) : (
          <div>
            <label className="block text-gray-700 font-medium mb-2">Upload File</label>
            <input
              type="file"
              className="w-full"
              onChange={(e) => setFile(e.target.files?.[0] || null)}
              required
            />
          </div>
        )}

        {/* Submit */}
        <button
          type="submit"
          className="w-full py-3 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-500 text-white font-semibold shadow-md hover:scale-105 transition"
        >
          Add Resource
        </button>
      </form>
    </div>
  );
}
