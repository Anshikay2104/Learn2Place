"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";

import { HeaderItem } from "../../../../types/menu";

const HeaderLink: React.FC<{ item: HeaderItem }> = ({ item }) => {
  const path = usePathname();
  const router = useRouter();
  const supabase = createClientComponentClient();

  const [submenuOpen, setSubmenuOpen] = useState(false);
  const [isActive, setIsActive] = useState(false);

  // ✅ Check active link / submenu
  useEffect(() => {
    const isLinkActive =
      path === item.href ||
      (item.submenu?.some((subItem) => path === subItem.href) ?? false);

    setIsActive(isLinkActive);
  }, [path, item.href, item.submenu]);

  // ✅ Protected navigation handler
  const handleProtectedClick = async (
    e: React.MouseEvent,
    href: string
  ) => {
    e.preventDefault();

    const {
      data: { user },
    } = await supabase.auth.getUser();

    // 🔐 Redirect if not logged in
    if (!user) {
      router.push("/auth/signup");
      return;
    }

    router.push(href);
  };

  return (
    <div
      className="relative"
      onMouseEnter={() => item.submenu && setSubmenuOpen(true)}
      onMouseLeave={() => setSubmenuOpen(false)}
    >
      {/* MAIN NAV LINK */}
      <Link
        href={item.href}
        onClick={(e) => handleProtectedClick(e, item.href)}
        className={`text-lg font-semibold flex items-center gap-1 capitalize relative transition ${
          isActive
            ? "text-black after:absolute after:w-8 after:h-1 after:bg-primary after:rounded-full after:-bottom-1"
            : "text-gray-500 hover:text-black"
        }`}
        title="Sign up to access this feature"
      >
        {item.label}

        {/* ▼ Dropdown arrow */}
        {item.submenu && (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="1.25em"
            height="1.25em"
            viewBox="0 0 24 24"
          >
            <path
              fill="none"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="m6 9l6 6l6-6"
            />
          </svg>
        )}
      </Link>

      {/* SUBMENU */}
      {submenuOpen && item.submenu && (
        <div className="absolute left-0 mt-2 w-60 bg-white shadow-lg rounded-lg py-2 z-50">
          {item.submenu.map((subItem, index) => {
            const isSubActive = path === subItem.href;

            return (
              <Link
                key={index}
                href={subItem.href}
                onClick={(e) =>
                  handleProtectedClick(e, subItem.href)
                }
                className={`block px-4 py-2 transition ${
                  isSubActive
                    ? "bg-primary text-white"
                    : "text-gray-700 hover:bg-primary hover:text-white"
                }`}
              >
                {subItem.label}
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default HeaderLink;
