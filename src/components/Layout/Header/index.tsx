"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { headerData } from "../Header/Navigation/menuData";
import Logo from "./Logo";
import HeaderLink from "../Header/Navigation/HeaderLink";
import MobileHeaderLink from "../Header/Navigation/MobileHeaderLink";
import Signin from "@/components/Auth/SignIn";
import SignUp from "@/components/Auth/SignUp";
import { useTheme } from "next-themes";
import { Icon } from "@iconify/react/dist/iconify.js";

const Header: React.FC = () => {
  const pathUrl = usePathname();
  const { theme } = useTheme();

  const [navbarOpen, setNavbarOpen] = useState(false);
  const [sticky, setSticky] = useState(false);
  const [isSignInOpen, setIsSignInOpen] = useState(false);
  const [isSignUpOpen, setIsSignUpOpen] = useState(false);

  const signInRef = useRef<HTMLDivElement>(null);
  const signUpRef = useRef<HTMLDivElement>(null);
  const mobileMenuRef = useRef<HTMLDivElement>(null);

  const handleScroll = () => {
    setSticky(window.scrollY >= 80);
  };

  const handleClickOutside = (event: MouseEvent) => {
    if (signInRef.current && !signInRef.current.contains(event.target as Node)) {
      setIsSignInOpen(false);
    }
    if (signUpRef.current && !signUpRef.current.contains(event.target as Node)) {
      setIsSignUpOpen(false);
    }
    if (mobileMenuRef.current && !mobileMenuRef.current.contains(event.target as Node) && navbarOpen) {
      setNavbarOpen(false);
    }
  };

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      window.removeEventListener("scroll", handleScroll);
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [navbarOpen, isSignInOpen, isSignUpOpen]);

  useEffect(() => {
    if (isSignInOpen || isSignUpOpen || navbarOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
  }, [isSignInOpen, isSignUpOpen, navbarOpen]);

  return (
    <header className={`fixed top-0 z-40 w-full bg-white transition-all duration-300 ${sticky ? "shadow-lg py-4" : "py-4"}`}>
      <div className="container mx-auto lg:max-w-screen-xl md:max-w-screen-md px-4 flex items-center justify-between gap-6">

        {/* LOGO */}
        <div className="flex items-center">
          <Logo />
        </div>

        {/* DESKTOP NAV — reduced ml spacing */}
        <nav className="hidden lg:flex items-center gap-10 ml-6 whitespace-nowrap">
          {headerData.map((item, index) => (
            <HeaderLink key={index} item={item} />
          ))}
        </nav>

        {/* BUTTONS */}
        <div className="flex items-center gap-4">

          {/* SIGN IN BUTTON */}
          <Link
            href="#"
            className="hidden lg:block bg-primary text-white hover:bg-primary/15 hover:text-primary px-6 py-2 rounded-full text-lg font-medium whitespace-nowrap"
            onClick={() => setIsSignInOpen(true)}
          >
            Sign In
          </Link>

          {/* SIGN UP BUTTON */}
          <Link
            href="#"
            className="hidden lg:block bg-primary/15 text-primary hover:bg-primary hover:text-white px-6 py-2 rounded-full text-lg font-medium whitespace-nowrap"
            onClick={() => setIsSignUpOpen(true)}
          >
            Sign Up
          </Link>

          {/* MOBILE MENU BUTTON */}
          <button
            onClick={() => setNavbarOpen(!navbarOpen)}
            className="block lg:hidden p-2 rounded-lg"
          >
            <span className="block w-6 h-0.5 bg-black"></span>
            <span className="block w-6 h-0.5 bg-black mt-1.5"></span>
            <span className="block w-6 h-0.5 bg-black mt-1.5"></span>
          </button>
        </div>
      </div>

      {/* SIGN IN MODAL */}
      {isSignInOpen && (
        <div className="fixed top-0 left-0 w-full h-full bg-black/50 flex items-center justify-center z-50">
          <div
            ref={signInRef}
            className="relative mx-auto w-full max-w-md rounded-lg px-8 pt-14 pb-8 text-center bg-white"
          >
            <button
              onClick={() => setIsSignInOpen(false)}
              className="absolute top-0 right-0 mr-8 mt-8"
            >
              <Icon icon="tabler:currency-xrp" className="text-black text-2xl" />
            </button>
            <Signin />
          </div>
        </div>
      )}

      {/* SIGN UP MODAL */}
      {isSignUpOpen && (
        <div className="fixed top-0 left-0 w-full h-full bg-black/50 flex items-center justify-center z-50">
          <div
            ref={signUpRef}
            className="relative mx-auto w-full max-w-md rounded-lg bg-white px-8 pt-14 pb-8 text-center"
          >
            <button
              onClick={() => setIsSignUpOpen(false)}
              className="absolute top-0 right-0 mr-8 mt-8"
            >
              <Icon icon="tabler:currency-xrp" className="text-black text-2xl" />
            </button>
            <SignUp />
          </div>
        </div>
      )}

      {/* MOBILE MENU BACKDROP */}
      {navbarOpen && <div className="fixed top-0 left-0 w-full h-full bg-black/50 z-40" />}

      {/* MOBILE MENU PANEL */}
      <div
        ref={mobileMenuRef}
        className={`lg:hidden fixed top-0 right-0 h-full w-full max-w-xs bg-darkmode shadow-lg transform transition-transform duration-300 z-50 ${navbarOpen ? "translate-x-0" : "translate-x-full"}`}
      >
        <div className="flex items-center justify-between p-4">
          <h2 className="text-lg font-bold">
            <Logo />
          </h2>

          <button
            onClick={() => setNavbarOpen(false)}
            className="bg-[url('/images/closed.svg')] bg-no-repeat bg-contain w-5 h-5 absolute top-0 right-0 mr-8 mt-8"
          ></button>
        </div>

        <nav className="flex flex-col items-start p-4">
          {headerData.map((item, index) => (
            <MobileHeaderLink key={index} item={item} />
          ))}

          <div className="mt-4 flex flex-col space-y-4 w-full">
            <Link
              href="#"
              className="border border-primary text-primary px-4 py-2 rounded-lg"
              onClick={() => {
                setIsSignInOpen(true);
                setNavbarOpen(false);
              }}
            >
              Sign In
            </Link>
            <Link
              href="#"
              className="bg-primary text-white px-4 py-2 rounded-lg"
              onClick={() => {
                setIsSignUpOpen(true);
                setNavbarOpen(false);
              }}
            >
              Sign Up
            </Link>
          </div>
        </nav>
      </div>
    </header>
  );
};

export default Header;
