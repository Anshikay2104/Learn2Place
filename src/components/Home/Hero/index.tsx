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

  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isAlumni, setIsAlumni] = useState(false);
  const [loading, setLoading] = useState(true);

  // 🔐 Fetch user + role
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
        setIsAlumni(
          data.role === "alumni" && data.is_verified_alumni === true
        );
      }

      setLoading(false);
    };

    loadProfile();
  }, []);

  // 🔐 Search button auth guard + redirect back after signup
  const handleSearchClick = async () => {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    // ❌ Not logged in → redirect to signup
    if (!user) {
      // Save where user wanted to go
      localStorage.setItem("redirectAfterAuth", "/search");

      router.push("/auth/signup");
      return;
    }

    // ✅ Logged in → allow
    router.push("/search");
  };

  return (
    <section id="home-section" className="bg-slateGray">
      <div className="container mx-auto lg:max-w-screen-xl md:max-w-screen-md px-4 pt-24">
        <div className="grid grid-cols-1 lg:grid-cols-12 items-center gap-4">

          {/* LEFT SIDE */}
          <div className="col-span-6 flex flex-col gap-8">
            <div className="flex gap-2 mx-auto lg:mx-0">
              <Icon
                icon="solar:verified-check-bold"
                className="text-success text-xl"
              />
              <p className="text-success text-sm font-semibold">
                Get in touch with the amazing Alumni !!
              </p>
            </div>

            <h1 className="text-midnight_text text-4xl sm:text-5xl font-semibold">
              Advance your career opportunities with us.
            </h1>

            <h3 className="text-black/70 text-lg">
              Build skills with our resources and alumni experiences from
              world-class companies.
            </h3>

            {/* MAIN LOGIC */}
            {loading ? (
              <p>Loading...</p>
            ) : isAlumni ? (
              // 🎓 Alumni CTA
              <Link href="/companies/add-experience">
                <button className="bg-indigo-600 hover:bg-indigo-700 text-white px-10 py-4 rounded-2xl text-xl font-bold shadow-[0_10px_20px_rgba(99,102,241,0.25)] transition-all">
                  + Add Your Interview Experience
                </button>
              </Link>
            ) : isLoggedIn ? (
              // 🔍 Logged-in users can search normally
              <div className="relative rounded-full pt-4">
                <input
                  className="py-6 lg:py-7 pl-8 pr-24 text-lg w-full text-black rounded-full shadow-input-shadow bg-white"
                  placeholder="Search companies, resources..."
                />

                <button
                  onClick={() => router.push("/search")}
                  className="bg-secondary p-5 rounded-full absolute right-2 top-2 hover:scale-105 transition"
                >
                  <Icon icon="solar:magnifer-linear" className="text-white text-3xl" />
                </button>
              </div>
            ) : (
              // 🔒 Not logged in → show lock + signup redirect
              <div className="pt-4">
                <p className="text-sm text-gray-600 mb-2 flex items-center gap-2">
                  <Icon icon="solar:lock-bold" className="text-lg" />
                  Sign up to search companies, resources & alumni
                </p>

                <div className="relative rounded-full">
                  <input
                    disabled
                    className="py-6 lg:py-7 pl-8 pr-24 text-lg w-full text-black rounded-full bg-white cursor-not-allowed shadow-input-shadow"
                    placeholder="Search companies, resources..."
                  />

                  <button
                    onClick={handleSearchClick}
                    className="bg-secondary p-5 rounded-full absolute right-2 top-2 hover:scale-105 transition"
                    title="Sign up to search"
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

          {/* RIGHT IMAGE */}
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
