"use client";

import Image from "next/image";
import { Icon } from "@iconify/react/dist/iconify.js";
import { getImagePrefix } from "@/utils/util";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { useEffect, useState } from "react";
import Link from "next/link";

const Hero = () => {
    const supabase = createClientComponentClient();

    const [isAlumni, setIsAlumni] = useState(false);
    const [profileData, setProfileData] = useState<any>(null);
    const [profileError, setProfileError] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadProfile = async () => {
            const {
                data: { user },
            } = await supabase.auth.getUser();

            if (!user) {
                setLoading(false);
                return;
            }

            // Try to fetch an existing profile. Use maybeSingle so we don't
            // get an error when there are 0 rows.
            const { data: profile, error } = await supabase
                .from("profiles")
                .select("role, is_verified_alumni")
                .eq("id", user.id)
                .maybeSingle();

            // Debug logs to help trace why the conditional UI might not appear
            // (remove or change to a proper logger in production)
            // eslint-disable-next-line no-console
            console.debug("Hero loadProfile user:", user);
            // eslint-disable-next-line no-console
            console.debug("Hero loadProfile profile:", profile, "error:", error);

            // Store profile and error for visible debug in UI
            setProfileData(profile ?? null);
            setProfileError(error ?? null);

            // If no profile exists, try to create one from the auth user's
            // metadata (signup sets `options.data` with name & role).
            if (!profile) {
                const authRole = (user.user_metadata && (user.user_metadata.role || user.user_metadata?.role)) || null;

                if (authRole) {
                    // attempt to create a profile row so the rest of the app
                    // (and the alumni check) can work immediately after signup
                    const { data: inserted, error: insertErr } = await supabase
                        .from("profiles")
                        .insert({ id: user.id, role: authRole })
                        .select()
                        .maybeSingle();

                    // Save whatever we got back
                    setProfileData(inserted ?? null);
                    setProfileError(insertErr ?? null);

                    // Show button if the inserted role is alumni
                    setIsAlumni(inserted?.role === "alumni");
                } else {
                    // No profile and no role in metadata — default to not showing
                    setIsAlumni(false);
                }
            } else {
                // Profile exists — show button when role is alumni
                setIsAlumni(profile.role === "alumni");
            }

            setLoading(false);
        };

        loadProfile();
    }, []);

    return (
        <section id="home-section" className="bg-slateGray">
            <div className="container mx-auto lg:max-w-screen-xl md:max-w-screen-md px-4 pt-20">
                <div className="grid grid-cols-1 lg:grid-cols-12 space-x-1 items-center">
                    <div className="col-span-6 flex flex-col gap-8 ">
                        <div className="flex gap-2 mx-auto lg:mx-0">
                            <Icon icon="solar:verified-check-bold" className="text-success text-xl inline-block me-2" />
                            <p className="text-success text-sm font-semibold text-center lg:text-start">
                                Get in touch with the amazing Alumni !!
                            </p>
                        </div>

                        <h1 className="text-midnight_text text-4xl sm:text-5xl font-semibold pt-5 lg:pt-0">
                            Advance your career opportunities with us.
                        </h1>

                        <h3 className="text-black/70 text-lg pt-5 lg:pt-0">
                            Build skills with our resources and alumni experiences from world-class companies.
                        </h3>

                        {/* CONDITIONAL SECTION */}
                        {loading ? (
                            <p>Loading...</p>
                        ) : isAlumni ? (
                            <Link href="/companies/add-experience">
                                <button
                                    className="
                                        bg-indigo-600
                                        hover:bg-indigo-700
                                        text-white
                                        px-10 py-4
                                        rounded-2xl
                                        text-xl font-bold
                                        shadow-[0_10px_20px_rgba(99,102,241,0.25)]
                                        transition-all
                                    "
                                >
                                    + Add Your Interview Experience
                                </button>
                            </Link>
                        ) : (
                            <div className="relative rounded-full pt-5 lg:pt-0">
                                <input
                                    type="Email address"
                                    name="q"
                                    className="py-6 lg:py-8 pl-8 pr-20 text-lg w-full text-black rounded-full focus:outline-none shadow-input-shadow"
                                    placeholder="search ..."
                                    autoComplete="off"
                                />
                                <button className="bg-secondary p-5 rounded-full absolute right-2 top-2 ">
                                    <Icon
                                        icon="solar:magnifer-linear"
                                        className="text-white text-4xl inline-block"
                                    />
                                </button>
                            </div>
                        )}

                        {/* Debug panel (visible) - shows fetched profile & errors for debugging */}
                        {!loading && (profileData || profileError) && (
                            <div className="mt-4 p-4 bg-white/80 dark:bg-black/60 rounded border text-sm text-black/80">
                                <p className="font-semibold mb-1">Debug: profile data</p>
                                <pre className="whitespace-pre-wrap text-xs mb-2">{JSON.stringify(profileData, null, 2)}</pre>
                                {profileError && (
                                    <p className="text-red-600 text-xs">Error: {JSON.stringify(profileError)}</p>
                                )}
                            </div>
                        )}

                        {/* BOTTOM FEATURES */}
                        <div className="flex items-center justify-between pt-10 lg:pt-4">
                            <div className="flex gap-2">
                                    <Image src={`${getImagePrefix()}images/banner/check-circle.svg`} width={30} height={30} alt="check icon" />
                                <p className="text-sm sm:text-lg text-black">Flexible</p>
                            </div>
                            <div className="flex gap-2">
                                <Image src={`${getImagePrefix()}images/banner/check-circle.svg`} width={30} height={30} alt="check icon" />
                                <p className="text-sm sm:text-lg text-black">Learning path</p>
                            </div>
                            <div className="flex gap-2">
                                <Image src={`${getImagePrefix()}images/banner/check-circle.svg`} width={30} height={30} alt="check icon" />
                                <p className="text-sm sm:text-lg text-black">Community</p>
                            </div>
                        </div>
                    </div>

                    <div className="col-span-6 flex justify-center">
                        <Image src={`${getImagePrefix()}images/banner/mahila.png`} width={1000} height={805} alt="hero illustration" />
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Hero;
