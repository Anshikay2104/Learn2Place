"use client";

import Image from "next/image";
import { Icon } from "@iconify/react";
import { getImagePrefix } from "@/utils/util";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

const Hero = () => {
  const supabase = createClientComponentClient();
  const router = useRouter();

  const [searchQuery, setSearchQuery] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isAlumni, setIsAlumni] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadProfile = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        setIsLoggedIn(false);
        setLoading(false);
        return;
      }

      setIsLoggedIn(true);

      const { data } = await supabase
        .from("profiles")
        .select("role, is_verified_alumni")
        .eq("id", user.id)
        .maybeSingle();

      if (data) {
        setIsAlumni(data.role === "alumni" && data.is_verified_alumni === true);
      }

      setLoading(false);
    };

    loadProfile();
  }, []);

  const handleSearch = async () => {
    if (!searchQuery.trim()) return;

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      localStorage.setItem(
        "redirectAfterAuth",
        `/search?query=${encodeURIComponent(searchQuery.trim())}`
      );
      router.push("/auth/signup");
      return;
    }

    router.push(`/search?query=${encodeURIComponent(searchQuery.trim())}`);
  };

  return (
    <section id="home-section" className="bg-slateGray">
      <div className="container mx-auto lg:max-w-screen-xl md:max-w-screen-md px-4 pt-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 items-center gap-4">

          {/* LEFT */}
          <div className="col-span-6 flex flex-col gap-8">
            <div className="flex gap-2 mx-auto lg:mx-0">
              <Icon icon="solar:verified-check-bold" className="text-success text-xl" />
              <p className="text-success text-sm font-semibold">
                Get in touch with the amazing Alumni !!
              </p>
            </div>

            <h1 className="text-midnight_text text-4xl sm:text-5xl font-semibold">
              Advance your career opportunities with us.
            </h1>

            <h3 className="text-black/70 text-lg">
              Build skills with our resources and alumni experiences from world-class companies.
            </h3>

            {loading ? (
              <p>Loading...</p>
            ) : isAlumni ? (
              <Link href="/companies/add-experience">
                <button className="bg-indigo-600 hover:bg-indigo-700 text-white px-10 py-4 rounded-2xl text-xl font-bold">
                  + Add Your Interview Experience
                </button>
              </Link>
            ) : isLoggedIn ? (
              // SEARCH BOX FIXED
              <div className="pt-4">
                <div className="flex items-center w-full bg-white rounded-full shadow-input-shadow pl-6 pr-3 py-3 lg:py-4">
                  <input
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                    className="flex-1 text-lg text-black bg-transparent outline-none"
                    placeholder="Search companies, resources..."
                  />

                  <button
                    onClick={handleSearch}
                    className="flex items-center justify-center w-14 h-14 rounded-full bg-secondary hover:scale-105 transition"
                  >
                    <Icon icon="solar:magnifer-linear" className="text-white text-3xl" />
                  </button>
                </div>
              </div>
            ) : (
              // NOT LOGGED IN SEARCH (disabled)
              <div className="flex flex-col gap-3 pt-4">
                <div className="bg-yellow-50 border border-yellow-300 rounded-lg p-3 flex items-start gap-2">
                  <Icon icon="solar:info-circle-bold" className="text-yellow-600 text-xl" />
                  <p className="text-sm text-yellow-800">
                    <span className="font-semibold">Sign up</span> before using this functionality
                  </p>
                </div>

                <div className="flex items-center w-full bg-white rounded-full shadow-input-shadow pl-6 pr-3 py-3 opacity-60 cursor-not-allowed">
                  <input
                    disabled
                    className="flex-1 text-lg bg-transparent outline-none"
                    placeholder="Search companies, resources..."
                  />

                  <button
                    onClick={() => router.push("/auth/signup")}
                    className="flex items-center justify-center w-14 h-14 rounded-full bg-secondary hover:scale-105 transition"
                  >
                    <Icon icon="solar:magnifer-linear" className="text-white text-3xl" />
                  </button>
                </div>
              </div>
            )}

            {/* FEATURES */}
            <div className="flex items-center justify-between pt-10">
              {["Flexible", "Learning path", "Community"].map((text) => (
                <div className="flex gap-2" key={text}>
                  <Image
                    src={`${getImagePrefix()}images/banner/check-circle.svg`}
                    width={30}
                    height={30}
                    alt="check"
                  />
                  <p className="text-sm sm:text-lg text-black">{text}</p>
                </div>
              ))}
            </div>
          </div>

          {/* RIGHT */}
          <div className="col-span-6 flex justify-center">
            <Image
              src={`${getImagePrefix()}images/banner/mahila.png`}
              width={1000}
              height={805}
              alt="hero illustration"
              priority
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
