"use client";
import Link from "next/link";
import { useState } from "react";

export const DocNavigation = () => {
  const [navItem, setNavItem] = useState("aboutus");

  const DocsNav = [
    { id: 1, navItem: "About Us", hash: "aboutus" },
    { id: 2, navItem: "Who We Are", hash: "whoweare" },
    { id: 3, navItem: "AIM", hash: "vision" },
    { id: 4, navItem: "Benefits of Learn2Place", hash: "benefits" },
    { id: 5, navItem: "How You Can Help", hash: "howyoucanhelp" },
  ];

  return (
    <nav className="flex flex-col gap-1">
      {DocsNav.map((item) => (
        <Link
          key={item.id}
          href={`#${item.hash}`}
          onClick={() => setNavItem(item.hash)}
          className={`px-4 py-2.5 rounded-lg text-sm font-medium transition
            ${
              item.hash === navItem
                ? "bg-indigo-600 text-white"
                : "text-gray-600 hover:bg-indigo-50 hover:text-indigo-600"
            }
          `}
        >
          {item.navItem}
        </Link>
      ))}
    </nav>
  );
};
