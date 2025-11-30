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
    // Read ?query safely from window location (client-side only)
    const params = new URLSearchParams(window.location.search);
    const q = params.get("query")?.trim().toLowerCase() || null;
    setQuery(q);

    if (!q) {
      router.replace("/");
      return;
    }

    const runSearch = async () => {
      // 🔐 AUTH CHECK
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        localStorage.setItem(
          "redirectAfterAuth",
          `/search?query=${encodeURIComponent(q)}`
        );
        router.replace("/auth/signup");
        return;
      }

      console.log("Searching for:", q);

      // ======================================================
      // 1️⃣ COMPANY SEARCH — Check if company exists by name
      // ======================================================
      const { data: companies } = await supabase
        .from("companies")
        .select("slug, name")
        .or(`name.ilike.%${q}%, slug.ilike.%${q}%`)
        .limit(1);

      if (companies && companies.length > 0) {
        // Found company → go to exact slug
        router.replace(`/companies/${companies[0].slug}`);
        return;
      }

      // ======================================================
      // 2️⃣ NO MATCHES IN DATABASE → STILL SHOW PAGE
      // ======================================================
      // Go to companies/<query> anyway
      // Your company page will show "No experiences yet"
      router.replace(`/companies/${q}`);
    };

    runSearch();
  }, []);

  return (
    <div className="flex items-center justify-center min-h-screen text-lg">
      Searching for <span className="font-semibold ml-1">{query}</span>...
    </div>
  );
}
