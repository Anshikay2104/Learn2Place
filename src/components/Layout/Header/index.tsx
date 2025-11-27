"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";

import Logo from "./Logo";
import { headerData } from "./Navigation/menuData";
import HeaderLink from "./Navigation/HeaderLink";
import MobileHeaderLink from "./Navigation/MobileHeaderLink";

import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";

const Header = () => {
  const router = useRouter();
  const supabase = createClientComponentClient();

  const [navbarOpen, setNavbarOpen] = useState(false);
  const [sticky, setSticky] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const dropdownRef = useRef<HTMLDivElement>(null);

  // Fetch user on mount
  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      setUser(data.user);
    });
  }, []);

  // Sticky header on scroll
  useEffect(() => {
    const handleScroll = () => setSticky(window.scrollY >= 40);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close avatar dropdown on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node)
      ) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const logout = async () => {
    const { error } = await supabase.auth.signOut();

    if (error) {
      toast.error("Logout failed. Try again.");
      return;
    }

    toast.success("Logged out!");
    setUser(null);

    router.replace("/");
    router.refresh();
  };

  const getInitials = () => {
    const name = user?.user_metadata?.name || user?.email || "";
    return name
      .split(" ")
      .filter(Boolean)
      .map((w: string) => w[0])
      .join("")
      .toUpperCase();
  };

  return (
    <header
      className={`fixed top-0 z-40 w-full bg-white border-b transition-all duration-200 ${
        sticky ? "py-4 shadow-sm" : "py-6"
      }`}
    >
      <div className="container mx-auto max-w-screen-xl flex items-center justify-between px-6">
        <div className="scale-110">
            <Logo />
      </div>


        {/* DESKTOP NAV */}
        <nav className="hidden lg:flex items-center gap-10 ml-6">
          {headerData
            .filter((item) => item.label !== "Profile") // remove profile item completely
            .map((item, index) => (
              <HeaderLink key={index} item={item} />
            ))}
        </nav>

        {/* RIGHT SIDE */}
        <div className="flex items-center gap-4">
          {user ? (
            <>
              {/* Avatar + Dropdown */}
              <div className="relative" ref={dropdownRef}>
                <div
                  className="w-9 h-9 rounded-full bg-purple-600 text-white flex items-center justify-center cursor-pointer font-bold text-sm"
                  onClick={() => setDropdownOpen((prev) => !prev)}
                >
                  {getInitials()}
                </div>

                {dropdownOpen && (
                  <div className="absolute right-0 mt-2 w-40 bg-white rounded-md shadow p-2 z-50">
                    <Link
                      href="/profile"
                      className="block px-4 py-2 hover:bg-gray-100 rounded-md"
                    >
                      My Profile
                    </Link>
                    <button
                      onClick={logout}
                      className="w-full px-4 py-2 text-left text-red-600 hover:bg-gray-100 rounded-md"
                    >
                      Logout
                    </button>
                  </div>
                )}
              </div>
            </>
          ) : (
            <>
              <Link
                href="/auth/signin"
                className="hidden lg:block bg-primary text-white px-6 py-3 rounded-full text-base font-bold"
              >
                Sign In
              </Link>

              <Link
                href="/auth/signup"
                className="hidden lg:block border border-primary text-primary px-5 py-2 rounded-full"
              >
                Sign Up
              </Link>
            </>
          )}

          {/* Mobile menu button */}
          <button
            className="lg:hidden p-2"
            onClick={() => setNavbarOpen(!navbarOpen)}
          >
            <span className="block w-6 h-0.5 bg-black"></span>
            <span className="block w-6 h-0.5 bg-black mt-1"></span>
            <span className="block w-6 h-0.5 bg-black mt-1"></span>
          </button>
        </div>
      </div>

      {/* MOBILE NAV */}
      {navbarOpen && (
        <div className="lg:hidden fixed top-0 right-0 h-full w-72 bg-white shadow-lg p-6 z-50">
          {headerData
            .filter((item) => item.label !== "Profile") // also remove here
            .map((item, index) => (
              <MobileHeaderLink key={index} item={item} />
            ))}

          {user ? (
            <div className="mt-6">
              <button
                onClick={() => {
                  setDropdownOpen(false);
                  router.push("/profile");
                }}
                className="block text-center border px-4 py-2 rounded-lg mb-2"
              >
                My Profile
              </button>

              <button
                onClick={logout}
                className="w-full bg-red-500 text-white py-2 rounded-lg"
              >
                Logout
              </button>
            </div>
          ) : (
            <>
              <Link
                href="/auth/signin"
                className="block border px-4 py-2 rounded-lg mt-4 text-center"
              >
                Sign In
              </Link>
              <Link
                href="/auth/signup"
                className="block bg-primary text-white px-4 py-2 rounded-lg mt-2 text-center"
              >
                Sign Up
              </Link>
            </>
          )}
        </div>
      )}
    </header>
  );
};

export default Header;
