"use client";

export const dynamic = "force-dynamic";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";

export default function SearchPage() {
  const router = useRouter();
  const supabase = createClientComponentClient();

  const [query, setQuery] = useState<string | null>(null);

  useEffect(() => {
    // Read query from window.search on the client to avoid useSearchParams prerender issues
    const params = new URLSearchParams(window.location.search);
    const q = params.get("query")?.trim().toLowerCase();
    setQuery(q ?? null);

    if (!q) {
      router.replace("/");
      return;
    }

    const runSearch = async () => {
      // 🔐 AUTH GUARD: Check if user is logged in
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        // Save where user wanted to go
        localStorage.setItem("redirectAfterAuth", `/search?query=${encodeURIComponent(q ?? "")}`);
        router.replace("/auth/signup");
        return;
      }

      console.log("Searching for:", q);

      // 1️⃣ Company search
      const { data: companies } = await supabase
        .from("companies")
        .select("slug, name")
        .ilike("name", `%${q}%`)
        .limit(1);

      if (companies && companies.length > 0) {
        router.replace(`/companies/${companies[0].slug}`);
        return;
      }

      // 2️⃣ Subject keyword match
      const SUBJECT_KEYWORDS: Record<string, string[]> = {
        dsa: ["dsa", "data structure", "algorithm"],
        cn: ["cn", "computer network", "network"],
        os: ["os", "operating system"],
        oops: ["oops", "oop", "object oriented"],
        dbms: ["dbms", "database"],
        sd: ["system design"],
      };

      for (const [subject, keywords] of Object.entries(SUBJECT_KEYWORDS)) {
        if (keywords.some((k) => (q ?? "").includes(k))) {
          router.replace(`/resources/${subject}`);
          return;
        }
      }

      // 3️⃣ Resource title search
      const { data: resources } = await supabase
        .from("resources")
        .select("subject_id, title")
        .ilike("title", `%${q}%`)
        .limit(1);

      if (resources && resources[0]?.subject_id) {
        router.replace(`/resources/${resources[0].subject_id}`);
        return;
      }

      // 4️⃣ Not found
      router.replace(`/search/not-found?query=${encodeURIComponent(q ?? "")}`);
    };

    runSearch();
  }, []);

  return (
    <div className="flex items-center justify-center min-h-screen text-lg">
      Searching for <span className="font-semibold ml-1">{query}</span>...
    </div>
  );
}
