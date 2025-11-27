"use client";

import { useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";

export default function SearchPage() {
  const router = useRouter();
  const params = useSearchParams();
  const supabase = createClientComponentClient();

  const query = params.get("query")?.trim().toLowerCase();

  useEffect(() => {
    if (!query) {
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
        localStorage.setItem("redirectAfterAuth", `/search?query=${encodeURIComponent(query)}`);
        router.replace("/auth/signup");
        return;
      }

      console.log("Searching for:", query);

      // 1️⃣ Company search
      const { data: companies } = await supabase
        .from("companies")
        .select("slug, name")
        .ilike("name", `%${query}%`)
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
        if (keywords.some((k) => query.includes(k))) {
          router.replace(`/resources/${subject}`);
          return;
        }
      }

      // 3️⃣ Resource title search
      const { data: resources } = await supabase
        .from("resources")
        .select("subject_id, title")
        .ilike("title", `%${query}%`)
        .limit(1);

      if (resources && resources[0]?.subject_id) {
        router.replace(`/resources/${resources[0].subject_id}`);
        return;
      }

      // 4️⃣ Not found
      router.replace(
        `/search/not-found?query=${encodeURIComponent(query)}`
      );
    };

    runSearch();
  }, [query]);

  return (
    <div className="flex items-center justify-center min-h-screen text-lg">
      Searching for <span className="font-semibold ml-1">{query}</span>...
    </div>
  );
}
